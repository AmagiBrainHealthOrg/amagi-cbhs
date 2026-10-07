import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { seedContent } from '@/seed'
import { seedFaqs, seedGlobals, seedNews, seedPages } from '@/seed/content'

let payload: Payload
let aboutTitle: string | undefined

describe('Launch content seed', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    await seedContent({ payload })
  })

  afterAll(async () => {
    if (aboutTitle === undefined) return
    await payload.update({
      collection: 'pages',
      where: { slug: { equals: 'about' } },
      data: { title: aboutTitle },
      context: { disableRevalidate: true },
    })
  })

  it('creates nothing on a second run', async () => {
    const before = await payload.count({ collection: 'pages' })
    const { created } = await seedContent({ payload })
    expect(created).toEqual([])
    expect((await payload.count({ collection: 'pages' })).totalDocs).toBe(before.totalDocs)
  })

  it('keeps editors’ changes and only recreates missing documents', async () => {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'about' } },
      limit: 1,
    })
    aboutTitle = docs[0].title
    await payload.update({
      collection: 'pages',
      id: docs[0].id,
      data: { title: 'About (edited)' },
      context: { disableRevalidate: true },
    })
    const question = seedFaqs[0].question
    await payload.delete({
      collection: 'faqs',
      where: { question: { equals: question } },
      context: { disableRevalidate: true },
    })

    const { created } = await seedContent({ payload })

    expect(created).toEqual([`faqs:${question}`])
    const about = await payload.findByID({ collection: 'pages', id: docs[0].id })
    expect(about.title).toBe('About (edited)')
  })

  it('uses no forbidden wording', () => {
    const content = JSON.stringify([
      seedPages({ hero: [] }),
      seedNews,
      seedFaqs,
      seedGlobals({ hero: [] }),
    ])
    expect(content).not.toMatch(/sponsor|exhibitor|lead generation/i)
  })
})
