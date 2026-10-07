import type { Block } from 'payload'

import { sectionFields } from '@/fields/section'

export const Roadmap: Block = {
  slug: 'roadmap',
  interfaceName: 'RoadmapBlock',
  admin: { group: 'Graphics' },
  fields: [
    ...sectionFields,
    {
      name: 'numbered',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Number the steps instead of showing their timing.' },
    },
    {
      name: 'steps',
      type: 'array',
      labels: { singular: 'Step', plural: 'Steps' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'when', type: 'text' },
            { name: 'title', type: 'text', required: true },
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'next',
              options: [
                { label: 'Done', value: 'done' },
                { label: 'Now', value: 'now' },
                { label: 'Next', value: 'next' },
              ],
            },
          ],
        },
        { name: 'body', type: 'textarea' },
      ],
    },
  ],
}
