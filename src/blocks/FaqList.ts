import type { Block } from 'payload'

import { sectionFields } from '@/fields/section'

export const FaqList: Block = {
  slug: 'faqList',
  interfaceName: 'FaqListBlock',
  fields: [
    ...sectionFields,
    {
      name: 'category',
      type: 'text',
      admin: { description: 'Show only FAQs in this category. Leave empty to show every FAQ.' },
    },
    {
      name: 'showCategories',
      type: 'checkbox',
      label: 'Show category headings',
      defaultValue: true,
    },
  ],
}
