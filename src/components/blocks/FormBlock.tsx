import React from 'react'

import { Section } from '@/components/Section'

import type { BlockProps } from './types'

// Placeholder until the shared form system lands (T012); the intro sits in the form's slot.
export function FormBlock({ block, blockId }: BlockProps<'form'>) {
  return (
    <Section {...block} blockId={blockId} className="v1-reveal" showIntro={false}>
      <p className="v1-form-slot" data-form={block.form}>
        {block.intro}
      </p>
    </Section>
  )
}
