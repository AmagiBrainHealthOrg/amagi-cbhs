import type { CollectionConfig } from 'payload'

import { publishedAndPermittedOrAuthenticated } from '@/access/publishedAndPermittedOrAuthenticated'
import { everyPage, revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

import { drafts, editorialAccess } from './shared'

export const Partners: CollectionConfig = {
  slug: 'partners',
  access: { read: publishedAndPermittedOrAuthenticated, ...editorialAccess },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'permissionConfirmed', '_status'],
    livePreview: { url: '/?preview=true' },
  },
  versions: drafts,
  hooks: {
    afterChange: [revalidateAfterChange(everyPage)],
    afterDelete: [revalidateAfterDelete(everyPage)],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'textarea' },
    { name: 'website', type: 'text' },
    {
      name: 'permissionConfirmed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'The name and logo appear on the site only once the partner has given permission.',
      },
    },
  ],
}
