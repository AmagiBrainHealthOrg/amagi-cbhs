import type { GlobalConfig } from 'payload'

import { revalidateGlobalAfterChange } from '@/hooks/revalidate'

import { contentGlobal } from './shared'
import { previewUrl } from '@/utils/preview'

const content = contentGlobal(previewUrl('/'))

export const CookieConsent: GlobalConfig = {
  slug: 'cookie-consent',
  hooks: { afterChange: [revalidateGlobalAfterChange] },
  ...content,
  // The banner was retired in T015 (SPEC §10.5). The global stays until a later release drops it.
  admin: { ...content.admin, hidden: true },
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
