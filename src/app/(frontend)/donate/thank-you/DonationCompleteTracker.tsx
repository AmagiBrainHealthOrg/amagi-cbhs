'use client'

import { useEffect } from 'react'

import { trackDonationComplete } from '@/lib/tracking'

const TRACKED_KEY = 'cbhs_donation_tracked'

type Props = { sessionId: string; value: number; currency: string }

// Rendered only after the server confirmed the session is paid (SPEC §7.4). Once per session ID,
// so a reload of the thank-you page doesn't count the donation twice.
export function DonationCompleteTracker({ sessionId, value, currency }: Props) {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(TRACKED_KEY) === sessionId) return
      window.sessionStorage.setItem(TRACKED_KEY, sessionId)
    } catch (error) {
      console.warn('Donation tracking skipped: session storage is unavailable', error)
      return
    }
    trackDonationComplete({ value, currency })
  }, [sessionId, value, currency])

  return null
}
