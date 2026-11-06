import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { parseLinks, splitParagraphs } from '@/utils/paragraphs'

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
              {parseLinks(paragraph).map((part, index) =>
                typeof part === 'string' ? (
                  part
                ) : (
                  <Link key={index} href={part.href}>
                    {part.label}
                  </Link>
                ),
              )}
            </p>
          ))}
        </details>
      ))}
    </>
  )
}
