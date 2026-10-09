import type { Metadata } from 'next'
import React from 'react'

import { PageView, findPage, pageMetadata, type RouteProps } from '../_page'

type Props = RouteProps<{ slug: string }>

// Each page renders on its first visit, then serves from cache until a publish revalidates it.
export const generateStaticParams = () => []

// The home page lives at `/`, never at `/home`.
const resolve = async ({ params }: Props) => {
  const { slug } = await params
  if (slug === 'home') return { page: undefined, draft: false }
  return findPage(slug)
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  return pageMetadata((await resolve(props)).page)
}

export default async function Page(props: Props) {
  return <PageView {...await resolve(props)} />
}
