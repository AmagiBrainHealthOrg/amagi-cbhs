import React from 'react'

import { Button } from '@/components/Button'
import { Badges, IconTiles } from '@/components/graphics/graphics'
import { Section } from '@/components/Section'

import type { BlockProps } from './types'

export function CardGridBlock({ block, blockId }: BlockProps<'cardGrid'>) {
  const items = block.items ?? []
  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      {items.length > 0 &&
        (block.style === 'badges' ? <Badges items={items} /> : <IconTiles items={items} />)}
      {block.links && block.links.length > 0 && (
        <div className="v1-section-actions">
          {block.links.map(({ id, label, href }) => (
            <Button
              key={id ?? href}
              href={href}
              variant="secondary"
              tone={block.background === 'blue' ? 'dark' : 'light'}
              journey="awareness"
              action="section_button"
            >
              {label}
            </Button>
          ))}
        </div>
      )}
    </Section>
  )
}
