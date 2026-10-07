export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const

export type UtmKey = (typeof UTM_KEYS)[number]

export type Utm = Record<UtmKey, string>

export const UTM_STORAGE_KEY = 'cbhs_utm'

const empty = (): Utm => ({
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_term: '',
  utm_content: '',
})

// Only a landing URL that carries UTM values replaces what the visit already recorded.
export function captureUtm(search: string, storage: Storage) {
  const params = new URLSearchParams(search)
  if (!UTM_KEYS.some((key) => params.get(key))) return

  const utm = empty()
  for (const key of UTM_KEYS) utm[key] = params.get(key) ?? ''
  storage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm))
}

// The visit's UTM values (SPEC §8.1); empty strings when there are none.
export function getUtm(storage: Storage | undefined = globalThis.sessionStorage): Utm {
  const utm = empty()
  try {
    const stored: unknown = JSON.parse(storage?.getItem(UTM_STORAGE_KEY) ?? 'null')
    if (stored && typeof stored === 'object') {
      for (const key of UTM_KEYS) {
        const value = (stored as Record<string, unknown>)[key]
        if (typeof value === 'string') utm[key] = value
      }
    }
  } catch {
    // Unreadable storage (blocked or corrupted) means no UTM values for this visit.
  }
  return utm
}
