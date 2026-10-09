import { z } from 'zod'

const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional())

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
  // Optional so builds and CI run without Airtable; form options and syncing need both.
  AIRTABLE_TOKEN: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.string().optional(),
  ),
  AIRTABLE_BASE_ID: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z
      .string()
      .regex(/^app[A-Za-z0-9]{14}$/, 'Use the base ID from the Airtable URL (app…).')
      .optional(),
  ),
  // Optional so builds and CI run without email; without a key Payload logs emails instead.
  RESEND_API_KEY: optional(z.string().startsWith('re_', 'Use a Resend API key (re_…).')),
  EMAIL_FROM_ADDRESS: optional(
    z.email('Use a full address, e.g. cbhs@noreply.amagibrainhealth.org.'),
  ),
  // Hears about Airtable sync failures (SPEC §8.2).
  SYNC_ALERT_TO: optional(z.email()),
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
