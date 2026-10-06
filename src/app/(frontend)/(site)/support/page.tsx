import { Check, ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { DonateBanner } from '@/components/DonateBanner'
import { FaqList } from '@/components/FaqList'
import { PageHero } from '@/components/PageHero'
import { faqs, support } from '@/config/placeholderContent'

export const metadata: Metadata = { title: 'Support | Caribbean Brain Health Summit' }

export default function SupportPage() {
  const supportFaqs = faqs.filter(({ category }) => category === support.faqCategory)

  return (
    <>
      <PageHero kicker={support.kicker} heading={support.heading} lead={support.lead} />

      <section className="page-section" aria-labelledby="enables-title">
        <h2 id="enables-title">{support.enables.heading}</h2>
        <ul className="card-grid">
          {support.enables.items.map(({ title, body }) => (
            <li key={title} className="card">
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <DonateBanner />

      <section className="page-section" aria-labelledby="levels-title">
        <h2 id="levels-title">{support.levels.heading}</h2>
        <p className="section-intro">{support.levels.intro}</p>
        <ul className="card-grid card-grid-3">
          {support.levels.items.map(({ name, amount, perks }) => (
            <li key={name} className="card level-card">
              <h3>{name}</h3>
              <p className="level-amount">{amount}</p>
              <ul className="tick-list">
                {perks.map((perk) => (
                  <li key={perk}>
                    <Check aria-hidden="true" />
                    {perk}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="section-intro">
          {/* TODO: link to the Partner form (Release 2, T019) only when a human developer decides to. */}
          Want to talk about supporting the Summit? <Link href="/faqs">Read the FAQs</Link> or get
          in touch.
        </p>
      </section>

      <section className="page-section page-section-tint" aria-labelledby="safeguards-title">
        <h2 id="safeguards-title">{support.safeguards.heading}</h2>
        <ul className="tick-list">
          {support.safeguards.items.map((item) => (
            <li key={item}>
              <ShieldCheck aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="page-section" aria-labelledby="supporters-title">
        <h2 id="supporters-title">{support.supporters.heading}</h2>
        {/* TODO: render the `logoGrid` block from the Payload `supporters` collection, only
            entries with permissionConfirmed, only when a human developer decides to. */}
        <p className="empty-state">{support.supporters.empty}</p>
      </section>

      <section className="page-section" aria-labelledby="support-faqs-title">
        <h2 id="support-faqs-title">Questions about supporting</h2>
        <FaqList groups={supportFaqs} showCategories={false} />
      </section>
    </>
  )
}
