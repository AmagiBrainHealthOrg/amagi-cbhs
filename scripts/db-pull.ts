import 'dotenv/config'

import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { isLocalUrl, LOCAL_DATABASE, localDatabaseProblem } from './local-database'

// Throws rather than exiting, so the finally that deletes the production dump always runs.
function fail(message: string): never {
  throw new Error(message)
}

function required(name: string): string {
  const value = process.env[name]
  if (!value) fail(`${name} is not set`)
  return value
}

function run(command: string, args: string[], input?: string): string {
  const result = spawnSync(command, args, { encoding: 'utf8', input, maxBuffer: 64 * 1024 * 1024 })
  if (result.error) fail(`${command} could not start: ${result.error.message}`)
  if (result.status !== 0) fail(`${command} exited ${result.status}\n${result.stderr}`)
  return result.stdout
}

function runInherited(command: string, args: string[]): void {
  const result = spawnSync(command, args, { stdio: 'inherit' })
  if (result.error) fail(`${command} could not start: ${result.error.message}`)
  if (result.status !== 0) fail(`${command} exited ${result.status}`)
}

async function main() {
  const localDatabaseUrl = required('DATABASE_URL')
  const problem = localDatabaseProblem(localDatabaseUrl)
  if (problem) fail(`refusing to run: ${problem}`)

  const localS3Endpoint = required('S3_ENDPOINT')
  if (!isLocalUrl(localS3Endpoint)) fail('refusing to run: S3_ENDPOINT does not point at 127.0.0.1')

  const pullDatabaseUrl = required('PULL_DATABASE_URL')
  if (isLocalUrl(pullDatabaseUrl)) fail('PULL_DATABASE_URL points at this machine, not production')

  const remote = new S3Client({
    endpoint: required('PULL_S3_ENDPOINT'),
    region: required('PULL_S3_REGION'),
    forcePathStyle: true,
    credentials: {
      accessKeyId: required('PULL_S3_ACCESS_KEY_ID'),
      secretAccessKey: required('PULL_S3_SECRET_ACCESS_KEY'),
    },
  })
  const remoteBucket = required('PULL_S3_BUCKET')

  const local = new S3Client({
    endpoint: localS3Endpoint,
    region: required('S3_REGION'),
    forcePathStyle: true,
    credentials: {
      accessKeyId: required('S3_ACCESS_KEY_ID'),
      secretAccessKey: required('S3_SECRET_ACCESS_KEY'),
    },
  })
  const localBucket = required('S3_BUCKET')

  // Dump before touching the local database, so a failed dump leaves it intact.
  const workDir = mkdtempSync(path.join(tmpdir(), 'db-pull-'))
  const dumpFile = path.join(workDir, 'public.sql')

  try {
    console.log('Dumping production public schema…')
    run('pg_dump', [
      '--schema=public',
      '--no-owner',
      '--no-acl',
      '--exclude-table-data=form_submissions*',
      `--file=${dumpFile}`,
      `--dbname=${pullDatabaseUrl}`,
    ])

    console.log(`Recreating local ${LOCAL_DATABASE}…`)
    const adminUrl = new URL(localDatabaseUrl)
    adminUrl.pathname = '/postgres'
    run('psql', [
      '-v',
      'ON_ERROR_STOP=1',
      '-q',
      adminUrl.toString(),
      '-c',
      `drop database if exists ${LOCAL_DATABASE} with (force)`,
      '-c',
      `create database ${LOCAL_DATABASE}`,
    ])

    // The new database already has a public schema; drop it when the dump recreates it.
    if (/^CREATE SCHEMA public;$/m.test(readFileSync(dumpFile, 'utf8'))) {
      run('psql', ['-v', 'ON_ERROR_STOP=1', '-q', localDatabaseUrl, '-c', 'drop schema public'])
    }

    console.log('Restoring…')
    run('psql', ['-v', 'ON_ERROR_STOP=1', '-q', localDatabaseUrl, '-f', dumpFile])
  } finally {
    rmSync(workDir, { recursive: true, force: true })
  }

  console.log('Copying storage objects…')
  try {
    await local.send(new HeadBucketCommand({ Bucket: localBucket }))
  } catch {
    await local.send(new CreateBucketCommand({ Bucket: localBucket }))
  }

  let objects = 0
  let continuationToken: string | undefined
  do {
    const page = await remote.send(
      new ListObjectsV2Command({ Bucket: remoteBucket, ContinuationToken: continuationToken }),
    )
    for (const { Key } of page.Contents ?? []) {
      if (!Key) continue
      const object = await remote.send(new GetObjectCommand({ Bucket: remoteBucket, Key }))
      if (!object.Body) fail(`object ${Key} has no body`)
      await local.send(
        new PutObjectCommand({
          Bucket: localBucket,
          Key,
          Body: await object.Body.transformToByteArray(),
          ContentType: object.ContentType,
        }),
      )
      objects++
    }
    continuationToken = page.NextContinuationToken
  } while (continuationToken)

  const counts = run(
    'psql',
    ['-At', '-F', '\t', localDatabaseUrl],
    "select format('select %L, count(*) from public.%I', tablename, tablename) from pg_tables where schemaname = 'public' order by tablename \\gexec",
  )

  console.log('\nRows')
  for (const line of counts.trim().split('\n').filter(Boolean)) {
    const [table, count] = line.split('\t')
    console.log(`  ${table.padEnd(40)} ${count}`)
  }
  console.log(`\nObjects: ${objects}`)

  console.log('\nRunning migrations…')
  runInherited('pnpm', ['payload', 'migrate'])
}

main().catch((error: unknown) => {
  console.error(`db:pull: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
