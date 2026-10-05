import React from 'react'
import './styles.css'

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600&family=Montserrat:wght@300;400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap"
        />
        <link rel="stylesheet" href="https://use.typekit.net/ebg5tit.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
