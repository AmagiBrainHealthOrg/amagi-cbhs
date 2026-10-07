import type { Block } from 'payload'

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
      ],
    },
  ],
}
