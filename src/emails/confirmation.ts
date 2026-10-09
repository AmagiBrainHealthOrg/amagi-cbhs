import { layout } from './layout'

// The thank-you page's copy from the `forms` global, so editors change both in one place.
export const confirmationEmail = ({
  name,
  heading,
  body,
}: {
  name?: string
  heading: string
  body?: string | null
}) => layout(heading, [name ? `Dear ${name},` : 'Hello,', ...(body ? [body] : [])])
