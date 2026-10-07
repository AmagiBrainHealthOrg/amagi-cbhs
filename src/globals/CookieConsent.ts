import type { GlobalConfig } from 'payload'

import { revalidateGlobalAfterChange } from '@/hooks/revalidate'

import { contentGlobal } from './shared'

export const CookieConsent: GlobalConfig = {
  slug: 'cookie-consent',
  hooks: { afterChange: [revalidateGlobalAfterChange] },
  ...contentGlobal('/?preview=true'),
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'textarea' },
    { name: 'acceptLabel', type: 'text' },
    { name: 'rejectLabel', type: 'text' },
    {
      name: 'settingsLabel',
      type: 'text',
      admin: { description: 'The footer link that reopens the cookie banner.' },
    },
  ],
}
