import type { GlobalConfig } from 'payload'

import { contentGlobal, linkFields } from './shared'

export const Header: GlobalConfig = {
  slug: 'header',
  ...contentGlobal('/?preview=true'),
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'brandTitle',
      type: 'textarea',
      admin: { description: 'Line breaks are kept.' },
    },
    {
      name: 'navItems',
      type: 'array',
      labels: { singular: 'Nav item', plural: 'Nav items' },
      fields: linkFields,
    },
    {
      name: 'donateLabel',
      type: 'text',
      admin: { description: 'The Donate button in the header.' },
    },
  ],
}
