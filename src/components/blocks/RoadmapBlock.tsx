import React from 'react'

import { Roadmap } from '@/components/graphics/graphics'
import { Section } from '@/components/Section'

import type { BlockProps } from './types'

export function RoadmapBlock({ block, blockId }: BlockProps<'roadmap'>) {
  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      <Roadmap
        steps={block.steps ?? []}
        numbered={Boolean(block.numbered)}
        statusLabels={block.statusLabels}
      />
    </Section>
  )
}
