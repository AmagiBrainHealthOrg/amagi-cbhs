import type { Metadata } from 'next'
import React from 'react'

import { DonateBand, PhotoHero, SectionHeading } from '../_components/chrome'
import { FlowDiagram, Roadmap, StatsBand } from '../_components/graphics'
import { about, aboutV1, home, roadmap } from '../_content'

export const metadata: Metadata = { title: 'About | Caribbean Brain Health Summit (v1)' }

export default function V1AboutPage() {
  const [why, , , after] = about.sections

  return (
    <>
      <PhotoHero kicker={about.kicker} heading={about.heading} lead={about.lead} />
      <StatsBand stats={about.facts} />

      <section className="v1-section v1-split v1-reveal" aria-labelledby="v1-why-heading">
        <SectionHeading id="v1-why-heading" kicker={about.kicker} heading={why.heading} />
        <p className="v1-lead-text">{why.body}</p>
      </section>

      <section className="v1-band v1-band-pale" aria-labelledby="v1-flow-heading">
        <div className="v1-band-inner v1-reveal">
          <SectionHeading
            id="v1-flow-heading"
            kicker={aboutV1.flow.kicker}
            heading={aboutV1.flow.heading}
          />
          <FlowDiagram steps={aboutV1.flow.steps} />
        </div>
      </section>

      <section className="v1-section v1-reveal" aria-labelledby="v1-roadmap-heading">
        <SectionHeading
          id="v1-roadmap-heading"
          kicker={home.roadmap.kicker}
          heading={home.roadmap.heading}
          body={after.body}
        />
        <Roadmap steps={roadmap} />
      </section>

      <DonateBand />
    </>
  )
}
