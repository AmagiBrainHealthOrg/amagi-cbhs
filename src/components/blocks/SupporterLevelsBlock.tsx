import React from 'react'

import { SupporterRings } from '@/components/graphics/graphics'
import { Section } from '@/components/Section'

import type { BlockProps } from './types'

export function SupporterLevelsBlock({ block, blockId }: BlockProps<'supporterLevels'>) {
  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      <SupporterRings levels={block.levels ?? []} />
    </Section>
  )
}
