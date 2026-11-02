import 'server-only'

import { airtableDonations } from '@/config/airtable'
import { type DonationRecord, toDonationFields } from '@/utils/airtable'

import { getTable, upsertRecord } from './airtable'

// SPEC §7.5: one Donation record per Checkout Session, whichever event or retry delivers it.
export async function recordDonation(donation: DonationRecord) {
  const table = await getTable(airtableDonations.table)
  return upsertRecord(airtableDonations.table, toDonationFields(table, donation), [
    airtableDonations.fields.session.id,
  ])
}
