import type { Block } from 'payload'

import { sectionFields } from '@/fields/section'

export const Events: Block = {
  slug: 'events',
  interfaceName: 'EventsBlock',
  fields: [
    {
      name: 'show',
      type: 'checkbox',
      label: 'Show on the page',
      defaultValue: true,
      admin: { description: 'Untick to hide this section without losing its events.' },
    },
    ...sectionFields,
    {
      name: 'groups',
      type: 'array',
      labels: { singular: 'Group', plural: 'Groups' },
      admin: {
        description: 'One per host country, plus one for online events. Empty groups are hidden.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'online', type: 'checkbox', label: 'Online events', defaultValue: false },
          ],
        },
        {
          name: 'events',
          type: 'array',
          labels: { singular: 'Event', plural: 'Events' },
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}
