// Placeholder copy for the design preview. Real copy comes from Amagi.

// TODO: hard-coded; migrate to Payload (`header` global, navItems) only when a human developer decides to.
export const navItems = [
  { label: 'About', href: '/about' },
  { label: 'Support Caribbean Brain Health', href: '/support' },
  { label: 'Call to Action', href: '/call-to-action' },
  { label: 'News', href: '/news' },
  { label: 'FAQs', href: '/faqs' },
]

// TODO: hard-coded; migrate to Payload (`footer` global) only when a human developer decides to.
export const footer = {
  links: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Cookies', href: '/cookies' },
    { label: 'Terms', href: '/terms' },
    // TODO: placeholder address; confirm Amagi's contact email. Release 2 replaces this with the /contact form.
    { label: 'Contact', href: 'mailto:info@amagibrainhealth.org' },
  ],
  // TODO: wire to the cookie consent banner (T030, `cookie-consent` global) only when a human developer decides to.
  cookieSettingsLabel: 'Cookie settings',
  tagline: 'One Caribbean. One Brain Health Future.',
  legalText:
    '© 2026 Amagi Health Ltd. The Caribbean Brain Health Summit is a convening of Amagi Health Ltd.',
}

// TODO: hard-coded; migrate to Payload (`donateBanner` block on `pages`) only when a human developer decides to.
export const donateBanner = {
  heading: 'Help bring brain health to every Caribbean community',
  body: 'Your gift funds free sessions, local activity hosts and the Caribbean Call to Action on Brain Health.',
  label: 'Donate',
}

// TODO: hard-coded; migrate to Payload (`pages` collection, slug about) only when a human developer decides to.
export const about = {
  kicker: 'About the Summit',
  heading: 'A week for Caribbean brain health',
  lead: 'The Caribbean Brain Health Summit runs from 16 to 22 November 2026, in several Caribbean countries and online.',
  sections: [
    {
      heading: 'Why a Summit',
      body: 'Brain health touches every family in the Caribbean, through dementia, stroke, mental health and healthy ageing. The Summit brings communities, practitioners, researchers and policymakers together to share what works and agree what comes next.',
    },
    {
      heading: 'How it works',
      body: 'Each host country runs its own programme of free, local activities during Summit week, alongside online sessions anyone can join. An Anchor Day in Jamaica brings the region together in one place.',
    },
    {
      heading: "Amagi's role",
      body: 'Amagi Health Ltd convenes the Summit. Amagi works with country leads, local partners and supporters to plan the week, and leads the consultation on the Caribbean Call to Action on Brain Health.',
    },
    {
      heading: 'After the Summit',
      body: 'The conversation continues at PLADRR, a follow-on event in Kingston from 3 to 5 February 2027.',
    },
  ],
  facts: [
    { value: '7', label: 'days of activity, 16–22 November 2026' },
    { value: 'Hybrid', label: 'in person across the region and online' },
    { value: 'Free', label: 'for the public to attend' },
  ],
}

