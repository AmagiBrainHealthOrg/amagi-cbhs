const ID = /^[\w-]{11}$/
const HOSTS = new Set(['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'])

// The video ID from a watch, youtu.be, share, shorts, live or embed link, or a bare ID.
export function youTubeId(input: string): string | undefined {
  const value = input.trim()
  if (ID.test(value)) return value
  const url = URL.parse(/^[a-z]+:\/\//i.test(value) ? value : `https://${value}`)
  if (!url) return undefined
  const host = url.hostname.toLowerCase().replace(/^www\./, '')
  let id: string | null | undefined
  if (host === 'youtu.be') id = url.pathname.split('/')[1]
  else if (HOSTS.has(host)) {
    const [kind, rest] = url.pathname.split('/').slice(1)
    id =
      kind === 'watch'
        ? url.searchParams.get('v')
        : ['shorts', 'live', 'embed'].includes(kind)
          ? rest
          : undefined
  }
  return id && ID.test(id) ? id : undefined
}

export const youTubeEmbed = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`

export const youTubeThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
