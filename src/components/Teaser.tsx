import Link from 'next/link'
import React from 'react'

import { formatDate } from '@/utils/formatDate'

type Props = {
  href: string
  title: string
  date: string
  summary?: string | null
  /** Shown before the date, e.g. the news type. */
  label?: string | null
  headingLevel?: 'h2' | 'h3'
}

// Lives inside a `.v1-news` list.
export function Teaser({ href, title, date, summary, label, headingLevel: Heading = 'h3' }: Props) {
  return (
    <li>
      <p className="v1-news-date">
        {label && <>{label} · </>}
        <time dateTime={date}>{formatDate(date)}</time>
      </p>
      <Heading>
        <Link href={href}>{title}</Link>
      </Heading>
      {summary && <p>{summary}</p>}
    </li>
  )
}
