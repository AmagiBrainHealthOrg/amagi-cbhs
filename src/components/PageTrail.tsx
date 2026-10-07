'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { recordPage } from '@/utils/pageTrail'

// Remembers the previous page, so a donation can name the page it started from (SPEC §7.3).
export function PageTrail() {
  const pathname = usePathname()

  useEffect(() => {
    try {
      recordPage(pathname, window.sessionStorage)
    } catch (error) {
      console.warn('Page trail skipped: session storage is unavailable', error)
    }
  }, [pathname])

  return null
}
