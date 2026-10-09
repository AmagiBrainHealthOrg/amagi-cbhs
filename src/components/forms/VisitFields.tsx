'use client'

import React, { useEffect, useRef } from 'react'

import { pageBefore } from '@/utils/pageTrail'
import { getUtm, UTM_KEYS } from '@/utils/utm'

// UTM values and the source page travel with a form: donations (SPEC §7.3) and forms (§8.1).
export function VisitFields() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const set = (name: string, value: string) => {
      const input = ref.current?.querySelector<HTMLInputElement>(`input[name="${name}"]`)
      if (input) input.value = value
    }
    const here = window.location.pathname
    try {
      set('source_page', pageBefore(here, window.sessionStorage) || here)
      const utm = getUtm(window.sessionStorage)
      for (const key of UTM_KEYS) set(key, utm[key])
    } catch (error) {
      set('source_page', here)
      console.warn('UTM values and source page skipped: session storage is unavailable', error)
    }
  }, [])

  return (
    <div ref={ref} hidden>
      <input type="hidden" name="source_page" defaultValue="" />
      {UTM_KEYS.map((key) => (
        <input key={key} type="hidden" name={key} defaultValue="" />
      ))}
    </div>
  )
}
