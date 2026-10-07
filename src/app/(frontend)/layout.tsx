import React from 'react'

import { UtmCapture } from '@/components/UtmCapture'

import './tokens.css'
import './base.css'
import './styles.css'
import { baloo2, montserrat, roboto } from './fonts'

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${baloo2.variable} ${montserrat.variable} ${roboto.variable}`}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/ebg5tit.css" />
      </head>
      <body>
        <UtmCapture />
        {children}
      </body>
    </html>
  )
}
