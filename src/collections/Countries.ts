import type { CollectionConfig } from 'payload'

import { publishedOrAuthenticated } from '@/access/publishedOrAuthenticated'
import { slugField } from '@/fields/slug'
import { everyPage, revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'
import { previewUrl } from '@/utils/preview'

import { drafts, editorialAccess } from './shared'

// The host country pages at /countries/[slug]. Wording shared by every country page is on the
// Country Pages global.
export const Countries: CollectionConfig = {
  slug: 'countries',
  labels: { singular: 'Country', plural: 'Countries' },
  access: { read: publishedOrAuthenticated, ...editorialAccess },
  admin: {
    group: 'Programme',
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'order', '_status'],
    livePreview: { url: ({ data }) => previewUrl(`/countries/${data?.slug ?? ''}`) },
  },
  defaultSort: 'order',
  versions: drafts,
  hooks: {
    afterChange: [revalidateAfterChange(everyPage)],
    afterDelete: [revalidateAfterDelete(everyPage)],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'session-locations',
      required: true,
      unique: true,
      admin: {
        description:
          'The programme location whose published sessions this page lists. Its schedule tab and session pages link here.',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      admin: { description: 'The page heading, also shown on the Countries page.' },
    },
    {
      name: 'intro',
      type: 'textarea',
      required: true,
      admin: { description: 'Separate paragraphs with a blank line.' },
    },
    {
      name: 'hosts',
      type: 'textarea',
      admin: {
        description:
          'Approved acknowledgement of this country’s local hosts. Shown above the general note when set.',
      },
    },
    {
      name: 'anchorDay',
      type: 'checkbox',
      label: 'Hosts the Anchor Day',
      defaultValue: false,
      admin: { description: 'Shows the Anchor Day note under the programme.' },
    },
    {
      name: 'priorities',
      type: 'group',
      fields: [
        { name: 'question', type: 'textarea', required: true },
        { name: 'strengths', type: 'textarea', required: true },
        { name: 'nextStep', type: 'textarea', required: true },
        { name: 'regional', type: 'textarea', required: true },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers come first.' },
    },
  ],
}
