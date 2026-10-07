import { ArrowRight, Check } from 'lucide-react'
import React from 'react'

import { getGlobal } from '@/lib/globals'

import { CustomAmountInput } from './CustomAmountInput'
import { fill, formatAmount, STRIPE_MAX_AMOUNT, suggestedAmounts } from './mockup'

type Props = { searchParams: Promise<{ error?: string }> }

export default async function DonatePage({ searchParams }: Props) {
  const [{ error }, settings] = await Promise.all([searchParams, getGlobal('donation-settings')])
  const { allowCustomAmount, minimumAmount, currency } = settings
  const page = settings.page ?? {}
  const amounts = suggestedAmounts(settings)
  const minimum = formatAmount(minimumAmount ?? 0, currency)

  return (
    <div className="donate-layout">
      <section className="donate-why" aria-labelledby="donate-title">
        {page.kicker && <p className="donate-kicker">{page.kicker}</p>}
        <h1 id="donate-title">{page.heading}</h1>
        {page.lead && <p className="donate-lead">{page.lead}</p>}
        {page.reasonsHeading && <h2>{page.reasonsHeading}</h2>}
        {page.reasons && page.reasons.length > 0 && (
          <ul className="donate-reasons">
            {page.reasons.map(({ id, text }) => (
              <li key={id ?? text}>
                <Check aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        )}
        {page.note && <p className="donate-note">{page.note}</p>}
      </section>

      <section className="donate-card" aria-label="Make a donation">
        {/* TODO: POST to /api/donate, which validates the amount and creates a Stripe Checkout Session with UTM and source page in metadata (T010), only when a human developer decides to. */}
        {/* TODO: send UTM values as hidden fields from getUtm() (T009/T010), only when a human developer decides to. */}
        <form action="/donate/checkout" method="get" className="donate-form">
          <fieldset>
            <legend>{page.amountLegend}</legend>
            {error && (
              <p className="donate-error" role="alert">
                {fill(page.errorText, 'minimum', minimum)}
              </p>
            )}
            <div className="donate-amounts">
              {amounts.map((amount, index) => (
                <label key={amount} className="donate-amount">
                  <input type="radio" name="amount" value={amount} defaultChecked={index === 1} />
                  <span>
                    <strong>{formatAmount(amount, currency)}</strong>
                  </span>
                </label>
              ))}
              {allowCustomAmount && (
                <label className="donate-amount">
                  <input type="radio" name="amount" value="custom" />
                  <span>
                    <strong>{page.otherLabel}</strong>
                  </span>
                </label>
              )}
            </div>
            {allowCustomAmount && (
              <div className="donate-custom">
                <label htmlFor="donate-custom">{page.otherAmountLabel}</label>
                <CustomAmountInput
                  id="donate-custom"
                  name="custom"
                  type="number"
                  inputMode="decimal"
                  min={(minimumAmount ?? 0) / 100}
                  max={STRIPE_MAX_AMOUNT / 100}
                  step="0.01"
                  aria-describedby="donate-custom-hint"
                />
                <small id="donate-custom-hint">
                  {fill(page.otherAmountHint, 'minimum', minimum)}
                </small>
              </div>
            )}
          </fieldset>
          <button type="submit" className="button button-orange donate-submit">
            {page.submitLabel} <ArrowRight aria-hidden="true" />
          </button>
          {page.securePaymentNote && <p className="donate-note">{page.securePaymentNote}</p>}
        </form>
      </section>
    </div>
  )
}
