import type { GlobalConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'

export const Integrations: GlobalConfig = {
  slug: 'integrations',
  access: {
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'gtmContainerId',
      type: 'text',
      label: 'Google Tag Manager container ID',
      admin: { description: 'For example GTM-ABC1234.' },
      validate: (value: string | null | undefined) =>
        !value || /^GTM-[A-Z0-9]+$/.test(value) || 'Use the format GTM-ABC1234.',
    },
  ],
}
