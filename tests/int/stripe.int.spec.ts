import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ create: vi.fn(), retrieve: vi.fn() }))

vi.mock('server-only', () => ({}))
vi.mock('@/env', () => ({
  env: { STRIPE_SECRET_KEY: 'sk_test_unit', NEXT_PUBLIC_SITE_URL: 'https://site.test' },
}))
vi.mock('stripe', async (importOriginal) => {
  const { default: Stripe } = await importOriginal<typeof import('stripe')>()
  class FakeStripe {
    static errors = Stripe.errors
    checkout = { sessions: { create: mocks.create, retrieve: mocks.retrieve } }
  }
  return { default: FakeStripe }
})

const { default: Stripe } = await import('stripe')
const { createDonationSession, getPaidDonation } = await import('@/lib/stripe')

const utm = {
  utm_source: 'newsletter',
  utm_medium: '',
  utm_campaign: 'launch',
  utm_term: '',
  utm_content: '',
}

describe('createDonationSession', () => {
  beforeEach(() => {
    mocks.create.mockReset()
  })

  it('creates a hosted payment session per SPEC §7.3', async () => {
    mocks.create.mockResolvedValue({ id: 'cs_test_1', url: 'https://checkout.stripe.com/c/pay/1' })
    const url = await createDonationSession({
      amount: 2500,
      currency: 'usd',
      productName: 'CBHS',
      sourcePage: '/about',
      utm,
    })
    expect(url).toBe('https://checkout.stripe.com/c/pay/1')
    expect(mocks.create).toHaveBeenCalledWith({
      mode: 'payment',
      submit_type: 'donate',
      line_items: [
        {
          quantity: 1,
          price_data: { currency: 'usd', unit_amount: 2500, product_data: { name: 'CBHS' } },
        },
      ],
      metadata: { source_page: '/about', utm_source: 'newsletter', utm_campaign: 'launch' },
      success_url: 'https://site.test/donate/thank-you?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://site.test/about',
    })
  })

  it('adds the item description when one is set', async () => {
    mocks.create.mockResolvedValue({ id: 'cs_test_2', url: 'https://checkout.stripe.com/c/pay/2' })
    await createDonationSession({
      amount: 2500,
      currency: 'usd',
      productName: 'Donation',
      productDescription: 'Supporting brain health',
      sourcePage: '/donate',
      utm,
    })
    expect(mocks.create.mock.calls[0][0].line_items[0].price_data.product_data).toEqual({
      name: 'Donation',
      description: 'Supporting brain health',
    })
  })
})

describe('getPaidDonation', () => {
  beforeEach(() => {
    mocks.retrieve.mockReset()
  })

  it('returns the amount and currency of a paid session', async () => {
    mocks.retrieve.mockResolvedValue({
      id: 'cs_test_paid',
      payment_status: 'paid',
      amount_total: 2500,
      currency: 'usd',
    })
    expect(await getPaidDonation('cs_test_paid')).toEqual({
      sessionId: 'cs_test_paid',
      amount: 2500,
      currency: 'usd',
    })
  })

  it('returns null for an unpaid session', async () => {
    mocks.retrieve.mockResolvedValue({
      id: 'cs_test_open',
      payment_status: 'unpaid',
      amount_total: 2500,
      currency: 'usd',
    })
    expect(await getPaidDonation('cs_test_open')).toBeNull()
  })

  it('returns null for a session Stripe does not know', async () => {
    mocks.retrieve.mockRejectedValue(
      new Stripe.errors.StripeInvalidRequestError({
        type: 'invalid_request_error',
        code: 'resource_missing',
        message: 'No such checkout.session: cs_test_fake',
      }),
    )
    expect(await getPaidDonation('cs_test_fake')).toBeNull()
  })

  it('logs other Stripe errors and returns null', async () => {
    mocks.retrieve.mockRejectedValue(new Error('network'))
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(await getPaidDonation('cs_test_x')).toBeNull()
    expect(error).toHaveBeenCalled()
    error.mockRestore()
  })

  it('does not call Stripe for a missing or malformed session ID', async () => {
    for (const id of [undefined, '', 'pi_123', 'cs_test_../../x']) {
      expect(await getPaidDonation(id)).toBeNull()
    }
    expect(mocks.retrieve).not.toHaveBeenCalled()
  })
})
