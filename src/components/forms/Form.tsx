'use client'

import Link from 'next/link'
import React, { startTransition, useActionState, useEffect, useRef, useState } from 'react'

import type { FormKey } from '@/config/forms'
import { slugify } from '@/fields/slug'
import { type FormState, submitForm } from '@/forms/actions'
import type { FormSection } from '@/forms/registry'
import {
  type FieldErrors,
  HONEYPOT,
  isVisible,
  matches,
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
  /** Sent with the answers, such as the session a registration is for. */
  hidden?: Record<string, string>
  sections?: FormSection[]
  hidePrivacyLine?: boolean
  submitAfter?: ResolvedField['name']
}

// SPEC §8: one shared form. Checks run in the browser first, then again in the server action;
// either way the first invalid field gets focus. Without JavaScript the action still runs.
export function Form({
  formKey,
  fields,
  submitLabel,
  notice,
  idPrefix,
  hidden,
  sections,
  hidePrivacyLine,
  submitAfter,
}: Props) {
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

  // A link such as /partner?country=jamaica picks that country in the location field, when it
  // has an option of that name and nothing is chosen yet.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('country')
    const option = slug
      ? fields
          .find((field) => field.name === 'location')
          ?.options?.find((choice) => slugify(choice.label) === slug)
      : undefined
    const form = formRef.current
    const select = form?.elements.namedItem('location')
    if (!form || !option || !(select instanceof HTMLSelectElement) || select.value) return
    select.value = option.value
    setCurrent(readValues(fields, new FormData(form)))
  }, [fields])

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

  const onChange = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    const target = event.target
    // Ticking an option like "No support currently anticipated" clears the others.
    if (target instanceof HTMLInputElement && target.type === 'checkbox' && target.checked) {
      const field = fields.find((f) => f.name === target.name && f.exclusiveChoiceId)
      const exclusive = field?.options?.find((o) => o.id === field.exclusiveChoiceId)
      if (exclusive?.value === target.value) {
        form.querySelectorAll<HTMLInputElement>(`input[name="${target.name}"]`).forEach((input) => {
          if (input !== target) input.checked = false
        })
      }
    }
    setCurrent(readValues(fields, new FormData(form)))
  }

  const renderField = (field: ResolvedField) => (
    <Field
      key={field.name}
      field={field}
      id={`${idPrefix}-${field.name}`}
      error={errors[field.name]}
      defaultValue={state.values?.[field.name]}
      current={current[field.name]}
    />
  )
  const visible = fields.filter((field) => isVisible(field, current, fields))
  const showSubmit =
    !submitAfter || matches({ field: submitAfter, answered: true }, current, fields)

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

      {sections ? (
        sections
          .filter((section) => matches(section.showWhen, current, fields))
          .map((section) => (
            <section
              key={section.id}
              className="form-section"
              aria-labelledby={`${idPrefix}-${section.id}`}
            >
              <h2 id={`${idPrefix}-${section.id}`}>{section.heading}</h2>
              <div className="form-grid">
                {visible.filter((field) => field.section === section.id).map(renderField)}
              </div>
              {section.notice && (
                <p className="form-notice form-section-notice">{section.notice}</p>
              )}
            </section>
          ))
      ) : (
        <div className="form-grid">{visible.map(renderField)}</div>
      )}

      <div className="form-honeypot" aria-hidden="true">
        <label>
          Leave this empty
          <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <VisitFields />
      {Object.entries(hidden ?? {}).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      {notice && <p className="form-notice">{notice}</p>}
      {showSubmit && (
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
          {!hidePrivacyLine && (
            <p className="form-privacy">
              We use your answers as described in our <Link href="/privacy">privacy policy</Link>.
            </p>
          )}
        </div>
      )}
    </form>
  )
}
