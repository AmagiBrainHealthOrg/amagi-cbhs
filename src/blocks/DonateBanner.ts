import type { Block } from 'payload'

// No fields: the copy comes from the `donation-settings` global's banner (SPEC §6.3).
export const DonateBanner: Block = {
  slug: 'donateBanner',
  interfaceName: 'DonateBannerBlock',
  labels: { singular: 'Donate banner', plural: 'Donate banners' },
  fields: [],
}
