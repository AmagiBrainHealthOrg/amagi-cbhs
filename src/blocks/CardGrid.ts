import type { Block } from 'payload'

import { iconOptions } from '@/config/icons'
import { sectionFields } from '@/fields/section'
import { linkFields } from '@/globals/shared'

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
        {
          name: 'link',
          type: 'group',
          admin: { description: 'Optional link at the foot of the card.' },
          fields: linkFields.map((field) => ({ ...field, required: false })),
        },
      ],
    },
    {
      name: 'links',
      type: 'array',
      maxRows: 2,
      labels: { singular: 'Button', plural: 'Buttons' },
      admin: { description: 'Optional buttons under the cards.' },
      fields: linkFields,
    },
  ],
}
