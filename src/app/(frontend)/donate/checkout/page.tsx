import { Lock } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

import { formatAmount, parseAmount } from '../mockup'

type Props = { searchParams: Promise<{ amount?: string | string[]; custom?: string | string[] }> }

// Stands in for Stripe's hosted Checkout page. It deliberately has no payment
// inputs: card details are only ever entered on Stripe's own page.
// TODO: delete this page; donors go straight to Stripe's hosted Checkout (T010), only when a human developer decides to.
export default async function MockCheckoutPage({ searchParams }: Props) {
  const amount = parseAmount(await searchParams)
  if (!amount) redirect('/donate?error=amount')

  const formatted = formatAmount(amount)

  return (
    <section className="donate-card mock-checkout" aria-labelledby="checkout-title">
      <div className="mock-checkout-summary">
        {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
        <p className="donate-kicker">Amagi Health Ltd</p>
        <h1 id="checkout-title">Donate {formatted}</h1>
        <p>Caribbean Brain Health Summit 2026</p>
      </div>

      <div className="mock-checkout-stripe">
        {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
        <p className="mock-checkout-label">
          <Lock aria-hidden="true" /> Stripe Checkout placeholder
        </p>
        {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
        <div className="mock-checkout-fields" aria-hidden="true">
          <span>Email</span>
          <span>Card information</span>
          <span>Name on card</span>
          <span>Country or region</span>
        </div>
        {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
        <p className="donate-note">
          On the live site this step is Stripe’s hosted page, where the donor enters their payment
          details.
        </p>

        {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
        <div className="mock-checkout-actions">
          <Link
            className="button button-orange"
            href={`/donate/thank-you?status=paid&amount=${amount}`}
          >
            Simulate successful payment
          </Link>
          <Link className="button button-outline" href={`/donate/thank-you?amount=${amount}`}>
            Simulate unconfirmed payment
          </Link>
          <Link className="donate-back" href="/donate">
            Cancel and go back
          </Link>
        </div>
      </div>
    </section>
  )
}
