'use client'

import { useEffect } from 'react'

import { type FormSubmitEvent, trackFormSubmit } from '@/lib/tracking'

// Counts only when the form left its pending marker (SPEC §10.2), so a reload or a direct visit
// adds nothing.
export function FormSubmitTracker({ form, territory, audienceType }: FormSubmitEvent) {
  useEffect(() => {
    trackFormSubmit({ form, territory, audienceType })
  }, [form, territory, audienceType])

  return null
}
