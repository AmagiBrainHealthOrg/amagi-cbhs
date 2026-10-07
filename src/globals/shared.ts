import type { Field, GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { publishedOrAuthenticated } from '@/access/publishedOrAuthenticated'

export const contentGlobal = (
  livePreviewUrl: string,
): Pick<GlobalConfig, 'access' | 'admin' | 'versions'> => ({
  access: {
    read: publishedOrAuthenticated,
    update: isAdminOrEditor,
  },
  admin: {
    livePreview: { url: livePreviewUrl },
  },
  versions: {
    drafts: {
      autosave: { interval: 800 },
    },
  },
})

export const linkFields: Field[] = [
  { name: 'label', type: 'text', required: true },
  {
    name: 'href',
    type: 'text',
    required: true,
    admin: { description: 'A path such as /about, a full URL, or a mailto: link.' },
  },
]
