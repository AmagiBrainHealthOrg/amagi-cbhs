import type { CollectionConfig } from 'payload'

import { publishedOrAuthenticated } from '@/access/publishedOrAuthenticated'
import { summitDays } from '@/config/summit'
import { slugField } from '@/fields/slug'
import { everyPage, revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

import { drafts, editorialAccess } from './shared'
import { previewUrl } from '@/utils/preview'

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/
const time = (value: string | null | undefined) =>
  !value || TIME.test(value) || 'Use the 24-hour clock, such as 09:30 or 18:00'

// SPEC §5.1. The schedule block lists every published session; one with no day goes under
// "Date TBC". In-person sessions register on /sessions/[slug]; online sessions link to Zoom.
export const Sessions: CollectionConfig = {
  slug: 'sessions',
  access: { read: publishedOrAuthenticated, ...editorialAccess },
  admin: {
    group: 'Programme',
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'day', 'startTime', '_status'],
    livePreview: { url: ({ data }) => previewUrl(`/sessions/${data?.slug ?? ''}`) },
  },
  defaultSort: ['day', 'startTime'],
  versions: drafts,
  hooks: {
    afterChange: [revalidateAfterChange(everyPage)],
    afterDelete: [revalidateAfterDelete(everyPage)],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      type: 'row',
      fields: [
        {
          name: 'location',
          type: 'relationship',
          relationTo: 'session-locations',
          required: true,
          index: true,
        },
        { name: 'theme', type: 'relationship', relationTo: 'session-themes' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'day',
          type: 'select',
          index: true,
          options: [...summitDays],
          admin: { description: 'Leave empty while the date is TBC.' },
        },
        {
          name: 'startTime',
          type: 'text',
          validate: time,
          admin: {
            placeholder: '09:30',
            description: 'Local time at the location, 24-hour. Leave empty while TBC.',
          },
        },
        {
          name: 'endTime',
          type: 'text',
          validate: time,
          admin: { placeholder: '11:00', description: 'Optional.' },
        },
      ],
    },
    {
      name: 'venue',
      type: 'text',
      admin: {
        description: 'In-person sessions: where it happens, such as a building and street.',
      },
    },
    { name: 'description', type: 'textarea' },
    {
      name: 'zoomUrl',
      label: 'Zoom registration link',
      type: 'text',
      admin: { description: 'Online sessions: the Register button opens this link.' },
      validate: (value: string | null | undefined) =>
        !value ||
        (URL.canParse(value) && /^https:\/\//.test(value)) ||
        'Enter a full web address, starting https://',
    },
    {
      name: 'registrationOpen',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Untick when the session is full. The Register button is then hidden.',
      },
    },
  ],
}
