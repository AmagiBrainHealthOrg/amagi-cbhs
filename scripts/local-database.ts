export const LOCAL_DATABASE = 'amagi_cbhs'

const LOCAL_HOSTS = ['127.0.0.1', 'localhost']

export function isLocalUrl(value: string | undefined): boolean {
  if (!value) return false
  try {
    return LOCAL_HOSTS.includes(new URL(value).hostname)
  } catch {
    return false
  }
}

// Returns why DATABASE_URL is not the local main database, or null if it is.
export function localDatabaseProblem(databaseUrl: string | undefined): string | null {
  if (!isLocalUrl(databaseUrl)) return 'DATABASE_URL does not point at 127.0.0.1'
  const name = new URL(databaseUrl!).pathname.slice(1)
  if (name !== LOCAL_DATABASE) return `DATABASE_URL points at "${name}", not "${LOCAL_DATABASE}"`
  return null
}
