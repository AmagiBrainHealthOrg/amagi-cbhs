import { summitDays } from '@/config/summit'
import type { SummitWeek } from '@/payload-types'

export type WeekStripDay = {
  day: string
  date: string
  label: string
  body?: string | null
  anchor: boolean
}

// The Summit Week Days global as the week strip, in date order, with the Anchor Day highlighted
// from the Anchor Day global's date.
export function weekStrip(
  days: SummitWeek['days'],
  anchorDate: string | null | undefined,
): WeekStripDay[] {
  const anchor = anchorDate?.slice(0, 10)
  return summitDays.flatMap(({ value, label: dayLabel }) => {
    const entry = (days ?? []).find((d) => d.day === value)
    if (!entry) return []
    return [
      {
        day: dayLabel.slice(0, 3),
        date: String(Number(value.slice(8))),
        label: entry.label,
        body: entry.body,
        anchor: value === anchor,
      },
    ]
  })
}
