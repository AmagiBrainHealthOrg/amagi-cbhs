import type { Metadata } from 'next'
import React from 'react'

import { Analytics } from '@/components/Analytics'
import { env } from '@/env'
import { PageTrail } from '@/components/PageTrail'
import { UtmCapture } from '@/components/UtmCapture'
import { getPlausibleSettings } from '@/lib/analytics'

import './tokens.css'
import './base.css'
import './styles.css'
import { baloo2, montserrat, roboto } from './fonts'

// Resolves the default Open Graph image (opengraph-image.png) to an absolute URL.
export const metadata: Metadata = { metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL) }

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const plausible = await getPlausibleSettings()

  return (
    <html lang="en" className={`${baloo2.variable} ${montserrat.variable} ${roboto.variable}`}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/ebg5tit.css" />
      </head>
      <body>
        {plausible && <Analytics {...plausible} />}
        <UtmCapture />
        <PageTrail />
        {children}
      </body>
    </html>
  )
}
