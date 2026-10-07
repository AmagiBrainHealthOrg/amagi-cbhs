import type { Block } from 'payload'

import { iconOptions } from '@/config/icons'
import { sectionFields } from '@/fields/section'
import { linkFields } from '@/globals/shared'

export const ActionAreas: Block = {
  slug: 'actionAreas',
  interfaceName: 'ActionAreasBlock',
  admin: { group: 'Graphics' },
  fields: [
    ...sectionFields,
    {
      name: 'centreLabel',
      type: 'text',
      admin: { description: 'Text in the middle of the wheel.' },
    },
    {
      name: 'areas',
      type: 'array',
      labels: { singular: 'Area', plural: 'Areas' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'icon', type: 'select', required: true, options: [...iconOptions] },
            { name: 'title', type: 'text', required: true },
          ],
        },
        { name: 'body', type: 'textarea' },
      ],
    },
    {
      name: 'link',
      type: 'group',
      admin: { description: 'Optional link under the wheel.' },
      fields: linkFields.map((field) => ({ ...field, required: false })),
    },
  ],
}
