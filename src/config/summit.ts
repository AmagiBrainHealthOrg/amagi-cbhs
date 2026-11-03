// The seven days of Summit week. Sessions pick one of these; the schedule shows them as columns.
export const summitDays = [
  { value: '2026-11-16', label: 'Monday 16 November' },
  { value: '2026-11-17', label: 'Tuesday 17 November' },
  { value: '2026-11-18', label: 'Wednesday 18 November' },
  { value: '2026-11-19', label: 'Thursday 19 November' },
  { value: '2026-11-20', label: 'Friday 20 November' },
  { value: '2026-11-21', label: 'Saturday 21 November' },
  { value: '2026-11-22', label: 'Sunday 22 November' },
] as const

export type SummitDay = (typeof summitDays)[number]['value']

// IANA zones for the host countries. Session times are entered in their location's zone.
export const timeZoneOptions = [
  { label: 'Jamaica (UTC−5)', value: 'America/Jamaica' },
  { label: 'Cayman Islands (UTC−5)', value: 'America/Cayman' },
  { label: 'The Bahamas (UTC−5)', value: 'America/Nassau' },
  { label: 'Barbados (UTC−4)', value: 'America/Barbados' },
  { label: 'Trinidad and Tobago (UTC−4)', value: 'America/Port_of_Spain' },
  { label: 'Eastern Caribbean (UTC−4)', value: 'America/Puerto_Rico' },
  { label: 'Guyana (UTC−4)', value: 'America/Guyana' },
  { label: 'Suriname (UTC−3)', value: 'America/Paramaribo' },
  { label: 'Belize (UTC−6)', value: 'America/Belize' },
  { label: 'United States, Eastern (UTC−5)', value: 'America/New_York' },
] as const

// Theme colours, from the brand palette plus five supporting hues for contrast between chips.
export const themeColours = [
  { label: 'Blue', value: 'blue' },
  { label: 'Red', value: 'red' },
  { label: 'Orange', value: 'orange' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Teal', value: 'teal' },
  { label: 'Purple', value: 'purple' },
  { label: 'Green', value: 'green' },
  { label: 'Pink', value: 'pink' },
  { label: 'Amber', value: 'amber' },
] as const

export type ThemeColour = (typeof themeColours)[number]['value']
