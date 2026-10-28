import { RichText } from '@payloadcms/richtext-lexical/react'
import { ChevronDown } from 'lucide-react'
import React from 'react'

import { Section } from '@/components/Section'

import type { BlockProps } from './types'

export function AccordionBlock({ block, blockId }: BlockProps<'accordion'>) {
  const items = block.items ?? []
  return (
    <Section {...block} blockId={blockId} className="v1-accordion v1-reveal">
      <div className="faq-list faq-list-items">
        {items.map(({ id, title, content }) => (
          <details key={id ?? title} className="faq-item">
            <summary>
              {title}
              <ChevronDown aria-hidden="true" />
            </summary>
            <RichText className="faq-body" data={content} />
          </details>
        ))}
      </div>
    </Section>
  )
}
