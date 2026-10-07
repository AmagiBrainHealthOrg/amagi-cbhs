import { sql } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'

import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    await payload.db.drizzle.execute(sql`select 1`)
    return Response.json({ status: 'ok' })
  } catch (error) {
    console.error('Health check: database unreachable', error)
    return Response.json({ status: 'error' }, { status: 503 })
  }
}
