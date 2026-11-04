import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { SessionDescription } from '@/components/SessionDescription'

import { blockFormOptions } from '@/config/forms'
import { formRegistry } from '@/forms/registry'
import type { Session, SessionLocation, SessionTheme } from '@/payload-types'
import { buildSchedule } from '@/utils/schedule'
import { registrationRoutes, sessionSummary, whenLabel, zonedToUtc, zoneLabel } from '@/utils/sessions'

const stamp = '2026-11-01T00:00:00.000Z'
const location = (id: number, name: string, extra: Partial<SessionLocation> = {}) =>
  ({
    id,
    name,
    timeZone: 'America/Jamaica',
    updatedAt: stamp,
    createdAt: stamp,
    ...extra,
  }) as SessionLocation
const theme = {
  id: 1,
  name: 'Policy',
  colour: 'green',
  updatedAt: stamp,
  createdAt: stamp,
} as SessionTheme
const session = (id: number, extra: Partial<Session>) =>
  ({
    id,
    title: `Session ${id}`,
    slug: `session-${id}`,
    location: 1,
    day: '2026-11-16',
    startTime: '10:00',
    updatedAt: stamp,
    createdAt: stamp,
    ...extra,
  }) as Session

describe('session times', () => {
  it('turns local wall-clock times into UTC instants', () => {
    expect(zonedToUtc('2026-11-16', '10:00', 'America/Jamaica')).toBe('2026-11-16T15:00:00.000Z')
    expect(zonedToUtc('2026-11-19', '09:00', 'America/Barbados')).toBe('2026-11-19T13:00:00.000Z')
    expect(zonedToUtc('2026-11-22', '23:30', 'America/Paramaribo')).toBe('2026-11-23T02:30:00.000Z')
  })

  it('labels a zone by its Summit-week offset', () => {
    expect(zoneLabel('Jamaica', 'America/Jamaica')).toBe('Jamaica time (UTC−5)')
    expect(zoneLabel('Barbados', 'America/Barbados')).toBe('Barbados time (UTC−4)')
  })

  it('summarises a session for Airtable and the confirmation email', () => {
    expect(
      sessionSummary({
        title: 'Anchor Day plenary',
        day: '2026-11-19',
        startTime: '09:00',
        endTime: '10:30',
        venue: 'Main hall',
        locationName: 'Jamaica',
      }),
    ).toBe('Anchor Day plenary · Thursday 19 November, 09:00–10:30 · Main hall, Jamaica')
  })

  it('says what is still to be confirmed', () => {
    expect(whenLabel({ day: '2026-11-19' })).toBe('Thursday 19 November, time to be confirmed')
    expect(whenLabel({ startTime: '16:00' })).toBe('Date to be confirmed, 16:00')
    expect(whenLabel({})).toBe('Date and time to be confirmed')
  })
})

