import type { Block } from 'payload'

import { sectionFields } from '@/fields/section'

export const SupporterLevels: Block = {
  slug: 'supporterLevels',
  interfaceName: 'SupporterLevelsBlock',
  admin: { group: 'Graphics' },
  fields: [
    ...sectionFields,
    {
      name: 'levels',
      type: 'array',
      labels: { singular: 'Level', plural: 'Levels' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
      ],
    },
  ],
}
