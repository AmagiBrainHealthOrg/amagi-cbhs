import Link from 'next/link'
import React from 'react'

import { getGlobal } from '@/lib/globals'
import { withBreaks } from '@/utils/withBreaks'

import { DonateButton } from './DonateButton'
import { MobileMenu } from './MobileMenu'

export async function Header() {
  const { logo: logoValue, brandTitle, navItems } = await getGlobal('header')
  const logo = logoValue && typeof logoValue === 'object' && logoValue.url ? logoValue : undefined

  const nav = (navItems ?? []).map(({ id, label, href }) => (
    <li key={id ?? href}>
      <Link href={href}>{label}</Link>
    </li>
  ))

  return (
    <header className="site-header">
      {(logo || brandTitle) && (
        <Link className="site-brand" href="/">
          {/* With a brand title the logo is decorative; without one, its alt names the link. */}
          {logo && <img src={logo.url!} alt={brandTitle ? '' : logo.alt} />}
          {logo && brandTitle && <span aria-hidden="true" />}
          {brandTitle && <strong>{withBreaks(brandTitle)}</strong>}
        </Link>
      )}

      {nav.length > 0 && (
        <nav className="site-nav" aria-label="Main">
          <ul>{nav}</ul>
        </nav>
      )}

      <div className="site-header-actions">
        <DonateButton className="site-header-donate" />
        {nav.length > 0 && <MobileMenu>{nav}</MobileMenu>}
      </div>
    </header>
  )
}
