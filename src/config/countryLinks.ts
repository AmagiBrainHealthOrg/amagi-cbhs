// Kept apart from countries.ts so client components can link without bundling the page copy.
const slugs: Record<string, string> = {
  Barbados: 'barbados',
  'Cayman Islands': 'cayman-islands',
  Jamaica: 'jamaica',
  Suriname: 'suriname',
  'Trinidad and Tobago': 'trinidad-and-tobago',
}

export const countryHref = (name: string) => (slugs[name] ? `/countries/${slugs[name]}` : undefined)
