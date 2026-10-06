import 'dotenv/config'

import { spawnSync } from 'node:child_process'
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs'

import { localDatabaseProblem } from './local-database'

const LOG = '.verification/preflight.log'

mkdirSync('.verification', { recursive: true })
writeFileSync(LOG, `preflight ${new Date().toISOString()}\n`)

function fail(reason: string): never {
  appendFileSync(LOG, `\nPREFLIGHT FAIL: ${reason}\n`)
  console.log(`PREFLIGHT FAIL: ${reason}`)
  process.exit(1)
}

// Runs a command, logging its output, and returns its stdout and whether it succeeded.
function run(command: string, args: string[]): { ok: boolean; stdout: string } {
  appendFileSync(LOG, `\n$ ${command} ${args.join(' ')}\n`)
  const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
  appendFileSync(LOG, `${result.stdout ?? ''}${result.stderr ?? ''}`)
  if (result.error) appendFileSync(LOG, `${result.error.message}\n`)
  return { ok: result.status === 0, stdout: (result.stdout ?? '').trim() }
}

function step(name: string, check: () => string | null) {
  console.log(`› ${name}`)
  const reason = check()
  if (reason) fail(reason)
}

step('Supabase stack', () => {
  if (run('pnpm', ['supabase', 'status']).ok) return null
  return run('pnpm', ['supabase', 'start']).ok ? null : `pnpm supabase start failed (see ${LOG})`
})

step('Git', () => {
  const branch = run('git', ['branch', '--show-current']).stdout
  if (branch !== 'main') return `on branch "${branch}", not main`
  const dirty = run('git', ['status', '--porcelain']).stdout
  if (dirty) return `working tree is dirty:\n${dirty}`
  if (!run('git', ['fetch', '--quiet', 'origin', 'main']).ok) return 'git fetch origin main failed'
  const head = run('git', ['rev-parse', 'HEAD']).stdout
  const origin = run('git', ['rev-parse', 'origin/main']).stdout
  if (head !== origin) return 'main is not level with origin/main'
  return null
})

step('GitHub CLI auth', () => (run('gh', ['auth', 'status']).ok ? null : 'gh auth status failed'))

step('Install', () =>
  run('pnpm', ['install', '--frozen-lockfile']).ok ? null : 'pnpm install --frozen-lockfile failed',
)

step('Migrations', () => {
  const problem = localDatabaseProblem(process.env.DATABASE_URL)
  if (problem) return problem
  return run('pnpm', ['payload', 'migrate']).ok ? null : `pnpm payload migrate failed (see ${LOG})`
})

for (const gate of ['typecheck', 'lint', 'test:int', 'build']) {
  step(gate, () => (run('pnpm', [gate]).ok ? null : `pnpm ${gate} failed (see ${LOG})`))
}

appendFileSync(LOG, '\nPREFLIGHT OK\n')
console.log('PREFLIGHT OK')
