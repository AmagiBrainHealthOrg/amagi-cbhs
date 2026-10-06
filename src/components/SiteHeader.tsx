import { Heart } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

const withBreaks = (text?: string | null) =>
  text?.split('\n').map((line, index, lines) => (
    <React.Fragment key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </React.Fragment>
  ))

// Until T006 adds the `header` global, the brand comes from the Coming Soon global.
export async function SiteHeader() {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({ slug: 'coming-soon', depth: 1 })
  const logo = data.logo && typeof data.logo === 'object' ? data.logo : undefined

  return (
    <header className="coming-soon-header site-header">
      {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
      <Link
        className="coming-soon-brand"
        href="/"
        aria-label="Caribbean Brain Health Summit homepage"
      >
        {logo?.url && <img src={logo.url} alt={logo.alt} />}
        {logo?.url && data.brandTitle && <span aria-hidden="true" />}
        {data.brandTitle && <strong>{withBreaks(data.brandTitle)}</strong>}
      </Link>
      <Link
        className="button button-orange site-header-donate"
        href="/donate"
        data-journey="donate"
        data-action="donate_click"
        data-destination-type="internal"
      >
        {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
        <Heart aria-hidden="true" /> Donate
      </Link>
    </header>
  )
}
