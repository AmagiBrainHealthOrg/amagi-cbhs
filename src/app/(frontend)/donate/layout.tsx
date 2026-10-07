import type { Metadata } from 'next'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getGlobal } from '@/lib/globals'

import './donate.css'

export async function generateMetadata(): Promise<Metadata> {
  const { donateLabel, brandTitle } = await getGlobal('header')
  const title = [donateLabel, brandTitle?.replace(/\s+/g, ' ')].filter(Boolean).join(' | ')
  return { title: title || undefined, robots: { index: false, follow: false } }
}

export default async function DonateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="donate-page">
      <a className="skip-link" href="#donate-main">
        Skip to content
      </a>
      <Header />
      <main className="donate-main" id="donate-main">
        {children}
      </main>
      <Footer />
    </div>
  )
}
