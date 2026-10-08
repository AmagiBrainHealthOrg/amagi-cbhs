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

// Outbound link clicks are Plausible's own "Outbound Link: Click" event.
export function startAnalytics({ domain, endpoint }: { domain: string; endpoint?: string }) {
  if (started) return
  init({ domain, endpoint, outboundLinks: true })
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
