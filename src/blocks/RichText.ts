import type { Block } from 'payload'

import { linkFields } from '@/globals/shared'

import { sectionFields } from '@/fields/section'

export const RichText: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  fields: [
    ...sectionFields,
    { name: 'content', type: 'richText', required: true },
    {
      name: 'layout',
      type: 'select',
      required: true,
      defaultValue: 'split',
      options: [
        { label: 'Split (heading beside text)', value: 'split' },
        { label: 'Prose (legal pages)', value: 'prose' },
        { label: 'Lead (large intro text, no heading)', value: 'lead' },
      ],
    },
    {
      name: 'links',
      type: 'array',
      maxRows: 2,
      labels: { singular: 'Button', plural: 'Buttons' },
      admin: {
        description: 'Optional buttons under the text. The first is solid, the second a text link.',
      },
      fields: linkFields,
    },
  ],
}
