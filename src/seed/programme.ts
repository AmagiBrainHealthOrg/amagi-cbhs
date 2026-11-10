import type { SummitDay, ThemeColour } from '@/config/summit'

// The CBHS 2026 programme from Amagi (3 November 2026). The programme_sessions migration and
// `pnpm db:seed` create what is missing; after that, editors own the sessions in the CMS.
// A missing day or time shows as TBC on the schedule.

export const seedThemes = [
  { name: 'Policy & Investment', colour: 'blue' },
  { name: 'Research & Data', colour: 'purple' },
  { name: 'Care & Workforce', colour: 'teal' },
  { name: 'Family & Caregivers', colour: 'orange' },
  { name: 'Community', colour: 'green' },
  { name: 'Life-course', colour: 'pink' },
  { name: 'Technology & Innovation', colour: 'amber' },
] as const satisfies readonly { name: string; colour: ThemeColour }[]

type ThemeName = (typeof seedThemes)[number]['name']

export type LocationName =
  | 'Online'
  | 'Jamaica'
  | 'Suriname'
  | 'Barbados'
  | 'Trinidad and Tobago'
  | 'Cayman Islands'
  | 'United States'

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type Time =
  | `${'0' | '1'}${Digit}:${'0' | '1' | '2' | '3' | '4' | '5'}${Digit}`
  | `2${'0' | '1' | '2' | '3'}:${'0' | '1' | '2' | '3' | '4' | '5'}${Digit}`

export type SeedSession = {
  title: string
  /** Set when the title has changed since the session went live, so its web address stays. */
  slug?: string
  location: LocationName
  /** Online sessions: the host country whose page also lists it. */
  country?: Exclude<LocationName, 'Online' | 'United States'>
  theme?: ThemeName
  day?: SummitDay
  startTime?: Time
  endTime?: Time
  /** In-person sessions only. */
  venue?: string
  /** Online sessions only. */
  zoomUrl?: `https://${string}`
  /** Replaces the location's default when a session offers several ways to register. */
  registrationOptions?: (
    { label: string; method: 'form' } | { label: string; method: 'link'; url: `https://${string}` }
  )[]
  /** Defaults to true. */
  registrationOpen?: boolean
  description?: string
  /** Defaults to true; false keeps the session a draft. */
  published?: boolean
}

