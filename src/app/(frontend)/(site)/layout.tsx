import type { Metadata } from 'next'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

import './site.css'
import './v1.css'

export const metadata: Metadata = {
  // TODO: hard-coded; migrate to Payload (`meta` on each page) only when a human developer decides to.
  title: 'Caribbean Brain Health Summit 2026',
  // TODO: drop noindex once the site lock (T017) is in place and the pages are real.
  robots: { index: false, follow: false },
}

// TODO: set page_type, audience_segment, journey and territory in the data layer (T015) only
// when a human developer decides to.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-page v1">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  )
}
