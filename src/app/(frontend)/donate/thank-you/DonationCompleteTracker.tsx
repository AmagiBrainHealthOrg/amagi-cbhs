'use client'

import { useEffect } from 'react'

import { trackDonationComplete } from '@/lib/tracking'

// Rendered only after the server confirmed the session is paid (SPEC §7.4).
export function DonationCompleteTracker({ value, currency }: { value: number; currency: string }) {
  useEffect(() => {
    trackDonationComplete({ value, currency })
  }, [value, currency])

  return null
}
