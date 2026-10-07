import Link from 'next/link'
import React from 'react'

import { getGlobal } from '@/lib/globals'

export async function Footer() {
  const [{ links, tagline, legalText }, { settingsLabel }] = await Promise.all([
    getGlobal('footer'),
    getGlobal('cookie-consent'),
  ])

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
                {/* T030 makes this reopen the cookie banner (SPEC §10.5). */}
                <Link href="/cookies">{settingsLabel}</Link>
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
