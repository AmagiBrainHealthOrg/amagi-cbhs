import type { RichTextBlock } from '@/payload-types'

const text = (value: string) => ({
  type: 'text',
  text: value,
  version: 1,
  format: 0,
  detail: 0,
  mode: 'normal',
  style: '',
})

type Node = ReturnType<typeof paragraph> | ReturnType<typeof heading>

export const paragraph = (value: string) => ({
  type: 'paragraph',
  version: 1,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  textStyle: '',
  children: [text(value)],
})

export const heading = (value: string, tag: 'h2' | 'h3' = 'h2') => ({
  type: 'heading',
  tag,
  version: 1,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  children: [text(value)],
})

export const richText = (...children: Node[]): RichTextBlock['content'] => ({
  root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children },
})

export const paragraphs = (...values: string[]) => richText(...values.map(paragraph))

// Headed sections, as the legal pages have them.
export const sections = (items: { heading: string; body: string }[]) =>
  richText(...items.flatMap((item) => [heading(item.heading), paragraph(item.body)]))
