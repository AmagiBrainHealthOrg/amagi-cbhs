import { summitDays } from '@/config/summit'
import type { Session } from '@/payload-types'

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

type When = { day?: string | null; startTime?: string | null; endTime?: string | null }

const clock = (instant: string, timeZone: string) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(instant))

// A session's day and times entered in `from`, as they read in `to`.
export function inZone<T extends When>(session: T, from: string, to: string): T {
  const { day, startTime, endTime } = session
  if (!day || !startTime || from === to) return session
  const start = zonedToUtc(day, startTime, from)
  return {
    ...session,
    day: new Intl.DateTimeFormat('en-CA', { timeZone: to }).format(new Date(start)),
    startTime: clock(start, to),
    endTime: endTime ? clock(zonedToUtc(day, endTime, from), to) : endTime,
  }
}

// "Monday 16 November, 09:00–11:30", with "to be confirmed" for a missing day or time.
export function whenLabel({ day, startTime, endTime }: When): string {
  if (!day && !startTime) return 'Date and time to be confirmed'
  return [
    day ? dayLabel(day) : 'Date to be confirmed',
    startTime ? timeRange(startTime, endTime) : 'time to be confirmed',
  ].join(', ')
}

// How a registration names its session in Airtable and the confirmation email.
export const sessionSummary = (
  session: When & { title: string; venue?: string | null; locationName: string },
) =>
  [
    session.title,
    whenLabel(session),
    session.venue ? `${session.venue}, ${session.locationName}` : session.locationName,
  ].join(' · ')

export type RegistrationRoute = { label?: string; href: string; external: boolean }

// The ways to register: the session's own options, or else the default for its location (the
// form on its page in person, Zoom online). A route with no label takes the caller's default.
export function registrationRoutes(
  session: Pick<Session, 'slug' | 'zoomUrl' | 'registrationOpen' | 'registrationOptions'>,
  location: { online?: boolean | null },
): RegistrationRoute[] {
  if (session.registrationOpen === false) return []
  const form = `/sessions/${session.slug}`
  if (session.registrationOptions?.length) {
    return session.registrationOptions.flatMap(({ label, method, url }): RegistrationRoute[] => {
      if (method === 'form') return [{ label, href: form, external: false }]
      return url ? [{ label, href: url, external: true }] : []
    })
  }
  if (location.online) {
    return session.zoomUrl ? [{ href: session.zoomUrl, external: true }] : []
  }
  return [{ href: form, external: false }]
}