export const seedSessions: SeedSession[] = [
  {
    title: 'Caribbean Brain Health & Brain Economy Leadership Roundtable',
    location: 'Jamaica',
    theme: 'Policy & Investment',
    day: '2026-11-16',
    startTime: '09:30',
    endTime: '12:00',
    venue: 'UWI Mona Council Room',
    registrationOpen: false,
    description:
      'An in-person leadership roundtable connecting brain health, ageing and dementia care with workforce capability, family responsibilities, public services and economic planning. The discussion will identify existing strengths, practical barriers and opportunities for national and regional cooperation, clarifying priorities and next steps rather than announcing a completed regional plan. Attendance is by invitation.',
  },
  {
    title: "Barbados Alzheimer's Association — Brain Health Relay",
    location: 'Barbados',
    theme: 'Community',
    day: '2026-11-16',
    registrationOpen: false,
    description: 'Barbados Brain Health Relay contribution.',
  },
  {
    title: 'From Data to Action: Strengthening Caribbean Brain Health Systems',
    location: 'Online',
    theme: 'Research & Data',
    day: '2026-11-17',
    startTime: '10:00',
    endTime: '11:00',
    zoomUrl: 'https://us02web.zoom.us/webinar/register/WN_YHx_C_-ySf-jkExTxJnVdw',
    description:
      'What information do Caribbean countries need to plan for brain health, and what helps turn it into action? This online dialogue connects national planning needs with the realities of clinical information, digital systems and public-health implementation, including the people, processes and governance needed for responsible information use. Contributors: Dr Renato Oliveira e Souza (PAHO), Dr Keisha Barwise and Dr Brian Armour (CARPHA). Moderated by Dr Ishtar Govia.',
  },
  {
    title: 'Dementia Moments — Kingston / St Andrew',
    location: 'Jamaica',
    theme: 'Care & Workforce',
    day: '2026-11-17',
    startTime: '12:00',
    venue: 'Medical Association of Jamaica Conference Room',
    description:
      "An immersive educational experience encouraging reflection on communication, environments and support for people living with dementia, and how participants' own practice, organisation or service could become more understanding and responsive. This is an educational experience, not a diagnostic assessment or a complete representation of any individual's experience of dementia.",
  },
  {
    title: 'Brain Health Empowerment Day: A Passport to a Stronger Brain',
    slug: 'brain-health-empowerment-day-a-passport-to-a-stronger-brain',
    location: 'United States',
    theme: 'Community',
    day: '2026-11-17',
    startTime: '13:00',
    endTime: '15:00',
    venue: 'East County Community Center, 3310 Gateshead Manor Way, Silver Spring, MD 20904',
    registrationOpen: false,
    description:
      'An interactive afternoon of brain-health learning, practical activities and community connection hosted by Resilient Health Communities. Using a Brain Boost Passport, participants visit four activity stops (reading aloud, simple maths, handwriting a reflection and exploring a practical next step), followed by a light lunch. A community education activity, not a diagnostic assessment. No advance registration or fee is required. Attendance is open, with seating on a first-come, first-seated basis, subject to venue capacity. For practical questions, contact Rhonda Baird on 301-655-9660.',
  },
  {
    title: 'Brain Boost Boot Camp — Tobago Edition: Recall. Reconnect. Refresh.',
    location: 'Trinidad and Tobago',
    theme: 'Community',
    day: '2026-11-17',
    startTime: '16:30',
    endTime: '18:00',
    venue: 'Scarborough Library, Tobago',
    description:
      "A gathering for Brain Health Ambassadors and community participants to reconnect, refresh their learning and share their contributions to brain health in Tobago. Organised by the Tobago Alzheimer's Support Group of the Alzheimer's Association of Trinidad and Tobago with Resilient Health Communities, and led in part by the Ambassadors themselves.",
  },
  {
    title:
      'Cayman Islands: Tech & Thrive Tuesday — Science, Technology and the Future of Brain Health',
    location: 'Online',
    country: 'Cayman Islands',
    theme: 'Technology & Innovation',
    day: '2026-11-17',
    startTime: '18:00',
    endTime: '20:30',
    zoomUrl: 'https://us02web.zoom.us/webinar/register/WN_fZObaeV8Qb2xFiHFJvedGw',
    description:
      'An accessible evening connecting clinical care, laboratory research and practical uses of artificial intelligence in brain health, with talks from Dr Romnesh de Souza and Ms Rebekah Brooks (Health City Cayman Islands), Dr Laura Goff (University of Kent) and Dr Eustache Placide (UCCI). Contributors will consider possibilities, limitations and what it takes for innovation to become useful in everyday life. Moderated by Dr Noviann McLean-Gregory.',
  },
  {
    title: 'Baby & Mom Brain Health Information Pack Handover',
    location: 'Barbados',
    theme: 'Life-course',
    day: '2026-11-17',
    registrationOpen: false,
    description:
      "A proposed handover of a Baby & Mom Brain Health Information Pack, bringing an early-life perspective to Barbados's contribution to the Summit. The pack's content, receiving organisation and distribution arrangements are being finalised.",
  },
  {
    title: 'Barbados Council for the Disabled — Brain Health Relay',
    location: 'Barbados',
    theme: 'Community',
    day: '2026-11-17',
    registrationOpen: false,
    description: 'Barbados Brain Health Relay contribution.',
  },
  {
    title: 'Cayman Brain Health Relay — Day 1',
    location: 'Cayman Islands',
    theme: 'Community',
    day: '2026-11-18',
    startTime: '10:00',
    registrationOpen: false,
    description:
      'Cayman organisations and community groups take turns holding the baton in the Brain Health Relay, with contributions from business, nursing education, civil-service wellness, healthcare and sport. Please check the individual contribution details before attending or joining, as a listed time does not necessarily mean an activity is open for in-person attendance.',
  },
  {
    title: 'Walking for Brain Health: Staff Wellness Walk',
    slug: 'cayman-brain-health-relay-global-captive-management',
    location: 'Cayman Islands',
    theme: 'Community',
    day: '2026-11-18',
    startTime: '10:00',
    endTime: '11:00',
    registrationOpen: false,
    description:
      'Global Captive Management staff will take part in a wellness walk highlighting the relationship between physical activity, wellbeing and brain health, encouraging movement during the working day and reflection on healthy everyday habits. Lead: Mr Daval Gregory, Software Developer. Internal event for staff only.',
  },
  {
    title:
      'Investing in Caribbean Brain Health: The Economic Case, the Evidence and the Delivery Conditions',
    location: 'Online',
    theme: 'Policy & Investment',
    day: '2026-11-18',
    startTime: '11:00',
    endTime: '12:00',
    zoomUrl: 'https://us02web.zoom.us/webinar/register/WN_WyP-FcvFTT2VZZbQajPdCQ',
    description:
      'What would make investment in Caribbean brain health credible, useful and implementable? This cross-sector dialogue brings together Caribbean economic perspectives, population-health evidence and research on long-term care and unpaid caring, examining what existing evidence supports and the conditions needed for delivery. Contributors: Marla Dukharan, Dr Kate Gillespie and Dr Derek King. Moderated by Dr Ishtar Govia.',
  },
  {
    title: 'Cayman Brain Health Relay — Ruth Eleanor McLaughlin School of Nursing, UCCI',
    slug: 'cayman-brain-health-relay-ruth-eleanor-mclaughlin-school-of-nursing-ucci',
    location: 'Cayman Islands',
    theme: 'Community',
    day: '2026-11-18',
    startTime: '11:00',
    endTime: '12:00',
    registrationOpen: false,
    description:
      'Ruth Eleanor McLaughlin School of Nursing (UCCI) contribution to the Cayman Brain Health Relay. Coordination contact: Professor Jusene Brown, School of Nursing.',
  },
  {
    title: 'Brain Health Hour: Individual Brain-Boosting Activities',
    slug: 'cayman-brain-health-relay-wellness-team-portfolio-of-the-civil-service',
    location: 'Cayman Islands',
    theme: 'Community',
    day: '2026-11-18',
    startTime: '12:00',
    endTime: '13:00',
    registrationOpen: false,
    description:
      'Civil Service employees take a break from their work routine to complete independent desk-based activities supporting memory, focus, creativity and relaxation: a memory challenge, brain games, mindful breathing, creative thinking and personal reflection. Lead: Dr Charmane Dalhouse-Morgan, Corporate Wellness Officer, Wellness Unit – Portfolio of the Civil Service. Internal event for participating employees.',
  },
  {
    title: 'Cognitive-Screening Training — Kingston',
    location: 'Jamaica',
    theme: 'Care & Workforce',
    day: '2026-11-18',
    startTime: '13:00',
    endTime: '16:00',
    venue: 'TBC, Kingston',
    description:
      'A practical training session for general practitioners, medical officers and primary-care staff on recognising cognitive concerns and connecting screening with appropriate assessment, referral and follow-up. The emphasis is on what happens around and after screening, not simply completing a test. Participation does not confer a specialist qualification.',
  },
  {
    title: 'Mind Yuh Mind: Brain Health and Young Adults',
    location: 'Online',
    theme: 'Life-course',
    day: '2026-11-18',
    startTime: '12:00',
    registrationOpen: false,
    description:
      "A JCI-hosted Instagram Live roundtable exploring brain-health risk reduction and its relevance to young people's everyday lives. Open to the public and JCI members across the Caribbean, this Tobago-led conversation makes space for questions and practical ways to engage with brain health earlier in life. Starts at 1:00 pm Trinidad and Tobago time on Instagram Live.",
  },
  {
    title: 'Cayman Brain Health Relay — Health City Cayman Islands',
    slug: 'cayman-brain-health-relay-health-city-cayman-islands',
    location: 'Cayman Islands',
    theme: 'Community',
    day: '2026-11-18',
    startTime: '13:00',
    endTime: '14:00',
    registrationOpen: false,
    description:
      'Internal staff contribution from Health City Cayman Islands; activity details have not yet been provided. Contact: Ms Rebekah Brooks, Head of Marketing and Sales. Internal event.',
  },
  {
    title: 'Netball for Brain Health: Movement, Connection and Teamwork',
    slug: 'cayman-brain-health-relay-allstars-netball-club',
    location: 'Online',
    country: 'Cayman Islands',
    theme: 'Community',
    day: '2026-11-18',
    startTime: '14:00',
    endTime: '15:00',
    registrationOpen: false,
    description:
      'A pre-recorded video (about 30 minutes) from AllStars Netball Club showcasing how netball brings together physical activity, social connection, coordination, decision-making and teamwork. Players reflect on wellbeing, managing stress and supporting people and families affected by dementia. Leads: Ms Lyneth Montieth, President, and Ms Georgie Muir, Fundraising Coordinator.',
  },
  {
    title: 'Move, Play & Create for Brain Health',
    slug: 'cayman-brain-health-relay-health-services-authority',
    location: 'Cayman Islands',
    theme: 'Community',
    day: '2026-11-18',
    startTime: '15:00',
    endTime: '16:00',
    venue: 'Hibiscus Rooms, HSA',
    registrationOpen: false,
    description:
      'Health Services Authority staff will take part in gait-speed tests, musical bingo and an art and colouring space, exploring mobility, cognition, creativity, social engagement and wellbeing. Leads: Dr Sunku Guptha, Internal Medicine Physician/Geriatrician, and Dr Dwaine Cooke, Neurosurgeon. Internal event for HSA staff only.',
  },
  {
    title: 'Financing Brain Health and Healthy Ageing in Barbados',
    location: 'Barbados',
    theme: 'Policy & Investment',
    day: '2026-11-18',
    startTime: '18:00',
    venue: 'Solidarity House, Harmony Hall, St Michael, Barbados',
    description:
      "A proposed in-person panel connecting Barbados's financing and development discussions with practical questions about prevention, care, workforce capability and family support. Proposed contributors include Ryan Straughn, Dr Jeremy Stephens and Christine Franklyn, with Kaila Branch as moderator; participation to be confirmed.",
  },
  {
    title:
      'Move for Your Mind: Exploring the Role and Methods of Regular Activity in Ageing and Brain Health',
    location: 'Barbados',
    theme: 'Community',
    day: '2026-11-18',
    registrationOpen: false,
    description:
      'A proposed contribution from Dr Vickster Fitness exploring regular activity in the context of ageing and brain health, connecting the topic with participation, accessibility and opportunities to remain active. Part of the Barbados Brain Health Relay; audience, format and arrangements to be confirmed.',
  },
  {
    title: 'Cayman Brain Health Relay — Day 2',
    location: 'Cayman Islands',
    theme: 'Community',
    day: '2026-11-19',
    startTime: '09:00',
    registrationOpen: false,
    description:
      "Day 2 of Cayman's Brain Health Relay brings together pre-recorded and live virtual contributions from research, medical education, community sport and the Cayman Longevity Program. Please check the individual listings for topic, format and viewing arrangements.",
  },
  {
    title: 'Building Caribbean Research Capacity: People, Data and Partnerships',
    location: 'Online',
    theme: 'Research & Data',
    day: '2026-11-19',
    startTime: '09:00',
    endTime: '10:30',
    zoomUrl: 'https://us02web.zoom.us/webinar/register/WN_hL88LVBQTLSubBoyepDaeQ',
    description:
      'What enables locally relevant Caribbean research, and allows the people doing it to develop beyond a single project or grant? This roundtable brings together researchers across Caribbean and diaspora settings to explore feasible studies, appropriate methods, mentorship, paid roles and partnerships that strengthen Caribbean leadership. Contributors: Dr Shonimá Gangaram-Panday, Ms Janelle Robinson, Dr Melanie Taylor-John, Dr Azizi Seixas, Dr Nekehia Quashie and Dr Neil Mehta. Moderated by Dr Ishtar Govia.',
  },
  {
    title: 'How the Brain Controls Health: Lessons from C. elegans',
    slug: 'cayman-brain-health-relay-the-tullet-laboratory',
    location: 'Online',
    country: 'Cayman Islands',
    theme: 'Research & Data',
    day: '2026-11-19',
    startTime: '09:00',
    endTime: '10:00',
    registrationOpen: false,
    description:
      'A pre-recorded research video (about 9 minutes) from the Tullet Laboratory on using the model organism C. elegans to investigate how a gene and neuronal signalling influence appetite, behaviour and metabolism. Lead: Dr Jennifer Tullet, Reader in Biogerontology.',
  },
  {
    title: 'How the microbiome affects health',
    slug: 'cayman-brain-health-relay-the-ezcurra-laboratory',
    location: 'Online',
    country: 'Cayman Islands',
    theme: 'Research & Data',
    day: '2026-11-19',
    startTime: '10:00',
    endTime: '11:00',
    registrationOpen: false,
    description:
      'A pre-recorded research talk (about 40 minutes) from the Ezcurra Laboratory exploring connections between the gut microbiome, health and neurodegeneration through studies using C. elegans. Lead: Dr Marina Ezcurra, Senior Lecturer in the Biology of Ageing.',
  },
  {
    title:
      'Our Brain, Our Future: Different Perspectives on Brain Health in Suriname and the Caribbean',
    location: 'Suriname',
    theme: 'Policy & Investment',
    day: '2026-11-19',
    startTime: '13:00',
    endTime: '14:00',
    registrationOptions: [
      { label: 'Attend in person', method: 'form' },
      {
        label: 'Join online',
        method: 'link',
        url: 'https://us02web.zoom.us/webinar/register/WN_cnUOb_lLQ8yZZJrubWTWHg',
      },
    ],
    description:
      'A Suriname-led online conversation bringing together perspectives on clinical care, cognition and mental wellbeing, ageing, human rights and public policy. It will explore what people and families need, the expertise already available, and a feasible next step for Suriname where regional cooperation could help. Held in English; 1:00–2:00 pm Suriname time.',
  },
  {
    title: 'MedTech, Neuroimaging and the Patient Care Journey',
    slug: 'cayman-longevity-program-morning-relay-session',
    location: 'Online',
    country: 'Cayman Islands',
    theme: 'Technology & Innovation',
    day: '2026-11-19',
    startTime: '11:00',
    endTime: '12:00',
    registrationOpen: false,
    description:
      'A Cayman Longevity Program webinar on the role of medical technology and neuroimaging in patient evaluation and the care journey. Lead: Ms Christina Rowlandson, Co-founder; additional speakers TBC.',
  },
  {
    title: 'The PAVING Wheel: Practical Approaches to Health and Wellbeing',
    slug: 'cayman-brain-health-relay-st-matthew-s-university-school-of-medicine',
    location: 'Online',
    country: 'Cayman Islands',
    theme: 'Community',
    day: '2026-11-19',
    startTime: '13:00',
    endTime: '14:00',
    registrationOpen: false,
    description:
      "A pre-recorded classroom session (up to 40 minutes) from St Matthew's University School of Medicine introducing the PAVING Wheel and practical lifestyle behaviours that support health and wellbeing. Leads: Dr Maribel Aurelio, Associate Dean of Basic Sciences, and Dr Gimena Marzan, Assistant Dean of Student Affairs.",
  },
  {
    title: 'Netball, Music and Brain Health',
    slug: 'cayman-brain-health-relay-netball-cayman',
    location: 'Online',
    country: 'Cayman Islands',
    theme: 'Community',
    day: '2026-11-19',
    startTime: '14:00',
    endTime: '15:00',
    registrationOpen: false,
    description:
      'A pre-recorded video from Netball Cayman incorporating music to celebrate netball, movement and community engagement. Lead: Ms Teneisha Wilson, President.',
  },
  {
    title: 'Everyday Habits, Cognitive Health and the Gut–Hormone–Brain Axis',
    slug: 'cayman-longevity-program-afternoon-relay-session',
    location: 'Online',
    country: 'Cayman Islands',
    theme: 'Life-course',
    day: '2026-11-19',
    startTime: '15:00',
    endTime: '16:00',
    registrationOpen: false,
    description:
      "A Cayman Longevity Program webinar on preventing cognitive decline, mild cognitive impairment and early dementia through everyday habits and a precision/functional neurology approach, including the gut–hormone–brain axis and women's health. Lead: Ms Christina Rowlandson, Co-founder; additional speakers TBC.",
  },
  {
    title: 'Brain Health Awareness Walk — Tobago',
    location: 'Trinidad and Tobago',
    theme: 'Community',
    day: '2026-11-19',
    startTime: '16:30',
    endTime: '17:30',
    venue: 'Tambrin Square, Scarborough, Tobago (proposed start)',
    description:
      "A community walk organised by the Tobago Alzheimer's Support Group of the Alzheimer's Association of Trinidad and Tobago, bringing attention to brain health and showing support for people living with dementia and their families. The proposed route starts at Tambrin Square and ends near Scarborough Library. Subject to police permission and confirmation of the final route.",
  },
  {
    title: 'Brain Health Toastmasters Speeches — Sunjet',
    location: 'Barbados',
    theme: 'Community',
    day: '2026-11-19',
    registrationOpen: false,
    description:
      'A Toastmasters contribution in which members deliver speeches on brain-health-related topics, bringing local perspectives and accessible communication into the programme. Participation TBC; format and access arrangements to be confirmed.',
  },
  {
    title: 'From Skills to Support: Connecting Brain Health Care in the Caribbean',
    location: 'Online',
    theme: 'Care & Workforce',
    day: '2026-11-20',
    startTime: '09:00',
    endTime: '10:30',
    zoomUrl: 'https://us02web.zoom.us/webinar/register/WN_51OaPs71QHe9BiylqTrGqQ',
    description:
      'A practical roundtable on the work around and between clinical appointments: helping families navigate services, supporting care workers, building community relationships and maintaining follow-up. Contributors include Melissa Da Costa (The Grey Area), Keisha Reid (Dignity in Care) and Rhonda Baird (Resilient Health Communities), with more to be announced. Moderated by Dr Ishtar Govia.',
  },
  {
    title: 'Music, Movement and Connection: Exploring Healthy Ageing Together',
    location: 'Trinidad and Tobago',
    theme: 'Community',
    day: '2026-11-20',
    startTime: '14:00',
    endTime: '18:00',
    venue: 'TBC, Trinidad',
    description:
      'An afternoon of discussion, steelpan music and accessible activities exploring healthy ageing and social connection in Trinidad. Hosted by Dingole Ltd with the Association of Psychiatrists in Trinidad & Tobago, the event includes an optional introduction to the early-stage PanJam initiative and will gather local priorities for the Caribbean Call to Action on Brain Health consultation.',
  },
  {
    title:
      'Invited Talk: Dr Ishtar Govia — Ministry of Health & Wellness National Health Research Conference',
    location: 'Jamaica',
    theme: 'Research & Data',
    day: '2026-11-20',
    registrationOpen: false,
    description:
      'Dr Ishtar Govia, Founder & CEO of Amagi Health and Convenor of CBHS 2026, will deliver an invited talk, in person and online, at the Ministry of Health & Wellness National Health Research Conference, in a 30-minute slot between 12 noon and 3:00 pm Jamaica time. Presentation title and exact time to be confirmed. Access is arranged by the conference organisers; please use their official registration or joining information.',
  },
  {
    title: 'Project Bright Minds: Early Brain Health & Wellness Outreach',
    location: 'Trinidad and Tobago',
    theme: 'Life-course',
    day: '2026-11-20',
    venue: 'Bright Gems Early Childhood Care and Education Centre, Tobago',
    registrationOpen: false,
    description:
      "A proposed early-years outreach activity led by the Youth Empowerment for Chronic Illness (YECI) Foundation for preschool children aged three to five, bringing an early-childhood perspective to the Summit. A school-based activity for participating pupils, not an open public event; subject to the school's permission.",
  },
  {
    title: 'Paint Cayman Purple',
    location: 'Cayman Islands',
    theme: 'Community',
    day: '2026-11-20',
    venue: 'Across participating workplaces, organisations and communities in the Cayman Islands',
    description:
      'An invitation to individuals, workplaces and community groups across Cayman to wear purple and start a conversation about brain health and dementia, showing support for people living with dementia and their families and connecting others with opportunities to learn more.',
  },
  {
    title: 'Living Wellness Legacy — Asha Jones — Brain Health Relay',
    location: 'Barbados',
    theme: 'Community',
    day: '2026-11-20',
    registrationOpen: false,
    description: 'Barbados Brain Health Relay contribution.',
  },
  {
    title: 'Menopause and Brain Health: Understanding Changes, Finding Support',
    location: 'Online',
    theme: 'Life-course',
    day: '2026-11-21',
    startTime: '05:00',
    endTime: '06:00',
    zoomUrl: 'https://us02web.zoom.us/webinar/register/WN_lS6948gZT46gkWYku-l1yQ',
    description:
      'A one-hour conversation with Dr Kamilah Vidale-Ellis, hosted by the British Caribbean Doctors & Dentists Association, exploring menopause-related concerns about memory, thinking and wellbeing, how to find appropriate assessment and support, and how healthcare professionals and employers can respond more effectively. 10:00–11:00 am UK time. General information only.',
  },
  {
    title: 'ADACI Memory Café',
    location: 'Cayman Islands',
    theme: 'Family & Caregivers',
    day: '2026-11-21',
    startTime: '10:00',
    endTime: '13:30',
    description:
      "A welcoming community gathering hosted by the Alzheimer's and Dementia Association of the Cayman Islands, offering people living with dementia, families, carers and community members a chance to spend time together in a supportive setting. Venue and attendance arrangements to be confirmed.",
  },
  {
    title: 'Community and Faith: A Message on Caribbean Brain Health',
    location: 'Trinidad and Tobago',
    theme: 'Community',
    day: '2026-11-21',
    registrationOpen: false,
    description:
      "Michèle Clavery will deliver a message from Summit Convenor Dr Ishtar Govia as part of a church gathering in Trinidad, inviting reflection on how faith communities can strengthen understanding, inclusion and support around brain health, dementia and family care. A contribution within the host church's programme, not a standalone public seminar.",
  },
  {
    title: 'Brain Health Toastmasters Speeches — Les Chalk',
    location: 'Barbados',
    theme: 'Community',
    day: '2026-11-21',
    registrationOpen: false,
    description:
      'A Toastmasters contribution in which members deliver speeches on brain-health-related topics, bringing local perspectives and accessible communication into the programme. Format and access arrangements to be confirmed.',
  },
  {
    title: 'Making Better Care Possible: Ageing, Brain Health and Frontline Practice',
    location: 'Online',
    theme: 'Care & Workforce',
    day: '2026-11-22',
    startTime: '14:00',
    endTime: '15:15',
    zoomUrl: 'https://us02web.zoom.us/webinar/register/WN_LQS8x6xVSeyVznddWCKbiA',
    description:
      'A cross-country conversation between three clinicians developing approaches to ageing and brain health in different settings, covering consultation time, prevention, assessment, patient preferences, teamwork, referrals and continuing support. Contributors: Dr Florelle Hobson (St Kitts and Nevis), Dr Khrystal Binns-Lee (Jamaica) and Dr Liane Conyette (Trinidad and Tobago). Moderated by Dr Ishtar Govia.',
  },
  {
    title: 'Dementia Caregiver Self-Care Roadmap',
    location: 'Jamaica',
    theme: 'Family & Caregivers',
    day: '2026-11-22',
    startTime: '15:00',
    endTime: '17:30',
    venue: 'Bellevue Conference Room',
    description:
      'A reflective workshop inviting family caregivers of people living with dementia to pause and consider their own support needs. Facilitated by Shawna-Kaye G. Lester, M.S., M.P.H., the session uses guided journaling and optional group discussion across eight areas of life to create a personal 2026 Snapshot. Please bring a journal or notebook; personal disclosure is not required.',
  },
  {
    title:
      'Beyond the Diagnosis: The Psychological Impact of Intellectual Disabilities on Individuals and Families',
    location: 'Online',
    theme: 'Family & Caregivers',
    day: '2026-11-22',
    startTime: '17:30',
    endTime: '19:30',
    zoomUrl: 'https://us02web.zoom.us/webinar/register/WN_zYRcq1CnTPqcE3TQ7uOxLQ',
    description:
      'Hosted by the Kiwanis Foundation of Jamaica, this online session with Dr Chukwuemeka Victor Chiana explores the psychological impact of intellectual disabilities, the experiences of individuals and families, and what more appropriate support and inclusion could look like. A student contribution sharing personal experience is also planned. General information and discussion only.',
  },
  {
    title: 'Community and Faith: A Message on Caribbean Brain Health',
    location: 'Trinidad and Tobago',
    theme: 'Community',
    day: '2026-11-22',
    registrationOpen: false,
    description:
      'A church-based contribution with Michèle Clavery delivering a message from Summit Convenor Dr Ishtar Govia, connecting brain health with the everyday life of families and communities and inviting congregation members to explore the Summit programme. Attendance arrangements remain with the host church.',
  },
  {
    title: 'Health Hub with Dr Kia Lewis — Caregiver Perspectives',
    location: 'Barbados',
    theme: 'Family & Caregivers',
    startTime: '16:00',
    venue: 'Radio broadcast — station TBC',
    registrationOpen: false,
    description:
      'A Health Hub radio conversation with Dr Kia Lewis featuring caregivers of people living with neurological conditions, exploring everyday experiences, support needs and what could be improved. Date, station and listening details to be confirmed.',
  },
  {
    title: 'Beyond Forgetfulness: Protecting Your Brain as You Age',
    location: 'Online',
    theme: 'Life-course',
    registrationOpen: false,
    description:
      'An accessible webinar with Dr Liane Conyette exploring brain health in later life, concerns about forgetfulness, and when and how to seek appropriate assessment and support. A Trinidad and Tobago contribution to CBHS 2026. Date, time and registration details to be announced. General information only.',
  },
  {
    title: 'Brain Health in Schools — Springer Memorial School',
    location: 'Barbados',
    theme: 'Life-course',
    venue: 'Springer Memorial School, Government Hill, St Michael, Barbados',
    registrationOpen: false,
    description:
      "A proposed school-based contribution hosted by the Barbados Alzheimer's Association, introducing brain-health awareness in a school setting with content agreed with Springer Memorial School. A school-based activity, not an open public event.",
  },
  {
    title: 'The Equity Podcast — Caregiver Perspectives on Neurological Conditions',
    location: 'Online',
    theme: 'Family & Caregivers',
    registrationOpen: false,
    description:
      'An episode of The Equity Podcast on YouTube, hosted by Grant Longwe, Atlantic Fellow for Equity in Brain Health, featuring caregivers of people living with neurological conditions. Episode title, guests, release date and viewing link to be confirmed.',
  },
  {
    title: 'Dr Roach — Brain Health Relay',
    location: 'Online',
    theme: 'Community',
    registrationOpen: false,
    description: 'Barbados Brain Health Relay online contribution.',
  },
]
