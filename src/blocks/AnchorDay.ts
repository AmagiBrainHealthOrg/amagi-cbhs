import type { Block } from 'payload'

import { sectionFields } from '@/fields/section'

// Details come from the `anchor-day` global.
export const AnchorDay: Block = {
  slug: 'anchorDay',
  interfaceName: 'AnchorDayBlock',
  fields: sectionFields,
}
