import 'server-only'

import type { Payload } from 'payload'

import { airtableForms } from '@/config/airtable'
import { type SubmissionData, toAirtableFields } from '@/utils/airtable'

import { createRecord, getTable } from './airtable'

export type SyncResult =
  { status: 'synced'; recordId: string } | { status: 'failed'; error: string }

// SPEC §8.2 step 6: writes a saved submission to its form's table and records the outcome on the
// submission, which stays the retry queue. Never throws, so it is safe inside after().
export async function syncSubmission(payload: Payload, id: number): Promise<SyncResult> {
  const submission = await payload.findByID({ collection: 'form-submissions', id, depth: 0 })
  if (submission.airtableSyncStatus === 'synced' && submission.airtableRecordId) {
    return { status: 'synced', recordId: submission.airtableRecordId }
  }

  let result: SyncResult
  try {
    const form = airtableForms[submission.form]
    const table = await getTable(form.table)
    const fields = toAirtableFields(form, table, submission.data as SubmissionData)
    result = { status: 'synced', recordId: await createRecord(form.table, fields) }
  } catch (error) {
    console.error(`Airtable sync failed for form submission ${id}`, error)
    result = { status: 'failed', error: error instanceof Error ? error.message : String(error) }
  }

  await payload.update({
    collection: 'form-submissions',
    id,
    data:
      result.status === 'synced'
        ? {
            airtableSyncStatus: 'synced',
            airtableRecordId: result.recordId,
            airtableSyncError: null,
          }
        : { airtableSyncStatus: 'failed', airtableSyncError: result.error },
  })
  return result
}
