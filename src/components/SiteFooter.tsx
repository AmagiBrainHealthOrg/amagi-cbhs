import Link from 'next/link'
import React from 'react'

import { footer } from '@/config/placeholderContent'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav aria-label="Footer">
        <ul>
          {footer.links.map(({ label, href }) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
          <li>
            {/* TODO: reopen the cookie consent banner (T030) instead of linking to /cookies, only
                when a human developer decides to. */}
            <Link href="/cookies">{footer.cookieSettingsLabel}</Link>
          </li>
        </ul>
      </nav>
      <p className="site-footer-tagline">{footer.tagline}</p>
      <p className="site-footer-legal">{footer.legalText}</p>
    </footer>
  )
}
