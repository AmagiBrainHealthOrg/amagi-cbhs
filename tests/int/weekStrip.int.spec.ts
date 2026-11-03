import { describe, expect, it } from 'vitest'

import { weekStrip } from '@/utils/weekStrip'

const days = [
  { day: '2026-11-22', label: 'Close' },
  { day: '2026-11-16', label: 'Anchor Day', body: 'The Summit opens' },
] as const

describe('week strip', () => {
  it('lists the global days in date order', () => {
    expect(weekStrip([...days], null).map((d) => [d.day, d.date, d.label])).toEqual([
      ['Mon', '16', 'Anchor Day'],
      ['Sun', '22', 'Close'],
    ])
  })

  it('highlights the day that matches the Anchor Day date', () => {
    const strip = weekStrip([...days], '2026-11-16T12:00:00.000Z')
    expect(strip.map((d) => d.anchor)).toEqual([true, false])
  })

  it('highlights nothing while the Anchor Day date is unset', () => {
    expect(weekStrip([...days], undefined).some((d) => d.anchor)).toBe(false)
  })
})
