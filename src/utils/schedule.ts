import { summitDays, type ThemeColour } from '@/config/summit'
import type { ScheduleBlock, Session, SessionLocation, SessionTheme } from '@/payload-types'

import { registrationRoutes, type RegistrationRoute, zonedToUtc, zoneLabel } from './sessions'

export type ScheduleDay = {
  value: string
  dow: string
  date: string
  note?: string
  highlight: boolean
  /** The "Date TBC" column, for sessions with no day yet. Always last. */
  tbc?: boolean
}
export type ScheduleLocation = {
  id: number
  name: string
  city?: string
  online: boolean
  timeZone: string
  zoneLabel: string
}
export type ScheduleTheme = { id: number; name: string; colour: ThemeColour }
export type ScheduleSession = {
  id: number
  title: string
  locationId: number
  themeId?: number
  /** Index into the days, in the location's zone. */
  day: number
  startTime?: string
  endTime?: string
  /** UTC instants, so online sessions can be shown in the visitor's zone. Unset while TBC. */
  start?: string
  end?: string
  venue?: string
  description?: string
  registration: RegistrationRoute[]
}
export type ScheduleData = {
  days: ScheduleDay[]
  locations: ScheduleLocation[]
  themes: ScheduleTheme[]
  sessions: ScheduleSession[]
}

const idOf = (value: number | { id: number } | null | undefined) =>
  value == null ? undefined : typeof value === 'number' ? value : value.id

export const TBC_DAY: ScheduleDay = { value: 'tbc', dow: 'Date', date: 'TBC', highlight: false, tbc: true }

// Same day, then timed sessions by start, then untimed ones, then title.
export const bySchedule = (a: ScheduleSession, b: ScheduleSession) =>
  a.day - b.day ||
  (a.start && b.start ? a.start.localeCompare(b.start) : a.start ? -1 : b.start ? 1 : 0) ||
  a.title.localeCompare(b.title)

// Plain data for the client schedule: sessions whose location is published, sorted by time.
export function buildSchedule(
  block: Pick<ScheduleBlock, 'dayNotes'>,
  locations: SessionLocation[],
  themes: SessionTheme[],
  sessions: Session[],
): ScheduleData {
  const notes = new Map((block.dayNotes ?? []).map((note) => [note.day, note]))
  const days = summitDays.map(({ value, label }): ScheduleDay => {
    const note = notes.get(value)
    return {
      value,
      dow: label.slice(0, 3),
      date: String(Number(value.slice(8))),
      note: note?.note || undefined,
      highlight: Boolean(note?.highlight),
    }
  })
  const byId = new Map(locations.map((location) => [location.id, location]))
  const themeIds = new Set(themes.map(({ id }) => id))

  if (sessions.some((session) => !session.day)) days.push(TBC_DAY)

  const list = sessions.flatMap((session): ScheduleSession[] => {
    const location = byId.get(idOf(session.location) ?? -1)
    const day = session.day
      ? days.findIndex(({ value }) => value === session.day)
      : days.indexOf(TBC_DAY)
    if (!location || day === -1) return []
    const themeId = idOf(session.theme)
    const zoned = (time?: string | null) =>
      session.day && session.startTime && time
        ? zonedToUtc(session.day, time, location.timeZone)
        : undefined
    return [
      {
        id: session.id,
        title: session.title,
        locationId: location.id,
        themeId: themeId !== undefined && themeIds.has(themeId) ? themeId : undefined,
        day,
        startTime: session.startTime || undefined,
        endTime: (session.startTime && session.endTime) || undefined,
        start: zoned(session.startTime),
        end: zoned(session.endTime),
        venue: location.online ? undefined : session.venue || undefined,
        description: session.description || undefined,
        registration: registrationRoutes(session, location),
      },
    ]
  })
  list.sort(bySchedule)

  return {
    days,
    locations: locations.map((location) => ({
      id: location.id,
      name: location.name,
      city: location.city || undefined,
      online: Boolean(location.online),
      timeZone: location.timeZone,
      zoneLabel: zoneLabel(location.name, location.timeZone),
    })),
    themes: themes.map(({ id, name, colour }) => ({ id, name, colour })),
    sessions: list,
  }
}
