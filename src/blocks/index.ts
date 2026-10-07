import type { Block } from 'payload'

import { ActionAreas } from './ActionAreas'
import { AnchorDay } from './AnchorDay'
import { CardGrid } from './CardGrid'
import { DonateBanner } from './DonateBanner'
import { FaqList } from './FaqList'
import { Flow } from './Flow'
import { Form } from './Form'
import { Hero } from './Hero'
import { HostMap } from './HostMap'
import { LogoGrid } from './LogoGrid'
import { NewsTeaser } from './NewsTeaser'
import { Roadmap } from './Roadmap'
import { RichText } from './RichText'
import { Statement } from './Statement'
import { SummitWeek } from './SummitWeek'
import { SupporterLevels } from './SupporterLevels'

// SPEC §6.3. `video` (T016) and `hostCountriesTeaser` (T020) join in Release 2.
export const pageBlocks: Block[] = [
  Hero,
  RichText,
  Statement,
  HostMap,
  SummitWeek,
  Roadmap,
  Flow,
  CardGrid,
  ActionAreas,
  SupporterLevels,
  LogoGrid,
  FaqList,
  NewsTeaser,
  DonateBanner,
  Form,
  AnchorDay,
]
