import type { Payload, PayloadRequest } from 'payload'

import { slugify } from '@/fields/slug'

import { seedSessions, seedThemes } from './programme'

type Args = { payload: Payload; req?: PayloadRequest }

// Two sessions can share a title, so later ones get "-2", "-3" in list order.
const slugs = () => {
  const seen = new Map<string, number>()
  return seedSessions.map(({ title, slug }) => {
    const base = slug ?? slugify(title)
    const count = (seen.get(base) ?? 0) + 1
    seen.set(base, count)
    return count === 1 ? base : `${base}-${count}`
  })
}

const idsByName = async (
  { payload, req }: Args,
  collection: 'session-locations' | 'session-themes',
) => {
  const { docs } = await payload.find({
    collection,
    pagination: false,
    depth: 0,
    draft: true,
    req,
  })
  return new Map(docs.map((doc) => [doc.name, doc.id]))
}

// Creates the themes and sessions that are missing, by theme name and session slug. Never
// updates an existing record, so editors' changes are kept.
export async function seedProgramme(args: Args): Promise<string[]> {
  const { payload, req } = args
  const created: string[] = []

  const themeIds = await idsByName(args, 'session-themes')
  for (const [order, { name, colour }] of seedThemes.entries()) {
    if (themeIds.has(name)) continue
    const theme = await payload.create({
      collection: 'session-themes',
      data: { name, colour, order, _status: 'published' },
      context: { disableRevalidate: true },
      req,
    })
    themeIds.set(name, theme.id)
    created.push(`session-themes:${name}`)
  }

  const locationIds = await idsByName(args, 'session-locations')
  const { docs } = await payload.find({
    collection: 'sessions',
    pagination: false,
    depth: 0,
    draft: true,
    select: { slug: true },
    req,
  })
  const existing = new Set(docs.map(({ slug }) => slug))

  for (const [index, slug] of slugs().entries()) {
    if (existing.has(slug)) continue
    const { location, theme, published = true, ...rest } = seedSessions[index]
    const locationId = locationIds.get(location)
    if (locationId === undefined) {
      throw new Error(`Programme session "${rest.title}" has an unknown location "${location}"`)
    }
    await payload.create({
      collection: 'sessions',
      data: {
        ...rest,
        slug,
        location: locationId,
        theme: theme ? themeIds.get(theme) : undefined,
        _status: published ? 'published' : 'draft',
      },
      draft: !published,
      context: { disableRevalidate: true },
      req,
    })
    created.push(`sessions:${slug}`)
  }

  return created
}
