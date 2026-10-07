import { env } from '@/env'
import { getGlobal } from '@/lib/globals'
import { createDonationSession } from '@/lib/stripe'
import { parseDonationAmount, sourcePagePath } from '@/utils/donation'
import { type Utm, UTM_KEYS } from '@/utils/utm'

const text = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '')

// A browser form post goes back to the chooser with its error message; other clients get a 400.
function invalidAmount(request: Request) {
  if (request.headers.get('sec-fetch-mode') === 'navigate') {
    return Response.redirect(`${env.NEXT_PUBLIC_SITE_URL}/donate?error=amount`, 303)
  }
  return Response.json({ error: 'Invalid amount' }, { status: 400 })
}

// SPEC §7.3: validate the amount, create a Checkout Session and send the donor to Stripe.
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  if (!form) return Response.json({ error: 'Expected form data' }, { status: 400 })

  const [settings, header] = await Promise.all([
    getGlobal('donation-settings'),
    getGlobal('header'),
  ])
  const amount = parseDonationAmount(
    { amount: form.get('amount'), custom: form.get('custom') },
    settings,
  )
  if (amount === undefined) return invalidAmount(request)

  const utm = Object.fromEntries(UTM_KEYS.map((key) => [key, text(form.get(key))])) as Utm

  try {
    const url = await createDonationSession({
      amount,
      currency: settings.currency || 'usd',
      productName:
        settings.checkoutItemName?.trim() ||
        header.brandTitle?.replace(/\s+/g, ' ').trim() ||
        new URL(env.NEXT_PUBLIC_SITE_URL).host,
      productDescription: settings.checkoutItemDescription?.trim() || undefined,
      sourcePage: sourcePagePath(form.get('source_page')),
      utm,
    })
    return Response.redirect(url, 303)
  } catch (error) {
    console.error('Could not create a Checkout Session', error)
    return Response.json({ error: 'Checkout is unavailable' }, { status: 502 })
  }
}
