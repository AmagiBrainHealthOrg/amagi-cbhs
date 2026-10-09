import type { CollectionConfig } from 'payload'

import { publishedOrAuthenticated } from '@/access/publishedOrAuthenticated'
import { everyPage, revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

import { drafts, editorialAccess } from './shared'

// The Summit team: the convenor and the country leads and liaisons. Listed by the team block.
export const Team: CollectionConfig = {
  slug: 'team',
  labels: { singular: 'Team member', plural: 'Team' },
  access: { read: publishedOrAuthenticated, ...editorialAccess },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'order', '_status'],
    description: 'People shown in team sections, such as on the About page, once published.',
    livePreview: { url: '/about?preview=true' },
  },
  versions: drafts,
  hooks: {
    afterChange: [revalidateAfterChange(everyPage)],
    afterDelete: [revalidateAfterDelete(everyPage)],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'role',
          type: 'text',
          admin: { description: 'For example "Convenor" or "Country lead". Optional.' },
        },
        { name: 'country', type: 'text', admin: { description: 'Optional.' } },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'A square headshot, at least 640 pixels wide.' },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description:
          'Separate paragraphs with a blank line. The first paragraph shows on the card; the rest opens with "Read more".',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers come first. People without a number follow, A to Z.',
      },
    },
  ],
}
