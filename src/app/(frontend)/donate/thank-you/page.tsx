import Link from 'next/link'
import React from 'react'

import { donationSettings, formatAmount } from '../mockup'

type Props = { searchParams: Promise<{ status?: string | string[]; amount?: string | string[] }> }

// TODO: read session_id, retrieve the Stripe Checkout Session server-side and show thank-you only if payment_status is paid (T010), only when a human developer decides to.
// TODO: push donation_complete (value, currency) to the data layer once per session ID (T015), only when a human developer decides to.
// TODO: the Stripe webhook records the donation in Airtable (Release 2, T022), only when a human developer decides to.
export default async function ThankYouPage({ searchParams }: Props) {
  const { status, amount } = await searchParams
  const minor = Number(amount)

  if (status !== 'paid') {
    return (
      <section className="donate-card" aria-labelledby="thank-you-title">
        {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
        <h1 id="thank-you-title">We couldn’t confirm your donation</h1>
        <p className="donate-lead">
          If you completed a payment, you’ll get a receipt from Stripe by email. Otherwise you can
          try again.
        </p>
        {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
        <Link className="button button-orange" href="/donate">
          Back to donate
        </Link>
      </section>
    )
  }

  return (
    <section className="donate-card" aria-labelledby="thank-you-title">
      {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
      <p className="donate-kicker">
        {Number.isInteger(minor) && minor > 0 ? `${formatAmount(minor)} received` : 'Received'}
      </p>
      <h1 id="thank-you-title">{donationSettings.thankYouHeading}</h1>
      <p className="donate-lead">{donationSettings.thankYouBody}</p>
      {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
      <Link className="button button-outline" href="/">
        Back to the homepage
      </Link>
    </section>
  )
}
