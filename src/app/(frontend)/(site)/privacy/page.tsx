import type { Metadata } from 'next'
import React from 'react'

import { LegalPage } from '@/components/LegalPage'
import { legal } from '@/config/placeholderContent'

export const metadata: Metadata = { title: 'Privacy | Caribbean Brain Health Summit' }

export default function PrivacyPage() {
  return <LegalPage {...legal.privacy} />
}
