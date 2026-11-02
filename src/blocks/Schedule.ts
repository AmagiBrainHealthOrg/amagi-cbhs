import type { Block } from 'payload'

import { summitDays } from '@/config/summit'
import { sectionFields } from '@/fields/section'

// SPEC §6.3. Sessions, locations and themes come from their collections; this block only adds
// labels for particular days. Hidden while no session is published.
export const Schedule: Block = {
  slug: 'schedule',
  interfaceName: 'ScheduleBlock',
  fields: [
    ...sectionFields,
    {
      name: 'dayNotes',
      type: 'array',
      labels: { singular: 'Day note', plural: 'Day notes' },
      maxRows: summitDays.length,
      admin: { description: 'A short label under a date, such as "Opening" or "Anchor Day".' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'day', type: 'select', required: true, options: [...summitDays] },
            { name: 'note', type: 'text', required: true },
            {
              name: 'highlight',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Marks the day in orange, as for Anchor Day.' },
            },
          ],
        },
      ],
    },
  ],
}
