import type { Metadata } from 'next'
import React from 'react'

import { LegalPage } from '@/components/LegalPage'
import { legal } from '@/config/placeholderContent'

export const metadata: Metadata = { title: 'Terms | Caribbean Brain Health Summit' }

export default function TermsPage() {
  return <LegalPage {...legal.terms} />
}
