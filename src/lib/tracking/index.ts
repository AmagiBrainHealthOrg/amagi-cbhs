import { init, track } from '@plausible-analytics/tracker'

// SPEC §10.2, sent to Plausible. Props are fixed, non-personal values: never names, emails,
// phone numbers or free text (CLAUDE.md hard rules).

type TrackArgs = Parameters<typeof track>

let started = false
// Child components' effects run before the layout's, so events can arrive before `init`.
const pending: TrackArgs[] = []

const send = (...args: TrackArgs) => {
  if (started) track(...args)
  else pending.push(args)
}

// Outbound link clicks and file downloads are Plausible's own "Outbound Link: Click" and
// "File Download" events.
export function startAnalytics({ domain, endpoint }: { domain: string; endpoint?: string }) {
  if (started) return
  init({ domain, endpoint, outboundLinks: true, fileDownloads: true })
  started = true
  for (const args of pending.splice(0)) track(...args)
}

export function trackDonateClick(location: string) {
  send('donate_click', { props: { location } })
}

export type DonationCompleteEvent = { value: number; currency: string }

export function trackDonationComplete({ value, currency }: DonationCompleteEvent) {
  send('donation_complete', { revenue: { amount: value, currency } })
}

// The path is the page that was asked for, not personal data.
export function trackNotFound(path: string) {
  send('404', { props: { path } })
}

export function trackFormStart(form: string) {
  send('form_start', { props: { form } })
}

// SPEC §10.2: a valid submit leaves a marker, and only the thank-you page that finds it counts a
// `form_submit`, so refreshes and direct visits don't.
const pendingKey = (form: string) => `cbhs_form_pending:${form}`

function withStorage(action: (storage: Storage) => void) {
  try {
    action(window.sessionStorage)
    return true
  } catch (error) {
    console.warn('Form tracking skipped: session storage is unavailable', error)
    return false
  }
}

export const markFormPending = (form: string) =>
  withStorage((storage) => storage.setItem(pendingKey(form), '1'))

export const clearFormPending = (form: string) =>
  withStorage((storage) => storage.removeItem(pendingKey(form)))

export type FormSubmitEvent = { form: string; territory?: string; audienceType?: string }

export function trackFormSubmit({ form, territory, audienceType }: FormSubmitEvent) {
  let pending = false
  withStorage((storage) => {
    pending = storage.getItem(pendingKey(form)) !== null
    storage.removeItem(pendingKey(form))
  })
  if (!pending) return
  const props: Record<string, string> = { form }
  if (territory) props.territory = territory
  if (audienceType) props.audience_type = audienceType
  send('form_submit', { props })
}
