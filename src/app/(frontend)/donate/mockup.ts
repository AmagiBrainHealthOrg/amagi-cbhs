import type { DonationSetting } from '@/payload-types'

// Amount handling for the donate mockup. T010 replaces it with POST /api/donate and Stripe.

type Settings = Pick<
  DonationSetting,
  'suggestedAmounts' | 'currency' | 'allowCustomAmount' | 'minimumAmount'
>

export const suggestedAmounts = (settings: Settings) =>
  (settings.suggestedAmounts ?? []).map(({ amount }) => amount)

// TODO: validate amounts with Zod in POST /api/donate against the Payload `donation-settings` global (T010), only when a human developer decides to.
export const formatAmount = (minor: number, currency: string | null | undefined) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'usd').toUpperCase(),
    maximumFractionDigits: minor % 100 === 0 ? 0 : 2,
  }).format(minor / 100)

// Stripe's largest single charge in USD.
export const STRIPE_MAX_AMOUNT = 99_999_999

// Fills the {minimum} or {amount} placeholder in donation-settings copy.
export const fill = (text: string | null | undefined, token: string, value: string) =>
  (text ?? '').replaceAll(`{${token}}`, value)

type AmountParams = { amount?: string | string[]; custom?: string | string[] }

// Returns the amount in minor units, or undefined if it isn't a valid donation.
export function parseAmount(
  { amount, custom }: AmountParams,
  settings: Settings,
): number | undefined {
  const pick = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value)
  const chosen = pick(amount)
  const customValue = pick(custom)?.trim()

  if (chosen && chosen !== 'custom') {
    const minor = Number(chosen)
    return suggestedAmounts(settings).includes(minor) ? minor : undefined
  }

  if (!settings.allowCustomAmount || !customValue) return undefined
  if (!/^\d+(\.\d{1,2})?$/.test(customValue)) return undefined
  const minor = Math.round(Number(customValue) * 100)
  return minor >= (settings.minimumAmount ?? 1) && minor <= STRIPE_MAX_AMOUNT ? minor : undefined
}
