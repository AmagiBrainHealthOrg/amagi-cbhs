import type { Payload, PayloadRequest, RequiredDataFromCollectionSlug } from 'payload'

import {
  type SeedImages,
  seedFaqs,
  seedGlobals,
  seedNews,
  seedPages,
  seedPartners,
  seedTeam,
} from './content'

type Args = { payload: Payload; req?: PayloadRequest }

export type SeedResult = { created: string[]; skipped: string[] }

const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.values(value).every(isEmpty)
  return false
}

const idOf = (value: unknown): number | undefined => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value && typeof value.id === 'number') {
    return value.id
  }
  return undefined
}

// The header logo and hero photos already live on the Coming Soon global (SPEC §11.4).
export async function findImages({ payload, req }: Args): Promise<SeedImages> {
  const comingSoon = await payload.findGlobal({ slug: 'coming-soon', depth: 0, req })
  return {
    logo: idOf(comingSoon.logo),
    hero: (comingSoon.backgroundImages ?? []).map(idOf).filter((id) => id !== undefined),
  }
}

// Applies the launch content (SPEC §6.4), creating only what is missing: pages and news by
// slug, FAQs by question, and each global field only while it is empty. Editors' changes are
// never overwritten, so it is safe to run again.
export async function seedContent({ payload, req }: Args): Promise<SeedResult> {
  const result: SeedResult = { created: [], skipped: [] }
  const context = { disableRevalidate: true }
  const images = await findImages({ payload, req })

  const createMissing = async <S extends 'pages' | 'news' | 'faqs' | 'partners' | 'team'>(
    collection: S,
    docs: RequiredDataFromCollectionSlug<S>[],
    keyOf: (doc: RequiredDataFromCollectionSlug<S>) => { field: string; value: string },
  ) => {
    for (const data of docs) {
      const { field, value } = keyOf(data)
      const label = `${collection}:${value}`
      const { totalDocs } = await payload.count({
        collection,
        where: { [field]: { equals: value } },
        req,
      })
      if (totalDocs > 0) {
        result.skipped.push(label)
        continue
      }
      await payload.create({ collection, data: { ...data, _status: 'published' }, context, req })
      result.created.push(label)
    }
  }

  await createMissing('pages', seedPages(images), (doc) => ({ field: 'slug', value: doc.slug }))
  await createMissing('news', seedNews, (doc) => ({ field: 'slug', value: doc.slug }))
  await createMissing('faqs', seedFaqs, (doc) => ({ field: 'question', value: doc.question }))
  await createMissing('partners', seedPartners, (doc) => ({ field: 'name', value: doc.name }))
  await createMissing('team', seedTeam, (doc) => ({ field: 'name', value: doc.name }))

  const globals = seedGlobals(images)
  for (const slug of Object.keys(globals) as (keyof typeof globals)[]) {
    const current = new Map(Object.entries(await payload.findGlobal({ slug, depth: 0, req })))
    const missing = Object.fromEntries(
      Object.entries(globals[slug]).filter(
        ([field, value]) => !isEmpty(value) && isEmpty(current.get(field)),
      ),
    )
    const fields = Object.keys(missing)
    if (fields.length === 0) {
      result.skipped.push(`global:${slug}`)
      continue
    }
    await payload.updateGlobal({
      slug,
      data: { ...missing, _status: 'published' },
      context,
      req,
    })
    result.created.push(`global:${slug} (${fields.join(', ')})`)
  }

  return result
}
