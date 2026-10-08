import type { RichTextBlock } from '@/payload-types'

const BOLD = 1

const text = (value: string, format = 0) => ({
  type: 'text',
  text: value,
  version: 1,
  format,
  detail: 0,
  mode: 'normal',
  style: '',
})

const element = { version: 1, direction: 'ltr' as const, format: '' as const, indent: 0 }

export const bold = (value: string) => text(value, BOLD)

export const link = (label: string, url: string) => ({
  ...element,
  type: 'link',
  version: 3,
  fields: { linkType: 'custom', url, newTab: false },
  children: [text(label)],
})

type Inline = string | ReturnType<typeof bold> | ReturnType<typeof link>

const inline = (values: Inline[]) =>
  values.map((value) => (typeof value === 'string' ? text(value) : value))

export const paragraph = (...values: Inline[]) => ({
  ...element,
  type: 'paragraph',
  textFormat: 0,
  textStyle: '',
  children: inline(values),
})

export const heading = (value: string, tag: 'h2' | 'h3' = 'h2') => ({
  ...element,
  type: 'heading',
  tag,
  children: [text(value)],
})

// Each item is one string, or an array of inline parts when it needs bold text or links.
export const bullets = (...items: (Inline | Inline[])[]) => ({
  ...element,
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((item, index) => ({
    ...element,
    type: 'listitem',
    value: index + 1,
    children: inline(Array.isArray(item) ? item : [item]),
  })),
})

type Node = ReturnType<typeof paragraph> | ReturnType<typeof heading> | ReturnType<typeof bullets>

export const richText = (...children: Node[]): RichTextBlock['content'] => ({
  root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children },
})

export const paragraphs = (...values: string[]) =>
  richText(...values.map((value) => paragraph(value)))
