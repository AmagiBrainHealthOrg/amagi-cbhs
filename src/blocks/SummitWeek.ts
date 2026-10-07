import type { Block } from 'payload'

import { sectionFields } from '@/fields/section'

export const SummitWeek: Block = {
  slug: 'summitWeek',
  interfaceName: 'SummitWeekBlock',
  admin: { group: 'Graphics' },
  fields: [
    ...sectionFields,
    {
      name: 'monthLabel',
      type: 'text',
      admin: { description: 'Shown under each date, e.g. Nov.' },
    },
    {
      name: 'days',
      type: 'array',
      labels: { singular: 'Day', plural: 'Days' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'day',
              type: 'text',
              required: true,
              admin: { description: 'Short name, e.g. Mon.' },
            },
            {
              name: 'date',
              type: 'text',
              required: true,
              admin: { description: 'Day of the month, e.g. 16.' },
            },
            { name: 'label', type: 'text', required: true },
          ],
        },
        { name: 'body', type: 'textarea' },
        { name: 'anchor', type: 'checkbox', label: 'Anchor Day', defaultValue: false },
      ],
    },
  ],
}
