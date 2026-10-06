'use client'

import React, { useSyncExternalStore } from 'react'

const MINUTE = 60_000

const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 10_000)
  return () => clearInterval(id)
}
const currentMinute = () => Math.floor(Date.now() / MINUTE)
const noMinute = () => null

export function Countdown({ target, label }: { target: string; label: string }) {
  const minute = useSyncExternalStore(subscribe, currentMinute, noMinute)
  const remaining =
    minute === null ? null : Math.max(0, Math.floor(new Date(target).getTime() / MINUTE) - minute)

  const units = [
    { label: 'days', value: remaining === null ? null : Math.floor(remaining / 1440) },
    { label: 'hours', value: remaining === null ? null : Math.floor((remaining % 1440) / 60) },
    { label: 'minutes', value: remaining === null ? null : remaining % 60 },
  ]

  return (
    <div className="v1-countdown">
      <p>{label}</p>
      <ol aria-live="off">
        {units.map(({ label: unit, value }) => (
          <li key={unit}>
            <strong>{value === null ? '–' : String(value).padStart(2, '0')}</strong>
            <span>{unit}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
