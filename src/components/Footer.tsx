import Link from 'next/link'
import React from 'react'

import { getCookieBanner } from '@/lib/cookieBanner'
import { getGlobal } from '@/lib/globals'

import { CookieSettingsButton } from './CookieBanner'

export async function Footer() {
  const [{ links, tagline, legalText }, cookieBanner] = await Promise.all([
    getGlobal('footer'),
    getCookieBanner(),
  ])
  const settingsLabel = cookieBanner?.settingsLabel

  return (
    <footer className="site-footer">
      {(links?.length || settingsLabel) && (
        <nav aria-label="Footer">
          <ul>
            {(links ?? []).map(({ id, label, href }) => (
              <li key={id ?? href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
            {settingsLabel && (
              <li>
                <CookieSettingsButton label={settingsLabel} />
              </li>
            )}
          </ul>
        </nav>
      )}
      {tagline && <p className="site-footer-tagline">{tagline}</p>}
      {legalText && <p className="site-footer-legal">{legalText}</p>}
    </footer>
  )
}
