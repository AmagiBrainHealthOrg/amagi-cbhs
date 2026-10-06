import type { Metadata } from 'next'
import React from 'react'

import { DonateBanner } from '@/components/DonateBanner'
import { PageHero } from '@/components/PageHero'
import { about } from '@/config/placeholderContent'

export const metadata: Metadata = { title: 'About | Caribbean Brain Health Summit' }

export default function AboutPage() {
  return (
    <>
      <PageHero kicker={about.kicker} heading={about.heading} lead={about.lead} />
      <section className="page-section">
        <ul className="fact-row" aria-label="Summit at a glance">
          {about.facts.map(({ value, label }) => (
            <li key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </li>
          ))}
        </ul>
        <div className="prose-grid">
          {about.sections.map(({ heading, body }) => (
            <article key={heading}>
              <h2>{heading}</h2>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <DonateBanner />
    </>
  )
}
