import React from 'react'

import { Badges, IconTiles } from '@/components/graphics/graphics'
import { Section } from '@/components/Section'

import type { BlockProps } from './types'

export function CardGridBlock({ block, blockId }: BlockProps<'cardGrid'>) {
  const items = block.items ?? []
  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      {block.style === 'badges' ? <Badges items={items} /> : <IconTiles items={items} />}
    </Section>
  )
}
