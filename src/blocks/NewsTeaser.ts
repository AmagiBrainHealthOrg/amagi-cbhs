import type { Block } from 'payload'

import { sectionFields } from '@/fields/section'

export const NewsTeaser: Block = {
  slug: 'newsTeaser',
  interfaceName: 'NewsTeaserBlock',
  fields: [
    ...sectionFields,
    {
      name: 'limit',
      type: 'number',
      label: 'Number of items',
      required: true,
      defaultValue: 3,
      min: 1,
      max: 12,
    },
    { name: 'linkLabel', type: 'text', admin: { description: 'Label for the link to /news.' } },
  ],
}
