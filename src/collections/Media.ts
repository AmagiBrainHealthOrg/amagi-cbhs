import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      required: true,
      admin: {
        description:
          'Required. Describe the image for people who can’t see it, such as “Dingolé logo” or “Dr Ishtar Govia speaking at a lectern”.',
      },
    },
  ],
  upload: {
    // Without this every image request runs Payload and fetches from Supabase; with it Netlify's
    // CDN and image CDN keep a copy. A replaced file shows within a day.
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
      return headers
    },
  },
}
