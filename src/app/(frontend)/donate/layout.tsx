import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import './donate.css'

export const metadata: Metadata = {
  title: 'Donate | Caribbean Brain Health Summit',
  robots: { index: false, follow: false },
}

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="donate-page">
      <a className="skip-link" href="#donate-main">
        Skip to content
      </a>
      <p className="donate-mockup-banner" role="note">
        Mockup: no payment is taken and nothing is sent to Stripe.
      </p>
      <header className="donate-header">
        <Link href="/" className="donate-brand">
          Caribbean Brain Health Summit 2026
        </Link>
      </header>
      <main className="donate-main" id="donate-main">
        {children}
      </main>
    </div>
  )
}
