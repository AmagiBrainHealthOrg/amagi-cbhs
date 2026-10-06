import type { Metadata } from 'next'
import React from 'react'

import { FaqList } from '@/components/FaqList'

import { DonateBand, PhotoHero } from '../_components/chrome'
import { faqs } from '../_content'

export const metadata: Metadata = { title: 'FAQs | Caribbean Brain Health Summit (v1)' }

export default function V1FaqsPage() {
  return (
    <>
      <PhotoHero kicker="FAQs" heading="Frequently asked questions" />
      <section className="v1-section">
        <FaqList groups={faqs} />
      </section>
      <DonateBand />
    </>
  )
}
