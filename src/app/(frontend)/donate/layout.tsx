import type { Metadata } from 'next'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

import './donate.css'

export const metadata: Metadata = {
  // TODO: hard-coded; migrate to Payload only when a human developer decides to.
  title: 'Donate | Caribbean Brain Health Summit',
  robots: { index: false, follow: false },
}

export default async function DonateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="donate-page">
      <a className="skip-link" href="#donate-main">
        Skip to content
      </a>
      {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
      <p className="donate-mockup-banner" role="note">
        Mockup: no payment is taken and nothing is sent to Stripe.
      </p>
      <Header />
      <main className="donate-main" id="donate-main">
        {children}
      </main>
      <Footer />
    </div>
  )
}
