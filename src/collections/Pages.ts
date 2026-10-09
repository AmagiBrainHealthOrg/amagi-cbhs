import type { CollectionConfig } from 'payload'

import { publishedOrAuthenticated } from '@/access/publishedOrAuthenticated'
import { pageBlocks } from '@/blocks'
import { slugField } from '@/fields/slug'
import {
  everyPage,
  pagePath,
  revalidateAfterChange,
  revalidateAfterDelete,
} from '@/hooks/revalidate'

import { drafts, editorialAccess } from './shared'
import { previewUrl } from '@/utils/preview'

// Every page's cookie banner links to the cookies page by its title.
const targets = (doc: Record<string, unknown>) =>
  doc.slug === 'cookies'
    ? [{ path: pagePath(doc.slug) }, ...everyPage(doc)]
    : [{ path: pagePath(doc.slug) }]

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: { read: publishedOrAuthenticated, ...editorialAccess },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description: 'The page with slug "home" is the home page.',
    livePreview: {
      url: ({ data }) => previewUrl(pagePath(data?.slug ?? 'home')),
    },
  },
  versions: drafts,
  hooks: {
    afterChange: [revalidateAfterChange(targets)],
    afterDelete: [revalidateAfterDelete(targets)],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [{ name: 'layout', type: 'blocks', blocks: pageBlocks }],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'description', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
