import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { formOptions } from '@/config/forms'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    defaultColumns: ['form', 'territory', 'audienceType', 'airtableSyncStatus', 'createdAt'],
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'form',
      type: 'select',
      options: [...formOptions],
      required: true,
      index: true,
    },
    {
      name: 'data',
      type: 'json',
      required: true,
      admin: {
        description:
          "The person's answers: name, email, phone and the form's own fields (SPEC §8.1, §8.3).",
      },
    },
    { name: 'territory', type: 'text', index: true },
    { name: 'audienceType', type: 'text' },
    {
      name: 'consents',
      type: 'group',
      fields: [
        { name: 'contact', type: 'checkbox', defaultValue: false },
        { name: 'publicName', type: 'checkbox', defaultValue: false },
        { name: 'shareStory', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'utm',
      label: 'UTM',
      type: 'group',
      fields: [
        { name: 'source', type: 'text' },
        { name: 'medium', type: 'text' },
        { name: 'campaign', type: 'text' },
        { name: 'term', type: 'text' },
        { name: 'content', type: 'text' },
      ],
    },
    {
      name: 'isTest',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Submitted before launch or from a non-production environment.',
      },
    },
    {
      name: 'airtableSyncStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Synced', value: 'synced' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'pending',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'airtableSyncError',
      type: 'textarea',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'airtableRecordId',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
