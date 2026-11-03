import React from 'react'

import { WeekStrip } from '@/components/graphics/graphics'
import { Section } from '@/components/Section'
import { getGlobal } from '@/lib/globals'
import { weekStrip } from '@/utils/weekStrip'

import type { BlockProps } from './types'

export async function SummitWeekBlock({ block, blockId }: BlockProps<'summitWeek'>) {
  const [week, anchorDay] = await Promise.all([getGlobal('summit-week'), getGlobal('anchor-day')])
  const days = weekStrip(week.days, anchorDay.date)
  if (days.length === 0) return null
  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      <WeekStrip days={days} month="Nov" />
    </Section>
  )
}
