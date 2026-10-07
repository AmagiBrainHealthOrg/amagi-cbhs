import type { Block } from 'payload'

import { linkFields } from '@/globals/shared'

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'style',
      type: 'select',
      required: true,
      defaultValue: 'photo',
      options: [
        { label: 'Map', value: 'map' },
        { label: 'Photo', value: 'photo' },
        { label: 'Plain', value: 'plain' },
      ],
    },
    { name: 'kicker', type: 'text' },
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      admin: { description: 'Line breaks are kept.' },
    },
    { name: 'lead', type: 'textarea' },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.style === 'photo',
        description:
          'Shown as a slow crossfade. Set the focal point on each image to control cropping.',
      },
    },
    {
      name: 'showDonateButton',
      type: 'checkbox',
      label: 'Show the Donate button',
      defaultValue: true,
    },
    {
      name: 'secondaryLink',
      type: 'group',
      admin: { description: 'Optional second button.' },
      fields: linkFields.map((field) => ({ ...field, required: false })),
    },
    {
      name: 'countdown',
      type: 'group',
      admin: { description: 'Optional. Counts down to the target time.' },
      fields: [
        {
          name: 'target',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
        { name: 'label', type: 'text' },
        {
          name: 'units',
          type: 'group',
          admin: { description: 'Labels under the numbers.' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'days', type: 'text' },
                { name: 'hours', type: 'text' },
                { name: 'minutes', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      labels: { singular: 'Stat', plural: 'Stats' },
      admin: { description: 'Figures shown in a band under the hero.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
