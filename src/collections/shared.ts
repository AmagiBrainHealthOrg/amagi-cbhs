import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const editorialAccess: NonNullable<CollectionConfig['access']> = {
  create: isAdminOrEditor,
  update: isAdminOrEditor,
  delete: isAdminOrEditor,
}

export const drafts: CollectionConfig['versions'] = {
  drafts: {
    autosave: { interval: 800 },
  },
}
