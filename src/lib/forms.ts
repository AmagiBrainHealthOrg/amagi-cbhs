import 'server-only'

import type { FormKey } from '@/config/forms'
import { formRegistry } from '@/forms/registry'
import type { ResolvedField } from '@/forms/validate'

import { getFormFields } from './airtable'

// A form's fields with their live options from Airtable (SPEC §5.3). Throws when the base is
// unreachable or no longer matches, so callers render an error state.
export async function getResolvedForm(key: FormKey): Promise<ResolvedField[]> {
  const live = new Map((await getFormFields(key)).map((field) => [field.name, field]))
  return formRegistry[key].fields.map((def): ResolvedField => {
    const field = live.get(def.name)
    if (!field) throw new Error(`${key}: field ${def.name} has no Airtable mapping`)
    return field.options ? { ...def, options: field.options } : def
  })
}
