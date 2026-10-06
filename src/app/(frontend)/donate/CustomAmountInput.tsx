'use client'

import React from 'react'

type Props = React.ComponentProps<'input'>

// Typing an amount selects "Other", so a donor is never charged a suggested amount they didn't pick.
export function CustomAmountInput(props: Props) {
  const selectOther = (event: React.ChangeEvent<HTMLInputElement>) => {
    const other = event.currentTarget.form?.querySelector<HTMLInputElement>(
      'input[name="amount"][value="custom"]',
    )
    if (other) other.checked = true
  }

  return <input {...props} onChange={selectOther} />
}
