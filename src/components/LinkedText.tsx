import Link from 'next/link'
import React from 'react'

import { parseLinks } from '@/utils/paragraphs'

// Plain CMS text with `[text](/path)` links.
export function LinkedText({ text }: { text: string }) {
  return parseLinks(text).map((part, index) =>
    typeof part === 'string' ? (
      part
    ) : (
      <Link key={index} href={part.href}>
        {part.label}
      </Link>
    ),
  )
}
