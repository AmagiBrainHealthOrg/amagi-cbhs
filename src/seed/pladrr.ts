import type { RequiredDataFromCollectionSlug } from 'payload'

import { bullets, link, paragraph, richText } from './lexical'

// Ishtar's PLADRR page copy, word for word, as laid out on the design boards (10 November 2026).

export const PLADRR_DOI = 'https://doi.org/10.1371/journal.pmed.1005059'
export const PLADRR_FORM_PATH = '/pladrr/express-interest'
const CONTACT = 'ishtargovia@amagibrainhealth.org'
const paragraphs = (...values: string[]) => values.join('\n\n')

export const pladrrPage: RequiredDataFromCollectionSlug<'pages'> = {
  title: 'PLADRR Jamaica 2027',
  slug: 'pladrr',
  meta: {
    title: 'PLADRR Jamaica 2027',
    description:
      'Population-Level Approaches to Dementia Risk Reduction: a scientific working meeting planned for 3–5 February 2027 in Kingston, Jamaica.',
  },
  layout: [
    {
      blockType: 'hero',
      style: 'photo',
      kicker: 'PLADRR Jamaica 2027',
      heading: 'Population-Level Approaches to Dementia Risk Reduction',
      lead: 'Connecting Caribbean questions with methods, evidence and policy-relevant research.',
      meta: [
        { icon: 'calendar', label: 'Planned for 3–5 February 2027' },
        { icon: 'map-pin', label: 'Kingston, Jamaica' },
        { icon: 'users', label: 'Scientific working meeting' },
      ],
      showDonateButton: false,
      secondaryLink: { label: 'Express interest', href: PLADRR_FORM_PATH, solid: true },
      extraLink: { label: 'Read the PLADRR principles', href: PLADRR_DOI },
    },
    {
      blockType: 'richText',
      background: 'white',
      layout: 'lead',
      content: richText(
        paragraph(
          'The second international scientific working meeting of the PLADRR research group will bring Caribbean, diaspora and international perspectives together to develop a focused research agenda on population-level dementia risk reduction. The aim is to establish what can be learned from existing evidence, what cannot yet be answered, and what research and collaboration are needed next.',
        ),
      ),
    },
    {
      blockType: 'scaleStrip',
      heading: 'What is PLADRR?',
      background: 'white',
      steps: [
        { label: 'Individual approaches' },
        { label: 'Clinical approaches' },
        { label: 'Systems and environments', highlight: true },
      ],
      highlightLabel: 'PLADRR',
      body: paragraphs(
        'PLADRR examines how public policy and the social, economic and physical conditions in which people live can shape dementia risk across populations. It complements individual and clinical approaches by asking what can change in systems and environments—not only what individuals should do differently.',
        'The research agenda includes equity, locally relevant evidence and responsible data governance. Population-wide action should be examined for who benefits, who is left out and whether inequalities narrow or widen.',
        'Jamaica follows the group’s inaugural scientific meeting in Auckland, Aotearoa New Zealand, in February 2025.',
      ),
    },
    {
      blockType: 'richText',
      heading: 'Why Jamaica, and why now?',
      background: 'pale',
      layout: 'split',
      content: richText(
        paragraph(
          'The 2007 Declaration of Port-of-Spain committed CARICOM countries to action on noncommunicable diseases and their risk factors. Its twentieth anniversary in 2027 provides a timely context for examining the evidence relevant to cognitive health and dementia risk.',
        ),
        paragraph(
          'The meeting will explore a possible “cognitive dividend”: whether changes in policies and population conditions may have brought benefits for cognitive health, for whom, and how such effects could be assessed. It will not assume that a benefit has occurred or that any observed change was caused by the Declaration.',
        ),
      ),
    },
    {
      blockType: 'venn',
      background: 'white',
      circles: [
        { label: 'How NCD risk factors have changed' },
        { label: 'How cognitive health has changed' },
        { label: 'Whether particular changes can credibly be attributed to specific policies' },
      ],
      centre: 'A possible “cognitive dividend”',
      body: paragraphs(
        'The work needs to distinguish three questions: how NCD risk factors have changed; how cognitive health has changed; and whether particular changes can credibly be attributed to specific policies. Answering them requires attention to the policies actually implemented, their timing and reach, available measures and data, and alternative explanations.',
        'Where existing evidence is insufficient, the useful outcome is a clear methodological roadmap—not a premature conclusion.',
      ),
    },
    {
      blockType: 'cardGrid',
      heading: 'Four connected working themes',
      background: 'white',
      style: 'numbered',
      items: [
        {
          title: 'Research questions, measurement and policy evaluation',
          label: 'Questions and intended draft products',
          body: 'Define priority cognitive outcomes and distinguish risk-factor trends, cognitive-health trends and policy effects. Examine the feasibility of policy histories and comparative analyses. Develop a draft methodological roadmap and measurement priorities.',
        },
        {
          title: 'Data infrastructure, harmonisation and sovereignty',
          label: 'Questions and intended draft products',
          body: 'Map relevant surveillance, cohorts and policy information; examine comparability across populations, languages and settings; identify governance and access requirements. Scope options for future harmonised cognitive assessment, including the proposed Caribbean HCAP concept, without assuming that a network or data-sharing agreement already exists.',
        },
        {
          title: 'Economics and whole-of-government policy',
          label: 'Questions and intended draft products',
          body: 'Specify the questions, assumptions, outcomes and data required to study the costs of inaction and possible responses. Develop an outline analytical protocol and identify which estimates are feasible, for which countries and populations, on what timescale.',
        },
        {
          title: 'Risk reduction across health, care and community systems',
          label: 'Questions and intended draft products',
          body: 'Examine opportunities for population-level risk reduction through health and care systems, equity and community engagement. Develop a focused evidence-and-implementation questions framework, keeping the work connected to PLADRR’s remit rather than attempting a comprehensive care-service redesign.',
        },
      ],
      outro:
        'Measurement and data infrastructure will be developed together, not in separate silos. Joint discussions and cross-group review will connect the themes. Social and structural determinants, inequalities, cultural relevance and the conditions for implementation run through all four.',
    },
    {
      blockType: 'richText',
      heading: 'What the meeting aims to produce',
      intro:
        'The three days are intended to produce reviewable working drafts and a prioritised follow-through plan—not completed studies, validated instruments or new institutions.',
      background: 'pale',
      layout: 'split',
      content: richText(
        bullets(
          'A methodological roadmap identifying what existing evidence can assess and what additional information or designs would be needed.',
          'An initial map of relevant data and policy information, with gaps, access questions and harmonisation priorities clearly recorded.',
          'Draft measurement and economic-analysis specifications, with feasibility questions and limits made explicit.',
          'A focused set of research and implementation questions on risk reduction across health, care and community settings.',
          'A follow-through plan recording proposed tasks, interested contributors, dependencies, resources required and the next review point.',
        ),
        paragraph(
          'Products will need further scientific review, consultation and development after the meeting. New data collection, policy coding, instrument testing, economic estimates or formal collaborations will depend on appropriate permissions, resources and agreements. The meeting cannot guarantee findings or policy adoption by a particular date.',
        ),
      ),
    },
    {
      blockType: 'funnel',
      heading: 'How the three days will work',
      background: 'white',
      steps: [
        {
          when: '3 Feb',
          title: 'Day 1 — Caribbean questions and research priorities',
          body: 'Establish the context, existing strengths, policy questions and evidence needs.',
        },
        {
          when: '4 Feb',
          title: 'Day 2 — Scientific methods and regional dialogue',
          body: 'Test approaches and draft ideas with relevant perspectives; build connections across working themes.',
        },
        {
          when: '5 Feb',
          title: 'Day 3 — Integration and next steps',
          body: 'Review the working drafts, resolve overlaps and define a realistic programme of further work.',
        },
      ],
      end: 'A realistic programme of further work',
      body: 'The proposed design combines focused working groups with joint discussions. Participants may contribute across themes where their expertise is relevant. Detailed arrangements, including any public lecture or online participation, will be announced once confirmed.',
    },
    {
      blockType: 'comparison',
      heading: 'Who the meeting is for',
      intro:
        'The scientific working meeting is intended for researchers and relevant policy, practice, community and data-governance contributors whose experience can help address the research questions.',
      background: 'pale',
      is: {
        heading: 'It is for',
        items: [
          { text: 'Researchers' },
          { text: 'Relevant policy, practice, community and data-governance contributors' },
          {
            text: 'Caribbean and Caribbean-diaspora early-career researchers, a priority for meaningful scientific participation and support',
          },
        ],
      },
      isNot: {
        heading: 'It is not',
        items: [
          { text: 'A general conference with automatically available places' },
          { text: 'An abstract competition' },
          { text: 'A commercial innovation showcase' },
        ],
      },
      body: paragraphs(
        'Participation arrangements are being finalised. Expressing interest does not confirm attendance, a speaking role or funding.',
        'Early-career participants should contribute to scientific thinking and outputs, not only record discussions. Roles, mentorship, workload, credit and any continuing tasks will be discussed explicitly. Attendance does not automatically commit anyone to twelve months of work.',
      ),
    },
    {
      blockType: 'accordion',
      background: 'white',
      items: [
        {
          title: 'Caribbean leadership and responsible collaboration',
          content: richText(
            paragraph(
              'The proposed collaboration model pairs Caribbean and PLADRR scientific leadership. Caribbean expertise and priorities should shape question-setting, interpretation and the use of findings. The region’s different languages, cultures, institutions and resources must be recognised.',
            ),
            paragraph(
              'The meeting does not authorise access to anyone’s data. Access, analysis and any transfer require the relevant custodians’ permissions, applicable ethics and governance arrangements, and specific agreements. Scientific credit and authorship will reflect contributions, with meaningful Caribbean leadership in work developed around Caribbean priorities and data.',
            ),
          ),
        },
        {
          title: 'From Summit week to scientific work',
          content: richText(
            paragraph(
              'The Caribbean Brain Health Summit in November 2026 brings wider perspectives on care, workforce, research, public systems and development into conversation. PLADRR Jamaica is a distinct scientific milestone: relevant questions emerging through that engagement can inform research scoping, subject to scientific assessment and the meeting’s remit.',
            ),
            paragraph(
              'The Caribbean Call to Action on Brain Health remains a non-binding framework under consultation. It is not a government declaration or a mandate for the scientific meeting. Any policy use of the research will require the appropriate country-led and institutional processes.',
            ),
          ),
        },
        {
          title: 'Support participation and follow-through',
          content: richText(
            paragraph(
              'A priority is enabling Caribbean and diaspora early-career researchers to participate through support for travel, accommodation and other agreed attendance costs. Support can also help resource appropriate stakeholder engagement and the scientific work that follows.',
            ),
            paragraph(
              'Enquiries about support are welcome. Funding does not confer control over research questions, findings, participant selection or data. Any arrangement requires separate agreement.',
            ),
          ),
        },
      ],
    },
    {
      blockType: 'richText',
      heading: 'Participation and updates',
      background: 'blue',
      layout: 'split',
      content: richText(
        paragraph(
          'Use the website’s interest route to tell us about your relevant experience and whether you are interested in the scientific meeting, contributing expertise, future public-event information or supporting participation. The organisers will explain the applicable next steps. Expressions of interest are not registrations or funding applications unless explicitly stated.',
        ),
        paragraph('Contact: Dr Ishtar Govia | ', link(CONTACT, `mailto:${CONTACT}`)),
      ),
      links: [
        { label: 'Express interest', href: PLADRR_FORM_PATH },
        {
          label:
            'Read “The principles of Population-Level Approaches to Dementia Risk Reduction (PLADRR)”',
          href: PLADRR_DOI,
        },
      ],
    },
    {
      blockType: 'accordion',
      heading: 'FAQs',
      background: 'white',
      items: [
        {
          title: 'Does “cognitive dividend” mean the Declaration improved cognition?',
          content: richText(
            paragraph(
              'No. It is a research question. Changes in NCD risk factors, cognitive outcomes and the effects of specific policies need to be studied separately and connected only where the evidence and methods support it.',
            ),
          ),
        },
        {
          title: 'Can anyone register for the full meeting?',
          content: richText(
            paragraph(
              'The scientific sessions are focused working sessions. Participation arrangements are being finalised; an expression of interest does not secure a place. Any public lecture or other open activity will have separate access information once confirmed.',
            ),
          ),
        },
        {
          title: 'Will a Caribbean HCAP network be launched?',
          content: richText(
            paragraph(
              'A possible Caribbean approach to harmonised cognitive assessment is under consideration. Scoping it does not establish a funded network, participating sites or permission to share data.',
            ),
          ),
        },
        {
          title: 'Will attendees be expected to work on outputs afterwards?',
          content: richText(
            paragraph(
              'Continuing tasks will be agreed with the people concerned, taking account of their role, time and resources. Attendance does not create an automatic year-long commitment.',
            ),
          ),
        },
        {
          title: 'Is there travel funding?',
          content: richText(
            paragraph(
              'Support for early-career participation is a priority, but availability and any eligibility or application arrangements will be communicated separately. Expressing interest does not guarantee financial support.',
            ),
          ),
        },
      ],
    },
    { blockType: 'donateBanner' },
  ],
}

