import type { GlobalConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { revalidateUndraftedGlobalAfterChange } from '@/hooks/revalidate'

export const Integrations: GlobalConfig = {
  slug: 'integrations',
  access: {
    read: isAdmin,
    update: isAdmin,
  },
  hooks: { afterChange: [revalidateUndraftedGlobalAfterChange] },
  fields: [
    {
      name: 'plausibleDomain',
      type: 'text',
      label: 'Plausible Analytics domain',
      admin: {
        description:
          'The site domain exactly as added in Plausible, for example amagisummit.org. Leave empty to turn analytics off.',
      },
      validate: (value: string | null | undefined) =>
        !value ||
        /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(value) ||
        'Use the bare domain, for example amagisummit.org.',
    },
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
