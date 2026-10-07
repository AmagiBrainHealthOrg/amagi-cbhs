import type { Block } from 'payload'

import { formOptions } from '@/config/forms'
import { sectionFields } from '@/fields/section'

// Thank-you copy lives in the `forms` global: the thank-you route only knows the form key (SPEC §8.4).
export const Form: Block = {
  slug: 'form',
  interfaceName: 'FormBlock',
  fields: [
    ...sectionFields,
    { name: 'form', type: 'select', required: true, options: [...formOptions] },
  ],
}
