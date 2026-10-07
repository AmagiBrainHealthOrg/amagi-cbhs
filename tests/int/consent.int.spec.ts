import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  CONSENT_EVENT,
  consentDefaultsScript,
  getConsent,
  hasAnalyticsConsent,
  parseConsent,
  setConsent,
} from '@/lib/consent'

const clearCookies = () => {
  for (const pair of document.cookie.split(';')) {
    const name = pair.split('=')[0].trim()
    if (name) document.cookie = `${name}=; Max-Age=0; Path=/`
  }
}

const runDefaults = () => {
  window.dataLayer = []
  delete window.gtag
  new Function(consentDefaultsScript)()
}

const commands = () => window.dataLayer.map((entry) => Array.from(entry as ArrayLike<unknown>))

describe('cookie consent', () => {
  beforeEach(() => {
    clearCookies()
    runDefaults()
  })

  it('parses only the two valid values', () => {
    expect(parseConsent('a=1; cbhs_consent=analytics')).toBe('analytics')
    expect(parseConsent('cbhs_consent=rejected; b=2')).toBe('rejected')
    expect(parseConsent('cbhs_consent=yes')).toBeNull()
    expect(parseConsent('xcbhs_consent=analytics')).toBeNull()
    expect(parseConsent('')).toBeNull()
  })

  it('pushes every Consent Mode type as denied before anything else', () => {
    const [first] = commands()
    expect(first.slice(0, 2)).toEqual(['consent', 'default'])
    const defaults = first[2] as Record<string, string>
    expect(Object.values(defaults).every((value) => value === 'denied')).toBe(true)
    expect(defaults).toMatchObject({ ad_storage: 'denied', analytics_storage: 'denied' })
    expect(commands()).toHaveLength(1)
  })

  it('grants analytics_storage only on accept, and announces the choice', () => {
    const listener = vi.fn()
    window.addEventListener(CONSENT_EVENT, listener)
    setConsent('analytics')
    window.removeEventListener(CONSENT_EVENT, listener)

    expect(getConsent()).toBe('analytics')
    expect(hasAnalyticsConsent()).toBe(true)
    expect(commands().at(-1)).toEqual(['consent', 'update', { analytics_storage: 'granted' }])
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toBe('analytics')
  })

  it('re-grants a returning visitor in the head script', () => {
    setConsent('analytics')
    runDefaults()
    expect(commands()).toHaveLength(2)
    expect(commands()[1]).toEqual(['consent', 'update', { analytics_storage: 'granted' }])
  })

  it('rejecting after accepting denies analytics and deletes _ga cookies', () => {
    setConsent('analytics')
    document.cookie = '_ga=GA1.1.1; Path=/'
    document.cookie = '_ga_ABC123=GS1.1.1; Path=/'
    document.cookie = 'keep=1; Path=/'
    setConsent('rejected')

    expect(getConsent()).toBe('rejected')
    expect(hasAnalyticsConsent()).toBe(false)
    expect(document.cookie).not.toMatch(/_ga/)
    expect(document.cookie).toMatch(/keep=1/)
    expect(commands().at(-1)).toEqual(['consent', 'update', { analytics_storage: 'denied' }])
  })
})
