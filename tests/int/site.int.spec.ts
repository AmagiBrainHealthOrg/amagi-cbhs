import { afterEach, describe, expect, it, vi } from 'vitest'

const loadIsLive = async () => {
  vi.resetModules()
  const { isLive } = await import('@/utils/site')
  return isLive
}

describe('isLive', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('is false when SITE_LIVE is unset', async () => {
    vi.stubEnv('SITE_LIVE', undefined)
    expect((await loadIsLive())()).toBe(false)
  })

  it('is true when SITE_LIVE is "true"', async () => {
    vi.stubEnv('SITE_LIVE', 'true')
    expect((await loadIsLive())()).toBe(true)
  })

  it.each(['', 'false', 'TRUE', '1', 'yes', ' true'])(
    'is false when SITE_LIVE is %j',
    async (value) => {
      vi.stubEnv('SITE_LIVE', value)
      expect((await loadIsLive())()).toBe(false)
    },
  )
})
