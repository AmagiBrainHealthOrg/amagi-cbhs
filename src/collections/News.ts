import type { CollectionConfig } from 'payload'

import { newsTypeOptions } from '@/config/news'
import { publishedOrAuthenticated } from '@/access/publishedOrAuthenticated'
import { slugField } from '@/fields/slug'
import { everyPage, revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

import { drafts, editorialAccess } from './shared'

// Home's news teaser, the index and the item itself; a partner announcement also shows on the
// partner's entry, which any page's logo grid can render (SPEC §4.4).
const targets = (doc: Record<string, unknown>) => [
  { path: '/' },
  { path: '/news' },
  { path: `/news/${String(doc.slug)}` },
  ...(doc.type === 'partner-announcement' ? everyPage(doc) : []),
]

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News item', plural: 'News' },
  access: { read: publishedOrAuthenticated, ...editorialAccess },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'publishedDate', '_status'],
    livePreview: {
      url: ({ data }) => `/news/${data?.slug ?? ''}?preview=true`,
    },
  },
  defaultSort: '-publishedDate',
  versions: drafts,
  hooks: {
    afterChange: [revalidateAfterChange(targets)],
    afterDelete: [revalidateAfterDelete(targets)],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      index: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'news',
      options: [...newsTypeOptions],
      admin: { position: 'sidebar' },
    },
    {
      name: 'partner',
      type: 'relationship',
      relationTo: 'partners',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.type === 'partner-announcement',
      },
      validate: (value: unknown, { siblingData }: { siblingData: { type?: string } }) =>
        siblingData?.type !== 'partner-announcement' ||
        Boolean(value) ||
        'A partner announcement needs a partner.',
    },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
  ],
}
