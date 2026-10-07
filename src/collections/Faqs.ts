import type { CollectionConfig } from 'payload'

import { publishedOrAuthenticated } from '@/access/publishedOrAuthenticated'
import { everyPage, revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

import { drafts, editorialAccess } from './shared'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  access: { read: publishedOrAuthenticated, ...editorialAccess },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order', '_status'],
    livePreview: { url: '/faqs?preview=true' },
  },
  defaultSort: 'order',
  versions: drafts,
  hooks: {
    afterChange: [revalidateAfterChange(everyPage)],
    afterDelete: [revalidateAfterDelete(everyPage)],
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    {
      name: 'category',
      type: 'text',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'FAQs with the same category are grouped together. An FAQ list block can filter by it.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers come first.' },
    },
  ],
}
