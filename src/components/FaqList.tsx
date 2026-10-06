import { ChevronDown } from 'lucide-react'
import React from 'react'

type FaqGroup = { category: string; items: { question: string; answer: string }[] }

type Props = { groups: FaqGroup[]; showCategories?: boolean }

// TODO: becomes the `faqList` block, reading the Payload `faqs` collection grouped by category and
// sorted by `order` (T009), only when a human developer decides to.
export function FaqList({ groups, showCategories = true }: Props) {
  return (
    <div className="faq-list">
      {groups.map(({ category, items }) => (
        <section key={category} aria-label={showCategories ? undefined : category}>
          {showCategories && <h2>{category}</h2>}
          {items.map(({ question, answer }) => (
            <details key={question} className="faq-item">
              <summary>
                {question}
                <ChevronDown aria-hidden="true" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </section>
      ))}
    </div>
  )
}
