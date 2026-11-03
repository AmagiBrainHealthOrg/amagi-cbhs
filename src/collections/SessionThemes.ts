import type { CollectionConfig } from 'payload'

import { publishedOrAuthenticated } from '@/access/publishedOrAuthenticated'
import { themeColours } from '@/config/summit'
import { everyPage, revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

import { drafts, editorialAccess } from './shared'
import { previewUrl } from '@/utils/preview'

// The schedule's filter chips.
export const SessionThemes: CollectionConfig = {
  slug: 'session-themes',
  labels: { singular: 'Theme', plural: 'Themes' },
  access: { read: publishedOrAuthenticated, ...editorialAccess },
  admin: {
    group: 'Programme',
    useAsTitle: 'name',
    defaultColumns: ['name', 'colour', 'order', '_status'],
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
      name: 'colour',
      type: 'select',
      required: true,
      defaultValue: 'blue',
      options: [...themeColours],
      admin: { description: 'Give each theme its own colour.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers come first.' },
    },
  ],
}
