import type { Block } from 'payload'

import { sectionFields } from '@/fields/section'

export const NewsTeaser: Block = {
  slug: 'newsTeaser',
  interfaceName: 'NewsTeaserBlock',
  fields: [
    ...sectionFields,
    {
      name: 'showAll',
      type: 'checkbox',
      label: 'List every news item',
      defaultValue: false,
      admin: { description: 'For the News page: lists every item with its type, newest first.' },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Number of items',
      required: true,
      defaultValue: 3,
      min: 1,
      max: 12,
      admin: { condition: (_, siblingData) => !siblingData?.showAll },
    },
    { name: 'linkLabel', type: 'text', admin: { description: 'Label for the link to /news.' } },
  ],
}
