import type { Block } from 'payload'

import { sectionFields } from '@/fields/section'

export const Flow: Block = {
  slug: 'flow',
  interfaceName: 'FlowBlock',
  admin: { group: 'Graphics' },
  fields: [
    ...sectionFields,
    {
      name: 'steps',
      type: 'array',
      labels: { singular: 'Step', plural: 'Steps' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
      ],
    },
  ],
}
