import { ChevronDown } from 'lucide-react'
import React from 'react'

export type AccordionItem = { id?: string | number | null; question: string; answer: string }

export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <>
      {items.map(({ id, question, answer }) => (
        <details key={id ?? question} className="faq-item">
          <summary>
            {question}
            <ChevronDown aria-hidden="true" />
          </summary>
          <p>{answer}</p>
        </details>
      ))}
    </>
  )
}
