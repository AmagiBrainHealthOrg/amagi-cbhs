import type { Page } from '@/payload-types'

export type LayoutBlock = NonNullable<Page['layout']>[number]

export type BlockProps<T extends LayoutBlock['blockType']> = {
  block: Extract<LayoutBlock, { blockType: T }>
  /** Unique within the page, for heading ids. */
  blockId: string
}
