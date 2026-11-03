import type { Block } from 'payload'

import { sectionFields } from '@/fields/section'

export const SummitWeek: Block = {
  slug: 'summitWeek',
  interfaceName: 'SummitWeekBlock',
  admin: { group: 'Graphics' },
  fields: [
    ...sectionFields,
    // Unread since 3 November 2026: the days come from the Summit Week Days global. Hidden, and
    // dropped in a later release.
    {
      name: 'monthLabel',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'days',
      type: 'array',
      admin: { hidden: true },
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
