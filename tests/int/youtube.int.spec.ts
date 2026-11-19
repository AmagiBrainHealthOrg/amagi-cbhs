import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { youTubeId } from '@/utils/youtube'

const ID = 'dQw4w9WgXcQ'

describe('youTubeId', () => {
  it.each([
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtube.com/watch?v=${ID}&t=42s`,
    `https://m.youtube.com/watch?feature=share&v=${ID}`,
    `https://youtu.be/${ID}`,
    `https://youtu.be/${ID}?si=abc123`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/live/${ID}?si=abc`,
    `https://www.youtube-nocookie.com/embed/${ID}`,
    `youtube.com/watch?v=${ID}`,
    `  ${ID}  `,
  ])('reads the ID from %s', (link) => {
    expect(youTubeId(link)).toBe(ID)
  })

  it.each([
    `https://vimeo.com/123456789`,
    `https://example.com/watch?v=${ID}`,
    `https://youtube.com.evil.com/watch?v=${ID}`,
    'https://www.youtube.com/@amagihealthltd',
    'https://www.youtube.com/watch?v=short',
    'not a link',
    '',
  ])('rejects %s', (link) => {
    expect(youTubeId(link)).toBeUndefined()
  })
})

describe('Session YouTube video field', () => {
  const prefix = 'youtube-int'
  let payload: Payload
  let location: number

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    location = (
      await payload.create({
        collection: 'session-locations',
        data: { name: `${prefix} location`, timeZone: 'America/Cayman', _status: 'published' },
      })
    ).id
  })

  afterAll(async () => {
    await payload.delete({ collection: 'sessions', where: { slug: { like: prefix } } })
    await payload.delete({ collection: 'session-locations', where: { name: { like: prefix } } })
  })

  it('keeps only the video ID', async () => {
    const session = await payload.create({
      collection: 'sessions',
      data: {
        title: `${prefix} relay`,
        slug: '',
        location,
        youtubeVideo: `https://youtu.be/${ID}?si=x`,
      },
    })
    expect(session.youtubeVideo).toBe(ID)
  })

  it('rejects links that are not from YouTube', async () => {
    await expect(
      payload.create({
        collection: 'sessions',
        data: {
          title: `${prefix} vimeo`,
          slug: '',
          location,
          youtubeVideo: 'https://vimeo.com/123',
        },
      }),
    ).rejects.toThrow(/YouTube/)
  })
})
