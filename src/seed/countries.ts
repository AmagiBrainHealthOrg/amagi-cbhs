import type {
  DataFromGlobalSlug,
  Payload,
  PayloadRequest,
  RequiredDataFromCollectionSlug,
} from 'payload'

// Amagi's country pages copy of 10 November 2026. Each country links to the session location
// with the same name.

type SeedCountry = Omit<RequiredDataFromCollectionSlug<'countries'>, 'location'>

const paragraphs = (...values: string[]) => values.join('\n\n')

export const seedCountries: SeedCountry[] = [
  {
    name: 'Barbados',
    slug: 'barbados',
    order: 0,
    tagline: 'Connecting brain health, innovation and economic resilience',
    intro: paragraphs(
      "Barbados's contribution asks how brain health can become part of development planning—not only a healthcare concern. The programme connects life-course community activities with discussion of the resources and partnerships needed to strengthen prevention, care and support.",
      'Locally led research and an emerging health-innovation ecosystem offer foundations. The question is what enables evidence and promising ideas to translate into dependable provision: appropriate validation, workforce capability, workable financing, clear responsibilities and equitable access.',
      'Tourism and other employers also belong in the conversation—as potential partners in workforce wellbeing, support for employees with caring responsibilities, and services responsive to changing needs. The inaugural Summit offers a starting point for practical collaboration and sustained regional learning, without assuming that future partnerships or hosting arrangements are already agreed.',
    ),
    hosts:
      "The Barbados Alzheimer's Association has helped make this contribution possible, drawing on its established networks to support media engagement and connections with family caregivers.",
    priorities: {
      question:
        'How can research, innovation, community relationships and financing connect around a manageable priority, while addressing gaps between public, private and community provision?',
      strengths:
        'Clinical, research, legal, community and innovation perspectives, together with established advocacy networks.',
      nextStep:
        'Identify one priority for further scoping, the evidence needed, and the organisations or disciplines that should join the next conversation.',
      regional:
        'Comparative learning, diaspora expertise and appropriate technical or institutional connections.',
    },
  },
  {
    name: 'Cayman Islands',
    slug: 'cayman-islands',
    order: 1,
    tagline: 'Connecting innovation with practical family support',
    intro: paragraphs(
      'The Cayman Islands contribution brings scientific and technological possibilities into conversation with the everyday experience of people and families. Tech & Thrive explores brain-health developments, while the Relay, Paint Cayman Purple and a Memory Café offer other routes into learning, participation and connection.',
      'The broader question is not simply which technologies are available. It is how assessment, treatment, information, practical assistance and continuing support connect across organisations—and what happens when families encounter gaps.',
      'Clinical, community and voluntary-sector experience provides a foundation for comparing approaches and identifying practical work. The Summit creates space to share those questions across settings without assuming that the same technology, service or funding model will work everywhere.',
    ),
    priorities: {
      question:
        'How can existing services and expertise connect more effectively with practical support for people and families?',
      strengths:
        'Existing clinical, community and voluntary-sector relationships and experience of supporting families.',
      nextStep:
        'Identify a specific coordination or access difficulty, clarify the information needed and bring the relevant organisations into a focused follow-up discussion.',
      regional:
        'Peer learning on navigation, service connections and appropriate innovation, adapted to local circumstances.',
    },
  },
  {
    name: 'Jamaica',
    slug: 'jamaica',
    order: 2,
    tagline: 'Connecting skills, care pathways and locally grounded leadership',
    intro: paragraphs(
      "Jamaica's contribution links practical workforce development with locally grounded leadership. Cognitive-screening training in Kingston and St Ann focuses on assessment and appropriate next steps, with interest in subsequent supervised practice considered separately.",
      'The emphasis is not simply on learning a tool. It is on professional scope, supervision, clinical review and referral arrangements. Training does not by itself authorise independent screening, establish a diagnosis or guarantee a supervised placement.',
      'Jamaica also hosts the inaugural Anchor Day leadership roundtable: a focused, invitation-only conversation convened by Dr Ishtar Govia on brain health, care capacity, workforce readiness and practical next steps within the wider Caribbean agenda. It complements—not replaces—the public and community contributions across Summit week.',
    ),
    hosts:
      'Amagi Health convenes the Summit and coordinates its Jamaica contribution with local contributors. Organisations and individuals supporting specific activities will be acknowledged according to their agreed roles.',
    priorities: {
      question:
        'What must surround workforce skills so that people can obtain appropriate assessment and dependable continuing support?',
      strengths:
        'Clinical, research and community experience, alongside perspectives on planning, business and care.',
      nextStep:
        'Clarify one bounded improvement and its evidence, supervision, referral, organisational and resource requirements.',
      regional:
        'Shared methods and learning, and connections that support locally led research and delivery.',
    },
  },
  {
    name: 'Suriname',
    slug: 'suriname',
    order: 3,
    tagline: 'Connecting care, rights and evidence',
    intro: paragraphs(
      "Suriname's country dialogue brings together noncommunicable diseases, geriatrics, human rights and cerebral palsy, placing brain health within a wider conversation about care, inclusion and development.",
      'The emphasis is on recognising foundations already being built alongside the practical constraints affecting services, workforce capacity and evidence generation. Professional education, work towards registries and collaboration across disciplines offer starting points.',
      'The dialogue invites each perspective to identify an asset, a bottleneck and a concrete next step. Participation in the inaugural Summit offers a way for Suriname to inform regional learning and benefit from it, while defining its own priorities rather than adopting an externally prescribed programme.',
    ),
    priorities: {
      question:
        'What support would help existing clinical, educational and evidence-building activity develop into more connected and sustainable capacity?',
      strengths:
        'Cross-disciplinary expertise, professional education and work towards stronger information and registry resources.',
      nextStep:
        'Identify a priority emerging from the dialogue and clarify the collaborators, capacity and permissions needed to explore it.',
      regional:
        'Appropriate methods, workforce learning and exchange across languages, disciplines and health-system contexts.',
    },
  },
  {
    name: 'Trinidad and Tobago',
    slug: 'trinidad-and-tobago',
    order: 4,
    tagline: 'Connecting culture, faith, innovation and care',
    intro: paragraphs(
      "Trinidad and Tobago's contribution connects cultural creativity, faith communities, professional perspectives and Caribbean-developed innovation. In Trinidad, PanJam combines steelpan-inspired music and virtual reality, exploring approaches to cognitive research and engagement.",
      "A planned community afternoon in Tunapuna brings demonstrations together with music, movement and brain-health information, complementing Tobago's activities across generations. Contributions to religious newspapers and planned greetings from the Summit Convenor to church congregations bring faith communities into the conversation.",
      "Women's health, occupational therapy and psychiatry offer further perspectives on life stages, everyday functioning and support. The aim is to connect these strengths with the evidence, relationships and resources needed for accessible, dependable care—not simply showcase projects or raise awareness.",
    ),
    priorities: {
      question:
        'How can cultural knowledge, community relationships, professional expertise and locally developed ideas work together to strengthen brain health and support across the life course?',
      strengths:
        'Creative and technical expertise, faith and community relationships, clinical perspectives and existing support networks.',
      nextStep:
        'Identify a local gap or opportunity and clarify what would be needed to evaluate and develop an appropriate response.',
      regional:
        'Responsible evaluation, cross-disciplinary learning and connections with Caribbean and diaspora collaborators.',
    },
  },
]

