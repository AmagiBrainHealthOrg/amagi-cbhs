const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export type Email = { subject: string; html: string; text: string }

// Plain, accessible HTML (SPEC §9.2): one column, real text, no images.
export function layout(subject: string, paragraphs: string[]): Email {
  const body = paragraphs
    .map((p) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.5">${escapeHtml(p)}</p>`)
    .join('')
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(subject)}</title></head><body style="margin:0;padding:24px;background:#ffffff;color:#002f5c;font-family:Arial,Helvetica,sans-serif"><div style="max-width:560px;margin:0 auto"><h1 style="margin:0 0 20px;font-size:22px;color:#005baa">${escapeHtml(subject)}</h1>${body}<p style="margin:24px 0 0;font-size:13px;color:#56657a">Caribbean Brain Health Summit 2026 · Amagi Health Ltd</p></div></body></html>`
  return { subject, html, text: [subject, ...paragraphs].join('\n\n') }
}
