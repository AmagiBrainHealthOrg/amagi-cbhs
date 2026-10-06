import { Heart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { donateBanner } from '@/config/placeholderContent'

// TODO: becomes the `donateBanner` block rendered from Payload `pages` (T009) only when a human
// developer decides to.
export function DonateBanner() {
  return (
    <section className="donate-banner" aria-labelledby="donate-banner-title">
      <div>
        <h2 id="donate-banner-title">{donateBanner.heading}</h2>
        <p>{donateBanner.body}</p>
      </div>
      {/* TODO: push the donate_click data-layer event (T015) only when a human developer decides to. */}
      <Link
        className="button button-orange donate-banner-button"
        href="/donate"
        data-journey="donate"
        data-action="donate_click"
        data-destination-type="internal"
      >
        <Heart aria-hidden="true" /> {donateBanner.label}
      </Link>
    </section>
  )
}
