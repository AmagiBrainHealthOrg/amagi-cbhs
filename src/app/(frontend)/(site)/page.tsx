import type { Metadata } from 'next'
import React from 'react'

import { PageView, pageMetadata, resolvePage, type RouteProps } from './_page'

type Props = Pick<RouteProps<unknown>, 'searchParams'>

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return pageMetadata((await resolvePage('home', searchParams)).page)
}

export default async function HomePage({ searchParams }: Props) {
  return <PageView {...await resolvePage('home', searchParams)} />
}
