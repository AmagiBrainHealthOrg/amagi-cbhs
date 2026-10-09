import type { Block } from 'payload'

import { sectionFields } from '@/fields/section'

// Lists every published team member, in their order. People are edited under Team.
export const Team: Block = {
  slug: 'team',
  interfaceName: 'TeamBlock',
  fields: sectionFields,
}
