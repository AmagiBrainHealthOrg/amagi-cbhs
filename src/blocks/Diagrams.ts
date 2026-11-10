import type { Block, Field } from 'payload'

import { sectionFields } from '@/fields/section'

// Graphics drawn for the PLADRR page (10 November 2026): a zoom-out strip, a three-circle Venn
// diagram, a narrowing funnel and an is/isn't comparison. Any page can use them.

const body: Field = {
  name: 'body',
  type: 'textarea',
  admin: {
    description:
      'Optional text beside or under the graphic. Separate paragraphs with a blank line. Link with [text](/path).',
  },
}

export const ScaleStrip: Block = {
  slug: 'scaleStrip',
  interfaceName: 'ScaleStripBlock',
  labels: { singular: 'Zoom-out strip', plural: 'Zoom-out strips' },
  admin: { group: 'Graphics' },
  fields: [
    ...sectionFields,
    {
      name: 'steps',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      labels: { singular: 'Scale', plural: 'Scales' },
      admin: {
        description: 'From one person outwards. Each scale shows more people than the last.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'highlight', type: 'checkbox', label: 'Highlight', defaultValue: false },
          ],
        },
      ],
    },
    {
      name: 'highlightLabel',
      type: 'text',
      admin: { description: 'Tag on the highlighted scales, such as "PLADRR’s focus".' },
    },
    body,
  ],
}

export const Venn: Block = {
  slug: 'venn',
  interfaceName: 'VennBlock',
  labels: { singular: 'Venn diagram', plural: 'Venn diagrams' },
  admin: { group: 'Graphics' },
  fields: [
    ...sectionFields,
    {
      name: 'circles',
      type: 'array',
      minRows: 3,
      maxRows: 3,
      labels: { singular: 'Circle', plural: 'Circles' },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    { name: 'centre', type: 'text', admin: { description: 'Where all three circles overlap.' } },
    body,
  ],
}

export const Funnel: Block = {
  slug: 'funnel',
  interfaceName: 'FunnelBlock',
  labels: { singular: 'Funnel', plural: 'Funnels' },
  admin: { group: 'Graphics' },
  fields: [
    ...sectionFields,
    {
      name: 'steps',
      type: 'array',
      minRows: 2,
      maxRows: 5,
      labels: { singular: 'Step', plural: 'Steps' },
      admin: { description: 'Each step is narrower than the last.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'when', type: 'text', admin: { description: 'Such as "3 Feb".' } },
            { name: 'title', type: 'text', required: true },
          ],
        },
        { name: 'body', type: 'textarea' },
      ],
    },
    {
      name: 'end',
      type: 'text',
      admin: { description: 'Where the funnel leads, under its point.' },
    },
    body,
  ],
}

const side = (name: string, label: string): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    { name: 'heading', type: 'text', required: true },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Item', plural: 'Items' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
})

export const Comparison: Block = {
  slug: 'comparison',
  interfaceName: 'ComparisonBlock',
  labels: { singular: 'Is / isn’t comparison', plural: 'Is / isn’t comparisons' },
  admin: { group: 'Graphics' },
  fields: [...sectionFields, side('is', 'Is (ticks)'), side('isNot', 'Isn’t (crosses)'), body],
}
