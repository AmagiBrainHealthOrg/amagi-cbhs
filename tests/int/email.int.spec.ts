import { beforeEach, describe, expect, it, vi } from 'vitest'

const env = vi.hoisted(() => ({
  SITE_LIVE: undefined as string | undefined,
  SYNC_ALERT_TO: 'alerts@example.com' as string | undefined,
  NEXT_PUBLIC_SITE_URL: 'https://site.test',
}))

vi.mock('server-only', () => ({}))
vi.mock('@/env', () => ({ env }))

const { sendConfirmation, sendSyncAlert } = await import('@/lib/email')

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
    env.SYNC_ALERT_TO = 'alerts@example.com'
  })

  it("sends the form's thank-you copy, escaped, to the person in test mode too", async () => {
    const p = payload()
    // @ts-expect-error a partial Payload is enough here
    await sendConfirmation(p, 'relay', 'person@example.com', 'Testy <b>Testerson</b>')
    const email = p.sendEmail.mock.calls[0][0]
    expect(email.to).toBe('person@example.com')
    expect(email.subject).toBe('Thank you for proposing an activity')
    expect(email.text).toContain('Dear Testy <b>Testerson</b>,')
    expect(email.html).toContain('Dear Testy &lt;b&gt;Testerson&lt;/b&gt;,')
    expect(email.html).toContain('We will be in touch.')
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
