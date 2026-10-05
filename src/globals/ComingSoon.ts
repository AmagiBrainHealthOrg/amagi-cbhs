import type { GlobalConfig } from 'payload'

export const detailIcons = [
  { label: 'Calendar', value: 'calendar' },
  { label: 'Map pin', value: 'map-pin' },
  { label: 'Globe', value: 'globe' },
  { label: 'Users', value: 'users' },
  { label: 'Clock', value: 'clock' },
  { label: 'Mail', value: 'mail' },
] as const

export const ComingSoon: GlobalConfig = {
  slug: 'coming-soon',
  label: 'Coming Soon Page',
  admin: {
    livePreview: {
      url: '/?preview=true',
    },
  },
  versions: {
    drafts: {
      autosave: { interval: 800 },
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Header',
          fields: [
            { name: 'logo', type: 'upload', relationTo: 'media' },
            {
              name: 'brandTitle',
              type: 'textarea',
              admin: { description: 'Line breaks are kept.' },
            },
          ],
        },
        {
          label: 'Hero',
          fields: [
            { name: 'kicker', type: 'text', admin: { description: 'Small uppercase line above the headline.' } },
            {
              name: 'headline',
              type: 'textarea',
              required: true,
              admin: { description: 'Line breaks are kept.' },
            },
            { name: 'lead', type: 'textarea' },
            { name: 'body', type: 'textarea' },
            {
              name: 'cta',
              type: 'group',
              label: 'Call to action',
              fields: [
                { name: 'label', type: 'text' },
                {
                  name: 'url',
                  type: 'text',
                  admin: { description: 'The QR code is generated from this link.' },
                },
              ],
            },
            {
              name: 'qr',
              type: 'group',
              label: 'QR code',
              fields: [
                { name: 'label', type: 'text' },
                { name: 'sublabel', type: 'text' },
              ],
            },
            {
              name: 'details',
              type: 'array',
              labels: { singular: 'Detail', plural: 'Details' },
              fields: [
                { name: 'icon', type: 'select', options: [...detailIcons], defaultValue: 'calendar' },
                { name: 'title', type: 'text', required: true },
                { name: 'subtitle', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Background',
          fields: [
            {
              name: 'backgroundImages',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: {
                description:
                  'Shown as a slow crossfade, 8 seconds each. Set the focal point on each image to control cropping.',
              },
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            { name: 'footerLeft', type: 'text' },
            { name: 'footerRight', type: 'text' },
          ],
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
