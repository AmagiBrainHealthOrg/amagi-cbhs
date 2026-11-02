import type { Block } from 'payload'

import { sectionFields } from '@/fields/section'

// Section copy only: the map, its countries and labels are in src/config/hostMap.ts.
export const HostMap: Block = {
  slug: 'hostMap',
  interfaceName: 'HostMapBlock',
  admin: { group: 'Graphics' },
  fields: [
    ...sectionFields,
    // The graphic is fixed in src/config/hostMap.ts. These are hidden and unread, kept so the
    // previous deployment still reads its tables (SPEC §11.2); a later release drops them.
    {
      name: 'onlineLabel',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'anchorLabel',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'countries',
      type: 'array',
      labels: { singular: 'Country', plural: 'Countries' },
      admin: { hidden: true },
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
