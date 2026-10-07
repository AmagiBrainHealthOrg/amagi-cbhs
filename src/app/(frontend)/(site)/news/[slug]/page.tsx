import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import { DonateBanner } from '@/components/DonateBanner'
import { newsTypeLabel } from '@/config/news'
import config from '@/payload.config'
import { formatDate } from '@/utils/formatDate'

import { RefreshRouteOnSave } from '../../../RefreshRouteOnSave'
import type { RouteProps } from '../../_page'

type Props = RouteProps<{ slug: string }>

const findItem = cache(async (slug: string, wantsPreview: boolean) => {
  const payload = await getPayload({ config })
  const user = wantsPreview ? (await payload.auth({ headers: await headers() })).user : null
  const { docs } = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    draft: Boolean(user),
    limit: 1,
    depth: 1,
    overrideAccess: false,
    user,
  })
  return { item: docs[0], draft: Boolean(user) }
})

const resolve = async ({ params, searchParams }: Props) => {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  return findItem(slug, query.preview === 'true')
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { item } = await resolve(props)
  if (!item) return {}
  const image = item.image && typeof item.image === 'object' ? item.image : undefined
  return {
    title: `${item.title} | Caribbean Brain Health Summit`,
    description: item.summary,
    openGraph: image?.url ? { images: [{ url: image.url, alt: image.alt }] } : undefined,
  }
}

export default async function NewsItemPage(props: Props) {
  const { item, draft } = await resolve(props)
  if (!item) notFound()

  return (
    <>
      {draft && <RefreshRouteOnSave />}
      <article className="page-section news-article">
        <Link className="back-link" href="/news">
          <ArrowLeft aria-hidden="true" /> All news
        </Link>
        <p className="news-meta">
          {newsTypeLabel(item.type)} ·{' '}
          <time dateTime={item.publishedDate}>{formatDate(item.publishedDate)}</time>
        </p>
        <h1>{item.title}</h1>
        <p className="page-hero-lead">{item.summary}</p>
        {item.body && <RichText data={item.body} disableContainer />}
      </article>
      <DonateBanner />
    </>
  )
}
