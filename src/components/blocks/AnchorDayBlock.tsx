import { getPayload } from 'payload'
import React from 'react'

import { Section } from '@/components/Section'
import { getGlobal } from '@/lib/globals'
import config from '@/payload.config'
import { formatDate } from '@/utils/formatDate'

import type { BlockProps } from './types'

const DETAILS = ['date', 'venue', 'moderator', 'mc'] as const

// Labels come from the `anchor-day` global's field config, so the admin and the site agree.
export async function AnchorDayBlock({ block, blockId }: BlockProps<'anchorDay'>) {
  const [details, payload] = await Promise.all([getGlobal('anchor-day'), getPayload({ config })])
  const fields = payload.config.globals.find(({ slug }) => slug === 'anchor-day')?.fields ?? []
  const labelFor = (name: string) => {
    const field = fields.find((candidate) => 'name' in candidate && candidate.name === name)
    const label = field && 'label' in field ? field.label : undefined
    return typeof label === 'string' ? label : name.charAt(0).toUpperCase() + name.slice(1)
  }

  const rows = DETAILS.flatMap((name) => {
    const value = details[name]
    if (!value) return []
    return [{ name, label: labelFor(name), value: name === 'date' ? formatDate(value) : value }]
  })

  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      {rows.length > 0 && (
        <dl className="v1-anchor-day">
          {rows.map(({ name, label, value }) => (
            <div key={name}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </Section>
  )
}
