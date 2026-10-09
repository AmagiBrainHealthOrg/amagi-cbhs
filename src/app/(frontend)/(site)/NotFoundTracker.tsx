'use client'

import { useEffect } from 'react'

import { trackNotFound } from '@/lib/tracking'

export function NotFoundTracker() {
  useEffect(() => {
    trackNotFound(window.location.pathname)
  }, [])

  return null
}
