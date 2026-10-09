import { z } from 'zod'

import type { DonationSetting } from '@/payload-types'

export type AmountSettings = Pick<
  DonationSetting,
  'suggestedAmounts' | 'currency' | 'allowCustomAmount' | 'minimumAmount'
>

// Stripe's largest single charge in USD, in cents.
export const STRIPE_MAX_AMOUNT = 99_999_999

export const suggestedAmounts = (settings: AmountSettings) =>
  (settings.suggestedAmounts ?? []).map(({ amount }) => amount)

export const formatAmount = (minor: number, currency: string | null | undefined) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'usd').toUpperCase(),
    maximumFractionDigits: minor % 100 === 0 ? 0 : 2,
  }).format(minor / 100)

// Fills the {minimum} or {amount} placeholder in donation-settings copy.
export const fill = (text: string | null | undefined, token: string, value: string) =>
  (text ?? '').replaceAll(`{${token}}`, value)

const minorUnits = z
  .string()
  .regex(/^\d{1,9}$/)
  .transform(Number)
const majorUnits = z
  .string()
  .trim()
  .regex(/^\d{1,7}(\.\d{1,2})?$/)
  .transform((value) => Math.round(Number(value) * 100))

const amountForm = z.union([
  z.object({ amount: z.literal('custom'), custom: majorUnits }),
  z.object({ amount: minorUnits }),
])

/**
 * The donation in minor units, or undefined if it isn't one we accept. `amount` is a suggested
 * amount in cents, or "custom" with `custom` in dollars. A custom amount can also arrive as cents
 * in `amount`; it must sit between `minimumAmount` and Stripe's maximum.
 */
export function parseDonationAmount(
  input: { amount: unknown; custom?: unknown },
  settings: AmountSettings,
): number | undefined {
  const parsed = amountForm.safeParse(input)
  if (!parsed.success) return undefined

  const amount = 'custom' in parsed.data ? parsed.data.custom : parsed.data.amount
  if (parsed.data.amount !== 'custom' && suggestedAmounts(settings).includes(amount)) return amount

  const minimum = Math.max(settings.minimumAmount ?? 1, 1)
  return settings.allowCustomAmount && amount >= minimum && amount <= STRIPE_MAX_AMOUNT
    ? amount
    : undefined
}

// A same-site path, or undefined for anything else (full URLs, protocol-relative, query strings).
export const sitePath = (value: unknown): string | undefined =>
  typeof value === 'string' && /^\/(?![/\\])[^\s?#]{0,199}$/.test(value) ? value : undefined

// A same-site path for the cancel URL and metadata; anything else falls back to /donate.
export const sourcePagePath = (value: unknown): string => sitePath(value) ?? '/donate'
