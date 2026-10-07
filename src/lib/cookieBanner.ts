import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'

import { getGlobal } from './globals'

const COOKIES_SLUG = 'cookies'

// The banner's copy, or null while the cookie-consent global lacks it (nothing renders, so no
// consent is given and analytics stays off). The /cookies link takes its label from that page.
export const getCookieBanner = cache(async () => {
  const [{ heading, body, acceptLabel, rejectLabel, settingsLabel }, cookiesPage] =
    await Promise.all([
      getGlobal('cookie-consent'),
      getPayload({ config }).then((payload) =>
        payload.find({
          collection: 'pages',
          where: { slug: { equals: COOKIES_SLUG } },
          select: { title: true },
          limit: 1,
          overrideAccess: false,
        }),
      ),
    ])
  if (!heading || !acceptLabel || !rejectLabel) return null

  const policyTitle = cookiesPage.docs[0]?.title
  return {
    banner: {
      heading,
      body,
      acceptLabel,
      rejectLabel,
      policy: policyTitle ? { href: `/${COOKIES_SLUG}`, label: policyTitle } : undefined,
    },
    settingsLabel,
  }
})
