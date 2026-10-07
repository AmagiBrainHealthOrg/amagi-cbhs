import type { GlobalConfig } from 'payload'

import { formOptions } from '@/config/forms'

import { contentGlobal } from './shared'

export const Forms: GlobalConfig = {
  slug: 'forms',
  ...contentGlobal('/thank-you/register-interest?preview=true'),
  fields: [
    {
      name: 'thankYou',
      type: 'array',
      labels: { singular: 'Thank-you page', plural: 'Thank-you pages' },
      maxRows: formOptions.length,
      admin: { description: 'One entry per form, shown on /thank-you/<form> after it is sent.' },
      validate: (rows: unknown) => {
        if (!Array.isArray(rows)) return true
        const forms = rows.map((row: { form?: string }) => row?.form).filter(Boolean)
        return new Set(forms).size === forms.length || 'Each form can only have one entry.'
      },
      fields: [
        { name: 'form', type: 'select', required: true, options: [...formOptions] },
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
      ],
    },
  ],
}
