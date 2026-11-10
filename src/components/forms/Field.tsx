import React from 'react'

import { LinkedText } from '@/components/LinkedText'
import { countWords, type ResolvedField } from '@/forms/validate'

type Props = {
  field: ResolvedField
  id: string
  error?: string
  defaultValue?: string | string[]
  /** The answer as it stands, for word counts and selection limits. */
  current?: string | string[]
}

const inputType = { text: 'text', email: 'email', tel: 'tel', url: 'url', date: 'date' } as const

// One question. Hints and errors are linked with aria-describedby (SPEC §8, WCAG 2.1 AA).
export function Field(props: Props) {
  const { field } = props
  return (
    <>
      {field.before && (
        <p className="form-before form-field-wide">
          <LinkedText text={field.before} />
        </p>
      )}
      {field.reveal ? (
        <div className="form-reveal form-field-wide">
          <Question {...props} />
        </div>
      ) : (
        <Question {...props} />
      )}
    </>
  )
}

function Question({ field, id, error, defaultValue, current }: Props) {
  const { name, label, control, required, hint, options = [] } = field
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const countId = field.wordLimit || field.maxSelections ? `${id}-count` : undefined
  const describedBy = [hintId, errorId, countId].filter(Boolean).join(' ') || undefined
  const invalid = error ? true : undefined
  const optional = !required && <span className="form-optional"> (optional)</span>
  const className = ['form-field', field.wide && 'form-field-wide', error && 'form-field-invalid']
    .filter(Boolean)
    .join(' ')
  const chosen = new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue ?? ''])
  const answer = Array.isArray(current) ? current : current ? [current] : []
  const exclusive = options.find((o) => o.id === field.exclusiveChoiceId)
  const exclusiveTicked = Boolean(exclusive && answer.includes(exclusive.value))
  const atLimit = Boolean(field.maxSelections && answer.length >= field.maxSelections)
  const words = field.wordLimit ? countWords(answer[0] ?? '') : 0

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
        {options.map((option, index) => {
          const ticked = answer.includes(option.value)
          const disabled =
            (exclusiveTicked && option !== exclusive) || (atLimit && !ticked) || undefined
          return (
            <React.Fragment key={option.value}>
              {option === exclusive && (
                <p className="form-choice-or" aria-hidden="true">
                  or
                </p>
              )}
              <label
                className={['form-choice', disabled && 'form-choice-disabled']
                  .filter(Boolean)
                  .join(' ')}
              >
                <input
                  type={control === 'radios' ? 'radio' : 'checkbox'}
                  name={name}
                  value={option.value}
                  defaultChecked={chosen.has(option.value)}
                  disabled={disabled}
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
            </React.Fragment>
          )
        })}
        {field.maxSelections && (
          <p id={countId} className="form-count" aria-live="polite">
            {answer.length} of {field.maxSelections} selected
          </p>
        )}
      </fieldset>
    )
  }

  if (control === 'checkbox') {
    return (
      <div className={`${className} form-choices`}>
        <label htmlFor={id} className="form-choice">
          <input
            id={id}
            type="checkbox"
            name={name}
            value="true"
            required={required}
            defaultChecked={chosen.has('true')}
            aria-invalid={invalid}
            aria-describedby={describedBy}
          />
          <span>{label}</span>
        </label>
        {notes}
      </div>
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
        <textarea {...common} rows={field.wordLimit && field.wordLimit > 100 ? 6 : 4} />
      ) : (
        <input
          {...common}
          type={inputType[control]}
          autoComplete={field.autoComplete}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          list={field.suggestions ? `${id}-suggestions` : undefined}
        />
      )}
      {field.suggestions && (
        <datalist id={`${id}-suggestions`}>
          {field.suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      )}
      {field.wordLimit && (
        <p
          id={countId}
          className={['form-count', words > field.wordLimit && 'form-count-over']
            .filter(Boolean)
            .join(' ')}
          aria-live="polite"
        >
          {words} of {field.wordLimit} words
        </p>
      )}
      {/* Below the input, so inputs side by side in the grid stay level. */}
      {notes}
    </div>
  )
}
