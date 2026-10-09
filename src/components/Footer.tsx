import Link from 'next/link'
import React from 'react'

import { getGlobal } from '@/lib/globals'

export async function Footer() {
  const { links, tagline, legalText } = await getGlobal('footer')

  return (
    <footer className="site-footer">
      {links?.length ? (
        <nav aria-label="Footer">
          <ul>
            {links.map(({ id, label, href }) => (
              <li key={id ?? href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      {tagline && <p className="site-footer-tagline">{tagline}</p>}
      {legalText && <p className="site-footer-legal">{legalText}</p>}
    </footer>
  )
}
