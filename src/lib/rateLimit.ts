import 'server-only'

import { createHash } from 'node:crypto'

import { sql } from '@payloadcms/db-postgres'
import type { Payload } from 'payload'

import { env } from '@/env'

// SPEC §8.2 step 2: 5 submissions per IP per 10 minutes. Counted in Postgres because each
// serverless instance has its own memory. IPs are stored only as salted hashes.
export const RATE_LIMIT = 5
export const RATE_WINDOW_MS = 10 * 60 * 1000

export async function allowSubmission(payload: Payload, ip: string, now = Date.now()) {
  const key = createHash('sha256').update(`${env.PAYLOAD_SECRET}:${ip}`).digest('hex')
  const windowStart = new Date(now - (now % RATE_WINDOW_MS)).toISOString()
  const result = await payload.db.drizzle.execute(sql`
    INSERT INTO rate_limits (key, window_start, count) VALUES (${key}, ${windowStart}, 1)
    ON CONFLICT (key, window_start) DO UPDATE SET count = rate_limits.count + 1
    RETURNING count`)
  // Old windows are never read again.
  await payload.db.drizzle.execute(
    sql`DELETE FROM rate_limits WHERE window_start < ${new Date(now - RATE_WINDOW_MS).toISOString()}`,
  )
  const count = Number((result.rows[0] as { count: number | string }).count)
  return count <= RATE_LIMIT
}
