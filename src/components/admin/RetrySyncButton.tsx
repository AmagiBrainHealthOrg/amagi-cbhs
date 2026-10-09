'use client'

import { Button, toast, useDocumentInfo } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

// SPEC §8.2 step 7: sends a failed submission to Airtable again through the same syncSubmission.
export function RetrySyncButton() {
  const { id } = useDocumentInfo()
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const retry = async () => {
    setPending(true)
    try {
      const response = await fetch(`/api/form-submissions/${id}/retry-sync`, {
        method: 'POST',
        credentials: 'include',
      })
      const result = (await response.json()) as { status?: string; error?: string }
      if (result.status === 'synced') toast.success('Sent to Airtable')
      else toast.error(`Still failing: ${result.error ?? response.statusText}`)
      router.refresh()
    } catch (error) {
      toast.error(`Retry failed: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setPending(false)
    }
  }

  if (!id) return null
  return (
    <Button buttonStyle="secondary" size="small" onClick={retry} disabled={pending}>
      {pending ? 'Retrying…' : 'Retry sync'}
    </Button>
  )
}
