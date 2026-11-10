import React from 'react'

import { Button } from '@/components/Button'
import { Badges, IconTiles, NumberedCards } from '@/components/graphics/graphics'
import { Section } from '@/components/Section'

import type { BlockProps } from './types'

export function CardGridBlock({ block, blockId }: BlockProps<'cardGrid'>) {
  const items = block.items ?? []
  const withIcons = items.flatMap(({ icon, ...item }) => (icon ? [{ ...item, icon }] : []))
  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      {block.style === 'numbered' && items.length > 0 && <NumberedCards items={items} />}
      {block.style === 'badges' && withIcons.length > 0 && <Badges items={withIcons} />}
      {block.style === 'tiles' && withIcons.length > 0 && <IconTiles items={withIcons} />}
      {block.outro && <p className="v1-section-outro">{block.outro}</p>}
      {block.links && block.links.length > 0 && (
        <div className="v1-section-actions">
          {block.links.map(({ id, label, href }) => (
            <Button
              key={id ?? href}
              href={href}
              variant="solid"
              tone={block.background === 'blue' ? 'dark' : 'light'}
              journey="awareness"
              action="section_button"
              className="v1-section-button"
            >
              {label}
            </Button>
          ))}
        </div>
      )}
    </Section>
  )
}
