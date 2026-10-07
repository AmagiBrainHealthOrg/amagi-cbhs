import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { getDropdowns } from '@/lib/dropdowns'
import config from '@/payload.config'
import type { Dropdown } from '@/payload-types'

let payload: Payload
let original: Dropdown

const published = {
  territories: [{ label: 'Jamaica', value: 'jamaica' }],
  audienceTypes: [
    { label: 'Country lead', value: 'country_lead' },
    { label: 'General public', value: 'general_public' },
  ],
  industries: [{ label: 'Health care', value: 'health_care' }],
}

describe('getDropdowns', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    original = await payload.findGlobal({ slug: 'dropdowns' })
    await payload.updateGlobal({
      slug: 'dropdowns',
      data: { ...published, _status: 'published' },
    })
  })

  afterAll(async () => {
    await payload.updateGlobal({
      slug: 'dropdowns',
      data: {
        territories: original.territories ?? [],
        audienceTypes: original.audienceTypes ?? [],
        industries: original.industries ?? [],
        _status: original._status ?? 'draft',
      },
    })
  })

  it('returns the published options as { label, value } arrays', async () => {
    await expect(getDropdowns()).resolves.toStrictEqual(published)
  })

  it('ignores unpublished draft changes', async () => {
    await payload.updateGlobal({
      slug: 'dropdowns',
      draft: true,
      data: { territories: [{ label: 'Draft only', value: 'draft_only' }] },
    })

    const { territories } = await getDropdowns()
    expect(territories).toStrictEqual(published.territories)
  })

  it('returns empty arrays when the global is unpublished', async () => {
    await payload.updateGlobal({
      slug: 'dropdowns',
      data: { ...published, _status: 'draft' },
    })

    await expect(getDropdowns()).resolves.toStrictEqual({
      territories: [],
      audienceTypes: [],
      industries: [],
    })
  })
})
