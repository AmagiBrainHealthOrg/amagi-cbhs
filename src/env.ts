import { z } from 'zod'

const schema = z.object({
  DATABASE_URL: z.url(),
  PAYLOAD_SECRET: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  S3_ENDPOINT: z.url(),
  S3_REGION: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
  SITE_LIVE: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.url(),
  // Optional so builds and CI run without Stripe; creating or reading a session needs it.
  STRIPE_SECRET_KEY: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z
      .string()
      .regex(/^(sk|rk)_(test|live)_/, 'Use a Stripe secret or restricted key.')
      .optional(),
  ),
})

// On Vercel, fall back to the production domain Vercel sets, so the site URL needs no manual setting.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
const parsed = schema.safeParse({
  ...process.env,
  NEXT_PUBLIC_SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : undefined),
})

if (!parsed.success) {
  const lines = parsed.error.issues.map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
  throw new Error(`Invalid environment variables:\n${lines.join('\n')}`)
}

export const env = parsed.data
