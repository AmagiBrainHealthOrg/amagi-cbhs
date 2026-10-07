import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AmountSettings } from '@/utils/donation'

const mocks = vi.hoisted(() => ({
  createDonationSession: vi.fn<() => Promise<string>>(),
  settings: {
    suggestedAmounts: [{ amount: 2500 }, { amount: 5000 }],
    currency: 'usd',
    allowCustomAmount: true,
    minimumAmount: 500,
  } as AmountSettings,
}))

vi.mock('@/lib/stripe', () => ({ createDonationSession: mocks.createDonationSession }))
vi.mock('@/lib/globals', () => ({
  getGlobal: async (slug: string) =>
    slug === 'header' ? { brandTitle: 'Caribbean Brain\nHealth Summit' } : mocks.settings,
}))

const { POST } = await import('@/app/(frontend)/api/donate/route')
const { parseDonationAmount, sourcePagePath } = await import('@/utils/donation')

const post = (fields: Record<string, string>, headers: Record<string, string> = {}) =>
  POST(
    new Request('http://localhost/api/donate', {
      method: 'POST',
      body: new URLSearchParams(fields),
      headers,
    }),
  )

describe('parseDonationAmount', () => {
  const settings = mocks.settings

  it('accepts suggested amounts and custom amounts at or above the minimum', () => {
    expect(parseDonationAmount({ amount: '2500' }, settings)).toBe(2500)
    expect(parseDonationAmount({ amount: 'custom', custom: '12.50' }, settings)).toBe(1250)
    expect(parseDonationAmount({ amount: 'custom', custom: ' 5 ' }, settings)).toBe(500)
    expect(parseDonationAmount({ amount: '3000' }, settings)).toBe(3000)
  })

  it('rejects amounts below the minimum, zero, negative, non-numeric or missing', () => {
    for (const input of [
      { amount: '499' },
      { amount: '0' },
      { amount: '-2500' },
      { amount: 'abc' },
      { amount: '25.5' },
      { amount: null },
      { amount: 'custom', custom: '4.99' },
      { amount: 'custom', custom: '' },
      { amount: 'custom', custom: '1e3' },
      { amount: 'custom', custom: '10.001' },
    ]) {
      expect(parseDonationAmount(input, settings), JSON.stringify(input)).toBeUndefined()
    }
  })

  it('accepts only suggested amounts when custom amounts are off', () => {
    const off = { ...settings, allowCustomAmount: false }
    expect(parseDonationAmount({ amount: '5000' }, off)).toBe(5000)
    expect(parseDonationAmount({ amount: '3000' }, off)).toBeUndefined()
    expect(parseDonationAmount({ amount: 'custom', custom: '30' }, off)).toBeUndefined()
  })

  it('caps custom amounts at Stripe’s maximum', () => {
    expect(parseDonationAmount({ amount: 'custom', custom: '1000000' }, settings)).toBeUndefined()
  })
})

describe('sourcePagePath', () => {
  it('keeps same-site paths and falls back to /donate', () => {
    expect(sourcePagePath('/about')).toBe('/about')
    expect(sourcePagePath('/news/summit-dates')).toBe('/news/summit-dates')
    for (const value of ['', 'https://evil.example', '//evil.example', '/\\evil', null, '/a b']) {
      expect(sourcePagePath(value)).toBe('/donate')
    }
  })
})

describe('POST /api/donate', () => {
  beforeEach(() => {
    mocks.createDonationSession.mockReset()
    mocks.createDonationSession.mockResolvedValue('https://checkout.stripe.com/c/pay/cs_test_123')
  })

  it('creates a Checkout Session and redirects to it with 303', async () => {
    const response = await post({
      amount: '2500',
      source_page: '/about',
      utm_source: 'newsletter',
      utm_campaign: 'launch',
    })
    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe('https://checkout.stripe.com/c/pay/cs_test_123')
    expect(mocks.createDonationSession).toHaveBeenCalledWith({
      amount: 2500,
      currency: 'usd',
      productName: 'Caribbean Brain Health Summit',
      sourcePage: '/about',
      utm: {
        utm_source: 'newsletter',
        utm_medium: '',
        utm_campaign: 'launch',
        utm_term: '',
        utm_content: '',
      },
    })
  })

  it('returns 400 for invalid amounts without calling Stripe', async () => {
    for (const amount of ['100', '0', '-2500', 'abc']) {
      const response = await post({ amount })
      expect(response.status, amount).toBe(400)
    }
    expect(mocks.createDonationSession).not.toHaveBeenCalled()
  })

  it('sends a browser form post with an invalid amount back to the chooser', async () => {
    const response = await post({ amount: '100' }, { 'sec-fetch-mode': 'navigate' })
    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toMatch(/\/donate\?error=amount$/)
  })

  it('falls back to /donate for an off-site source page', async () => {
    await post({ amount: '2500', source_page: 'https://evil.example' })
    expect(mocks.createDonationSession).toHaveBeenCalledWith(
      expect.objectContaining({ sourcePage: '/donate' }),
    )
  })

  it('returns 502 when Stripe fails', async () => {
    mocks.createDonationSession.mockRejectedValue(new Error('Stripe is down'))
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const response = await post({ amount: '2500' })
    expect(response.status).toBe(502)
    expect(error).toHaveBeenCalled()
    error.mockRestore()
  })
})
