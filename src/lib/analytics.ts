import 'server-only'

import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'

// The integrations global is admin-only, but the Plausible domain isn't secret: it ships in the
// page either way. Null turns analytics off.
export const getPlausibleDomain = cache(async () => {
  const payload = await getPayload({ config })
  const { plausibleDomain } = await payload.findGlobal({
    slug: 'integrations',
    select: { plausibleDomain: true },
    overrideAccess: true,
  })
  return plausibleDomain || null
})
