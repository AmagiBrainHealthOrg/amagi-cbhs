import type { Field } from 'payload'

export const sectionFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'kicker',
        type: 'text',
        admin: { description: 'Small uppercase line above the heading.' },
      },
      { name: 'heading', type: 'text' },
    ],
  },
  { name: 'intro', type: 'textarea' },
  {
    type: 'row',
    fields: [
      {
        name: 'background',
        type: 'select',
        required: true,
        defaultValue: 'white',
        options: [
          { label: 'White', value: 'white' },
          { label: 'Pale', value: 'pale' },
          { label: 'Blue', value: 'blue' },
        ],
      },
      {
        name: 'anchorId',
        type: 'text',
        label: 'Anchor ID',
        admin: { description: 'Lets links jump to this section, e.g. "week" for /#week.' },
        validate: (value: string | null | undefined) =>
          !value ||
          /^[a-z][a-z0-9-]*$/.test(value) ||
          'Use lowercase letters, numbers and hyphens, starting with a letter.',
      },
    ],
  },
]
