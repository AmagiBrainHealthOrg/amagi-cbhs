import type { Metadata } from 'next'
import React from 'react'

import { DonateBanner } from '@/components/DonateBanner'
import { FaqList } from '@/components/FaqList'
import { PageHero } from '@/components/PageHero'
import { faqs } from '@/config/placeholderContent'

export const metadata: Metadata = { title: 'FAQs | Caribbean Brain Health Summit' }

export default function FaqsPage() {
  return (
    <>
      {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
      <PageHero kicker="FAQs" heading="Frequently asked questions" />
      <section className="page-section">
        <FaqList groups={faqs} />
      </section>
      <DonateBanner />
    </>
  )
}
