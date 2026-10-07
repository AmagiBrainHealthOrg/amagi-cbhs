import type { CollectionConfig } from 'payload'

import { publishedAndPermittedOrAuthenticated } from '@/access/publishedAndPermittedOrAuthenticated'
import { everyPage, revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

import { drafts, editorialAccess } from './shared'

export const Supporters: CollectionConfig = {
  slug: 'supporters',
  access: { read: publishedAndPermittedOrAuthenticated, ...editorialAccess },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'level', 'permissionConfirmed', '_status'],
    livePreview: { url: '/support?preview=true' },
  },
  versions: drafts,
  hooks: {
    afterChange: [revalidateAfterChange(everyPage)],
    afterDelete: [revalidateAfterDelete(everyPage)],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'level',
      type: 'select',
      options: [
        { label: 'Founding Regional Supporter', value: 'founding-regional' },
        { label: 'Regional Supporter', value: 'regional' },
        { label: 'Access & Participation Supporter', value: 'access-participation' },
        { label: 'Community Supporter', value: 'community' },
      ],
    },
    {
      name: 'permissionConfirmed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'The name and logo appear on the site only once the supporter has given permission.',
      },
    },
  ],
}
