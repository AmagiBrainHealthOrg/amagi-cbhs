import 'server-only'

import Stripe from 'stripe'

import { env } from '@/env'
import type { Utm } from '@/utils/utm'

let client: Stripe | undefined

// Created on first use, so pages that never touch Stripe build and run without a key.
export function getStripe(): Stripe {
  if (!env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is not set')
  client ??= new Stripe(env.STRIPE_SECRET_KEY)
  return client
}

type DonationSessionInput = {
  amount: number
  currency: string
  productName: string
  productDescription?: string
  sourcePage: string
  utm: Utm
}

// SPEC §7.3. The donor pays on Stripe's hosted page; no card data touches our site.
export async function createDonationSession({
  amount,
  currency,
  productName,
  productDescription,
  sourcePage,
  utm,
}: DonationSessionInput): Promise<string> {
  const metadata: Record<string, string> = { source_page: sourcePage }
  for (const [key, value] of Object.entries(utm)) if (value) metadata[key] = value.slice(0, 500)

  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    submit_type: 'donate',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency,
          unit_amount: amount,
          product_data: {
            name: productName,
            ...(productDescription && { description: productDescription }),
          },
        },
      },
    ],
    metadata,
    success_url: `${env.NEXT_PUBLIC_SITE_URL}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_SITE_URL}${sourcePage}`,
  })
  if (!session.url) throw new Error(`Checkout Session ${session.id} has no URL`)
  return session.url
}

export type PaidDonation = { sessionId: string; amount: number; currency: string }

const SESSION_ID = /^cs_(test|live)_[A-Za-z0-9]{1,250}$/

// SPEC §7.4: only a session Stripe reports as paid counts. Anything else is unconfirmed.
export async function getPaidDonation(sessionId: string | undefined): Promise<PaidDonation | null> {
  if (!sessionId || !SESSION_ID.test(sessionId)) return null

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid' || session.amount_total === null || !session.currency) {
      return null
    }
    return { sessionId: session.id, amount: session.amount_total, currency: session.currency }
  } catch (error) {
    if (
      error instanceof Stripe.errors.StripeInvalidRequestError &&
      error.code === 'resource_missing'
    ) {
      return null
    }
    console.error('Could not retrieve the Checkout Session', error)
    return null
  }
}
