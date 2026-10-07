import type { Block } from 'payload'

import { sectionFields } from '@/fields/section'

export const LogoGrid: Block = {
  slug: 'logoGrid',
  interfaceName: 'LogoGridBlock',
  fields: [
    ...sectionFields,
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'supporters',
      options: [
        { label: 'Supporters', value: 'supporters' },
        { label: 'Partners', value: 'partners' },
      ],
      admin: { description: 'Only entries with permission confirmed are shown.' },
    },
    {
      name: 'emptyText',
      type: 'textarea',
      admin: { description: 'Shown when nobody can be listed yet.' },
    },
  ],
}
