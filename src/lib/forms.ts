import 'server-only'

import { airtableForms, type Consent } from '@/config/airtable'
import type { FormKey } from '@/config/forms'
import { formRegistry } from '@/forms/registry'
import type { ResolvedField } from '@/forms/validate'

import { getFormFields } from './airtable'

export type ConsentOption = { consent: Consent; label: string }

export type ResolvedForm = {
  fields: ResolvedField[]
  // The three consent checkboxes, labelled with the form's Permissions choices in the base.
  consents: ConsentOption[]
}

// A form's fields with their live options from Airtable (SPEC §5.3). Throws when the base is
// unreachable or no longer matches, so callers render an error state.
export async function getResolvedForm(key: FormKey): Promise<ResolvedForm> {
  const live = await getFormFields(key)
  const byName = new Map(live.map((field) => [field.name, field]))

  const fields = formRegistry[key].fields.map((def): ResolvedField => {
    const field = byName.get(def.name)
    if (!field) throw new Error(`${key}: field ${def.name} has no Airtable mapping`)
    return field.options ? { ...def, options: field.options } : def
  })

  const permissions = byName.get('permissions')?.options ?? []
  const consents = (Object.entries(airtableForms[key].consentChoices) as [Consent, string][]).map(
    ([consent, choiceId]) => {
      const label = permissions.find((o) => o.id === choiceId)?.label
      if (!label) throw new Error(`${key}: Permissions choice for ${consent} is missing`)
      return { consent, label }
    },
  )
  return { fields, consents }
}
