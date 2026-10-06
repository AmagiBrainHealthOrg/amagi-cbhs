// Mockup stand-in for the `donation-settings` global (SPEC §2, T006) until it exists.
// Amounts are in minor units, as the global will store them.
export const donationSettings = {
  suggestedAmounts: [2500, 5000, 10000, 25000],
  currency: 'usd',
  allowCustomAmount: true,
  minimumAmount: 500,
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
  const major = Number(customValue)
  if (!Number.isFinite(major)) return undefined
  const minor = Math.round(major * 100)
  return minor >= donationSettings.minimumAmount ? minor : undefined
}
