import { ChevronDown } from 'lucide-react'
import React from 'react'

import { splitParagraphs } from '@/utils/paragraphs'

import { LinkedText } from './LinkedText'

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
          {splitParagraphs(answer).map((paragraph) => (
            <p key={paragraph}>
              <LinkedText text={paragraph} />
            </p>
          ))}
        </details>
      ))}
    </>
  )
}
