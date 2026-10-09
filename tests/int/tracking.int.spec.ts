import { beforeEach, describe, expect, it, vi } from 'vitest'

const track = vi.fn()
vi.mock('@plausible-analytics/tracker', () => ({ init: vi.fn(), track }))

const { clearFormPending, markFormPending, startAnalytics, trackFormStart, trackFormSubmit } =
  await import('@/lib/tracking')

startAnalytics({ domain: 'example.org' })

describe('form tracking (SPEC §10.2)', () => {
  beforeEach(() => {
    track.mockClear()
    sessionStorage.clear()
  })

  it('sends form_start with the form key only', () => {
    trackFormStart('contact')
    expect(track).toHaveBeenCalledWith('form_start', { props: { form: 'contact' } })
  })

  it('counts form_submit once, only after a pending submit', () => {
    trackFormSubmit({ form: 'register-interest', territory: 'Jamaica' })
    expect(track).not.toHaveBeenCalled()

    markFormPending('register-interest')
    trackFormSubmit({ form: 'register-interest', territory: 'Jamaica', audienceType: 'Family' })
    trackFormSubmit({ form: 'register-interest', territory: 'Jamaica', audienceType: 'Family' })

    expect(track).toHaveBeenCalledTimes(1)
    expect(track).toHaveBeenCalledWith('form_submit', {
      props: { form: 'register-interest', territory: 'Jamaica', audience_type: 'Family' },
    })
  })

  it('keeps markers per form and drops one after a rejected submit', () => {
    markFormPending('contact')
    clearFormPending('contact')
    markFormPending('partner')

    trackFormSubmit({ form: 'contact' })
    trackFormSubmit({ form: 'partner' })

    expect(track).toHaveBeenCalledTimes(1)
    expect(track).toHaveBeenCalledWith('form_submit', { props: { form: 'partner' } })
  })
})

describe('donation tracking (SPEC §10.2)', () => {
  it('sends the amount and currency as revenue and as props', async () => {
    const { trackDonationComplete } = await import('@/lib/tracking')
    track.mockClear()
    trackDonationComplete({ value: 25, currency: 'usd' })
    expect(track).toHaveBeenCalledWith('donation_complete', {
      revenue: { amount: 25, currency: 'usd' },
      props: { amount: '25.00', currency: 'USD' },
    })
  })
})
