import { notFound } from 'next/navigation'
import React from 'react'

import { Button } from '@/components/Button'
import { formOptions } from '@/config/forms'
import { getGlobal } from '@/lib/globals'

import { FormSubmitTracker } from './FormSubmitTracker'

type Props = {
  params: Promise<{ form: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

// SPEC §8.4: one template, with copy per form from the `forms` global.
export default async function FormThankYouPage({ params, searchParams }: Props) {
  const [{ form }, query] = await Promise.all([params, searchParams])
  if (!formOptions.some(({ value }) => value === form)) notFound()

  const { thankYou } = await getGlobal('forms')
  const copy = thankYou?.find((entry) => entry.form === form)

  return (
    <section className="v1-section form-thank-you" aria-labelledby="thank-you-title">
      <FormSubmitTracker
        form={form}
        territory={first(query.territory)}
        audienceType={first(query.audience_type)}
      />
      <h1 id="thank-you-title">{copy?.heading ?? 'Thank you'}</h1>
      {copy?.body && <p>{copy.body}</p>}
      <Button href="/" variant="secondary" journey={form} action="thank_you_home">
        Back to the homepage
      </Button>
    </section>
  )
}
