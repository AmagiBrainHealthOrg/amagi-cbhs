// Every form key from SPEC §8.3, Release 2 forms included: select options become a Postgres enum.
export const formOptions = [
  { label: 'Register Interest', value: 'register-interest' },
  { label: 'Call to Action consultation', value: 'cta-consultation' },
  { label: 'Partner Sign-Up', value: 'partner' },
  { label: 'Brain Health Relay', value: 'relay' },
  { label: 'Contact and media', value: 'contact' },
] as const

export type FormKey = (typeof formOptions)[number]['value']
