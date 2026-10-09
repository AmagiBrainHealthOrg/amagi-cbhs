import type { Metadata } from 'next'
import React from 'react'

import { PageView, findPage, pageMetadata } from './_page'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata((await findPage('home')).page)
}

export default async function HomePage() {
  return <PageView {...await findPage('home')} />
}
