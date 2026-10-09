import React from 'react'

import { Form } from '@/components/forms/Form'
import { Section } from '@/components/Section'
import { formRegistry } from '@/forms/registry'
import { getResolvedForm, type ResolvedForm } from '@/lib/forms'

import type { BlockProps } from './types'

// Thank-you copy lives in the `forms` global: the thank-you route only knows the form key (SPEC §8.4).
export async function FormBlock({ block, blockId }: BlockProps<'form'>) {
  const { submitLabel, notice } = formRegistry[block.form]
  let form: ResolvedForm | undefined
  try {
    form = await getResolvedForm(block.form)
  } catch (error) {
    console.error(`Form ${block.form} could not load its fields from Airtable`, error)
  }

  return (
    <Section {...block} blockId={blockId} className="v1-reveal">
      {form ? (
        <Form
          formKey={block.form}
          fields={form.fields}
          consents={form.consents}
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
