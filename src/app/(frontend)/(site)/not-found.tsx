import React from 'react'

import { Button } from '@/components/Button'
import { ErrorState } from '@/components/ErrorState'

// Fixed system copy: there is no CMS global for error pages yet.
export default function NotFound() {
  return (
    <ErrorState
      heading="Page not found"
      body="We couldn’t find that page. It may have moved, or the link may be wrong."
      action={
        <Button href="/" variant="secondary" journey="awareness" action="error_home">
          Go to the home page
        </Button>
      }
    />
  )
}
