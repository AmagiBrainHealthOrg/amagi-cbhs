// The labels double as the type shown before the date on the News page.
export const newsTypeOptions = [
  { label: 'News', value: 'news' },
  { label: 'Partner announcement', value: 'partner-announcement' },
] as const

export const newsTypeLabel = (value: string): string | undefined =>
  newsTypeOptions.find((option) => option.value === value)?.label
