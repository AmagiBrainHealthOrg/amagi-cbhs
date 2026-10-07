'use client'

import React, { useEffect } from 'react'

import { Button } from '@/components/Button'
import { ErrorState } from '@/components/ErrorState'

// Fixed system copy: the CMS may be what failed, so nothing here reads from it.
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorState
      heading="Something went wrong"
      body="This page didn’t load properly. Please try again in a moment."
      action={
        <>
          <button type="button" className="button button-outline" onClick={() => retry()}>
            Try again
          </button>
          <Button href="/" variant="tertiary" journey="awareness" action="error_home">
            Go to the home page
          </Button>
        </>
      }
    />
  )
}