// TODO: hard-coded; migrate to Payload (`pages` collection, slug support) only when a human developer decides to.
export const support = {
  kicker: 'Support Caribbean brain health',
  heading: 'Your support makes the Summit possible',
  lead: 'The Summit is free for the public. Donations and supporters pay for the sessions, the people who run them and the work that follows.',
  enables: {
    heading: 'What your support enables',
    items: [
      {
        title: 'Free local sessions',
        body: 'Community activities in each host country, open to everyone.',
      },
      {
        title: 'Online access',
        body: 'Sessions streamed so people across the region and the diaspora can join.',
      },
      {
        title: 'Local activity hosts',
        body: 'Support for the people and organisations who run activities on the ground.',
      },
      {
        title: 'A Call to Action',
        body: 'A regional consultation that turns the week into lasting policy change.',
      },
    ],
  },
  levels: {
    heading: 'Supporter levels',
    intro: "If your organisation is interested in supporting CBHS, we will develop a proposal that reflects your priorities while preserving the Summit's independence.",
    items: [
      {
        name: 'Founding Regional Supporter',
        body: 'Enables core Caribbean brain-health infrastructure across digital access, country participation, independent convening and accountable follow-through.',
      },
      {
        name: 'Regional Supporter',
        body: 'Helps extend participation, connection and learning across Caribbean countries and diaspora communities.',
      },
      {
        name: 'Access & Participation Supporter',
        body: 'Enables a defined public-interest area, such as caregiver inclusion, country leadership, primary-care education, digital access or lived-experience participation.',
      },
      {
        name: 'Community Supporter',
        body: 'Provides financial or in-kind support that helps local and regional CBHS activity remain accessible, inclusive and independently delivered.',
      },
    ],
  },
  safeguards: {
    heading: 'Our safeguards',
    items: [
      'Supporters do not control programme content, speakers, participant selection, research, policy recommendations or the Call to Action.',
      'Supporters do not receive attendee contact lists, individual-level analytics or direct-marketing rights.',
      "Support does not imply endorsement of a supporter's products or commercial interests.",
      'Supporter recognition is separate from educational, clinical, research and policy content.',
    ],
  },
  // TODO: list from the Payload `supporters` collection, filtered on permissionConfirmed, only when a human developer decides to.
  supporters: {
    heading: 'Our supporters',
    empty: "Supporters will appear here once they've given permission to be named.",
  },
  faqCategory: 'Donations and support',
}

// TODO: hard-coded; migrate to Payload (`pages` collection, slug call-to-action) only when a human developer decides to.
export const callToAction = {
  kicker: 'Caribbean Call to Action on Brain Health',
  heading: 'A shared agenda for Caribbean brain health',
  lead: 'The Caribbean Call to Action on Brain Health is a policy statement shaped by communities, practitioners and policymakers across the region.',
  intro:
    'It sets out five areas where action would make the biggest difference to brain health in the Caribbean. Amagi is consulting on it before and during Summit week.',
  areas: [
    {
      title: 'Brain health as workforce and development capacity',
      body: "Brain health shapes the Caribbean's future workforce, family care capacity, productivity and economic resilience.",
    },
    {
      title: 'Coordinated investment in brain-health infrastructure',
      body: 'The region needs practical infrastructure for prevention, care, participation, research, learning and collaboration.',
    },
    {
      title: 'Workforce capacity and support for family carers',
      body: 'Primary care teams, care workers and families need practical knowledge, clear pathways and stronger support.',
    },
    {
      title: 'Caribbean-specific evidence for Caribbean-specific action',
      body: 'The Caribbean needs evidence that reflects its own populations, cultures, health systems and diaspora realities.',
    },
    {
      title: 'Sustained coordination, review and accountability',
      body: 'Progress requires continuing relationships, shared learning and visible follow-through beyond Summit week.',
    },
  ],
  // TODO: replace with the consultation form (T012/T014: form-submissions, Airtable sync, Resend email) only when a human developer decides to.
  consultation: {
    heading: 'Have your say',
    body: 'The consultation form will open here. Registering your interest in the consultation is not an endorsement of the Call to Action.',
  },
}

// TODO: hard-coded; migrate to Payload (`faqs` collection) only when a human developer decides to.
export const faqs = [
  {
    category: 'About the Summit',
    items: [
      {
        question: 'When is the Summit?',
        answer: 'From 16 to 22 November 2026, in several Caribbean countries and online.',
      },
      {
        question: 'Does it cost anything to attend?',
        answer: 'No. Summit sessions are free for the public, in person and online.',
      },
      {
        question: 'Where is the Anchor Day?',
        answer:
          "In Jamaica. We'll publish the venue and timings here once they're confirmed.",
      },
    ],
  },
  {
    category: 'Taking part',
    items: [
      {
        question: 'How do I stay updated?',
        answer: "Register your interest and we'll email you when the programme is published.",
      },
      {
        question: 'Can my organisation run an activity?',
        answer:
          'Yes. Activity hosts run local sessions during Summit week. Contact us to find out more.',
      },
    ],
  },
  {
    category: 'Donations and support',
    items: [
      {
        question: 'How are donations processed?',
        answer: 'Securely through Stripe. We never see or store your card details.',
      },
      {
        question: 'Will I get a receipt?',
        answer: 'Yes. Stripe emails you a receipt as soon as your payment goes through.',
      },
      {
        question: 'Can my organisation become a supporter?',
        answer:
          'Yes. See the supporter levels on our Support page, or contact us to talk it through.',
      },
    ],
  },
]

