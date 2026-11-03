import type { GlobalConfig } from 'payload'

import { summitDays } from '@/config/summit'
import { revalidateGlobalAfterChange } from '@/hooks/revalidate'

import { contentGlobal } from './shared'
import { previewUrl } from '@/utils/preview'

const base = contentGlobal(previewUrl('/summit-week'))

// The week strip on Home and Summit Week. The Anchor Day is highlighted from the Anchor Day
// global's date, so it is set in one place.
export const SummitWeek: GlobalConfig = {
  slug: 'summit-week',
  label: 'Summit Week Days',
  hooks: { afterChange: [revalidateGlobalAfterChange] },
  ...base,
  admin: {
    ...base.admin,
    description:
      'The seven days shown on Home and Summit Week. The Anchor Day is highlighted from the date on the Anchor Day global.',
  },
  fields: [
    {
      name: 'days',
      type: 'array',
      labels: { singular: 'Day', plural: 'Days' },
      maxRows: summitDays.length,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'day', type: 'select', required: true, options: [...summitDays] },
            { name: 'label', type: 'text', required: true },
          ],
        },
        { name: 'body', type: 'textarea' },
      ],
    },
  ],
}
