import React from 'react'

import { Button } from '@/components/Button'
import { ActionWheel } from '@/components/graphics/graphics'
import { Section } from '@/components/Section'

import type { BlockProps } from './types'

export function ActionAreasBlock({ block, blockId }: BlockProps<'actionAreas'>) {
  const { areas, centreLabel, link } = block
  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      <ActionWheel areas={areas ?? []} centre={centreLabel} />
      {link?.label && link.href && (
        <Button href={link.href} variant="tertiary" journey="awareness" action="read_more">
          {link.label}
        </Button>
      )}
    </Section>
  )
}
