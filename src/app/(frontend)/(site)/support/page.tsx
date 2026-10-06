import type { Metadata } from 'next'
import React from 'react'

import { FaqList } from '@/components/FaqList'

import { DonateBand, DonateButton, PhotoHero, SectionHeading } from '../_components/chrome'
import { IconTiles, icons, SupporterRings } from '../_components/graphics'
import { faqs, support, supportV1 } from '../_content'

export const metadata: Metadata = { title: 'Support | Caribbean Brain Health Summit (v1)' }

export default function V1SupportPage() {
  const supportFaqs = faqs.filter(({ category }) => category === support.faqCategory)

  return (
    <>
      <PhotoHero kicker={support.kicker} heading={support.heading} lead={support.lead}>
        <div className="v1-hero-actions">
          <DonateButton />
        </div>
      </PhotoHero>

      <section className="v1-section v1-reveal" aria-labelledby="v1-enables-heading">
        <SectionHeading id="v1-enables-heading" heading={support.enables.heading} />
        <IconTiles items={support.enables.items} iconNames={supportV1.enablesIcons} />
      </section>

      <DonateBand />

      <section className="v1-section v1-reveal" aria-labelledby="v1-levels-heading">
        <SectionHeading
          id="v1-levels-heading"
          kicker="For organisations"
          heading={support.levels.heading}
          body={support.levels.intro}
        />
        <SupporterRings levels={support.levels.items} />
      </section>

      <section className="v1-band v1-band-blue" aria-labelledby="v1-safeguards-heading">
        <div className="v1-band-inner v1-reveal">
          <SectionHeading id="v1-safeguards-heading" heading={support.safeguards.heading} tone="dark" />
          <ul className="v1-badges">
            {support.safeguards.items.map((item, index) => {
              const Icon = icons[supportV1.safeguardIcons[index]]
              return (
                <li key={item}>
                  <Icon aria-hidden="true" />
                  <p>{item}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="v1-section v1-reveal" aria-labelledby="v1-supporters-heading">
        <SectionHeading id="v1-supporters-heading" heading={support.supporters.heading} />
        <ul className="v1-logo-slots" aria-label="Supporter logos, coming soon">
          {Array.from({ length: 6 }, (_, index) => (
            <li key={index} aria-hidden="true" />
          ))}
        </ul>
        <p className="v1-muted">{support.supporters.empty}</p>
      </section>

      <section className="v1-section v1-reveal" aria-labelledby="v1-support-faqs-heading">
        <SectionHeading id="v1-support-faqs-heading" heading="Questions about supporting" />
        <FaqList groups={supportFaqs} showCategories={false} />
      </section>
    </>
  )
}
