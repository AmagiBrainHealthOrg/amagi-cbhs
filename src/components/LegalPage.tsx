import React from 'react'

import { PlainHero } from '@/components/Hero'

type Props = { title: string; intro: string; sections: { heading: string; body: string }[] }

// TODO: render the legal page from the Payload `pages` collection, with Amagi's final wording,
// only when a human developer decides to.
export function LegalPage({ title, intro, sections }: Props) {
  return (
    <>
      <PlainHero heading={title} lead={intro} />
      <section className="page-section legal-body">
        {sections.map(({ heading, body }) => (
          <React.Fragment key={heading}>
            <h2>{heading}</h2>
            <p>{body}</p>
          </React.Fragment>
        ))}
      </section>
    </>
  )
}