describe('schedule data', () => {
  const locations = [location(1, 'Jamaica'), location(2, 'Online', { online: true })]

  it('links in-person sessions to their page and online ones to Zoom', () => {
    const { sessions } = buildSchedule(
      {},
      locations,
      [theme],
      [
        session(1, { theme: 1, venue: 'Main hall' }),
        session(2, {
          location: 2,
          zoomUrl: 'https://zoom.us/meeting/register/x',
          venue: 'Ignored',
        }),
        session(3, { location: 2 }),
        session(4, { registrationOpen: false }),
      ],
    )
    const byId = Object.fromEntries(sessions.map((s) => [s.id, s]))
    expect(byId[1].registration).toEqual([{ href: '/sessions/session-1', external: false }])
    expect(byId[1].themeId).toBe(1)
    expect(byId[1].venue).toBe('Main hall')
    expect(byId[2].registration).toEqual([
      { href: 'https://zoom.us/meeting/register/x', external: true },
    ])
    expect(byId[2].venue).toBeUndefined()
    expect(byId[3].registration).toEqual([])
    expect(byId[4].registration).toEqual([])
  })

  it('links the email address and partner form in a description', () => {
    const html = renderToStaticMarkup(
      React.createElement(SessionDescription, {
        text: 'Contact info@amagibrainhealth.org or complete the partner form.',
      }),
    )
    expect(html).toContain('<a href="mailto:info@amagibrainhealth.org">info@amagibrainhealth.org</a>')
    expect(html).toContain('<a href="/partner#partner-form">partner form</a>')
    expect(html).toMatch(/^Contact <a/)
    expect(html).toMatch(/form<\/a>\.$/)
  })

  it('passes each session description to the card', () => {
    const { sessions } = buildSchedule(
      {},
      locations,
      [],
      [session(1, { description: 'Attendance is by invitation.' }), session(2, {})],
    )
    expect(sessions.map((s) => s.description)).toEqual(['Attendance is by invitation.', undefined])
  })

  it('offers every way to register on a hybrid session', () => {
    const hybrid = session(1, {
      zoomUrl: 'https://zoom.us/ignored',
      registrationOptions: [
        { label: 'Attend in person', method: 'form' },
        { label: 'Join online', method: 'link', url: 'https://zoom.us/meeting/register/x' },
      ],
    })
    const routes = [
      { label: 'Attend in person', href: '/sessions/session-1', external: false },
      { label: 'Join online', href: 'https://zoom.us/meeting/register/x', external: true },
    ]
    expect(registrationRoutes(hybrid, { online: false })).toEqual(routes)
    expect(registrationRoutes(hybrid, { online: true })).toEqual(routes)
    expect(registrationRoutes({ ...hybrid, registrationOpen: false }, { online: false })).toEqual([])
  })

  it('drops sessions whose location is not published and sorts by time', () => {
    const { sessions } = buildSchedule(
      {},
      locations,
      [],
      [
        session(1, { startTime: '15:00' }),
        session(2, { startTime: '09:00' }),
        session(3, { location: 99 }),
      ],
    )
    expect(sessions.map((s) => s.id)).toEqual([2, 1])
  })

  it('shows the seven days with their notes', () => {
    const { days } = buildSchedule(
      { dayNotes: [{ day: '2026-11-19', note: 'Anchor Day', highlight: true }] },
      locations,
      [],
      [],
    )
    expect(days).toHaveLength(7)
    expect(days[0]).toMatchObject({ dow: 'Mon', date: '16', highlight: false })
    expect(days[3]).toMatchObject({ dow: 'Thu', date: '19', note: 'Anchor Day', highlight: true })
  })

  it('puts sessions with no day in a Date TBC column after Sunday', () => {
    const { days, sessions } = buildSchedule(
      {},
      locations,
      [],
      [session(1, { day: null, startTime: null }), session(2, {})],
    )
    expect(days).toHaveLength(8)
    expect(days[7]).toMatchObject({ dow: 'Date', date: 'TBC', tbc: true })
    expect(sessions.map((s) => [s.id, s.day])).toEqual([
      [2, 0],
      [1, 7],
    ])
  })

  it('lists sessions with no time after the timed ones that day', () => {
    const { sessions } = buildSchedule(
      {},
      locations,
      [],
      [
        session(1, { startTime: null, endTime: '12:00', title: 'A' }),
        session(2, { startTime: '15:00' }),
      ],
    )
    expect(sessions.map((s) => s.id)).toEqual([2, 1])
    expect(sessions[1]).toMatchObject({ start: undefined, startTime: undefined, endTime: undefined })
  })
})

describe('session registration form', () => {
  it('asks name, country, organisation and email, with phone optional', () => {
    const fields = formRegistry['session-registration'].fields
    expect(fields.map((f) => [f.name, Boolean(f.required)])).toEqual([
      ['name', true],
      ['location', true],
      ['organisation', true],
      ['email', true],
      ['phone', false],
    ])
  })

  it('is not offered to the form block, which has no session', () => {
    expect(blockFormOptions.map(({ value }) => value)).not.toContain('session-registration')
  })
})
