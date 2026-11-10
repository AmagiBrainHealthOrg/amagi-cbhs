import type { Block } from 'payload'

import { Accordion } from './Accordion'
import { ActionAreas } from './ActionAreas'
import { AnchorDay } from './AnchorDay'
import { CardGrid } from './CardGrid'
import { Comparison, Funnel, ScaleStrip, Venn } from './Diagrams'
import { DonateBanner } from './DonateBanner'
import { Events } from './Events'
import { FaqList } from './FaqList'
import { Flow } from './Flow'
import { Form } from './Form'
import { Hero } from './Hero'
import { HostMap } from './HostMap'
import { LogoGrid } from './LogoGrid'
import { NewsTeaser } from './NewsTeaser'
import { Roadmap } from './Roadmap'
import { RichText } from './RichText'
import { Schedule } from './Schedule'
import { Statement } from './Statement'
import { SummitWeek } from './SummitWeek'
import { SupporterLevels } from './SupporterLevels'
import { Team } from './Team'

// SPEC §6.3. `video` (T016) and `hostCountriesTeaser` (T020) join in Release 2.
export const pageBlocks: Block[] = [
  Hero,
  RichText,
  Statement,
  HostMap,
  SummitWeek,
  Events,
  Schedule,
  Roadmap,
  Flow,
  ScaleStrip,
  Venn,
  Funnel,
  Comparison,
  CardGrid,
  Accordion,
  ActionAreas,
  SupporterLevels,
  LogoGrid,
  Team,
  FaqList,
  NewsTeaser,
  DonateBanner,
  Form,
  AnchorDay,
]

// Replaced by `schedule`. Kept in the config so the previous deployment still reads its tables
// (SPEC §11.2), but editors can no longer add it. A later release removes it and drops them.
export const retiredBlocks = ['events']

export const allowedBlocks = pageBlocks
  .map(({ slug }) => slug)
  .filter((slug) => !retiredBlocks.includes(slug))
