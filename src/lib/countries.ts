import 'server-only'

import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'

// Published countries, in order. Pages that only link to them read this.
export const getCountries = cache(async () => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'countries',
    sort: ['order', 'name'],
    depth: 0,
    pagination: false,
    overrideAccess: false,
  })
  return docs
})

const locationId = (location: number | { id: number }) =>
  typeof location === 'number' ? location : location.id

export const countryHref = (slug: string) => `/countries/${slug}`

// Country page links by session location id, for the schedule and session pages. A failure
// is logged and leaves the links out rather than breaking the page.
export async function countryHrefsByLocation(): Promise<Map<number, string>> {
  try {
    const countries = await getCountries()
    return new Map(countries.map(({ location, slug }) => [locationId(location), countryHref(slug)]))
  } catch (error) {
    console.error('Could not load the country pages for links', error)
    return new Map()
  }
}
