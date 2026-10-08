import 'server-only'

import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'

export type PlausibleSettings = { domain: string; endpoint?: string }

// The integrations global is admin-only, but these settings aren't secret: they ship in the page
// either way. Null (no domain) turns analytics off; no host means plausible.io.
export const getPlausibleSettings = cache(async (): Promise<PlausibleSettings | null> => {
  const payload = await getPayload({ config })
  const { plausibleDomain, plausibleHost } = await payload.findGlobal({
    slug: 'integrations',
    select: { plausibleDomain: true, plausibleHost: true },
    overrideAccess: true,
  })
  if (!plausibleDomain) return null
  return {
    domain: plausibleDomain,
    endpoint: plausibleHost ? `${plausibleHost}/api/event` : undefined,
  }
})
