import { beforeEach, describe, expect, it } from 'vitest'

import { captureUtm, getUtm, UTM_STORAGE_KEY } from '@/utils/utm'

describe('UTM capture', () => {
  beforeEach(() => sessionStorage.clear())

  it('stores the five utm_* values from the landing URL', () => {
    captureUtm('?utm_source=test&utm_campaign=c1&other=x', sessionStorage)
    expect(getUtm()).toEqual({
      utm_source: 'test',
      utm_medium: '',
      utm_campaign: 'c1',
      utm_term: '',
      utm_content: '',
    })
  })

  it('keeps the visit values when a later URL has no UTM parameters', () => {
    captureUtm('?utm_source=first', sessionStorage)
    captureUtm('?page=2', sessionStorage)
    expect(getUtm().utm_source).toBe('first')
  })

  it('returns empty values for missing or corrupted storage', () => {
    expect(getUtm().utm_source).toBe('')
    sessionStorage.setItem(UTM_STORAGE_KEY, '{not json')
    expect(getUtm().utm_campaign).toBe('')
  })
})
