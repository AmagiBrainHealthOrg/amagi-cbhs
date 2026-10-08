import type { Metadata } from 'next'
import React from 'react'

import { CookieBanner } from '@/components/CookieBanner'
import { env } from '@/env'
import { PageTrail } from '@/components/PageTrail'
import { UtmCapture } from '@/components/UtmCapture'
import { consentDefaultsScript } from '@/lib/consent'
import { getCookieBanner } from '@/lib/cookieBanner'

import './tokens.css'
import './base.css'
import './styles.css'
import { baloo2, montserrat, roboto } from './fonts'

// Resolves the default Open Graph image (opengraph-image.png) to an absolute URL.
export const metadata: Metadata = { metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL) }

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const cookieBanner = await getCookieBanner()

  return (
    <html lang="en" className={`${baloo2.variable} ${montserrat.variable} ${roboto.variable}`}>
      <head>
        {/* First in <head>: Consent Mode defaults precede every other dataLayer push (SPEC §10.5). */}
        <script dangerouslySetInnerHTML={{ __html: consentDefaultsScript }} />
        <link rel="stylesheet" href="https://use.typekit.net/ebg5tit.css" />
      </head>
      <body>
        <UtmCapture />
        <PageTrail />
        {children}
        {cookieBanner && <CookieBanner {...cookieBanner.banner} />}
      </body>
    </html>
  )
}
