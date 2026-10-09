import { APIError, type CollectionConfig } from 'payload'

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
  endpoints: [
    {
      // SPEC §8.2 step 7. Admin-only, like the collection.
      path: '/:id/retry-sync',
      method: 'post',
      handler: async (req) => {
        if (!isAdmin({ req })) throw new APIError('Forbidden', 403)
        const id = Number(req.routeParams?.id)
        if (!Number.isInteger(id)) throw new APIError('Not found', 404)
        // Loaded here: the config also runs in CLI scripts, where server-only modules throw.
        const { syncSubmission } = await import('@/lib/syncSubmission')
        const result = await syncSubmission(req.payload, id)
        return Response.json(result, { status: result.status === 'synced' ? 200 : 502 })
      },
    },
  ],
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
      // Unused since forms ask follow-up preferences instead (SPEC §8.1); kept until a later release drops it.
      admin: { hidden: true },
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
      name: 'sourcePage',
      type: 'text',
      admin: { description: 'The page the visitor came from before the form, for attribution.' },
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
      name: 'retrySync',
      type: 'ui',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.airtableSyncStatus === 'failed',
        components: { Field: '/components/admin/RetrySyncButton#RetrySyncButton' },
      },
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
