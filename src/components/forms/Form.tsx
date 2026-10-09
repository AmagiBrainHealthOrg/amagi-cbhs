'use client'

import Link from 'next/link'
import React, { startTransition, useActionState, useEffect, useRef, useState } from 'react'

import type { FormKey } from '@/config/forms'
import { type FormState, submitForm } from '@/forms/actions'
import {
  type FieldErrors,
  HONEYPOT,
  isVisible,
  readValues,
  type ResolvedField,
  validate,
  type Values,
} from '@/forms/validate'
import { clearFormPending, markFormPending, trackFormStart } from '@/lib/tracking'

import { Field } from './Field'
import { VisitFields } from './VisitFields'

type Props = {
  formKey: FormKey
  fields: ResolvedField[]
  submitLabel: string
  notice?: string
  /** Unique on the page, so two forms never share input ids. */
  idPrefix: string
}

// SPEC §8: one shared form. Checks run in the browser first, then again in the server action;
// either way the first invalid field gets focus. Without JavaScript the action still runs.
export function Form({ formKey, fields, submitLabel, notice, idPrefix }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    submitForm.bind(null, formKey),
    {},
  )
  const [clientErrors, setClientErrors] = useState<FieldErrors | null>(null)
  const [current, setCurrent] = useState<Values>(state.values ?? {})
  const [attempt, setAttempt] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)
  const started = useRef(false)

  const errors = clientErrors ?? state.errors ?? {}
  const hasErrors = Object.keys(errors).length > 0

  useEffect(() => {
    if (attempt === 0) return
    const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
    if (first) first.focus()
    else if (state.formError) formRef.current?.querySelector<HTMLElement>('.form-alert')?.focus()
  }, [attempt, state])

  // A rejected submit never reaches the thank-you page, so its marker mustn't count later.
  useEffect(() => {
    if (state.errors || state.formError) clearFormPending(formKey)
  }, [state, formKey])

  const onFocus = () => {
    if (started.current) return
    started.current = true
    trackFormStart(formKey)
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const found = validate(fields, readValues(fields, data))
    setAttempt((n) => n + 1)
    if (Object.keys(found).length > 0) {
      setClientErrors(found)
      return
    }
    setClientErrors(null)
    markFormPending(formKey)
    startTransition(() => formAction(data))
  }

  const onChange = (event: React.FormEvent<HTMLFormElement>) =>
    setCurrent(readValues(fields, new FormData(event.currentTarget)))

  return (
    <form
      ref={formRef}
      className="form"
      data-form={formKey}
      action={formAction}
      onSubmit={onSubmit}
      onChange={onChange}
      onFocus={onFocus}
      noValidate
    >
      {(hasErrors || state.formError) && (
        <div className="form-alert" role="alert" tabIndex={-1}>
          {state.formError ?? 'Check the highlighted answers and try again.'}
        </div>
      )}

      <div className="form-grid">
        {fields
          .filter((field) => isVisible(field, current, fields))
          .map((field) => (
            <Field
              key={field.name}
              field={field}
              id={`${idPrefix}-${field.name}`}
              error={errors[field.name]}
              defaultValue={state.values?.[field.name]}
            />
          ))}
      </div>

      <div className="form-honeypot" aria-hidden="true">
        <label>
          Leave this empty
          <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <VisitFields />

      {notice && <p className="form-notice">{notice}</p>}
      <div className="form-actions">
        <button
          type="submit"
          className="button form-submit"
          disabled={pending}
          data-journey={formKey}
          data-action="form_submit"
          data-destination-type="internal"
        >
          {pending ? 'Sending…' : submitLabel}
        </button>
        <p className="form-privacy">
          We use your answers as described in our <Link href="/privacy">privacy policy</Link>.
        </p>
      </div>
    </form>
  )
}
