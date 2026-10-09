import { notFound } from 'next/navigation'
import React from 'react'

import { Button } from '@/components/Button'
import { formOptions } from '@/config/forms'
import { getGlobal } from '@/lib/globals'

type Props = { params: Promise<{ form: string }> }

// SPEC §8.4: one template, with copy per form from the `forms` global.
export default async function FormThankYouPage({ params }: Props) {
  const { form } = await params
  if (!formOptions.some(({ value }) => value === form)) notFound()

  const { thankYou } = await getGlobal('forms')
  const copy = thankYou?.find((entry) => entry.form === form)

  return (
    <section className="v1-section form-thank-you" aria-labelledby="thank-you-title">
      <h1 id="thank-you-title">{copy?.heading ?? 'Thank you'}</h1>
      {copy?.body && <p>{copy.body}</p>}
      <Button href="/" variant="secondary" journey={form} action="thank_you_home">
        Back to the homepage
      </Button>
    </section>
  )
}