// TODO: hard-coded; migrate to Payload (`news` collection) only when a human developer decides to.
export const news = {
  kicker: 'News',
  heading: 'Latest from the Summit',
  items: [
    {
      slug: 'summit-dates-announced',
      title: 'Summit dates announced: 16–22 November 2026',
      date: '2026-09-01',
      type: 'News',
      summary:
        'The Caribbean Brain Health Summit will run for a week across several Caribbean countries and online.',
      body: [
        'The Caribbean Brain Health Summit will run from 16 to 22 November 2026, with activities in several Caribbean countries and sessions online.',
        'Each host country will run its own programme of free local activities, and an Anchor Day in Jamaica will bring the region together.',
      ],
    },
    {
      slug: 'call-to-action-consultation',
      title: 'Consultation on the Caribbean Call to Action on Brain Health',
      date: '2026-09-15',
      type: 'News',
      summary:
        'Communities, practitioners and policymakers are invited to help shape the Call to Action.',
      body: [
        'Amagi is consulting on the Caribbean Call to Action on Brain Health, a policy statement setting out five areas for action.',
        'Taking part in the consultation is not an endorsement of the Call to Action.',
      ],
    },
    {
      slug: 'pladrr-2027',
      title: 'PLADRR follows the Summit in February 2027',
      date: '2026-09-28',
      type: 'News',
      summary:
        'A follow-on event in Kingston from 3 to 5 February 2027 will continue the conversation.',
      body: [
        'PLADRR will take place in Kingston from 3 to 5 February 2027, building on the work of Summit week.',
      ],
    },
  ],
}

// TODO: hard-coded; migrate to Payload (`pages` collection, slugs privacy, cookies, terms) only when a human developer decides to.
export const legal = {
  privacy: {
    title: 'Privacy',
    intro:
      'How Amagi Health Ltd collects and uses personal data on this site. Amagi will supply the final wording.',
    sections: [
      {
        heading: 'Who we are',
        body: 'Amagi Health Ltd runs the Caribbean Brain Health Summit and this website.',
      },
      {
        heading: 'What we collect',
        body: 'The details you give us in our forms, and, if you accept analytics cookies, how you use the site.',
      },
      {
        heading: 'Donations',
        body: 'Payments are handled by Stripe. We never see or store your card details.',
      },
      {
        heading: 'Your rights',
        body: 'You can ask to see, correct or delete the personal data we hold about you.',
      },
    ],
  },
  cookies: {
    title: 'Cookies',
    intro: 'The cookies this site and Google Tag Manager set. Amagi will supply the final wording.',
    sections: [
      {
        heading: 'Strictly necessary',
        body: 'cbhs_consent remembers your cookie choice for 6 months.',
      },
      {
        heading: 'Analytics (only if you accept)',
        body: '_ga and _ga_* are set by Google Analytics to count visits. They last up to 2 years.',
      },
      {
        heading: 'Changing your mind',
        body: 'Use "Cookie settings" in the footer at any time. Rejecting deletes the analytics cookies on our domain.',
      },
    ],
  },
  terms: {
    title: 'Terms',
    intro: 'The terms for using this website. Amagi will supply the final wording.',
    sections: [
      {
        heading: 'Using this site',
        body: 'This site is run by Amagi Health Ltd for information about the Caribbean Brain Health Summit.',
      },
      {
        heading: 'Donations',
        body: "Donations are processed by Stripe on Amagi Health Ltd's behalf.",
      },
      {
        heading: 'Contact',
        body: 'Questions about these terms can be sent to info@amagibrainhealth.org.',
      },
    ],
  },
}
