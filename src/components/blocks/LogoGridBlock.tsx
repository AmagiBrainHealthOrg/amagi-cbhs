import { getPayload } from 'payload'
import React from 'react'

import { LogoGrid } from '@/components/LogoGrid'
import { Section } from '@/components/Section'
import config from '@/payload.config'

import type { BlockProps } from './types'

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
  const logos = docs.map(({ id, name, logo, ...rest }) => ({
    id,
    name,
    logo,
    website: 'website' in rest ? rest.website : undefined,
  }))

  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      <LogoGrid logos={logos} emptyText={block.emptyText} />
    </Section>
  )
}
