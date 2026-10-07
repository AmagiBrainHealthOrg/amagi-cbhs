// Keys match `icons` in src/app/(frontend)/(site)/_components/graphics.tsx (SPEC §6.3).
export const iconOptions = [
  { label: 'Megaphone', value: 'megaphone' },
  { label: 'Shield', value: 'shield' },
  { label: 'Stethoscope', value: 'stethoscope' },
  { label: 'Graduation cap', value: 'graduation' },
  { label: 'Landmark', value: 'landmark' },
  { label: 'Users', value: 'users' },
  { label: 'Video', value: 'video' },
  { label: 'Hand and heart', value: 'hand-heart' },
  { label: 'Document', value: 'file-text' },
  { label: 'Scales', value: 'scale' },
  { label: 'Badge with tick', value: 'badge-check' },
  { label: 'Lock', value: 'lock' },
] as const

export type IconKey = (typeof iconOptions)[number]['value']
