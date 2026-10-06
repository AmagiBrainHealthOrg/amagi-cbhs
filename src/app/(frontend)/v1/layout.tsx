import type { Metadata } from 'next'
import React from 'react'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

import { v1Nav } from './_content'
import '../(site)/site.css'
import './v1.css'

export const metadata: Metadata = {
  title: 'Caribbean Brain Health Summit 2026',
  robots: { index: false, follow: false },
}

export default function V1Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-page v1">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <p className="preview-banner" role="note">
        Design variation v1: placeholder content, not final.
      </p>
      <SiteHeader nav={v1Nav} homeHref="/v1" />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  )
}
