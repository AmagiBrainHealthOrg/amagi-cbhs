import { ArrowRight } from 'lucide-react'
import React from 'react'

import { donationSettings, formatAmount } from './mockup'

type Props = { searchParams: Promise<{ error?: string }> }

export default async function DonatePage({ searchParams }: Props) {
  const { error } = await searchParams
  const { suggestedAmounts, allowCustomAmount, minimumAmount } = donationSettings

  return (
    <section className="donate-card" aria-labelledby="donate-title">
      <p className="donate-kicker">Support the Summit</p>
      <h1 id="donate-title">Make a donation</h1>
      <p className="donate-lead">
        Your gift helps bring brain health to communities across the Caribbean, in person and
        online, from 16 to 22 November 2026.
      </p>

      <form action="/donate/checkout" method="get" className="donate-form">
        <fieldset>
          <legend>Choose an amount</legend>
          {error && (
            <p className="donate-error" role="alert">
              Please choose an amount, or enter one of at least {formatAmount(minimumAmount)}.
            </p>
          )}
          <div className="donate-amounts">
            {suggestedAmounts.map((amount, index) => (
              <label key={amount} className="donate-amount">
                <input
                  type="radio"
                  name="amount"
                  value={amount}
                  defaultChecked={index === 1}
                />
                <span>{formatAmount(amount)}</span>
              </label>
            ))}
            {allowCustomAmount && (
              <label className="donate-amount">
                <input type="radio" name="amount" value="custom" />
                <span>Other</span>
              </label>
            )}
          </div>
          {allowCustomAmount && (
            <div className="donate-custom">
              <label htmlFor="donate-custom">Other amount (USD)</label>
              <input
                id="donate-custom"
                name="custom"
                type="number"
                inputMode="decimal"
                min={minimumAmount / 100}
                step="0.01"
                aria-describedby="donate-custom-hint"
              />
              <small id="donate-custom-hint">
                Select “Other” and enter at least {formatAmount(minimumAmount)}.
              </small>
            </div>
          )}
        </fieldset>
        <button type="submit" className="button button-orange donate-submit">
          Continue to payment <ArrowRight aria-hidden="true" />
        </button>
        <p className="donate-note">You’ll pay securely on Stripe’s checkout page.</p>
      </form>
    </section>
  )
}
