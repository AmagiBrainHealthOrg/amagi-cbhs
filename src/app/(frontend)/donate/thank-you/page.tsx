import Link from 'next/link'
import React from 'react'

import { getGlobal } from '@/lib/globals'

import { fill, formatAmount } from '../mockup'

type Props = { searchParams: Promise<{ status?: string | string[]; amount?: string | string[] }> }

// TODO: read session_id, retrieve the Stripe Checkout Session server-side and show thank-you only if payment_status is paid (T010), only when a human developer decides to.
// TODO: push donation_complete (value, currency) to the data layer once per session ID (T015), only when a human developer decides to.
// TODO: the Stripe webhook records the donation in Airtable (Release 2, T022), only when a human developer decides to.
export default async function ThankYouPage({ searchParams }: Props) {
  const [{ status, amount }, settings] = await Promise.all([
    searchParams,
    getGlobal('donation-settings'),
  ])
  const minor = Number(amount)

  if (status !== 'paid') {
    return (
      <section className="donate-card" aria-labelledby="thank-you-title">
        <h1 id="thank-you-title">{settings.unconfirmedHeading}</h1>
        {settings.unconfirmedBody && <p className="donate-lead">{settings.unconfirmedBody}</p>}
        {settings.unconfirmedLinkLabel && (
          <Link className="button button-orange" href="/donate">
            {settings.unconfirmedLinkLabel}
          </Link>
        )}
      </section>
    )
  }

  const hasAmount = Number.isInteger(minor) && minor > 0
  return (
    <section className="donate-card" aria-labelledby="thank-you-title">
      {hasAmount && settings.thankYouKicker && (
        <p className="donate-kicker">
          {fill(settings.thankYouKicker, 'amount', formatAmount(minor, settings.currency))}
        </p>
      )}
      <h1 id="thank-you-title">{settings.thankYouHeading}</h1>
      {settings.thankYouBody && <p className="donate-lead">{settings.thankYouBody}</p>}
      {settings.thankYouLinkLabel && (
        <Link className="button button-outline" href="/">
          {settings.thankYouLinkLabel}
        </Link>
      )}
    </section>
  )
}
