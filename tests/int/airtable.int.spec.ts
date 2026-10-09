import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { airtableForms } from '@/config/airtable'
import {
  findSchemaProblems,
  optionsFor,
  type SchemaField,
  type SchemaTable,
  toAirtableFields,
} from '@/utils/airtable'

vi.mock('server-only', () => ({}))
vi.mock('@/env', () => ({
  env: { AIRTABLE_TOKEN: 'pat_unit', AIRTABLE_BASE_ID: 'appUnitTest000000' },
}))

const { AirtableError, createRecord, getFormFields, RETRY_DELAYS_MS } =
  await import('@/lib/airtable')

const form = airtableForms['register-interest']
const choices = [
  { id: form.consentChoices.contact, name: 'Amagi may contact me about the Summit' },
  { id: form.consentChoices.publicName, name: 'My name may be shown publicly' },
  { id: form.consentChoices.shareStory, name: 'My story may be shared' },
]
const types: Record<string, string> = {
  text: 'singleLineText',
  longText: 'multilineText',
  email: 'email',
  phone: 'phoneNumber',
  url: 'url',
  date: 'date',
  link: 'multipleRecordLinks',
  select: 'multipleSelects',
}

// A base that matches the config, with one linked Locations table.
function schema(): SchemaTable[] {
  const formTables = Object.values(airtableForms).map((f) => ({
    id: f.table,
    name: f.table,
    primaryFieldId: f.fields.name!.id,
    fields: Object.entries(f.fields).map(([name, { id, kind }]): SchemaField => ({
      id,
      name,
      type: types[kind],
      options:
        name === 'permissions'
          ? {
              choices: Object.values(f.consentChoices).map((cid, i) => ({
                id: cid,
                name: choices[i].name,
              })),
            }
          : kind === 'link'
            ? { linkedTableId: 'tblLocations' }
            : kind === 'select'
              ? { choices: [{ id: 'selA', name: 'Email me' }] }
              : undefined,
    })),
  }))
  return [
    ...formTables,
    {
      id: 'tblLocations',
      name: 'Locations',
      primaryFieldId: 'fldArea',
      fields: [{ id: 'fldArea', name: 'Area', type: 'singleLineText' }],
    },
  ]
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

describe('findSchemaProblems', () => {
  it('passes a base that matches the config', () => {
    expect(findSchemaProblems(schema())).toEqual([])
  })

  it('names a missing field, a wrong type and a missing consent choice', () => {
    const tables = schema()
    const table = tables.find((t) => t.id === form.table)!
    table.fields = table.fields.filter((f) => f.id !== form.fields.role!.id)
    table.fields.find((f) => f.id === form.fields.email!.id)!.type = 'singleLineText'
    table.fields.find((f) => f.id === form.fields.permissions!.id)!.options!.choices!.pop()

    expect(findSchemaProblems(tables)).toEqual([
      'register-interest: field email ("email") is singleLineText, expected email',
      `register-interest: field role (${form.fields.role!.id}) is missing from "${form.table}"`,
      `register-interest: Permissions choice for shareStory (${form.consentChoices.shareStory}) is missing`,
    ])
  })

  it('names a missing table', () => {
    const tables = schema().filter((t) => t.id !== airtableForms.relay.table)
    expect(findSchemaProblems(tables)).toEqual([
      `relay: table ${airtableForms.relay.table} is missing`,
    ])
  })
})

describe('toAirtableFields', () => {
  const table = () => schema().find((t) => t.id === form.table)!

  it('writes by field ID, lower-cases email, skips blanks and maps consents to choices', () => {
    const fields = toAirtableFields(
      form,
      table(),
      {
        name: ' Testy Testerson ',
        email: 'Testy@Example.COM',
        phone: '',
        location: 'recJamaica',
        engagement: ['recAttend', 'recConnect'],
      },
      { contact: true, publicName: false, shareStory: true },
    )
    expect(fields).toEqual({
      [form.fields.name!.id]: 'Testy Testerson',
      [form.fields.email!.id]: 'testy@example.com',
      [form.fields.location!.id]: ['recJamaica'],
      [form.fields.engagement!.id]: ['recAttend', 'recConnect'],
      [form.fields.permissions!.id]: [
        'Amagi may contact me about the Summit',
        'My story may be shared',
      ],
    })
  })

  it('sends one choice to a single select', () => {
    const t = table()
    t.fields.find((f) => f.id === form.fields.permissions!.id)!.type = 'singleSelect'
    const fields = toAirtableFields(form, t, {}, { publicName: true, shareStory: true })
    expect(fields).toEqual({ [form.fields.permissions!.id]: 'My name may be shown publicly' })
  })

  it('leaves Permissions out when nothing is ticked', () => {
    expect(toAirtableFields(form, table(), { name: 'A' }, {})).toEqual({
      [form.fields.name!.id]: 'A',
    })
  })
})

describe('optionsFor', () => {
  it('uses linked records for links and choices for selects', () => {
    const linked = { tblLocations: [{ value: 'rec1', label: 'Jamaica' }] }
    expect(
      optionsFor(
        {
          id: 'f',
          name: 'f',
          type: 'multipleRecordLinks',
          options: { linkedTableId: 'tblLocations' },
        },
        linked,
      ),
    ).toEqual([{ value: 'rec1', label: 'Jamaica' }])
    expect(
      optionsFor(
        {
          id: 'f',
          name: 'f',
          type: 'singleSelect',
          options: { choices: [{ id: 's', name: 'Media' }] },
        },
        linked,
      ),
    ).toEqual([{ value: 'Media', label: 'Media', id: 's' }])
  })
})

describe('Airtable client', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('creates a record with typecast and the token', async () => {
    fetchMock.mockResolvedValue(json({ id: 'recNew' }))
    await expect(createRecord('tblX', { fldA: 'x' })).resolves.toBe('recNew')

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.airtable.com/v0/appUnitTest000000/tblX')
    expect(init?.method).toBe('POST')
    expect(JSON.parse(init?.body as string)).toEqual({ fields: { fldA: 'x' }, typecast: true })
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer pat_unit')
  })

  it('retries a 429 with backoff, then succeeds', async () => {
    vi.useFakeTimers()
    fetchMock
      .mockResolvedValueOnce(json({ errors: [] }, 429))
      .mockResolvedValueOnce(json({ errors: [] }, 429))
      .mockResolvedValueOnce(json({ id: 'recLater' }))
    const pending = createRecord('tblX', {})
    await vi.advanceTimersByTimeAsync(RETRY_DELAYS_MS[0] + RETRY_DELAYS_MS[1])
    await expect(pending).resolves.toBe('recLater')
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('gives up after the last retry with an AirtableError', async () => {
    vi.useFakeTimers()
    fetchMock.mockImplementation(async () => json({ error: 'RATE_LIMITED' }, 429))
    const pending = createRecord('tblX', {})
    const assertion = expect(pending).rejects.toMatchObject({ status: 429, type: 'RATE_LIMITED' })
    await vi.runAllTimersAsync()
    await assertion
    expect(fetchMock).toHaveBeenCalledTimes(RETRY_DELAYS_MS.length + 1)
  })

  it('maps an Airtable error body', async () => {
    fetchMock.mockResolvedValue(
      json({ error: { type: 'INVALID_VALUE_FOR_COLUMN', message: 'Bad value' } }, 422),
    )
    const error = await createRecord('tblX', {}).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(AirtableError)
    expect(error).toMatchObject({ status: 422, type: 'INVALID_VALUE_FOR_COLUMN' })
    expect((error as Error).message).toBe('Airtable 422 INVALID_VALUE_FOR_COLUMN: Bad value')
  })

  it("resolves a form's fields with options from linked records, across pages", async () => {
    fetchMock.mockImplementation(async (input) => {
      const url = String(input)
      if (url.includes('/meta/bases/')) return json({ tables: schema() })
      if (url.includes('offset=page2')) {
        return json({ records: [{ id: 'recB', fields: { fldArea: 'Barbados' } }] })
      }
      return json({
        records: [
          { id: 'recJ', fields: { fldArea: 'Jamaica' } },
          { id: 'recEmpty', fields: {} },
        ],
        offset: 'page2',
      })
    })

    const fields = await getFormFields('cta-consultation')
    const location = fields.find((f) => f.name === 'location')
    expect(location).toEqual({
      name: 'location',
      type: 'multipleRecordLinks',
      options: [
        { value: 'recB', label: 'Barbados' },
        { value: 'recJ', label: 'Jamaica' },
      ],
    })
    expect(fields.find((f) => f.name === 'name')).toEqual({ name: 'name', type: 'singleLineText' })
    // The schema once, then two pages of Locations, shared by every link field.
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })
})
