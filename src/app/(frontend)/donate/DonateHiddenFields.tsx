'use client'

import React, { useEffect, useRef } from 'react'

import { getUtm, UTM_KEYS } from '@/utils/utm'

// The page the donor came from, if it's on this site; otherwise this one.
function sourcePage() {
  try {
    const referrer = new URL(document.referrer)
    if (referrer.origin === window.location.origin) return referrer.pathname
  } catch {
    // No referrer, or not a URL.
  }
  return window.location.pathname
}

// UTM values and the source page travel with the form to POST /api/donate (SPEC §7.3).
export function DonateHiddenFields() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const set = (name: string, value: string) => {
      const input = ref.current?.querySelector<HTMLInputElement>(`input[name="${name}"]`)
      if (input) input.value = value
    }
    set('source_page', sourcePage())
    try {
      const utm = getUtm(window.sessionStorage)
      for (const key of UTM_KEYS) set(key, utm[key])
    } catch (error) {
      console.warn('UTM values skipped: session storage is unavailable', error)
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
