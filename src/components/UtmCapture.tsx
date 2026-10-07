'use client'

import { useEffect } from 'react'

import { captureUtm, getUtm } from '@/utils/utm'

declare global {
  interface Window {
    getUtm?: typeof getUtm
  }
}

// Mounted once in the root layout, so it runs on landing and survives client-side navigation.
export function UtmCapture() {
  useEffect(() => {
    try {
      captureUtm(window.location.search, window.sessionStorage)
    } catch (error) {
      console.warn('UTM capture skipped: session storage is unavailable', error)
    }
    if (process.env.NODE_ENV === 'development') window.getUtm = getUtm
  }, [])

  return null
}
