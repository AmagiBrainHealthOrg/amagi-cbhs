import type { Metadata } from 'next'
import { draftMode, headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import type { Media, Page } from '@/payload-types'
import config from '@/payload.config'

import { RefreshRouteOnSave } from '../RefreshRouteOnSave'

export type RouteProps<P> = {
  params: Promise<P>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Drafts only for a signed-in CMS user in draft mode (/api/preview). Reading searchParams or
// headers otherwise would render every page per request and turn off caching.
export const previewUser = async () => {
  if (!(await draftMode()).isEnabled) return null
  const payload = await getPayload({ config })
  return (await payload.auth({ headers: await headers() })).user
}

export const findPage = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const user = await previewUser()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    draft: Boolean(user),
    limit: 1,
    depth: 1,
    overrideAccess: false,
    user,
  })
  return { page: docs[0], draft: Boolean(user) }
})

export const pageMetadata = (page: Page | undefined): Metadata => {
  if (!page) return {}
  const image: Media | undefined =
    page.meta?.image && typeof page.meta.image === 'object' ? page.meta.image : undefined
  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description || undefined,
    // Left unset without an image, so the default opengraph-image applies.
    ...(image?.url && { openGraph: { images: [{ url: image.url, alt: image.alt }] } }),
  }
}

export function PageView({ page, draft }: { page: Page | undefined; draft: boolean }) {
  if (!page) notFound()
  return (
    <>
      {draft && <RefreshRouteOnSave />}
      <RenderBlocks blocks={page.layout} />
    </>
  )
}
