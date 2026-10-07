import Link from 'next/link'
import React from 'react'

type Crumb = { label: string; href?: string }

// The last crumb is the current page and is not a link.
export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <nav className="breadcrumbs" aria-label={label}>
      <ol>
        {items.map(({ label: text, href }, index) => {
          const current = index === items.length - 1
          return (
            <li key={index}>
              {href && !current ? (
                <Link href={href}>{text}</Link>
              ) : (
                <span aria-current={current ? 'page' : undefined}>{text}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
