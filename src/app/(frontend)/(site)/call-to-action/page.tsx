import type { Metadata } from 'next'
import React from 'react'

import { DonateBand, PhotoHero, SectionHeading } from '../_components/chrome'
import { ActionWheel, Roadmap } from '@/components/graphics/graphics'
import { actionAreaIcons, callToAction, callToActionV1 } from '../_content'

export const metadata: Metadata = { title: 'Call to Action | Caribbean Brain Health Summit (v1)' }

export default function V1CallToActionPage() {
  const { process } = callToActionV1

  return (
    <>
      <PhotoHero
        kicker={callToAction.kicker}
        heading={callToAction.heading}
        lead={callToAction.lead}
      />

      <section className="v1-section v1-reveal" aria-labelledby="v1-areas-heading">
        <SectionHeading
          id="v1-areas-heading"
          kicker="The framework"
          heading="Five action areas"
          body={callToAction.intro}
        />
        <ActionWheel
          areas={callToAction.areas.map((area, index) => ({
            ...area,
            icon: actionAreaIcons[index],
          }))}
          centre={callToActionV1.wheelCentre}
        />
      </section>

      <section className="v1-band v1-band-pale" aria-labelledby="v1-process-heading">
        <div className="v1-band-inner v1-reveal">
          <SectionHeading
            id="v1-process-heading"
            kicker={process.kicker}
            heading={process.heading}
          />
          <Roadmap steps={process.steps} numbered />
        </div>
      </section>

      <section className="v1-section v1-reveal" aria-labelledby="v1-consultation-heading">
        <SectionHeading id="v1-consultation-heading" heading={callToAction.consultation.heading} />
        <p className="v1-form-slot">{callToAction.consultation.body}</p>
      </section>

      <DonateBand />
    </>
  )
}
