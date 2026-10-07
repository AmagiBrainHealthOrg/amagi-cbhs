import type { Block } from 'payload'

import { sectionFields } from '@/fields/section'

export const HostMap: Block = {
  slug: 'hostMap',
  interfaceName: 'HostMapBlock',
  admin: { group: 'Graphics' },
  fields: [
    ...sectionFields,
    {
      name: 'onlineLabel',
      type: 'text',
      admin: { description: 'The extra line for online sessions.' },
    },
    {
      name: 'anchorLabel',
      type: 'text',
      admin: { description: 'Shown beside the country that hosts the Anchor Day.' },
    },
    {
      name: 'countries',
      type: 'array',
      labels: { singular: 'Country', plural: 'Countries' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'city', type: 'text' },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'x',
              type: 'number',
              required: true,
              admin: { description: 'Position on the map grid, 0–932, left to right.' },
            },
            {
              name: 'y',
              type: 'number',
              required: true,
              admin: { description: 'Position on the map grid, 0–660, top to bottom.' },
            },
            {
              name: 'labelSide',
              type: 'select',
              required: true,
              defaultValue: 'left',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
            },
          ],
        },
        { name: 'anchor', type: 'checkbox', label: 'Hosts the Anchor Day', defaultValue: false },
      ],
    },
  ],
}
