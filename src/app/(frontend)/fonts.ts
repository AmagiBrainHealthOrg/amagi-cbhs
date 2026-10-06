import { Baloo_2, Montserrat, Roboto } from 'next/font/google'

export const baloo2 = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-baloo-2',
  display: 'swap',
})

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})
