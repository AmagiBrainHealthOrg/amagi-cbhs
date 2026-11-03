import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { airtableDonations } from '@/config/airtable'
import type { SchemaTable } from '@/utils/airtable'

const SECRET = 'whsec_unit'

vi.mock('server-only', () => ({}))
vi.mock('@/env', () => ({
  env: {
    STRIPE_WEBHOOK_SECRET: 'whsec_unit',
    AIRTABLE_TOKEN: 'pat_unit',
    AIRTABLE_BASE_ID: 'appUnitTest000000',
  },
}))

const { default: Stripe } = await import('stripe')
const { POST } = await import('@/app/(frontend)/api/stripe/webhook/route')
const { toDonationFields } = await import('@/utils/airtable')

const { fields } = airtableDonations
const table: SchemaTable = {
  id: airtableDonations.table,
  name: 'Donation',
  primaryFieldId: 'fldRecord',
  fields: [
    { id: 'fldRecord', name: 'Record', type: 'autoNumber' },
    { id: fields.amount.id, name: 'Amount', type: 'currency' },
    { id: fields.currency.id, name: 'Currency', type: 'singleLineText' },
    { id: fields.date.id, name: 'Date', type: 'dateTime' },
    { id: fields.session.id, name: 'Stripe session', type: 'singleLineText' },
    { id: 'fldSource', name: 'UTM source', type: 'singleLineText' },
    { id: 'fldCampaign', name: 'UTM campaign', type: 'singleLineText' },
    { id: 'fldPage', name: 'Source page', type: 'singleLineText' },
  ],
}

const CREATED = 1_793_000_000

function event(type: string, session: Record<string, unknown> = {}) {
  return {
    id: 'evt_unit',
    object: 'event',
    type,
    created: CREATED,
    data: {
      object: {
        id: 'cs_test_unit',
        object: 'checkout.session',
        payment_status: 'paid',
        amount_total: 2500,
        currency: 'usd',
        metadata: { source_page: '/about', utm_source: 'newsletter', utm_campaign: 'launch' },
        customer_details: { name: 'Testy Testerson', email: 'testy@example.com' },
        ...session,
      },
    },
  }
}

const post = (body: string, signature?: string) =>
  POST(
    new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body,
      headers: signature ? { 'stripe-signature': signature } : {},
    }),
  )

const signed = (payload: unknown) => {
  const body = JSON.stringify(payload)
  return post(body, Stripe.webhooks.generateTestHeaderString({ payload: body, secret: SECRET }))
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

describe('toDonationFields', () => {
  it('writes major units, the currency, the date, the session and attribution', () => {
    expect(
      toDonationFields(table, {
        sessionId: 'cs_test_1',
        amount: 2550,
        currency: 'usd',
        paidAt: new Date(CREATED * 1000),
        sourcePage: '/donate',
        utm: { source: 'newsletter' },
      }),
    ).toEqual({
      [fields.amount.id]: 25.5,
      [fields.currency.id]: 'USD',
      [fields.date.id]: new Date(CREATED * 1000).toISOString(),
      [fields.session.id]: 'cs_test_1',
      fldSource: 'newsletter',
      fldPage: '/donate',
    })
  })

  it('leaves zero-decimal currencies whole', () => {
    const record = toDonationFields(table, {
      sessionId: 'cs_test_2',
      amount: 5000,
      currency: 'jpy',
      paidAt: new Date(),
    })
    expect(record[fields.amount.id]).toBe(5000)
  })

  it('follows Stripe, not ISO 4217, for currencies Stripe counts in hundredths', () => {
    for (const currency of ['huf', 'isk', 'ugx']) {
      const record = toDonationFields(table, {
        sessionId: 'cs_test_3',
        amount: 500000,
        currency,
        paidAt: new Date(),
      })
      expect(record[fields.amount.id]).toBe(5000)
    }
  })

  it('divides three-decimal currencies by 1000', () => {
    const record = toDonationFields(table, {
      sessionId: 'cs_test_4',
      amount: 25500,
      currency: 'bhd',
      paidAt: new Date(),
    })
    expect(record[fields.amount.id]).toBe(25.5)
  })
})

describe('POST /api/stripe/webhook', () => {
  const fetchMock = vi.fn<typeof fetch>()
  const upserts = () =>
    fetchMock.mock.calls
      .filter(([, init]) => init?.method === 'PATCH')
      .map(([url, init]) => ({
        url: String(url),
        body: JSON.parse(init?.body as string),
      }))

  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockImplementation(async (input, init) => {
      if (String(input).includes('/meta/bases/')) return json({ tables: [table] })
      if (init?.method === 'PATCH') {
        return json({ records: [{ id: 'recDonation' }], createdRecords: ['recDonation'] })
      }
      return json({ error: 'NOT_FOUND' }, 404)
    })
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'info').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('upserts one Donation record on the session ID, without donor details', async () => {
    const response = await signed(event('checkout.session.completed'))
    expect(response.status).toBe(200)

    const [upsert] = upserts()
    expect(upserts()).toHaveLength(1)
    expect(upsert.url).toBe(
      `https://api.airtable.com/v0/appUnitTest000000/${airtableDonations.table}`,
    )
    expect(upsert.body).toEqual({
      performUpsert: { fieldsToMergeOn: [fields.session.id] },
      records: [
        {
          fields: {
            [fields.amount.id]: 25,
            [fields.currency.id]: 'USD',
            [fields.date.id]: new Date(CREATED * 1000).toISOString(),
            [fields.session.id]: 'cs_test_unit',
            fldSource: 'newsletter',
            fldCampaign: 'launch',
            fldPage: '/about',
          },
        },
      ],
      typecast: true,
    })
    expect(JSON.stringify(upsert.body)).not.toMatch(/Testy|example\.com/)
  })

  it('records a delayed payment once it succeeds, and nothing while it is unpaid', async () => {
    const unpaid = await signed(event('checkout.session.completed', { payment_status: 'unpaid' }))
    expect(unpaid.status).toBe(200)
    expect(upserts()).toHaveLength(0)

    const paid = await signed(event('checkout.session.async_payment_succeeded'))
    expect(paid.status).toBe(200)
    expect(upserts()).toHaveLength(1)
  })

  it('ignores other event types', async () => {
    const response = await signed(event('checkout.session.expired'))
    expect(response.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects a missing or wrong signature, and the valid path still works', async () => {
    const body = JSON.stringify(event('checkout.session.completed'))
    expect((await post(body)).status).toBe(400)
    const forged = Stripe.webhooks.generateTestHeaderString({
      payload: body,
      secret: 'whsec_other',
    })
    expect((await post(body, forged)).status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()

    expect((await signed(event('checkout.session.completed'))).status).toBe(200)
    expect(upserts()).toHaveLength(1)
  })

  it('returns 500 when Airtable fails, so Stripe retries', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMock.mockImplementation(async (input) =>
      String(input).includes('/meta/bases/')
        ? json({ tables: [table] })
        : json({ error: { type: 'INVALID_VALUE_FOR_COLUMN', message: 'Bad value' } }, 422),
    )
    const response = await signed(event('checkout.session.completed'))
    expect(response.status).toBe(500)
  })
})