// The expression of interest form at /pladrr/express-interest (a rewrite of this page's slug).
export const PLADRR_FORM_SLUG = 'pladrr-express-interest'

export const pladrrFormPage: RequiredDataFromCollectionSlug<'pages'> = {
  title: 'Express interest: PLADRR Jamaica 2027',
  slug: PLADRR_FORM_SLUG,
  meta: {
    title: 'Express interest | PLADRR Jamaica 2027',
    description:
      'Express interest in PLADRR Jamaica 2027, a scientific working meeting planned for 3–5 February 2027 in Kingston, Jamaica.',
  },
  layout: [
    {
      blockType: 'hero',
      style: 'photo',
      kicker: 'PLADRR Jamaica 2027',
      heading: 'Express interest',
      showDonateButton: false,
      lead: 'PLADRR Jamaica is a scientific working meeting on Population-Level Approaches to Dementia Risk Reduction, planned for 3–5 February 2027 in Kingston, Jamaica.',
    },
    {
      blockType: 'richText',
      background: 'white',
      layout: 'split',
      content: richText(
        paragraph(
          'Use this form to express interest in scientific participation, the regional stakeholder dialogue, contributing relevant expertise, future public-event information or supporting participation.',
        ),
        paragraph(
          'Scientific places and support are limited and subject to arrangements agreed by the organising committee. Submitting this form does not confirm attendance, a speaking role, financial support or an institutional partnership. Any public lecture will have separate registration arrangements once confirmed.',
        ),
        paragraph(
          'You do not need to submit an abstract or a completed research proposal. Please do not include private health information or upload confidential documents.',
        ),
        paragraph(link('About PLADRR Jamaica 2027', '/pladrr')),
      ),
    },
    { blockType: 'form', background: 'white', form: 'pladrr-eoi' },
  ],
}

export const pladrrThankYou = {
  form: 'pladrr-eoi' as const,
  heading: 'Thank you. We have received your expression of interest in PLADRR Jamaica 2027.',
  body: `This is not confirmation of a meeting place, speaking role or funding. The organisers will review your enquiry and communicate the applicable next steps.\n\nAny public lecture or open activity will have separate participation information once confirmed.\n\nFor enquiries: ${CONTACT}`,
}
