import React from 'react'

import { CaribbeanMap } from '@/components/graphics/graphics'
import { Section } from '@/components/Section'
import { hostMap } from '@/config/hostMap'

import type { BlockProps } from './types'

export function HostMapBlock({ block, blockId }: BlockProps<'hostMap'>) {
  return (
    <Section {...block} blockId={blockId} className="v1-split">
      <CaribbeanMap countries={hostMap.countries} online={hostMap.onlineLabel} />
    </Section>
  )
}
