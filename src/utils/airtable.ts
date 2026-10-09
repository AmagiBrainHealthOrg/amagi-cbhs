import {
  type AirtableForm,
  airtableForms,
  compatibleTypes,
  type FieldName,
} from '@/config/airtable'

// The parts of Airtable's metadata API response (GET /v0/meta/bases/:id/tables) the site reads.
export type SchemaChoice = { id: string; name: string }
export type SchemaField = {
  id: string
  name: string
  type: string
  options?: { choices?: SchemaChoice[]; linkedTableId?: string }
}
export type SchemaTable = {
  id: string
  name: string
  primaryFieldId: string
  fields: SchemaField[]
}

export type SubmissionValue = string | string[]
export type SubmissionData = Partial<Record<FieldName, SubmissionValue>>

// Every table, field and choice the config names that the base no longer has, or has with an
// incompatible type. Empty when the base matches.
export function findSchemaProblems(tables: SchemaTable[]): string[] {
  const problems: string[] = []
  for (const [key, form] of Object.entries(airtableForms)) {
    const table = tables.find(({ id }) => id === form.table)
    if (!table) {
      problems.push(`${key}: table ${form.table} is missing`)
      continue
    }
    for (const [name, { id, kind }] of Object.entries(form.fields)) {
      const field = table.fields.find((f) => f.id === id)
      if (!field) problems.push(`${key}: field ${name} (${id}) is missing from "${table.name}"`)
      else if (!compatibleTypes[kind].includes(field.type)) {
        problems.push(
          `${key}: field ${name} ("${field.name}") is ${field.type}, expected ${compatibleTypes[kind].join(' or ')}`,
        )
      }
    }
  }
  return problems
}

const list = (value: SubmissionValue | undefined): string[] =>
  (Array.isArray(value) ? value : [value ?? '']).map((v) => v.trim()).filter(Boolean)

// The record a submission becomes, keyed by field ID. Values are shaped by each field's type in
// the base, so a select switched between single and multiple in Airtable keeps working.
export function toAirtableFields(
  form: AirtableForm,
  table: SchemaTable,
  data: SubmissionData,
): Record<string, unknown> {
  const fields: Record<string, unknown> = {}
  const typeOf = (id: string) => table.fields.find((f) => f.id === id)?.type

  for (const [name, field] of Object.entries(form.fields) as [FieldName, { id: string }][]) {
    const value = list(data[name])
    if (value.length === 0) continue
    switch (typeOf(field.id)) {
      case 'multipleRecordLinks':
      case 'multipleSelects':
        fields[field.id] = value
        break
      case 'email':
        fields[field.id] = value[0].toLowerCase()
        break
      // Holds one choice: the first one ticked. Switch the field to multiple select to keep all.
      case 'singleSelect':
        fields[field.id] = value[0]
        break
      default:
        fields[field.id] = value.join(', ')
    }
  }
  return fields
}

export type Attribution = {
  utm?: {
    source?: string | null
    medium?: string | null
    campaign?: string | null
    term?: string | null
    content?: string | null
  } | null
  sourcePage?: string | null
}

// Attribution columns are matched by name, not ID, so Amagi can add them to any form table and
// they fill from the next submission without a deploy (docs/AIRTABLE.md). Missing columns are
// skipped.
export function attributionFields(table: SchemaTable, { utm, sourcePage }: Attribution) {
  const values: Record<string, string | null | undefined> = {
    'utm source': utm?.source,
    'utm medium': utm?.medium,
    'utm campaign': utm?.campaign,
    'utm term': utm?.term,
    'utm content': utm?.content,
    'source page': sourcePage,
  }
  const fields: Record<string, string> = {}
  for (const field of table.fields) {
    const value = values[field.name.trim().toLowerCase()]
    if (value) fields[field.id] = value
  }
  return fields
}

// `id` is the select choice's ID, for choices the site must recognise whatever their name.
export type FieldOption = { value: string; label: string; id?: string }

// Options for a link or select field: the linked table's records, or the select's choices.
export function optionsFor(
  field: SchemaField,
  linkedRecords: Record<string, FieldOption[]>,
): FieldOption[] {
  if (field.type === 'multipleRecordLinks') {
    return linkedRecords[field.options?.linkedTableId ?? ''] ?? []
  }
  return (field.options?.choices ?? []).map(({ id, name }) => ({ value: name, label: name, id }))
}
