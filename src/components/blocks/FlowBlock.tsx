import React from 'react'

import { FlowDiagram } from '@/components/graphics/graphics'
import { Section } from '@/components/Section'

import type { BlockProps } from './types'

export function FlowBlock({ block, blockId }: BlockProps<'flow'>) {
  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      <FlowDiagram steps={block.steps ?? []} />
      {block.outro && <p className="v1-section-outro">{block.outro}</p>}
    </Section>
  )
}
