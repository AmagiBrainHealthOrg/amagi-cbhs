import React from 'react'

import { ActionAreasBlock } from './ActionAreasBlock'
import { AnchorDayBlock } from './AnchorDayBlock'
import { CardGridBlock } from './CardGridBlock'
import { DonateBannerBlock } from './DonateBannerBlock'
import { FaqListBlock } from './FaqListBlock'
import { FlowBlock } from './FlowBlock'
import { FormBlock } from './FormBlock'
import { HeroBlock } from './HeroBlock'
import { HostMapBlock } from './HostMapBlock'
import { LogoGridBlock } from './LogoGridBlock'
import { NewsTeaserBlock } from './NewsTeaserBlock'
import { RichTextBlock } from './RichTextBlock'
import { RoadmapBlock } from './RoadmapBlock'
import { StatementBlock } from './StatementBlock'
import { SummitWeekBlock } from './SummitWeekBlock'
import { SupporterLevelsBlock } from './SupporterLevelsBlock'
import type { LayoutBlock } from './types'

function RenderBlock({ block, blockId }: { block: LayoutBlock; blockId: string }) {
  switch (block.blockType) {
    case 'hero':
      return <HeroBlock block={block} blockId={blockId} />
    case 'richText':
      return <RichTextBlock block={block} blockId={blockId} />
    case 'statement':
      return <StatementBlock block={block} blockId={blockId} />
    case 'hostMap':
      return <HostMapBlock block={block} blockId={blockId} />
    case 'summitWeek':
      return <SummitWeekBlock block={block} blockId={blockId} />
    case 'roadmap':
      return <RoadmapBlock block={block} blockId={blockId} />
    case 'flow':
      return <FlowBlock block={block} blockId={blockId} />
    case 'cardGrid':
      return <CardGridBlock block={block} blockId={blockId} />
    case 'actionAreas':
      return <ActionAreasBlock block={block} blockId={blockId} />
    case 'supporterLevels':
      return <SupporterLevelsBlock block={block} blockId={blockId} />
    case 'logoGrid':
      return <LogoGridBlock block={block} blockId={blockId} />
    case 'faqList':
      return <FaqListBlock block={block} blockId={blockId} />
    case 'newsTeaser':
      return <NewsTeaserBlock block={block} blockId={blockId} />
    case 'donateBanner':
      return <DonateBannerBlock block={block} blockId={blockId} />
    case 'form':
      return <FormBlock block={block} blockId={blockId} />
    case 'anchorDay':
      return <AnchorDayBlock block={block} blockId={blockId} />
    default: {
      const unhandled: never = block
      throw new Error(`No renderer for block ${JSON.stringify(unhandled)}`)
    }
  }
}

export function RenderBlocks({ blocks }: { blocks?: LayoutBlock[] | null }) {
  return (
    <>
      {(blocks ?? []).map((block, index) => {
        const blockId = `block-${block.id ?? index}`
        return <RenderBlock key={blockId} block={block} blockId={blockId} />
      })}
    </>
  )
}
