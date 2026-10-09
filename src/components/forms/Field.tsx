import React from 'react'

import type { ResolvedField } from '@/forms/validate'

type Props = {
  field: ResolvedField
  id: string
  error?: string
  defaultValue?: string | string[]
}

const inputType = { text: 'text', email: 'email', tel: 'tel', url: 'url', date: 'date' } as const

// One question. Hints and errors are linked with aria-describedby (SPEC §8, WCAG 2.1 AA).
export function Field({ field, id, error, defaultValue }: Props) {
  const { name, label, control, required, hint, options = [] } = field
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  const invalid = error ? true : undefined
  const optional = !required && <span className="form-optional"> (optional)</span>
  const className = ['form-field', field.wide && 'form-field-wide', error && 'form-field-invalid']
    .filter(Boolean)
    .join(' ')
  const chosen = new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue ?? ''])

  const notes = (
    <>
      {hint && (
        <p id={hintId} className="form-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="form-error">
          {error}
        </p>
      )}
    </>
  )

  if (control === 'radios' || control === 'checkboxes') {
    return (
      <fieldset
        className={[className, 'form-choices', field.numbered && 'form-choices-numbered']
          .filter(Boolean)
          .join(' ')}
        aria-describedby={describedBy}
      >
        <legend>
          {label}
          {optional}
        </legend>
        {notes}
        {options.map((option, index) => (
          <label key={option.value} className="form-choice">
            <input
              type={control === 'radios' ? 'radio' : 'checkbox'}
              name={name}
              value={option.value}
              defaultChecked={chosen.has(option.value)}
              aria-invalid={index === 0 ? invalid : undefined}
              required={control === 'radios' ? required : undefined}
            />
            {field.numbered && (
              <span className="form-choice-number" aria-hidden="true">
                {index + 1}
              </span>
            )}
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
    )
  }

  const common = {
    id,
    name,
    required,
    'aria-invalid': invalid,
    'aria-describedby': describedBy,
    defaultValue: typeof defaultValue === 'string' ? defaultValue : undefined,
  }

  return (
    <div className={className}>
      <label htmlFor={id}>
        {label}
        {optional}
      </label>
      {control === 'select' ? (
        <select {...common} defaultValue={common.defaultValue ?? ''}>
          <option value="">Select</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : control === 'textarea' ? (
        <textarea {...common} rows={4} />
      ) : (
        <input
          {...common}
          type={inputType[control]}
          autoComplete={field.autoComplete}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
        />
      )}
      {/* Below the input, so inputs side by side in the grid stay level. */}
      {notes}
    </div>
  )
}
