// Editors separate paragraphs in plain-text CMS fields with a blank line.
export const splitParagraphs = (text?: string | null): string[] =>
  (text ?? '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

export type TextPart = string | { label: string; href: string }

// `[text](/path)` becomes a link, for paths on this site only.
export function parseLinks(text: string): TextPart[] {
  const parts: TextPart[] = []
  let last = 0
  for (const match of text.matchAll(/\[([^\]]+)\]\((\/(?!\/)[^)\s]*)\)/g)) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    parts.push({ label: match[1], href: match[2] })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}
