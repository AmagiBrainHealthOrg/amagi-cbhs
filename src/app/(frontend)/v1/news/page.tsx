import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { formatDate } from '@/utils/formatDate'

import { DonateBand, PhotoHero } from '../_components/chrome'
import { news } from '../_content'

export const metadata: Metadata = { title: 'News | Caribbean Brain Health Summit (v1)' }

export default function V1NewsPage() {
  const items = [...news.items].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <PhotoHero kicker={news.kicker} heading={news.heading} />
      <section className="v1-section">
        <ul className="v1-news">
          {items.map(({ slug, title, date, type, summary }) => (
            <li key={slug}>
              <p className="v1-news-date">
                {type} · <time dateTime={date}>{formatDate(date)}</time>
              </p>
              <h2>
                <Link href={`/news/${slug}`}>{title}</Link>
              </h2>
              <p>{summary}</p>
            </li>
          ))}
        </ul>
      </section>
      <DonateBand />
    </>
  )
}
