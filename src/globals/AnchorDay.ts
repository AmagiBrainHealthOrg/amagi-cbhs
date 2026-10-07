import type { GlobalConfig } from 'payload'

import { contentGlobal } from './shared'

const base = contentGlobal('/?preview=true')

export const AnchorDay: GlobalConfig = {
  slug: 'anchor-day',
  ...base,
  admin: {
    ...base.admin,
    description: 'Every field is optional while the details are being confirmed.',
  },
  fields: [
    { name: 'date', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'venue', type: 'text' },
    { name: 'moderator', type: 'text' },
    { name: 'mc', type: 'text', label: 'MC' },
  ],
}
