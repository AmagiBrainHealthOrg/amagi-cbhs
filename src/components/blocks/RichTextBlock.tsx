import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { Section } from '@/components/Section'

import type { BlockProps } from './types'

export function RichTextBlock({ block, blockId }: BlockProps<'richText'>) {
  const { content, layout, kicker, heading, intro, anchorId } = block

  // Prose is the long-form legal layout: a plain reading column, no section styling.
  if (layout === 'prose') {
    return (
      <section className="page-section legal-body" id={anchorId || undefined}>
        {heading && <h2>{heading}</h2>}
        {intro && <p>{intro}</p>}
        <RichText data={content} disableContainer />
      </section>
    )
  }

  // With nothing to sit beside, the text takes the page column's left edge.
  if (!kicker && !heading && !intro) {
    return (
      <Section {...block} blockId={blockId} className="v1-reveal">
        <RichText className="v1-text-column" data={content} />
      </Section>
    )
  }

  return (
    <Section {...block} blockId={blockId} className="v1-split v1-reveal">
      <RichText className="v1-lead-text" data={content} />
    </Section>
  )
}
