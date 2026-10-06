import type { Metadata } from 'next'
import React from 'react'

import { LegalPage } from '@/components/LegalPage'
import { legal } from '@/config/placeholderContent'

export const metadata: Metadata = { title: 'Cookies | Caribbean Brain Health Summit' }

export default function CookiesPage() {
  return <LegalPage {...legal.cookies} />
}
