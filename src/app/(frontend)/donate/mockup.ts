// Mockup stand-in for the `donation-settings` global (SPEC §2, T006) until it exists.
// Amounts are in minor units, as the global will store them.
// TODO: hard-coded; migrate to Payload only when a human developer decides to.
export const donationSettings = {
  suggestedAmounts: [2500, 5000, 10000, 25000],
  currency: 'usd',
  allowCustomAmount: true,
  minimumAmount: 500,
  // TODO: hard-coded; migrate to Payload only when a human developer decides to.
  impact: {
    2500: 'Prints brain health guides for a community session',
    5000: 'Helps a local activity host run a session in their country',
    10000: 'Brings an online session to viewers across the region',
    25000: 'Supports a country programme during Summit week',
  } as Record<number, string>,
  // TODO: hard-coded; migrate to Payload only when a human developer decides to.
  reasons: [
    'Seven days of activity across several Caribbean countries and online, 16–22 November 2026',
    'Free sessions on dementia, stroke, mental health and healthy ageing for the public',
    'A Caribbean Call to Action on Brain Health, shaped by communities and policymakers',
  ],
  // TODO: hard-coded; migrate to Payload only when a human developer decides to.
  thankYouHeading: 'Thank you for your donation',
  thankYouBody:
    'Your gift helps bring the Caribbean Brain Health Summit to communities across the region and online.',
}

export const formatAmount = (minor: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: donationSettings.currency.toUpperCase(),
    maximumFractionDigits: minor % 100 === 0 ? 0 : 2,
  }).format(minor / 100)

// Stripe's largest single charge in USD.
export const STRIPE_MAX_AMOUNT = 99_999_999

type AmountParams = { amount?: string | string[]; custom?: string | string[] }

// Returns the amount in minor units, or undefined if it isn't a valid donation.
export function parseAmount({ amount, custom }: AmountParams): number | undefined {
  const pick = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value)
  const chosen = pick(amount)
  const customValue = pick(custom)?.trim()

  if (chosen && chosen !== 'custom') {
    const minor = Number(chosen)
    return donationSettings.suggestedAmounts.includes(minor) ? minor : undefined
  }

  if (!donationSettings.allowCustomAmount || !customValue) return undefined
  if (!/^\d+(\.\d{1,2})?$/.test(customValue)) return undefined
  const minor = Math.round(Number(customValue) * 100)
  return minor >= donationSettings.minimumAmount && minor <= STRIPE_MAX_AMOUNT ? minor : undefined
}
