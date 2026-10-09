import { beforeEach, describe, expect, it, vi } from 'vitest'

const env = vi.hoisted(() => ({
  SITE_LIVE: undefined as string | undefined,
  EMAIL_SANDBOX_TO: 'sandbox@example.com' as string | undefined,
  SYNC_ALERT_TO: 'alerts@example.com' as string | undefined,
  NEXT_PUBLIC_SITE_URL: 'https://site.test',
}))

vi.mock('server-only', () => ({}))
vi.mock('@/env', () => ({ env }))

const { recipientFor, sendConfirmation, sendSyncAlert } = await import('@/lib/email')

const payload = () => ({
  findGlobal: vi.fn().mockResolvedValue({
    thankYou: [
      {
        form: 'relay',
        heading: 'Thank you for proposing an activity',
        body: 'We will be in touch.',
      },
    ],
  }),
  sendEmail: vi.fn().mockResolvedValue(undefined),
  logger: { warn: vi.fn() },
})

describe('email', () => {
  beforeEach(() => {
    env.SITE_LIVE = undefined
    env.EMAIL_SANDBOX_TO = 'sandbox@example.com'
    env.SYNC_ALERT_TO = 'alerts@example.com'
  })

  it('sends to the sandbox in test mode and to the person once live', () => {
    expect(recipientFor('person@example.com')).toBe('sandbox@example.com')
    env.SITE_LIVE = 'true'
    expect(recipientFor('person@example.com')).toBe('person@example.com')
  })

  it("sends the form's thank-you copy, escaped, as the confirmation", async () => {
    const p = payload()
    // @ts-expect-error a partial Payload is enough here
    await sendConfirmation(p, 'relay', 'person@example.com', 'Testy <b>Testerson</b>')
    const email = p.sendEmail.mock.calls[0][0]
    expect(email.to).toBe('sandbox@example.com')
    expect(email.subject).toBe('Thank you for proposing an activity')
    expect(email.text).toContain('Dear Testy <b>Testerson</b>,')
    expect(email.html).toContain('Dear Testy &lt;b&gt;Testerson&lt;/b&gt;,')
    expect(email.html).toContain('We will be in touch.')
  })

  it('skips the confirmation in test mode when there is no sandbox address', async () => {
    env.EMAIL_SANDBOX_TO = undefined
    const p = payload()
    // @ts-expect-error a partial Payload is enough here
    await sendConfirmation(p, 'relay', 'person@example.com')
    expect(p.sendEmail).not.toHaveBeenCalled()
  })

  it('alerts SYNC_ALERT_TO with a link to the submission', async () => {
    const p = payload()
    // @ts-expect-error a partial Payload is enough here
    await sendSyncAlert(p, { id: 7, form: 'partner' }, 'Airtable 422')
    const email = p.sendEmail.mock.calls[0][0]
    expect(email.to).toBe('alerts@example.com')
    expect(email.subject).toBe('Airtable sync failed: partner submission 7')
    expect(email.text).toContain('https://site.test/admin/collections/form-submissions/7')
  })
})
