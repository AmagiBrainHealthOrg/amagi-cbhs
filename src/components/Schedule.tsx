'use client'

import Link from 'next/link'
import React, { useMemo, useRef, useState, useSyncExternalStore } from 'react'

import {
  bySchedule,
  type ScheduleData,
  type ScheduleLocation,
  type ScheduleSession,
} from '@/utils/schedule'

type Tab = 'overview' | number

const OVERVIEW_PREVIEW = 2

const plural = (count: number) => `${count} ${count === 1 ? 'session' : 'sessions'}`

// Online sessions show in the visitor's zone, known only in the browser. The server and the
// first client render use the location's own zone, so hydration matches.
const noSubscription = () => () => {}

function useVisitorZone() {
  return useSyncExternalStore(
    noSubscription,
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    () => undefined,
  )
}

const columns = (count: number) => ({ '--days': count }) as React.CSSProperties

function localise(session: ScheduleSession, zone: string, days: ScheduleData['days']) {
  if (!session.start) return session
  const week = days.filter(({ tbc }) => !tbc)
  const time = (iso: string) =>
    new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit' }).format(
      new Date(iso),
    )
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: zone }).format(new Date(session.start))
  const index = week.findIndex(({ value }) => value === date)
  return {
    ...session,
    startTime: time(session.start),
    endTime: session.end ? time(session.end) : undefined,
    // A session that falls just outside the week in the visitor's zone stays on its nearest day.
    day: index === -1 ? (date < week[0].value ? 0 : week.length - 1) : index,
  }
}

