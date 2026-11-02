import { recordDonation } from '@/lib/recordDonation'
import { donationFromSession, verifyWebhookEvent } from '@/lib/stripe'

// SPEC §7.5. A non-2xx response makes Stripe retry, so failures to record return 500.
export async function POST(request: Request) {
  const body = await request.text()
  let event
  try {
    event = verifyWebhookEvent(body, request.headers.get('stripe-signature'))
  } catch (error) {
    console.error('Stripe webhook is not configured', error)
    return Response.json({ error: 'Webhook unavailable' }, { status: 500 })
  }
  if (!event) return Response.json({ error: 'Invalid signature' }, { status: 400 })

  if (
    event.type !== 'checkout.session.completed' &&
    event.type !== 'checkout.session.async_payment_succeeded'
  ) {
    return Response.json({ received: true })
  }
  const donation = donationFromSession(event.data.object, new Date(event.created * 1000))
  if (!donation) return Response.json({ received: true })

  try {
    const { id, created } = await recordDonation(donation)
    console.info(
      `Donation ${donation.sessionId} ${created ? 'recorded' : 'already recorded'} as ${id}`,
    )
  } catch (error) {
    console.error(`Could not record donation ${donation.sessionId} in Airtable`, error)
    return Response.json({ error: 'Could not record the donation' }, { status: 500 })
  }
  return Response.json({ received: true })
}
