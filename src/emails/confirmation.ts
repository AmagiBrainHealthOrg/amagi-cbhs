import { splitParagraphs } from '@/utils/paragraphs'

import { layout } from './layout'

// The thank-you page's copy from the `forms` global, so editors change both in one place.
export const confirmationEmail = ({
  name,
  heading,
  body,
  detail,
}: {
  name?: string
  heading: string
  body?: string | null
  detail?: string
}) =>
  layout(heading, [
    name ? `Dear ${name},` : 'Hello,',
    ...(detail ? [detail] : []),
    ...splitParagraphs(body),
  ])
