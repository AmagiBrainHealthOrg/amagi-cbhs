import { summitDays } from '@/config/summit'

const offsetMinutes = (instant: Date, timeZone: string) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
      .formatToParts(instant)
      .map(({ type, value }) => [type, value]),
  )
  const local = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
  )
  return (local - instant.getTime()) / 60_000
}

// The instant a wall-clock time in `timeZone` falls on, as an ISO string.
export function zonedToUtc(day: string, time: string, timeZone: string): string {
  const [year, month, date] = day.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  const naive = Date.UTC(year, month - 1, date, hour, minute)
  const offset = offsetMinutes(new Date(naive), timeZone)
  return new Date(naive - offset * 60_000).toISOString()
}

export const dayLabel = (day: string) => summitDays.find(({ value }) => value === day)?.label ?? day

export const timeRange = (start: string, end?: string | null) => (end ? `${start}–${end}` : start)

// "Jamaica time (UTC−5)", from the zone's offset during Summit week.
export function zoneLabel(name: string, timeZone: string): string {
  const minutes = offsetMinutes(new Date(Date.UTC(2026, 10, 16, 12)), timeZone)
  const sign = minutes < 0 ? '−' : '+'
  const hours = Math.abs(minutes) / 60
  return `${name} time (UTC${sign}${Number.isInteger(hours) ? hours : hours.toFixed(1)})`
}

// How a registration names its session in Airtable and the confirmation email.
export const sessionSummary = (session: {
  title: string
  day: string
  startTime: string
  endTime?: string | null
  venue?: string | null
  locationName: string
}) =>
  [
    session.title,
    `${dayLabel(session.day)}, ${timeRange(session.startTime, session.endTime)}`,
    session.venue ? `${session.venue}, ${session.locationName}` : session.locationName,
  ].join(' · ')
