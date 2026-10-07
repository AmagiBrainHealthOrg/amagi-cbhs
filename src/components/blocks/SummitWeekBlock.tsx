import React from 'react'

import { WeekStrip } from '@/components/graphics/graphics'
import { Section } from '@/components/Section'

import type { BlockProps } from './types'

export function SummitWeekBlock({ block, blockId }: BlockProps<'summitWeek'>) {
  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      <WeekStrip days={block.days ?? []} month={block.monthLabel} />
    </Section>
  )
}
