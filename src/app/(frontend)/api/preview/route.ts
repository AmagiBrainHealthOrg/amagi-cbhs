import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { env } from '@/env'
import config from '@/payload.config'

// Live preview opens /api/preview?path=/about. Draft mode is a cookie, so public pages stay cached
// and only the signed-in editor's requests render fresh with drafts.
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get('path') ?? ''
  const site = new URL(env.NEXT_PUBLIC_SITE_URL)
  const target = new URL(path, site)
  if (!path.startsWith('/') || target.origin !== site.origin) {
    return Response.json({ error: 'Invalid path' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return Response.json({ error: 'Sign in to preview' }, { status: 401 })

  ;(await draftMode()).enable()
  redirect(`${target.pathname}${target.search}`)
}
