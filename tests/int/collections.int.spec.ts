import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { slugify } from '@/fields/slug'

let payload: Payload

const prefix = 't007-int'

describe('Core collections', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    await payload.delete({ collection: 'news', where: { slug: { like: prefix } } })
    await payload.delete({ collection: 'pages', where: { slug: { like: prefix } } })
    await payload.delete({ collection: 'partners', where: { name: { like: prefix } } })
    await payload.delete({ collection: 'supporters', where: { name: { like: prefix } } })
  })

  it('slugifies titles', () => {
    expect(slugify('Summit dates announced: 16–22 November 2026')).toBe(
      'summit-dates-announced-16-22-november-2026',
    )
    expect(slugify('  Café & Côte  ')).toBe('cafe-cote')
  })

  it('generates the slug from the title and publishes outside Next.js without throwing', async () => {
    const page = await payload.create({
      collection: 'pages',
      data: { title: `${prefix} Generated Slug`, slug: '', _status: 'published' },
    })
    expect(page.slug).toBe(`${prefix}-generated-slug`)
  })

  it('requires a partner on partner announcements', async () => {
    const base = {
      title: `${prefix} announcement`,
      slug: '',
      publishedDate: '2026-10-01T00:00:00.000Z',
      summary: 'Summary',
      type: 'partner-announcement' as const,
      _status: 'published' as const,
    }
    await expect(payload.create({ collection: 'news', data: base })).rejects.toThrow(/partner/i)

    const partner = await payload.create({
      collection: 'partners',
      data: { name: `${prefix} partner` },
    })
    const news = await payload.create({
      collection: 'news',
      data: { ...base, partner: partner.id },
    })
    expect(news.partner).toMatchObject({ id: partner.id })
  })

  it('hides unpermitted supporters from anonymous reads', async () => {
    await payload.create({
      collection: 'supporters',
      data: { name: `${prefix} hidden`, _status: 'published' },
    })
    await payload.create({
      collection: 'supporters',
      data: { name: `${prefix} shown`, permissionConfirmed: true, _status: 'published' },
    })
    const { docs } = await payload.find({
      collection: 'supporters',
      where: { name: { like: prefix } },
      overrideAccess: false,
    })
    expect(docs.map(({ name }) => name)).toEqual([`${prefix} shown`])
  })
})
