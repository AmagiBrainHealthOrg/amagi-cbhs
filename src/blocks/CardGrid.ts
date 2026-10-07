import type { Block } from 'payload'

import { iconOptions } from '@/config/icons'
import { sectionFields } from '@/fields/section'

export const CardGrid: Block = {
  slug: 'cardGrid',
  interfaceName: 'CardGridBlock',
  fields: [
    ...sectionFields,
    {
      name: 'style',
      type: 'select',
      required: true,
      defaultValue: 'tiles',
      options: [
        { label: 'Tiles', value: 'tiles' },
        { label: 'Badges', value: 'badges' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Item', plural: 'Items' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'icon', type: 'select', required: true, options: [...iconOptions] },
            { name: 'title', type: 'text', admin: { description: 'Optional for badges.' } },
          ],
        },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
  ],
}
