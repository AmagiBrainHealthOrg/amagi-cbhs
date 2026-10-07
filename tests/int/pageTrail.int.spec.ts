import { beforeEach, describe, expect, it } from 'vitest'

import { PAGE_TRAIL_KEY, pageBefore, recordPage } from '@/utils/pageTrail'

describe('page trail', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('names the previous page once the current page is recorded', () => {
    recordPage('/about', sessionStorage)
    recordPage('/donate', sessionStorage)
    expect(pageBefore('/donate', sessionStorage)).toBe('/about')
  })

  it('names the last recorded page when the current page is not recorded yet', () => {
    recordPage('/about', sessionStorage)
    expect(pageBefore('/donate', sessionStorage)).toBe('/about')
  })

  it('ignores repeat visits to the same page', () => {
    recordPage('/about', sessionStorage)
    recordPage('/donate', sessionStorage)
    recordPage('/donate', sessionStorage)
    expect(pageBefore('/donate', sessionStorage)).toBe('/about')
  })

  it('returns an empty string for a landing page or corrupted storage', () => {
    expect(pageBefore('/donate', sessionStorage)).toBe('')
    sessionStorage.setItem(PAGE_TRAIL_KEY, '{not json')
    expect(pageBefore('/donate', sessionStorage)).toBe('')
  })
})
