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
const httpsUrl = (value: string | null | undefined) =>
  !value ||
  (URL.canParse(value) && /^https:\/\//.test(value)) ||
  'Enter a full web address, starting https://'

// SPEC §5.1. The schedule block lists every published session; one with no day goes under
// "Date TBC". In-person sessions register on /sessions/[slug]; online sessions link to Zoom.
// `registrationOptions` replaces that default when a session offers several ways to register.
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
      validate: httpsUrl,
    },
    {
      name: 'registrationOptions',
      label: 'Ways to register',
      type: 'array',
      labels: { singular: 'Way to register', plural: 'Ways to register' },
      admin: {
        description:
          'Optional, for sessions offering more than one way to register, such as "Attend in person" and "Join online". Leave empty for a single Register button.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { placeholder: 'Attend in person' },
            },
            {
              name: 'method',
              type: 'select',
              required: true,
              defaultValue: 'form',
              options: [
                { label: 'Registration form on this site', value: 'form' },
                { label: 'Link, such as Zoom', value: 'link' },
              ],
            },
          ],
        },
        {
          name: 'url',
          label: 'Link',
          type: 'text',
          admin: { condition: (_, siblingData) => siblingData?.method === 'link' },
          validate: (
            value: string | null | undefined,
            { siblingData }: { siblingData: unknown },
          ) =>
            (siblingData as { method?: string }).method === 'link' && !value
              ? 'Enter the link'
              : httpsUrl(value),
        },
      ],
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
