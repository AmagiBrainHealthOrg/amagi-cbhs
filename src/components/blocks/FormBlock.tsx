import React from 'react'

import { Form } from '@/components/forms/Form'
import { Section } from '@/components/Section'
import { formRegistry } from '@/forms/registry'
import type { ResolvedField } from '@/forms/validate'
import { getResolvedForm } from '@/lib/forms'

import type { BlockProps } from './types'

// Thank-you copy lives in the `forms` global: the thank-you route only knows the form key (SPEC §8.4).
type Props = BlockProps<'form'> & { actionAreas: string[] }

// Lists options in the order the page's action areas block shows them; anything else goes last.
const inOrder = (field: ResolvedField, titles: string[]): ResolvedField => {
  if (field.name !== 'actionArea' || !field.options || titles.length === 0) return field
  const rank = (label: string) => {
    const index = titles.findIndex((title) => title.trim().toLowerCase() === label.toLowerCase())
    return index === -1 ? titles.length : index
  }
  return { ...field, options: [...field.options].sort((a, b) => rank(a.label) - rank(b.label)) }
}

export async function FormBlock({ block, blockId, actionAreas }: Props) {
  const { submitLabel, notice } = formRegistry[block.form]
  let fields: ResolvedField[] | undefined
  try {
    fields = (await getResolvedForm(block.form)).map((field) => inOrder(field, actionAreas))
  } catch (error) {
    console.error(`Form ${block.form} could not load its fields from Airtable`, error)
  }

  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      {fields ? (
        <Form
          formKey={block.form}
          fields={fields}
          submitLabel={submitLabel}
          notice={notice}
          idPrefix={blockId}
        />
      ) : (
        <p className="form-alert" role="alert">
          This form is unavailable right now. Please try again later.
        </p>
      )}
    </Section>
  )
}
