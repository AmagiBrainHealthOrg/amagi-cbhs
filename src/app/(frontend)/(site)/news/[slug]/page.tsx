import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { DonateBanner } from '@/components/DonateBanner'
import { news } from '@/config/placeholderContent'
import { formatDate } from '@/utils/formatDate'

type Props = { params: Promise<{ slug: string }> }

// TODO: look the item up in the Payload `news` collection by slug, with drafts and live preview
// (T011), only when a human developer decides to.
const findItem = async (params: Props['params']) => {
  const { slug } = await params
  return news.items.find((item) => item.slug === slug)
}

export const generateStaticParams = () => news.items.map(({ slug }) => ({ slug }))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await findItem(params)
  return { title: item ? `${item.title} | Caribbean Brain Health Summit` : undefined }
}

export default async function NewsItemPage({ params }: Props) {
  const item = await findItem(params)
  if (!item) notFound()

  return (
    <>
      <article className="page-section news-article">
        <Link className="back-link" href="/news">
          <ArrowLeft aria-hidden="true" /> All news
        </Link>
        <p className="news-meta">
          {item.type} · <time dateTime={item.date}>{formatDate(item.date)}</time>
        </p>
        <h1>{item.title}</h1>
        <p className="page-hero-lead">{item.summary}</p>
        {/* TODO: render the Lexical rich-text `body` from Payload only when a human developer decides to. */}
        {item.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
      <DonateBanner />
    </>
  )
}
