import { getPayload } from 'payload'
import React from 'react'

import { type Logo, LogoGrid } from '@/components/LogoGrid'
import { Section } from '@/components/Section'
import config from '@/payload.config'

import type { BlockProps } from './types'

// Each partner's entry links to its newest published announcement (SPEC §4.4).
async function latestAnnouncements(partnerIds: number[]) {
  const byPartner = new Map<number, { href: string; title: string }>()
  if (partnerIds.length === 0) return byPartner

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'news',
    where: {
      and: [{ type: { equals: 'partner-announcement' } }, { partner: { in: partnerIds } }],
    },
    sort: '-publishedDate',
    depth: 0,
    pagination: false,
    overrideAccess: false,
  })
  for (const { partner, slug, title } of docs) {
    const partnerId = typeof partner === 'object' ? partner?.id : partner
    if (partnerId && !byPartner.has(partnerId))
      byPartner.set(partnerId, { href: `/news/${slug}`, title })
  }
  return byPartner
}

// The where clause repeats the read access rule so editors previewing a page still see only
// names that may be shown publicly.
export async function LogoGridBlock({ block, blockId }: BlockProps<'logoGrid'>) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: block.source,
    where: {
      and: [{ _status: { equals: 'published' } }, { permissionConfirmed: { equals: true } }],
    },
    sort: 'name',
    depth: 1,
    pagination: false,
    overrideAccess: false,
  })
  const announcements =
    block.source === 'partners' ? await latestAnnouncements(docs.map(({ id }) => id)) : new Map()
  const logos: Logo[] = docs.map(({ id, name, logo, ...rest }) => ({
    id,
    name,
    logo,
    website: 'website' in rest ? rest.website : undefined,
    announcement: announcements.get(id),
  }))

  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      <LogoGrid logos={logos} emptyText={block.emptyText} />
    </Section>
  )
}
