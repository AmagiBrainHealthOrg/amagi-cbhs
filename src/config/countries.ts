// TODO: country page copy is hard-coded for launch. Move it into the CMS so editors can change it.
// Sessions and team members come from Payload; `teamCountries` matches the team's `country` field.

export type Country = {
  slug: string
  name: string
  tagline: string
  timeZone: string
  intro: string[]
  anchorDay?: boolean
  hosts?: string
  teamCountries: string[]
  question: string
  strengths: string
  nextStep: string
  regional: string
  galleryCount: number
}

export const countries: Country[] = [
  {
    slug: 'barbados',
    name: 'Barbados',
    tagline: 'Connecting brain health, innovation and economic resilience',
    timeZone: 'Barbados time',
    intro: [
      "Barbados's contribution asks how brain health can become part of development planning—not only a healthcare concern. The programme connects life-course community activities with discussion of the resources and partnerships needed to strengthen prevention, care and support.",
      'Locally led research and an emerging health-innovation ecosystem offer foundations. The question is what enables evidence and promising ideas to translate into dependable provision: appropriate validation, workforce capability, workable financing, clear responsibilities and equitable access.',
      'Tourism and other employers also belong in the conversation—as potential partners in workforce wellbeing, support for employees with caring responsibilities, and services responsive to changing needs. The inaugural Summit offers a starting point for practical collaboration and sustained regional learning, without assuming that future partnerships or hosting arrangements are already agreed.',
    ],
    hosts:
      "The Barbados Alzheimer's Association has helped make this contribution possible, drawing on its established networks to support media engagement and connections with family caregivers.",
    teamCountries: ['Barbados'],
    question:
      'How can research, innovation, community relationships and financing connect around a manageable priority, while addressing gaps between public, private and community provision?',
    strengths:
      'Clinical, research, legal, community and innovation perspectives, together with established advocacy networks.',
    nextStep:
      'Identify one priority for further scoping, the evidence needed, and the organisations or disciplines that should join the next conversation.',
    regional:
      'Comparative learning, diaspora expertise and appropriate technical or institutional connections.',
    galleryCount: 6,
  },
  {
    slug: 'cayman-islands',
    name: 'Cayman Islands',
    tagline: 'Connecting innovation with practical family support',
    timeZone: 'Cayman Islands time',
    intro: [
      'The Cayman Islands contribution brings scientific and technological possibilities into conversation with the everyday experience of people and families. Tech & Thrive explores brain-health developments, while the Relay, Paint Cayman Purple and a Memory Café offer other routes into learning, participation and connection.',
      'The broader question is not simply which technologies are available. It is how assessment, treatment, information, practical assistance and continuing support connect across organisations—and what happens when families encounter gaps.',
      'Clinical, community and voluntary-sector experience provides a foundation for comparing approaches and identifying practical work. The Summit creates space to share those questions across settings without assuming that the same technology, service or funding model will work everywhere.',
    ],
    teamCountries: ['Cayman Islands'],
    question:
      'How can existing services and expertise connect more effectively with practical support for people and families?',
    strengths:
      'Existing clinical, community and voluntary-sector relationships and experience of supporting families.',
    nextStep:
      'Identify a specific coordination or access difficulty, clarify the information needed and bring the relevant organisations into a focused follow-up discussion.',
    regional:
      'Peer learning on navigation, service connections and appropriate innovation, adapted to local circumstances.',
    galleryCount: 6,
  },
  {
    slug: 'jamaica',
    name: 'Jamaica',
    tagline: 'Connecting skills, care pathways and locally grounded leadership',
    timeZone: 'Jamaica time',
    intro: [
      "Jamaica's contribution links practical workforce development with locally grounded leadership. Cognitive-screening training in Kingston and St Ann focuses on assessment and appropriate next steps, with interest in subsequent supervised practice considered separately.",
      'The emphasis is not simply on learning a tool. It is on professional scope, supervision, clinical review and referral arrangements. Training does not by itself authorise independent screening, establish a diagnosis or guarantee a supervised placement.',
      'Jamaica also hosts the inaugural Anchor Day leadership roundtable: a focused, invitation-only conversation convened by Dr Ishtar Govia on brain health, care capacity, workforce readiness and practical next steps within the wider Caribbean agenda. It complements—not replaces—the public and community contributions across Summit week.',
    ],
    anchorDay: true,
    hosts:
      'Amagi Health convenes the Summit and coordinates its Jamaica contribution with local contributors. Organisations and individuals supporting specific activities will be acknowledged according to their agreed roles.',
    teamCountries: ['Jamaica'],
    question:
      'What must surround workforce skills so that people can obtain appropriate assessment and dependable continuing support?',
    strengths:
      'Clinical, research and community experience, alongside perspectives on planning, business and care.',
    nextStep:
      'Clarify one bounded improvement and its evidence, supervision, referral, organisational and resource requirements.',
    regional:
      'Shared methods and learning, and connections that support locally led research and delivery.',
    galleryCount: 6,
  },
  {
    slug: 'suriname',
    name: 'Suriname',
    tagline: 'Connecting care, rights and evidence',
    timeZone: 'Suriname time',
    intro: [
      "Suriname's country dialogue brings together noncommunicable diseases, geriatrics, human rights and cerebral palsy, placing brain health within a wider conversation about care, inclusion and development.",
      'The emphasis is on recognising foundations already being built alongside the practical constraints affecting services, workforce capacity and evidence generation. Professional education, work towards registries and collaboration across disciplines offer starting points.',
      'The dialogue invites each perspective to identify an asset, a bottleneck and a concrete next step. Participation in the inaugural Summit offers a way for Suriname to inform regional learning and benefit from it, while defining its own priorities rather than adopting an externally prescribed programme.',
    ],
    teamCountries: ['Suriname'],
    question:
      'What support would help existing clinical, educational and evidence-building activity develop into more connected and sustainable capacity?',
    strengths:
      'Cross-disciplinary expertise, professional education and work towards stronger information and registry resources.',
    nextStep:
      'Identify a priority emerging from the dialogue and clarify the collaborators, capacity and permissions needed to explore it.',
    regional:
      'Appropriate methods, workforce learning and exchange across languages, disciplines and health-system contexts.',
    galleryCount: 6,
  },
  {
    slug: 'trinidad-and-tobago',
    name: 'Trinidad and Tobago',
    tagline: 'Connecting culture, faith, innovation and care',
    timeZone: 'Trinidad and Tobago time',
    intro: [
      "Trinidad and Tobago's contribution connects cultural creativity, faith communities, professional perspectives and Caribbean-developed innovation. In Trinidad, PanJam combines steelpan-inspired music and virtual reality, exploring approaches to cognitive research and engagement.",
      "A planned community afternoon in Tunapuna brings demonstrations together with music, movement and brain-health information, complementing Tobago's activities across generations. Contributions to religious newspapers and planned greetings from the Summit Convenor to church congregations bring faith communities into the conversation.",
      "Women's health, occupational therapy and psychiatry offer further perspectives on life stages, everyday functioning and support. The aim is to connect these strengths with the evidence, relationships and resources needed for accessible, dependable care—not simply showcase projects or raise awareness.",
    ],
    teamCountries: ['Trinidad and Tobago', 'Trinidad', 'Tobago'],
    question:
      'How can cultural knowledge, community relationships, professional expertise and locally developed ideas work together to strengthen brain health and support across the life course?',
    strengths:
      'Creative and technical expertise, faith and community relationships, clinical perspectives and existing support networks.',
    nextStep:
      'Identify a local gap or opportunity and clarify what would be needed to evaluate and develop an appropriate response.',
    regional:
      'Responsible evaluation, cross-disciplinary learning and connections with Caribbean and diaspora collaborators.',
    galleryCount: 6,
  },
]

export const findCountry = (slug: string) => countries.find((country) => country.slug === slug)
