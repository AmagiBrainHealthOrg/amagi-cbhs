import type { CollectionConfig } from 'payload'

import { publishedAndPermittedOrAuthenticated } from '@/access/publishedAndPermittedOrAuthenticated'
import { everyPage, revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

import { drafts, editorialAccess } from './shared'
import { previewUrl } from '@/utils/preview'

export const Partners: CollectionConfig = {
  slug: 'partners',
  access: { read: publishedAndPermittedOrAuthenticated, ...editorialAccess },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', 'permissionConfirmed', '_status'],
    description:
      'Partner logos appear in logo grids and the scrolling partner banner once published with permission confirmed.',
    livePreview: { url: previewUrl('/') },
  },
  versions: drafts,
  hooks: {
    afterChange: [revalidateAfterChange(everyPage)],
    afterDelete: [revalidateAfterDelete(everyPage)],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: "The organisation's full name. Screen readers read it out for the logo.",
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'A transparent PNG, SVG or WebP works best, around 480 pixels wide. Logos on a solid background should be on white.',
      },
    },
    { name: 'description', type: 'textarea' },
    {
      name: 'website',
      type: 'text',
      admin: { description: 'Optional. The full address, starting https://' },
      validate: (value: string | null | undefined) =>
        !value ||
        (URL.canParse(value) && /^https?:\/\//.test(value)) ||
        'Enter a full web address, starting https://',
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers come first. Partners without a number follow, A to Z.',
      },
    },
    {
      name: 'permissionConfirmed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'The name and logo appear on the site only once the partner has given permission.',
      },
    },
  ],
}
