import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'
import type { Dropdown } from '@/payload-types'

export type DropdownOption = Pick<NonNullable<Dropdown['territories']>[number], 'label' | 'value'>

export type Dropdowns = {
  territories: DropdownOption[]
  audienceTypes: DropdownOption[]
  industries: DropdownOption[]
}

const toOptions = (rows?: DropdownOption[] | null): DropdownOption[] =>
  (rows ?? []).map(({ label, value }) => ({ label, value }))

// Reads the published version only: without a user, the global's read access filters on _status.
export const getDropdowns = cache(async (): Promise<Dropdowns> => {
  const payload = await getPayload({ config })
  const doc = await payload.findGlobal({ slug: 'dropdowns', overrideAccess: false })

  return {
    territories: toOptions(doc.territories),
    audienceTypes: toOptions(doc.audienceTypes),
    industries: toOptions(doc.industries),
  }
})
