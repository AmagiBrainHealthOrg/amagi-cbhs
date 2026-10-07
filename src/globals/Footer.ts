import type { GlobalConfig } from 'payload'

import { revalidateGlobalAfterChange } from '@/hooks/revalidate'

import { contentGlobal, linkFields } from './shared'

export const Footer: GlobalConfig = {
  slug: 'footer',
  hooks: { afterChange: [revalidateGlobalAfterChange] },
  ...contentGlobal('/?preview=true'),
  fields: [
    {
      name: 'links',
      type: 'array',
      labels: { singular: 'Link', plural: 'Links' },
      admin: {
        description:
          'The cookie settings link is added after these; its label is on Cookie Consent.',
      },
      fields: linkFields,
    },
    { name: 'tagline', type: 'text' },
    { name: 'legalText', type: 'textarea' },
  ],
}
