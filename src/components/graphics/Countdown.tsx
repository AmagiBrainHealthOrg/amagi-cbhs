'use client'

import React, { useSyncExternalStore } from 'react'

const MINUTE = 60_000

const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 10_000)
  return () => clearInterval(id)
}
const currentMinute = () => Math.floor(Date.now() / MINUTE)
const noMinute = () => null

type Units = { days?: string | null; hours?: string | null; minutes?: string | null }

export function Countdown({
  target,
  label,
  units: unitLabels,
}: {
  target: string
  label: string
  units?: Units | null
}) {
  const minute = useSyncExternalStore(subscribe, currentMinute, noMinute)
  const remaining =
    minute === null ? null : Math.max(0, Math.floor(new Date(target).getTime() / MINUTE) - minute)

  const units = [
    {
      key: 'days',
      label: unitLabels?.days,
      value: remaining === null ? null : Math.floor(remaining / 1440),
    },
    {
      key: 'hours',
      label: unitLabels?.hours,
      value: remaining === null ? null : Math.floor((remaining % 1440) / 60),
    },
    {
      key: 'minutes',
      label: unitLabels?.minutes,
      value: remaining === null ? null : remaining % 60,
    },
  ]

  return (
    <div className="v1-countdown">
      <p>{label}</p>
      <ol aria-live="off">
        {units.map(({ key, label: unit, value }) => (
          <li key={key}>
            <strong>{value === null ? '–' : String(value).padStart(2, '0')}</strong>
            {unit && <span>{unit}</span>}
          </li>
        ))}
      </ol>
    </div>
  )
}
