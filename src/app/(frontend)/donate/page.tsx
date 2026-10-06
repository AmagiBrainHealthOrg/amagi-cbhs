import { ArrowRight, Check } from 'lucide-react'
import React from 'react'

import { CustomAmountInput } from './CustomAmountInput'
import { donationSettings, formatAmount, STRIPE_MAX_AMOUNT } from './mockup'

type Props = { searchParams: Promise<{ error?: string }> }

export default async function DonatePage({ searchParams }: Props) {
  const { error } = await searchParams
  const { suggestedAmounts, allowCustomAmount, minimumAmount } = donationSettings

  return (
    <div className="donate-layout">
      <section className="donate-why" aria-labelledby="donate-title">
        {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
        <p className="donate-kicker">Support the Summit</p>
        <h1 id="donate-title">Give to Caribbean brain health</h1>
        <p className="donate-lead">
          The Caribbean Brain Health Summit brings brain health to communities across the region, in
          person and online, from 16 to 22 November 2026. Your gift makes it possible.
        </p>
        {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
        <h2>What your gift supports</h2>
        <ul className="donate-reasons">
          {donationSettings.reasons.map((reason) => (
            <li key={reason}>
              <Check aria-hidden="true" />
              {reason}
            </li>
          ))}
        </ul>
        {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
        <p className="donate-note">Amagi Health Ltd runs the Summit.</p>
      </section>

      <section className="donate-card" aria-label="Make a donation">
        <form action="/donate/checkout" method="get" className="donate-form">
          <fieldset>
            {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
            <legend>Choose an amount</legend>
            {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
            {error && (
              <p className="donate-error" role="alert">
                Please choose an amount, or enter one of at least {formatAmount(minimumAmount)}.
              </p>
            )}
            <div className="donate-amounts">
              {suggestedAmounts.map((amount, index) => (
                <label key={amount} className="donate-amount">
                  <input type="radio" name="amount" value={amount} defaultChecked={index === 1} />
                  <span>
                    <strong>{formatAmount(amount)}</strong>
                    {donationSettings.impact[amount] && (
                      <small>{donationSettings.impact[amount]}</small>
                    )}
                  </span>
                </label>
              ))}
              {allowCustomAmount && (
                <label className="donate-amount">
                  <input type="radio" name="amount" value="custom" />
                  <span>
                    {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
                    <strong>Other</strong>
                    <small>Choose your own amount</small>
                  </span>
                </label>
              )}
            </div>
            {allowCustomAmount && (
              <div className="donate-custom">
                {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
                <label htmlFor="donate-custom">Other amount (USD)</label>
                <CustomAmountInput
                  id="donate-custom"
                  name="custom"
                  type="number"
                  inputMode="decimal"
                  min={minimumAmount / 100}
                  max={STRIPE_MAX_AMOUNT / 100}
                  step="0.01"
                  aria-describedby="donate-custom-hint"
                />
                {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
                <small id="donate-custom-hint">
                  Select “Other” and enter at least {formatAmount(minimumAmount)}.
                </small>
              </div>
            )}
          </fieldset>
          {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
          <button type="submit" className="button button-orange donate-submit">
            Continue to payment <ArrowRight aria-hidden="true" />
          </button>
          {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
          <p className="donate-note">You’ll pay securely on Stripe’s checkout page.</p>
        </form>
      </section>
    </div>
  )
}
