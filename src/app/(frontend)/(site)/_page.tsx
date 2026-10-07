import type { Metadata } from 'next'
import { headers } from 'next/headers'
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

// Drafts only for a logged-in CMS user who asks for them (SPEC §5, Payload rules).
export const previewUser = async (searchParams: RouteProps<unknown>['searchParams']) => {
  const { preview } = await searchParams
  if (preview !== 'true') return null
  const payload = await getPayload({ config })
  return (await payload.auth({ headers: await headers() })).user
}

const findPage = cache(async (slug: string, draft: boolean) => {
  const payload = await getPayload({ config })
  const user = draft ? (await payload.auth({ headers: await headers() })).user : null
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

export const resolvePage = async (
  slug: string,
  searchParams: RouteProps<unknown>['searchParams'],
) => findPage(slug, (await searchParams).preview === 'true')

export const pageMetadata = (page: Page | undefined): Metadata => {
  if (!page) return {}
  const image: Media | undefined =
    page.meta?.image && typeof page.meta.image === 'object' ? page.meta.image : undefined
  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description || undefined,
    openGraph: image?.url ? { images: [{ url: image.url, alt: image.alt }] } : undefined,
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
