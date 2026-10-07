import React from 'react'

import { Statement } from '@/components/graphics/graphics'

import type { BlockProps } from './types'

export function StatementBlock({ block }: BlockProps<'statement'>) {
  return (
    <section className="v1-section">
      <Statement text={block.text} source={block.source ?? undefined} />
    </section>
  )
}
