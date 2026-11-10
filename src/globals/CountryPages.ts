import type { Field, GlobalConfig } from 'payload'

import { iconOptions } from '@/config/icons'
import { revalidateGlobalAfterChange } from '@/hooks/revalidate'
import { previewUrl } from '@/utils/preview'

import { contentGlobal } from './shared'

const base = contentGlobal(previewUrl('/countries'))

const COUNTRY_TOKEN = 'Write {country} where the country’s name should go.'
const LINKS = 'Separate paragraphs with a blank line. Link with [text](/path).'

const text = (name: string, description?: string): Field => ({
  name,
  type: 'text',
  required: true,
  ...(description && { admin: { description } }),
})
const textarea = (name: string, description?: string): Field => ({
  name,
  type: 'textarea',
  required: true,
  ...(description && { admin: { description } }),
})

// Wording shared by /countries and every country page. Each country's own copy is on the
// Countries collection.
export const CountryPages: GlobalConfig = {
  slug: 'country-pages',
  label: 'Country Pages',
  hooks: { afterChange: [revalidateGlobalAfterChange] },
  ...base,
  admin: { ...base.admin, group: 'Programme' },
  fields: [
    {
      name: 'index',
      type: 'group',
      label: 'Countries page',
      fields: [text('kicker'), text('heading'), textarea('lead')],
    },
    {
      name: 'programme',
      type: 'group',
      fields: [
        text('heading'),
        textarea('intro', COUNTRY_TOKEN),
        text('timeZoneNote', COUNTRY_TOKEN),
      ],
    },
    {
      name: 'anchorDay',
      type: 'group',
      label: 'Anchor Day note',
      admin: { description: 'Shown on countries that host the Anchor Day.' },
      fields: [text('heading'), text('when'), textarea('body')],
    },
    {
      name: 'hosts',
      type: 'group',
      label: 'Local hosts',
      fields: [text('heading'), textarea('note')],
    },
    {
      name: 'priorities',
      type: 'group',
      fields: [
        text('heading'),
        textarea('intro'),
        text('questionLabel'),
        text('strengthsLabel'),
        text('nextStepLabel'),
        text('regionalLabel'),
      ],
    },
    {
      name: 'takePart',
      type: 'group',
      label: 'Take part',
      fields: [
        text('heading'),
        {
          name: 'cards',
          type: 'array',
          maxRows: 4,
          fields: [
            { name: 'icon', type: 'select', required: true, options: [...iconOptions] },
            text('title'),
            textarea('body'),
            {
              type: 'row',
              fields: [
                { name: 'linkLabel', type: 'text' },
                {
                  name: 'linkHref',
                  type: 'text',
                  admin: { description: 'A path such as /relay, or #programme for the list.' },
                },
              ],
            },
          ],
        },
        text('stayConnectedLabel'),
        textarea('stayConnected'),
      ],
    },
    {
      name: 'beyond',
      type: 'group',
      label: 'Beyond Summit week',
      fields: [text('heading'), textarea('body', LINKS)],
    },
    {
      name: 'about',
      type: 'group',
      label: 'About this contribution',
      fields: [text('heading'), textarea('body', LINKS)],
    },
  ],
}
