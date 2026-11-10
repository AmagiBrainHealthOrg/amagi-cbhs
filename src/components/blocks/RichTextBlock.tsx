import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { Button } from '@/components/Button'
import { Section } from '@/components/Section'

import type { BlockProps } from './types'

export function RichTextBlock({ block, blockId }: BlockProps<'richText'>) {
  const { content, layout, kicker, heading, intro, anchorId, background, links } = block
  const tone = background === 'blue' ? 'dark' : 'light'
  // The first button is solid, the second a text link.
  const actions = links && links.length > 0 && (
    <div className="v1-section-actions">
      {links.map(({ id, label, href }, index) => (
        <Button
          key={id ?? href}
          href={href}
          variant={index === 0 ? 'solid' : 'tertiary'}
          tone={tone}
          journey="awareness"
          action="section_button"
          className={index === 0 ? 'v1-section-button' : undefined}
        >
          {label}
        </Button>
      ))}
    </div>
  )

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

  // A large opening paragraph in the page column, such as the one under a hero.
  if (layout === 'lead') {
    return (
      <Section {...block} blockId={blockId} className="v1-reveal">
        <RichText className="v1-lead-text v1-text-column" data={content} />
        {actions}
      </Section>
    )
  }

  // With nothing to sit beside, the text takes the page column's left edge.
  if (!kicker && !heading && !intro) {
    return (
      <Section {...block} blockId={blockId} className="v1-reveal">
        <RichText className="v1-text-column" data={content} />
        {actions}
      </Section>
    )
  }

  return (
    <Section {...block} blockId={blockId} className="v1-split v1-reveal">
      <div>
        <RichText className="v1-lead-text" data={content} />
        {actions}
      </div>
    </Section>
  )
}
