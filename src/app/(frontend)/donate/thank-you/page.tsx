import Link from 'next/link'
import React from 'react'

import { donationSettings, formatAmount } from '../mockup'

type Props = { searchParams: Promise<{ status?: string | string[]; amount?: string | string[] }> }

export default async function ThankYouPage({ searchParams }: Props) {
  const { status, amount } = await searchParams
  const minor = Number(amount)

  if (status !== 'paid') {
    return (
      <section className="donate-card" aria-labelledby="thank-you-title">
        <h1 id="thank-you-title">We couldn’t confirm your donation</h1>
        <p className="donate-lead">
          If you completed a payment, you’ll get a receipt from Stripe by email. Otherwise you can
          try again.
        </p>
        <Link className="button button-orange" href="/donate">
          Back to donate
        </Link>
      </section>
    )
  }

  return (
    <section className="donate-card" aria-labelledby="thank-you-title">
      <p className="donate-kicker">
        {Number.isInteger(minor) && minor > 0 ? `${formatAmount(minor)} received` : 'Received'}
      </p>
      <h1 id="thank-you-title">{donationSettings.thankYouHeading}</h1>
      <p className="donate-lead">{donationSettings.thankYouBody}</p>
      <Link className="button button-outline" href="/">
        Back to the homepage
      </Link>
    </section>
  )
}
