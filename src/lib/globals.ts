import { type DataFromGlobalSlug, type GlobalSlug, getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'

const findPublished = cache(async (slug: GlobalSlug) => {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug, depth: 1, overrideAccess: false })
})

// Published version only (SPEC §5): without a user, read access filters on _status. An empty
// global comes back with null fields, which the components treat as "render nothing".
export const getGlobal = <S extends GlobalSlug>(slug: S) =>
  findPublished(slug) as Promise<DataFromGlobalSlug<S>>
