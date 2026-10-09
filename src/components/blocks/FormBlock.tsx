import React from 'react'

import { Form } from '@/components/forms/Form'
import { Section } from '@/components/Section'
import { formRegistry } from '@/forms/registry'
import type { ResolvedField } from '@/forms/validate'
import { getResolvedForm } from '@/lib/forms'

import type { BlockProps } from './types'

// Thank-you copy lives in the `forms` global: the thank-you route only knows the form key (SPEC §8.4).
export async function FormBlock({ block, blockId }: BlockProps<'form'>) {
  const { submitLabel, notice } = formRegistry[block.form]
  let fields: ResolvedField[] | undefined
  try {
    fields = await getResolvedForm(block.form)
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
