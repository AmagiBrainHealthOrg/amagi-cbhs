import { Heart, Menu } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { navItems } from '@/config/placeholderContent'
import config from '@/payload.config'

const withBreaks = (text?: string | null) =>
  text?.split('\n').map((line, index, lines) => (
    <React.Fragment key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </React.Fragment>
  ))

// TODO: read logo, navItems and donateLabel from the Payload `header` global (T006) only when a
// human developer decides to. Until then the brand comes from the Coming Soon global.
type Props = { nav?: { label: string; href: string }[]; homeHref?: string }

export async function SiteHeader({ nav: items = navItems, homeHref = '/' }: Props = {}) {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({ slug: 'coming-soon', depth: 1 })
  const logo = data.logo && typeof data.logo === 'object' ? data.logo : undefined

  const nav = items.map(({ label, href }) => (
    <li key={href}>
      <Link href={href}>{label}</Link>
    </li>
  ))

  return (
    <header className="coming-soon-header site-header">
      {/* TODO: hard-coded; migrate to Payload only when a human developer decides to. */}
      <Link
        className="coming-soon-brand"
        href={homeHref}
        aria-label="Caribbean Brain Health Summit homepage"
      >
        {logo?.url && <img src={logo.url} alt={logo.alt} />}
        {logo?.url && data.brandTitle && <span aria-hidden="true" />}
        {data.brandTitle && <strong>{withBreaks(data.brandTitle)}</strong>}
      </Link>

      <nav className="site-nav" aria-label="Main">
        <ul>{nav}</ul>
      </nav>

      <div className="site-header-actions">
        {/* TODO: push the donate_click data-layer event (T015) only when a human developer decides to. */}
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
        <details className="site-menu">
          <summary aria-label="Menu">
            <Menu aria-hidden="true" />
          </summary>
          <nav aria-label="Main (mobile)">
            <ul>{nav}</ul>
          </nav>
        </details>
      </div>
    </header>
  )
}
