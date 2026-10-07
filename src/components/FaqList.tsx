import React from 'react'

import { Accordion, type AccordionItem } from './Accordion'

export type FaqGroup = { category: string; items: AccordionItem[] }

type Props = { groups: FaqGroup[]; showCategories?: boolean }

export function FaqList({ groups, showCategories = true }: Props) {
  return (
    <div className="faq-list">
      {groups.map(({ category, items }) => (
        <section key={category} aria-label={showCategories ? undefined : category}>
          {showCategories && <h2>{category}</h2>}
          <Accordion items={items} />
        </section>
      ))}
    </div>
  )
}
