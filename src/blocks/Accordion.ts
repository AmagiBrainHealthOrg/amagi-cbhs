import type { Block } from 'payload'

import { sectionFields } from '@/fields/section'

export const Accordion: Block = {
  slug: 'accordion',
  interfaceName: 'AccordionBlock',
  fields: [
    ...sectionFields,
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Item', plural: 'Items' },
      admin: { description: 'Each item opens and closes on its own.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'richText', required: true },
      ],
    },
  ],
}
