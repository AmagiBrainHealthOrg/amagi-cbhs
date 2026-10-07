export const PAGE_TRAIL_KEY = 'cbhs_page_trail'

type Trail = { previous: string; current: string }

function read(storage: Storage): Trail {
  try {
    const stored: unknown = JSON.parse(storage.getItem(PAGE_TRAIL_KEY) ?? 'null')
    if (stored && typeof stored === 'object') {
      const { previous, current } = stored as Record<string, unknown>
      if (typeof previous === 'string' && typeof current === 'string') return { previous, current }
    }
  } catch {
    // Corrupted storage means no trail.
  }
  return { previous: '', current: '' }
}

// Called on every route change, client-side or full load, so the trail survives both.
export function recordPage(pathname: string, storage: Storage) {
  const { current } = read(storage)
  if (current === pathname) return
  storage.setItem(PAGE_TRAIL_KEY, JSON.stringify({ previous: current, current: pathname }))
}

// The page visited before `pathname`, whether or not the trail has recorded `pathname` yet.
export function pageBefore(pathname: string, storage: Storage): string {
  const { previous, current } = read(storage)
  return (current === pathname ? previous : current) || ''
}
