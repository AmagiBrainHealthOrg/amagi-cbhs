import { Heart } from 'lucide-react'
import React from 'react'

import { getGlobal } from '@/lib/globals'

import { Button } from './Button'

// The sitewide primary button. Its label is the header global's `donateLabel`.
export async function DonateButton({ className }: { className?: string }) {
  const { donateLabel } = await getGlobal('header')
  if (!donateLabel) return null

  return (
    <Button href="/donate" variant="primary" journey="donate" action="donate" className={className}>
      <Heart aria-hidden="true" /> {donateLabel}
    </Button>
  )
}
