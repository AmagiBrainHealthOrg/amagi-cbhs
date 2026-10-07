import 'dotenv/config'

import { getPayload } from 'payload'

import { isLocalUrl } from './local-database'

// Remote databases are read-only from dev machines (CLAUDE.md); production gets this content
// through the t011_content migration.
if (!isLocalUrl(process.env.DATABASE_URL)) {
  console.error('db:seed only runs against a local database (127.0.0.1 or localhost).')
  process.exit(1)
}

const { default: config } = await import('../src/payload.config')
const { seedContent } = await import('../src/seed')

const payload = await getPayload({ config })
const { created, skipped } = await seedContent({ payload })
console.log(`Created ${created.length}: ${created.join('; ') || 'nothing'}`)
console.log(`Already present ${skipped.length}`)
process.exit(0)