export function Schedule({ data }: { data: ScheduleData }) {
  const { days, locations, themes } = data
  const [tab, setTab] = useState<Tab>('overview')
  const [theme, setTheme] = useState<number | null>(null)
  const [day, setDay] = useState(() =>
    Math.max(
      0,
      days.findIndex(({ highlight }) => highlight),
    ),
  )
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const top = useRef<HTMLDivElement>(null)
  const visitorZone = useVisitorZone()

  const online = useMemo(
    () => new Set(locations.filter((l) => l.online).map((l) => l.id)),
    [locations],
  )
  const sessions = useMemo(() => {
    return data.sessions
      .filter((s) => theme === null || s.themeId === theme)
      .map((s) => (visitorZone && online.has(s.locationId) ? localise(s, visitorZone, days) : s))
  }, [data.sessions, online, days, theme, visitorZone])

  const themeOf = (session: ScheduleSession) => themes.find(({ id }) => id === session.themeId)
  const at = (locationId: number, index: number) =>
    sessions.filter((s) => s.locationId === locationId && s.day === index).sort(bySchedule)
  // A location's "Date TBC" column shows only when it has sessions there, or is picked on mobile.
  const shows = (locationId: number, index: number) =>
    !days[index].tbc || index === day || at(locationId, index).length > 0
  const location = locations.find(({ id }) => id === tab)

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    ...locations.map(({ id, name }) => ({ id, label: name })),
  ]
  // From the overview: show the location's tab and bring the top of the schedule into view.
  const open = (id: number) => {
    setTab(id)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    tabRefs.current[tabs.findIndex((t) => t.id === id)]?.focus({ preventScroll: true })
    top.current?.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
  }
  const onTabKey = (event: React.KeyboardEvent, index: number) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = (index + step + tabs.length) % tabs.length
    setTab(tabs[next].id)
    tabRefs.current[next]?.focus()
  }

  const zoneNote = (place: ScheduleLocation) =>
    place.online && visitorZone
      ? `Times are shown in your time zone (${visitorZone.replace(/_/g, ' ')}).`
      : `Times are in ${place.zoneLabel}.`

  const card = (session: ScheduleSession) => {
    const sessionTheme = themeOf(session)
    return (
      <li key={session.id} className="schedule-card">
        {sessionTheme && (
          <span className={`schedule-theme schedule-theme-${sessionTheme.colour}`}>
            {sessionTheme.name}
          </span>
        )}
        <span className="schedule-time">
          {!session.startTime
            ? 'Time TBC'
            : session.endTime
              ? `${session.startTime}–${session.endTime}`
              : session.startTime}
        </span>
        <h4>{session.title}</h4>
        {!online.has(session.locationId) && (
          <p className="schedule-venue">{session.venue ?? 'Venue TBC'}</p>
        )}
        {session.register &&
          (session.register.external ? (
            <a
              className="button button-outline schedule-register"
              href={session.register.href}
              target="_blank"
              rel="noopener noreferrer"
              data-journey="session_registration"
              data-action="register_online"
              data-destination-type="external"
            >
              Register<span className="v1-sr-only">: {session.title} (opens Zoom)</span>
            </a>
          ) : (
            <Link
              className="button button-outline schedule-register"
              href={session.register.href}
              data-journey="session_registration"
              data-action="register_in_person"
              data-destination-type="internal"
            >
              Register<span className="v1-sr-only">: {session.title}</span>
            </Link>
          ))}
      </li>
    )
  }

  const dayHeading = (index: number) => (
    <>
      <span className="schedule-dow">{days[index].dow}</span>
      <span className="schedule-date">{days[index].date}</span>
      {days[index].note && <span className="schedule-note">{days[index].note}</span>}
    </>
  )

  return (
    <div ref={top} className="schedule" style={columns(days.length)}>
      <div className="schedule-tabs" role="tablist" aria-label="Locations">
        {tabs.map(({ id, label }, index) => (
          <button
            key={id}
            ref={(element) => {
              tabRefs.current[index] = element
            }}
            type="button"
            role="tab"
            id={`schedule-tab-${id}`}
            aria-selected={tab === id}
            aria-controls="schedule-panel"
            tabIndex={tab === id ? 0 : -1}
            onClick={() => setTab(id)}
            onKeyDown={(event) => onTabKey(event, index)}
          >
            {label}
          </button>
        ))}
      </div>

      {themes.length > 0 && (
        <div className="schedule-themes" role="group" aria-label="Filter by theme">
          {themes.map(({ id, name, colour }) => (
            <button
              key={id}
              type="button"
              className={`schedule-theme schedule-theme-${colour}`}
              aria-pressed={theme === id}
              onClick={() => setTheme(theme === id ? null : id)}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <div className="schedule-days" role="group" aria-label="Day">
        {days.map((d, index) => (
          <button
            key={d.value}
            type="button"
            aria-pressed={day === index}
            className={
              [d.highlight && 'schedule-day-highlight', d.tbc && 'schedule-day-tbc']
                .filter(Boolean)
                .join(' ') || undefined
            }
            onClick={() => setDay(index)}
          >
            <span className="schedule-dow">{d.dow}</span>
            <span className="schedule-date">{d.date}</span>
          </button>
        ))}
      </div>

      <div
        id="schedule-panel"
        className="schedule-panel"
        role="tabpanel"
        aria-labelledby={`schedule-tab-${tab}`}
      >
        {location ? (
          <>
            <header className="schedule-location">
              <h3>{location.name}</h3>
              {location.city && <span>{location.city}</span>}
              <p>{zoneNote(location)}</p>
            </header>
            <div
              className="schedule-week"
              style={columns(days.filter((d, index) => shows(location.id, index)).length)}
            >
              {days.map((d, index) => {
                const list = at(location.id, index)
                if (!shows(location.id, index)) return null
                return (
                  <section
                    key={d.value}
                    className={[
                      'schedule-column',
                      index === day && 'schedule-column-current',
                      d.highlight && 'schedule-column-highlight',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-label={`${d.dow} ${d.date}`}
                  >
                    <div className="schedule-column-head">{dayHeading(index)}</div>
                    {list.length > 0 ? (
                      <ul>{list.map(card)}</ul>
                    ) : (
                      <p className="schedule-empty">No sessions on this day.</p>
                    )}
                  </section>
                )
              })}
            </div>
          </>
        ) : (
          <table className="schedule-grid">
            <caption className="v1-sr-only">Sessions by location and day</caption>
            <thead>
              <tr>
                <td />
                {days.map((d, index) => (
                  <th
                    key={d.value}
                    scope="col"
                    className={[
                      index === day && 'schedule-column-current',
                      d.highlight && 'schedule-column-highlight',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {dayHeading(index)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {locations.map((place) => {
                const total = sessions.filter((s) => s.locationId === place.id).length
                return (
                  // The row is a mouse target; its first cell's button is the keyboard one.
                  <tr key={place.id} className="schedule-row" onClick={() => open(place.id)}>
                    <th scope="row">
                      <button type="button">
                        <span className="schedule-place">{place.name}</span>
                        {place.city && <span className="schedule-city">{place.city}</span>}
                        <span className="schedule-count">{plural(total)}</span>
                      </button>
                    </th>
                    {days.map((d, index) => {
                      const list = at(place.id, index)
                      const hidden = list.length - OVERVIEW_PREVIEW
                      return (
                        <td
                          key={d.value}
                          className={[
                            index === day && 'schedule-column-current',
                            d.highlight && 'schedule-column-highlight',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          {list.slice(0, OVERVIEW_PREVIEW).map((session) => {
                            const sessionTheme = themeOf(session)
                            return (
                              <span
                                key={session.id}
                                className={`schedule-chip schedule-theme-${sessionTheme?.colour ?? 'none'}`}
                              >
                                {session.title}
                              </span>
                            )
                          })}
                          {hidden > 0 && (
                            <span className="schedule-more">+{hidden} more</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
