import React from 'react'

import { DonateBanner } from '@/components/DonateBanner'

import type { BlockProps } from './types'

export function DonateBannerBlock({ blockId }: BlockProps<'donateBanner'>) {
  return <DonateBanner id={blockId} />
}
