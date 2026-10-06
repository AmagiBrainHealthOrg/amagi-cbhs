import React from 'react'

type Props = { kicker?: string; heading: string; lead?: string }

// TODO: becomes the `hero` block rendered from Payload `pages` (T009) only when a human developer
// decides to.
export function PageHero({ kicker, heading, lead }: Props) {
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        {kicker && <p className="page-kicker">{kicker}</p>}
        <h1>{heading}</h1>
        {lead && <p className="page-hero-lead">{lead}</p>}
      </div>
    </section>
  )
}
