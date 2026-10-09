import 'server-only'

import { airtableForms, type FieldName } from '@/config/airtable'
import type { FormKey } from '@/config/forms'
import { env } from '@/env'
import { type FieldOption, optionsFor, type SchemaField, type SchemaTable } from '@/utils/airtable'

const API = 'https://api.airtable.com/v0'
// Schema and option lists change only when Amagi edits the base; five minutes is fresh enough.
const READ_REVALIDATE = 300
// Airtable allows 5 requests per second per base and asks for a pause after a 429 (SPEC §9.1).
export const RETRY_DELAYS_MS = [1000, 2000, 4000]

export class AirtableError extends Error {
  constructor(
    readonly status: number,
    readonly type: string,
    message: string,
  ) {
    super(`Airtable ${status} ${type}: ${message}`)
    this.name = 'AirtableError'
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function credentials() {
  if (!env.AIRTABLE_TOKEN || !env.AIRTABLE_BASE_ID) {
    throw new Error('AIRTABLE_TOKEN and AIRTABLE_BASE_ID must both be set')
  }
  return { token: env.AIRTABLE_TOKEN, baseId: env.AIRTABLE_BASE_ID }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { token } = credentials()
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...init.headers,
      },
    })
    if (response.ok) return (await response.json()) as T
    if (response.status === 429 && attempt < RETRY_DELAYS_MS.length) {
      await sleep(RETRY_DELAYS_MS[attempt])
      continue
    }
    const body = (await response.json().catch(() => null)) as {
      error?: string | { type?: string; message?: string }
    } | null
    const error = typeof body?.error === 'string' ? { type: body.error } : (body?.error ?? {})
    throw new AirtableError(
      response.status,
      error.type ?? 'UNKNOWN',
      error.message ?? response.statusText,
    )
  }
}

const cached = { next: { revalidate: READ_REVALIDATE } }

export async function getSchema(): Promise<SchemaTable[]> {
  const { baseId } = credentials()
  const { tables } = await request<{ tables: SchemaTable[] }>(
    `/meta/bases/${baseId}/tables`,
    cached,
  )
  return tables
}

export async function getTable(tableId: string): Promise<SchemaTable> {
  const table = (await getSchema()).find(({ id }) => id === tableId)
  if (!table) throw new Error(`Airtable table ${tableId} is missing; run pnpm airtable:check`)
  return table
}

// Every record in a table as an option: its ID and its primary field, sorted by label.
export async function listOptions(table: SchemaTable): Promise<FieldOption[]> {
  const { baseId } = credentials()
  const options: FieldOption[] = []
  let offset: string | undefined
  do {
    const params = new URLSearchParams({ returnFieldsByFieldId: 'true', pageSize: '100' })
    params.append('fields[]', table.primaryFieldId)
    if (offset) params.set('offset', offset)
    const page = await request<{
      records: { id: string; fields: Record<string, unknown> }[]
      offset?: string
    }>(`/${baseId}/${table.id}?${params}`, cached)
    for (const { id, fields } of page.records) {
      const label = fields[table.primaryFieldId]
      if (typeof label === 'string' && label.trim())
        options.push({ value: id, label: label.trim() })
    }
    offset = page.offset
  } while (offset)
  return options.sort((a, b) => a.label.localeCompare(b.label))
}

export type FormField = { name: FieldName; type: string; options?: FieldOption[] }

// The fields a form writes, with options for its link and select fields read live from the base.
export async function getFormFields(key: FormKey): Promise<FormField[]> {
  const form = airtableForms[key]
  const tables = await getSchema()
  const table = tables.find(({ id }) => id === form.table)
  if (!table) throw new Error(`Airtable table ${form.table} is missing; run pnpm airtable:check`)

  const resolved = Object.entries(form.fields).map(([name, { id }]) => {
    const field = table.fields.find((f) => f.id === id)
    if (!field)
      throw new Error(`Airtable field ${name} (${id}) is missing; run pnpm airtable:check`)
    return { name: name as FieldName, field }
  })

  const linked = new Set(
    resolved.map(({ field }) => field.options?.linkedTableId).filter((id): id is string => !!id),
  )
  const linkedRecords = Object.fromEntries(
    await Promise.all(
      [...linked].map(async (id) => {
        const target = tables.find((t) => t.id === id)
        return [id, target ? await listOptions(target) : []] as const
      }),
    ),
  )

  return resolved.map(({ name, field }): FormField => {
    const hasOptions = ['multipleRecordLinks', 'singleSelect', 'multipleSelects'].includes(
      field.type,
    )
    return {
      name,
      type: field.type,
      ...(hasOptions && { options: optionsFor(field as SchemaField, linkedRecords) }),
    }
  })
}

// typecast lets Airtable coerce values, e.g. a phone number in any format (docs/AIRTABLE.md).
export async function createRecord(
  tableId: string,
  fields: Record<string, unknown>,
): Promise<string> {
  const { baseId } = credentials()
  const { id } = await request<{ id: string }>(`/${baseId}/${tableId}`, {
    method: 'POST',
    body: JSON.stringify({ fields, typecast: true }),
    cache: 'no-store',
  })
  return id
}
