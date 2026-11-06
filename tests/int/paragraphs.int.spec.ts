import { describe, expect, it } from 'vitest'

import { parseLinks, splitParagraphs } from '@/utils/paragraphs'

describe('plain-text CMS copy', () => {
  it('splits paragraphs on blank lines', () => {
    expect(splitParagraphs('One.\n\nTwo.\n \nThree.')).toEqual(['One.', 'Two.', 'Three.'])
    expect(splitParagraphs(null)).toEqual([])
  })

  it('links site paths and leaves everything else as text', () => {
    expect(parseLinks('See the [Relay](/relay) page.')).toEqual([
      'See the ',
      { label: 'Relay', href: '/relay' },
      ' page.',
    ])
    expect(parseLinks('[a](https://evil.test) [b](//evil.test)')).toEqual([
      '[a](https://evil.test) [b](//evil.test)',
    ])
  })
})
