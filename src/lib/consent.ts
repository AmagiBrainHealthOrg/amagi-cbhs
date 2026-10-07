export const CONSENT_COOKIE = 'cbhs_consent'

export type Consent = 'analytics' | 'rejected'

// Dispatched on window with the new Consent as `detail`, so Google Tag Manager (T015) can load as
// soon as the visitor accepts.
export const CONSENT_EVENT = 'cbhs:consent'

const SIX_MONTHS = 60 * 60 * 24 * 183

// SPEC §10.5: every type starts denied; accepting grants analytics_storage only.
export const CONSENT_DEFAULTS = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'denied',
} as const

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const consentPattern = new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=(analytics|rejected)(?:;|$)`)

export const parseConsent = (cookie: string): Consent | null =>
  (consentPattern.exec(cookie)?.[1] as Consent | undefined) ?? null

export const getConsent = (): Consent | null => parseConsent(document.cookie)

export const hasAnalyticsConsent = () => getConsent() === 'analytics'

// Inlined at the top of <head>, so the defaults (and a returning visitor's grant) are in
// dataLayer before anything else. gtag commands must be pushed as Arguments objects, not arrays.
export const consentDefaultsScript = `window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};gtag('consent','default',${JSON.stringify(CONSENT_DEFAULTS)});if(${consentPattern}.exec(document.cookie)?.[1]==='analytics')gtag('consent','update',{analytics_storage:'granted'});`

// _ga cookies are usually set on the registrable domain with a leading dot, so try every
// parent of the current host as well as a host-only cookie.
export function deleteAnalyticsCookies() {
  const names = document.cookie
    .split(';')
    .map((pair) => pair.split('=')[0].trim())
    .filter((name) => name.startsWith('_ga'))
  const labels = window.location.hostname.split('.')
  const domains = labels.slice(0, -1).map((_, index) => labels.slice(index).join('.'))
  const expired = 'Max-Age=0; Path=/'
  for (const name of names) {
    document.cookie = `${name}=; ${expired}`
    for (const domain of domains) document.cookie = `${name}=; ${expired}; Domain=.${domain}`
  }
}

export function setConsent(consent: Consent) {
  document.cookie = `${CONSENT_COOKIE}=${consent}; Max-Age=${SIX_MONTHS}; Path=/; SameSite=Lax; Secure`
  window.gtag?.('consent', 'update', {
    analytics_storage: consent === 'analytics' ? 'granted' : 'denied',
  })
  if (consent === 'rejected') deleteAnalyticsCookies()
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: consent }))
}
