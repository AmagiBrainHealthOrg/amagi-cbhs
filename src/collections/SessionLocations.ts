import type { CollectionConfig } from 'payload'

import { publishedOrAuthenticated } from '@/access/publishedOrAuthenticated'
import { timeZoneOptions } from '@/config/summit'
import { everyPage, revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

import { drafts, editorialAccess } from './shared'
import { previewUrl } from '@/utils/preview'

// The schedule's tabs: one per host country, plus Online.
export const SessionLocations: CollectionConfig = {
  slug: 'session-locations',
  labels: { singular: 'Location', plural: 'Locations' },
  access: { read: publishedOrAuthenticated, ...editorialAccess },
  admin: {
    group: 'Programme',
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'online', 'order', '_status'],
    livePreview: { url: previewUrl('/summit-week') },
  },
  defaultSort: 'order',
  versions: drafts,
  hooks: {
    afterChange: [revalidateAfterChange(everyPage)],
    afterDelete: [revalidateAfterDelete(everyPage)],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'city',
      type: 'text',
      admin: { description: 'Shown under the name, such as "Kingston" or "Open to everyone".' },
    },
    {
      name: 'online',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Online sessions show in each visitor’s own time zone and register through Zoom. In-person sessions register on this site.',
      },
    },
    {
      name: 'timeZone',
      type: 'select',
      required: true,
      defaultValue: 'America/Jamaica',
      options: [...timeZoneOptions],
      admin: { description: 'The time zone session times are entered in.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers come first.' },
    },
  ],
}
