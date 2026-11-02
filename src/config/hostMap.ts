import type { MapCountry } from '@/components/graphics/graphics'

// The host map graphic on Home. Fixed in code, not the CMS: positions are on the map's own grid
// (see caribbeanMap.ts), 0–932 left to right and 0–660 top to bottom.
export const hostMap: { countries: MapCountry[]; onlineLabel: string; anchorLabel: string } = {
  onlineLabel: 'Plus online sessions, open to everyone',
  anchorLabel: 'Anchor Day',
  countries: [
    { name: 'Jamaica', city: 'Kingston', x: 365, y: 285, anchor: true, labelSide: 'left' },
    // Paramaribo is just east of the map's edge, so Suriname sits on its western border.
    { name: 'Suriname', city: 'Paramaribo', x: 914, y: 634, labelSide: 'left' },
    { name: 'Barbados', city: 'Bridgetown', x: 858, y: 432, labelSide: 'left' },
    { name: 'Trinidad and Tobago', city: 'Port of Spain', x: 803, y: 506, labelSide: 'left' },
    { name: 'Cayman Islands', city: 'George Town', x: 233, y: 246, labelSide: 'left' },
  ],
}
