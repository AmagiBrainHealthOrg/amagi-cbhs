import React from 'react'

import { Comparison, Funnel, ScaleStrip, Venn } from '@/components/graphics/diagrams'
import { LinkedText } from '@/components/LinkedText'
import { Section } from '@/components/Section'
import { splitParagraphs } from '@/utils/paragraphs'

import type { BlockProps } from './types'

function Body({ text }: { text?: string | null }) {
  const paragraphs = splitParagraphs(text)
  if (paragraphs.length === 0) return null
  return (
    <div className="v1-diagram-body">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>
          <LinkedText text={paragraph} />
        </p>
      ))}
    </div>
  )
}

// The graphic beside its text, or alone when there is none.
function Beside({ graphic, text }: { graphic: React.ReactNode; text?: string | null }) {
  return (
    <div className={text ? 'v1-diagram v1-diagram-beside' : 'v1-diagram'}>
      {graphic}
      <Body text={text} />
    </div>
  )
}

export function ScaleStripBlock({ block, blockId }: BlockProps<'scaleStrip'>) {
  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      <ScaleStrip steps={block.steps ?? []} highlightLabel={block.highlightLabel} />
      <Body text={block.body} />
    </Section>
  )
}

export function VennBlock({ block, blockId }: BlockProps<'venn'>) {
  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      <Beside
        graphic={
          <Venn circles={(block.circles ?? []).map(({ label }) => label)} centre={block.centre} />
        }
        text={block.body}
      />
    </Section>
  )
}

export function FunnelBlock({ block, blockId }: BlockProps<'funnel'>) {
  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      <Funnel steps={block.steps ?? []} end={block.end} />
      <Body text={block.body} />
    </Section>
  )
}

export function ComparisonBlock({ block, blockId }: BlockProps<'comparison'>) {
  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      <Comparison is={block.is} isNot={block.isNot} />
      <Body text={block.body} />
    </Section>
  )
}
