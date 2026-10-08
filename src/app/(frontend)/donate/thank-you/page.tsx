import Link from 'next/link'
import React from 'react'

import { getGlobal } from '@/lib/globals'
import { getPaidDonation } from '@/lib/stripe'
import { fill, formatAmount } from '@/utils/donation'

import { DonationCompleteTracker } from './DonationCompleteTracker'

type Props = { searchParams: Promise<{ session_id?: string | string[] }> }

// SPEC §7.4. The Stripe webhook records the donation in Airtable in Release 2 (T022).
export default async function ThankYouPage({ searchParams }: Props) {
  const { session_id } = await searchParams
  const [settings, donation] = await Promise.all([
    getGlobal('donation-settings'),
    getPaidDonation(Array.isArray(session_id) ? session_id[0] : session_id),
  ])

  if (!donation) {
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

  return (
    <section className="donate-card" aria-labelledby="thank-you-title">
      <DonationCompleteTracker
        sessionId={donation.sessionId}
        value={donation.amount / 100}
        currency={donation.currency.toUpperCase()}
      />
      {settings.thankYouKicker && (
        <p className="donate-kicker">
          {fill(
            settings.thankYouKicker,
            'amount',
            formatAmount(donation.amount, donation.currency),
          )}
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
