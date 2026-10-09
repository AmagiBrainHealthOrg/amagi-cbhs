import 'dotenv/config'

import { findSchemaProblems, type SchemaTable } from '../src/utils/airtable'

// SPEC §9.1: fails, naming each problem, when the base no longer has a table, field or choice
// that src/config/airtable.ts writes to.
const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID } = process.env
if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
  console.error('AIRTABLE_TOKEN and AIRTABLE_BASE_ID must both be set.')
  process.exit(1)
}

const response = await fetch(`https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`, {
  headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
})
if (!response.ok) {
  console.error(`Could not read the base schema: ${response.status} ${await response.text()}`)
  process.exit(1)
}

const { tables } = (await response.json()) as { tables: SchemaTable[] }
const problems = findSchemaProblems(tables)
if (problems.length > 0) {
  console.error(
    `The Airtable base doesn't match src/config/airtable.ts:\n  ${problems.join('\n  ')}`,
  )
  process.exit(1)
}
console.log('The Airtable base matches src/config/airtable.ts.')
