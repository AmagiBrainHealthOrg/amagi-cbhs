import type { Metadata } from 'next'
import React from 'react'

import { DonateBanner } from '@/components/DonateBanner'
import { PageHero } from '@/components/PageHero'
import { callToAction } from '@/config/placeholderContent'

export const metadata: Metadata = { title: 'Call to Action | Caribbean Brain Health Summit' }

export default function CallToActionPage() {
  return (
    <>
      <PageHero
        kicker={callToAction.kicker}
        heading={callToAction.heading}
        lead={callToAction.lead}
      />
      <section className="page-section" aria-labelledby="areas-title">
        <h2 id="areas-title">Five action areas</h2>
        <p className="section-intro">{callToAction.intro}</p>
        {/* TODO: becomes the `actionAreas` block from Payload `pages` (T009) only when a human
            developer decides to. */}
        <ol className="action-areas">
          {callToAction.areas.map(({ title, body }) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="page-section page-section-tint" aria-labelledby="consultation-title">
        <h2 id="consultation-title">{callToAction.consultation.heading}</h2>
        {/* TODO: render the `form` block with the cta-consultation form (T012/T014: Zod
            validation, form-submissions, Airtable sync, Resend email, form_start/form_submit
            events) only when a human developer decides to. */}
        <p className="empty-state">{callToAction.consultation.body}</p>
      </section>
      <DonateBanner />
    </>
  )
}
