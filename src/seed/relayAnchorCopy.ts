import { link, paragraph, paragraphs, richText } from './lexical'

// Dr Ishtar Govia's copy of 5 November 2026, word for word. Used by the seed and by the
// 20261105_120000 migration.

export const relayCopy = {
  title: 'Brain Health Relay: Propose an Activity to Host',
  lead: 'Organise an hour-long activity for your community or organisation and propose it for inclusion in the Brain Health Relay.',
  intro: richText(
    paragraph(
      'The Brain Health Relay connects hour-long activities organised by individuals, groups and organisations during Caribbean Brain Health Summit week, 16–22 November 2026.',
    ),
    paragraph(
      'This form is for an activity that you or your organisation will organise and lead. It is not an application for a speaking slot within an event organised by Amagi, or registration to attend an existing session.',
    ),
    paragraph(
      'You can adapt something you already do, such as a staff discussion, community meeting, workshop or support-group session. You do not need to create a large event.',
    ),
    paragraph(
      'You will take responsibility for preparing and coordinating your activity, including any contributors and practical delivery arrangements. Any support from the Summit team must be discussed and confirmed separately.',
    ),
    paragraph(
      'Submitting this form records your proposal. Programme inclusion, timing and any support arrangements are confirmed after follow-up.',
    ),
    paragraph(
      'Looking to attend rather than host? Visit the ',
      link('Summit programme', '/summit-week#programme'),
      ' to register for an existing session. If you would like to offer expertise without organising an activity, ',
      link('contact the Summit team', '/contact'),
      ' to discuss whether a suitable opportunity is available.',
    ),
  ),
  after: paragraphs(
    'After your activity, please send a short recap. Where appropriate and permission has been obtained, you may also send photos or a short baton-passing clip.',
    'A written recap or non-identifying image is welcome where filming is inappropriate. Please do not submit private health information or identifiable photos or videos without the necessary permissions.',
    'Materials will be reviewed for use in agreed Summit communications; submission does not guarantee publication.',
  ),
}

export const anchorDayCopy = {
  heading: 'Anchor Day',
  content: paragraphs(
    'For the inaugural Caribbean Brain Health Summit, Anchor Day takes the form of a focused, Jamaica-based leadership conversation convened by Dr Ishtar Govia.',
    'Invited participants will examine locally relevant brain-health, care and workforce priorities, the evidence and partnerships needed to address them, and feasible next steps beyond Summit week.',
    "The conversation connects Jamaica's circumstances with the wider Caribbean agenda. It complements the public sessions, country-led activities and community participation taking place across the week; it does not represent a regional decision-making or endorsement process. Any subsequent projects or commitments require separate agreement.",
  ),
}
