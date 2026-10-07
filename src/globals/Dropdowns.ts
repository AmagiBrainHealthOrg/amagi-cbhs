import type { ArrayField, GlobalConfig } from 'payload'

import { contentGlobal } from './shared'

const options = (name: string, singular: string, plural: string): ArrayField => ({
  name,
  type: 'array',
  labels: { singular, plural },
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'value',
      type: 'text',
      required: true,
      admin: {
        description: 'Stored on submissions and sent to Airtable. Avoid changing it once in use.',
      },
    },
  ],
  validate: (rows: unknown) => {
    if (!Array.isArray(rows)) return true
    const values = rows.map((row: { value?: string }) => row?.value).filter(Boolean)
    return new Set(values).size === values.length || 'Each value must be unique.'
  },
})

export const Dropdowns: GlobalConfig = {
  slug: 'dropdowns',
  ...contentGlobal('/?preview=true'),
  fields: [
    options('territories', 'Territory', 'Territories'),
    options('audienceTypes', 'Audience type', 'Audience types'),
    options('industries', 'Industry', 'Industries'),
  ],
}
