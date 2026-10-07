import React from 'react'

import { CookieBanner } from '@/components/CookieBanner'
import { UtmCapture } from '@/components/UtmCapture'
import { consentDefaultsScript } from '@/lib/consent'
import { getCookieBanner } from '@/lib/cookieBanner'

import './tokens.css'
import './base.css'
import './styles.css'
import { baloo2, montserrat, roboto } from './fonts'

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
        {children}
        {cookieBanner && <CookieBanner {...cookieBanner.banner} />}
      </body>
    </html>
  )
}
