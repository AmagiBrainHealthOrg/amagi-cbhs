import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { Button, destinationTypeFor } from '@/components/Button'

describe('Button', () => {
  it('carries the three tracking attributes', () => {
    const html = renderToStaticMarkup(
      Button({
        href: '/donate',
        variant: 'primary',
        journey: 'donate',
        action: 'donate',
        children: 'Donate',
      }),
    )
    expect(html).toContain('class="button button-orange"')
    expect(html).toContain('data-journey="donate"')
    expect(html).toContain('data-action="donate"')
    expect(html).toContain('data-destination-type="internal"')
  })

  it('classifies destinations from the href', () => {
    expect(destinationTypeFor('/about')).toBe('internal')
    expect(destinationTypeFor('#week')).toBe('internal')
    expect(destinationTypeFor('https://lu.ma/x')).toBe('external')
    expect(destinationTypeFor('mailto:info@example.org')).toBe('email')
  })
})
