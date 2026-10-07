import React from 'react'

import { CaribbeanMap } from '@/components/graphics/graphics'
import { Section } from '@/components/Section'

import type { BlockProps } from './types'

export function HostMapBlock({ block, blockId }: BlockProps<'hostMap'>) {
  return (
    <Section {...block} blockId={blockId} className="v1-split">
      <CaribbeanMap countries={block.countries ?? []} online={block.onlineLabel} />
    </Section>
  )
}
