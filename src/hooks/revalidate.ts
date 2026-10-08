import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

type Doc = Record<string, unknown> & { _status?: 'draft' | 'published' | null }

type Target = { path: string; type?: 'layout' | 'page' }

type TargetsFor = (doc: Doc) => Target[]

const revalidate = (req: PayloadRequest, targets: Target[]) => {
  if (req.context.disableRevalidate) return
  const unique = new Map(targets.map((target) => [`${target.type ?? ''}:${target.path}`, target]))
  for (const { path, type } of unique.values()) {
    try {
      revalidatePath(path, type)
    } catch (error) {
      // revalidatePath needs a Next.js request; migrations and scripts run without one.
      const message = error instanceof Error ? error.message : String(error)
      req.payload.logger.warn(`Skipped revalidating ${path}: ${message}`)
    }
  }
}

// Draft autosaves don't change the public site; publishing or unpublishing does.
export const revalidateAfterChange =
  (targetsFor: TargetsFor): CollectionAfterChangeHook =>
  ({ doc, previousDoc, req }) => {
    const targets: Target[] = []
    if (doc._status === 'published') targets.push(...targetsFor(doc))
    if (previousDoc?._status === 'published') targets.push(...targetsFor(previousDoc))
    revalidate(req, targets)
    return doc
  }

export const revalidateAfterDelete =
  (targetsFor: TargetsFor): CollectionAfterDeleteHook =>
  ({ doc, req }) => {
    revalidate(req, targetsFor(doc))
    return doc
  }

// Globals the shell or the donate pages read appear on every page.
export const revalidateGlobalAfterChange: GlobalAfterChangeHook = ({ doc, previousDoc, req }) => {
  if (doc?._status === 'published' || previousDoc?._status === 'published') {
    revalidate(req, [{ path: '/', type: 'layout' }])
  }
  return doc
}

// For globals without drafts that the shell reads (integrations): every save goes live.
export const revalidateUndraftedGlobalAfterChange: GlobalAfterChangeHook = ({ doc, req }) => {
  revalidate(req, [{ path: '/', type: 'layout' }])
  return doc
}

// For content that blocks can show on any page (logo grids, FAQ lists).
export const everyPage: TargetsFor = () => [{ path: '/', type: 'layout' }]

export const pagePath = (slug: unknown): string => (slug === 'home' ? '/' : `/${String(slug)}`)
