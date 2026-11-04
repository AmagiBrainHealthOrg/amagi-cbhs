import Link from 'next/link'
import React from 'react'

const LINKABLE = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+|\bpartner form\b)/gi

// Descriptions are plain text; their email addresses and "partner form" become links.
export function SessionDescription({ text }: { text: string }) {
  return text.split(LINKABLE).map((part, index) => {
    if (index % 2 === 0) return part
    return part.includes('@') ? (
      <a key={index} href={`mailto:${part}`}>
        {part}
      </a>
    ) : (
      <Link key={index} href="/partner#partner-form">
        {part}
      </Link>
    )
  })
}
