import localFont from 'next/font/local'

// Self-hosted (OFL-1.1, Latin subset, variable weight) so builds don't fetch from Google Fonts.
export const baloo2 = localFont({
  src: './fonts/baloo-2.woff2',
  weight: '400 800',
  variable: '--font-baloo-2',
  display: 'swap',
})

export const montserrat = localFont({
  src: './fonts/montserrat.woff2',
  weight: '100 900',
  variable: '--font-montserrat',
  display: 'swap',
})

export const roboto = localFont({
  src: './fonts/roboto.woff2',
  weight: '100 900',
  variable: '--font-roboto',
  display: 'swap',
})