export const countryPagesCopy: Omit<DataFromGlobalSlug<'country-pages'>, 'id'> = {
  index: {
    kicker: 'Where it happens',
    heading: 'Across the region, and online',
    lead: 'Each host country runs its own programme of free, local activity. Online sessions let anyone in the region or the diaspora join in.',
  },
  programme: {
    heading: 'Explore the programme',
    intro:
      'Browse the confirmed {country} activities below. Some are open to the public; others require registration, selection or an invitation. Check each listing for local time, location and access arrangements before making plans.',
    timeZoneNote: 'Times are in {country} time.',
  },
  hosts: {
    heading: 'Local hosts and contributors',
    note: "Each activity listing identifies its host and contributors. These roles are specific to the activity; taking part does not automatically imply endorsement by an individual's employer or by another institution.",
  },
  priorities: {
    heading: 'Priorities to develop together',
    intro:
      'The following is an emerging discussion focus for the country team, not an adopted national position. We welcome experience and evidence that can help test and refine it.',
    questionLabel: 'The question',
    strengthsLabel: 'Strengths to build on',
    nextStepLabel: 'A possible local next step',
    regionalLabel: 'Where regional cooperation could help',
  },
  takePart: {
    heading: 'Find your way to take part',
    cards: [
      {
        icon: 'users',
        title: 'Attend',
        body: 'Choose a suitable event from the listings and follow its access instructions.',
        linkLabel: 'View country activities',
        linkHref: '/summit-week?country={slug}#programme',
      },
      {
        icon: 'hand-heart',
        title: 'Contribute expertise or practical support',
        body: 'Tell us what you could offer and which local priority or activity it relates to. A suitable role or speaking opportunity is not guaranteed.',
        linkLabel: 'Express interest in this country',
        linkHref: '/partner?country={slug}#partner-form',
      },
      {
        icon: 'megaphone',
        title: 'Host a Relay activity',
        body: 'Propose an hour-long activity you or your organisation will organise and lead. Programme inclusion and any support must be confirmed separately.',
        linkLabel: 'Propose a Relay activity',
        linkHref: '/relay?country={slug}',
      },
      {
        icon: 'file-text',
        title: 'Help shape the agenda',
        body: 'Contribute to the Caribbean Call to Action on Brain Health consultation.',
        linkLabel: 'Contribute to the consultation',
        linkHref: '/call-to-action#have-your-say',
      },
    ],
    stayConnectedLabel: 'Stay connected:',
    stayConnected:
      "express interest in future work if you cannot contribute during this November's programme.",
  },
  beyond: {
    heading: 'Beyond Summit week',
    body: paragraphs(
      'The intention is to carry forward useful priorities, relationships and agreed next steps—not only repeat the events. Further work will depend on the people, responsibilities, resources and permissions agreed. Expressing interest does not create a commitment to organise an activity or join a project.',
      "Interested in wider conversations? Explore the [shared online programme](/summit-week) and [other country contributions](/countries). Please use the appropriate local service's contact route for immediate care enquiries; Summit registration is not a clinical referral service.",
    ),
  },
  about: {
    heading: 'About this contribution',
    body: 'These activities form part of the Caribbean Brain Health Summit 2026, convened by Amagi Health. Local hosts lead their own agreed activities. For the current regional programme and ways to participate, visit [amagisummit.org](/).',
  },
}

type Args = { payload: Payload; req?: PayloadRequest }

// Creates the countries that are missing, by slug, each linked to the session location with
// its name. Never updates an existing country, so editors' changes are kept.
export async function createMissingCountries({ payload, req }: Args): Promise<string[]> {
  const created: string[] = []
  const context = { disableRevalidate: true }
  const { docs: locations } = await payload.find({
    collection: 'session-locations',
    pagination: false,
    depth: 0,
    draft: true,
    req,
  })
  const locationIds = new Map(locations.map((location) => [location.name, location.id]))
  for (const country of seedCountries) {
    const { totalDocs } = await payload.count({
      collection: 'countries',
      where: { slug: { equals: country.slug } },
      req,
    })
    const location = locationIds.get(country.name)
    if (totalDocs > 0 || location === undefined) continue
    await payload.create({
      collection: 'countries',
      data: { ...country, location, _status: 'published' },
      context: { ...context },
      req,
    })
    created.push(`countries:${country.slug}`)
  }
  return created
}
