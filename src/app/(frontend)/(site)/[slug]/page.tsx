import type { Metadata } from 'next'
import React from 'react'

import { PageView, pageMetadata, resolvePage, type RouteProps } from '../_page'

type Props = RouteProps<{ slug: string }>

// The home page lives at `/`, never at `/home`.
const resolve = async ({ params, searchParams }: Props) => {
  const { slug } = await params
  if (slug === 'home') return { page: undefined, draft: false }
  return resolvePage(slug, searchParams)
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  return pageMetadata((await resolve(props)).page)
}

export default async function Page(props: Props) {
  return <PageView {...await resolve(props)} />
}
