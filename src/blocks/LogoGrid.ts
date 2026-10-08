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
      name: 'display',
      type: 'select',
      required: true,
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Scrolling banner', value: 'marquee' },
      ],
      admin: {
        description:
          'The banner scrolls once there are 5 or more logos; with fewer it shows them in a row. With none, the section is hidden.',
      },
    },
    {
      name: 'emptyText',
      type: 'textarea',
      admin: {
        description: 'Shown when nobody can be listed yet.',
        condition: (_, siblingData) => siblingData?.display !== 'marquee',
      },
    },
  ],
}
