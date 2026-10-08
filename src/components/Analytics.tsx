'use client'

import { useEffect } from 'react'

import { startAnalytics, trackDonateClick } from '@/lib/tracking'

// Plausible sets no cookies and stores nothing in the browser, so it starts without consent.
export function Analytics({ domain }: { domain: string }) {
  useEffect(() => {
    startAnalytics(domain)

    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('[data-action="donate"]')) {
        trackDonateClick(window.location.pathname)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [domain])

  return null
}
