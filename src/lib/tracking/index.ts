// SPEC §10.2. Stubs until T015 wires them to the data layer. Payloads carry no personal data.

export type DonationCompleteEvent = { value: number; currency: string }

export function trackDonationComplete(_event: DonationCompleteEvent): void {}
