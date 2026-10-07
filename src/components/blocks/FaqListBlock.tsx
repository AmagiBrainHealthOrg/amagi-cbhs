import { getPayload } from 'payload'
import React from 'react'

import { type FaqGroup, FaqList } from '@/components/FaqList'
import { Section } from '@/components/Section'
import config from '@/payload.config'

import type { BlockProps } from './types'

export async function FaqListBlock({ block, blockId }: BlockProps<'faqList'>) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'faqs',
    where: block.category ? { category: { equals: block.category } } : undefined,
    sort: ['order', 'createdAt'],
    pagination: false,
    overrideAccess: false,
  })

  // Categories appear in the order of their first FAQ.
  const groups = new Map<string, FaqGroup>()
  for (const { id, category, question, answer } of docs) {
    const group = groups.get(category) ?? { category, items: [] }
    group.items.push({ id, question, answer })
    groups.set(category, group)
  }

  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      <FaqList groups={[...groups.values()]} showCategories={block.showCategories ?? true} />
    </Section>
  )
}
