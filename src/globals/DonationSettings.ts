import type { GlobalConfig, NumberFieldSingleValidation } from 'payload'

import { revalidateGlobalAfterChange } from '@/hooks/revalidate'

import { contentGlobal } from './shared'

const positiveInteger: NumberFieldSingleValidation = (value) =>
  value === null ||
  value === undefined ||
  (Number.isInteger(value) && value > 0) ||
  'Enter a whole number above 0.'

const minorUnits = 'In cents: 2500 is $25.00.'
const minimumToken = 'Use {minimum} for the minimum amount.'
const amountToken = 'Use {amount} for the amount given.'

export const DonationSettings: GlobalConfig = {
  slug: 'donation-settings',
  hooks: { afterChange: [revalidateGlobalAfterChange] },
  ...contentGlobal('/donate?preview=true'),
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Amounts',
          fields: [
            {
              name: 'suggestedAmounts',
              type: 'array',
              labels: { singular: 'Amount', plural: 'Amounts' },
              fields: [
                {
                  name: 'amount',
                  type: 'number',
                  required: true,
                  admin: { description: minorUnits, step: 1 },
                  validate: positiveInteger,
                },
              ],
            },
            {
              name: 'currency',
              type: 'text',
              defaultValue: 'usd',
              admin: { description: 'Three-letter ISO code in lower case, as Stripe expects.' },
              validate: (value: string | null | undefined) =>
                !value ||
                /^[a-z]{3}$/.test(value) ||
                'Use a lower-case three-letter code, such as usd.',
            },
            { name: 'allowCustomAmount', type: 'checkbox', defaultValue: true },
            {
              name: 'minimumAmount',
              type: 'number',
              admin: { description: `Smallest custom amount. ${minorUnits}`, step: 1 },
              validate: positiveInteger,
            },
          ],
        },
        {
          label: 'Donate page',
          fields: [
            {
              name: 'page',
              type: 'group',
              admin: { description: 'Copy on /donate.' },
              fields: [
                { name: 'kicker', type: 'text' },
                { name: 'heading', type: 'text' },
                { name: 'lead', type: 'textarea' },
                { name: 'reasonsHeading', type: 'text' },
                {
                  name: 'reasons',
                  type: 'array',
                  labels: { singular: 'Reason', plural: 'Reasons' },
                  fields: [{ name: 'text', type: 'textarea', required: true }],
                },
                { name: 'note', type: 'text' },
                { name: 'amountLegend', type: 'text' },
                {
                  name: 'otherLabel',
                  type: 'text',
                  admin: { description: 'The "Other" amount option.' },
                },
                {
                  name: 'otherAmountLabel',
                  type: 'text',
                  admin: { description: 'Label on the custom amount input.' },
                },
                {
                  name: 'otherAmountHint',
                  type: 'text',
                  admin: { description: `Hint under the custom amount input. ${minimumToken}` },
                },
                { name: 'submitLabel', type: 'text' },
                { name: 'securePaymentNote', type: 'text' },
                {
                  name: 'errorText',
                  type: 'text',
                  admin: { description: `Shown when no valid amount is chosen. ${minimumToken}` },
                },
              ],
            },
          ],
        },
        {
          label: 'Thank you',
          fields: [
            {
              name: 'thankYouKicker',
              type: 'text',
              admin: { description: `Line above the heading. ${amountToken}` },
            },
            { name: 'thankYouHeading', type: 'text' },
            { name: 'thankYouBody', type: 'textarea' },
            { name: 'thankYouLinkLabel', type: 'text' },
            {
              name: 'unconfirmedHeading',
              type: 'text',
              admin: { description: 'Shown when Stripe has not confirmed the payment.' },
            },
            { name: 'unconfirmedBody', type: 'textarea' },
            { name: 'unconfirmedLinkLabel', type: 'text' },
          ],
        },
        {
          label: 'Donate banner',
          fields: [
            {
              name: 'banner',
              type: 'group',
              admin: { description: 'Copy shown by every Donate banner block.' },
              fields: [
                { name: 'heading', type: 'text' },
                { name: 'body', type: 'textarea' },
                { name: 'label', type: 'text', admin: { description: 'Button label.' } },
              ],
            },
          ],
        },
      ],
    },
  ],
}
