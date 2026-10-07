import type { Block } from 'payload'

export const Statement: Block = {
  slug: 'statement',
  interfaceName: 'StatementBlock',
  fields: [
    { name: 'text', type: 'textarea', required: true },
    { name: 'source', type: 'text' },
  ],
}
