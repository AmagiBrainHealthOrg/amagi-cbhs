import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { DonateBanner } from '@/components/DonateBanner'
import { PageHero } from '@/components/PageHero'
import { news } from '@/config/placeholderContent'
import { formatDate } from '@/utils/formatDate'

export const metadata: Metadata = { title: 'News | Caribbean Brain Health Summit' }

export default function NewsPage() {
  // TODO: query the Payload `news` collection, newest first (T011); approved `substack-posts`
  // join in Release 2 (T028). Only when a human developer decides to.
  const items = [...news.items].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <PageHero kicker={news.kicker} heading={news.heading} />
      <section className="page-section">
        <ul className="news-list">
          {items.map(({ slug, title, date, type, summary }) => (
            <li key={slug} className="card news-card">
              <p className="news-meta">
                {type} · <time dateTime={date}>{formatDate(date)}</time>
              </p>
              <h2>
                <Link href={`/news/${slug}`}>{title}</Link>
              </h2>
              <p>{summary}</p>
              <span className="news-more" aria-hidden="true">
                Read more <ArrowRight />
              </span>
            </li>
          ))}
        </ul>
      </section>
      <DonateBanner />
    </>
  )
}
