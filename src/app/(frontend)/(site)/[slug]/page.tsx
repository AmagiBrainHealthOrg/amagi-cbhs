import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import config from '@/payload.config'

import { RefreshRouteOnSave } from '../../RefreshRouteOnSave'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Drafts only for a logged-in CMS user who asks for them (SPEC §5, Payload rules).
const findPage = cache(async (slug: string, wantsPreview: boolean) => {
  // The home page lives at `/`, never at `/home`.
  if (slug === 'home') return { page: undefined, draft: false }

  const payload = await getPayload({ config })
  const user = wantsPreview ? (await payload.auth({ headers: await headers() })).user : null
  const draft = Boolean(user)

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    draft,
    limit: 1,
    depth: 1,
    overrideAccess: false,
    user,
  })
  return { page: docs[0], draft }
})

const resolve = async ({ params, searchParams }: Props) => {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  return findPage(slug, query.preview === 'true')
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { page } = await resolve(props)
  if (!page) return {}

  const image =
    page.meta?.image && typeof page.meta.image === 'object' ? page.meta.image : undefined
  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description || undefined,
    openGraph: image?.url ? { images: [{ url: image.url, alt: image.alt }] } : undefined,
  }
}

export default async function Page(props: Props) {
  const { page, draft } = await resolve(props)
  if (!page) notFound()

  return (
    <>
      {draft && <RefreshRouteOnSave />}
      <RenderBlocks blocks={page.layout} />
    </>
  )
}
