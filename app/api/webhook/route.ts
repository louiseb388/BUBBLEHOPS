import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { SITE } from '@/lib/data';
import { sendEmail } from '@/lib/email';

function formatAmount(amount: number | null, currency: string | null): string {
  if (amount == null || !currency) return 'unknown amount';
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency.toUpperCase() }).format(amount / 100);
}

/** Emails the studio — this is the only place a paid order actually reaches a human;
 * without it, an order only shows up in the Stripe dashboard and (if configured) the
 * Supabase orders table. */
async function notifyStudio(stripe: Stripe, session: Stripe.Checkout.Session) {
  const lines = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
  const itemsText = lines.data
    .map((li) => `- ${li.quantity} x ${li.description} — ${formatAmount(li.amount_total, session.currency)}`)
    .join('\n');
  const meta = session.metadata || {};
  const body = [
    `New paid order — ${formatAmount(session.amount_total, session.currency)}`,
    '',
    `Customer: ${session.customer_details?.email || 'unknown'}`,
    `Deliver to: ${meta.delivery_name || 'unknown'}`,
    `Address: ${meta.delivery_address || 'unknown'}`,
    `Delivery: ${meta.delivery_method || 'standard'}`,
    '',
    'Items:',
    itemsText,
    '',
    `Stripe session: ${session.id}`
  ].join('\n');

  await sendEmail({ to: SITE.email, subject: `New order — ${formatAmount(session.amount_total, session.currency)}`, text: body });
}

/** Emails the customer their own order confirmation — separate from notifyStudio above,
 * which only reaches the shop. Without this, a paying customer got nothing but Stripe's
 * own receipt (if enabled) and no mention of the painting/photo/shipping process. */
async function notifyCustomer(stripe: Stripe, session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email;
  if (!email) return;
  const lines = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
  const itemsText = lines.data
    .map((li) => `- ${li.quantity} x ${li.description} — ${formatAmount(li.amount_total, session.currency)}`)
    .join('\n');
  const meta = session.metadata || {};
  const body = [
    `Thanks${meta.delivery_name ? `, ${meta.delivery_name.split(/\s+/)[0]}` : ''} — your order's in!`,
    '',
    'Items:',
    itemsText,
    '',
    `Total: ${formatAmount(session.amount_total, session.currency)}`,
    `Delivering to: ${meta.delivery_address || 'the address you gave at checkout'}`,
    '',
    "What happens next: painting takes about three days, then we'll email you a photo of the",
    "finished pair before it ships — you'll have 24 hours to flag anything. After that it's",
    `${meta.delivery_method === 'express' ? 'next-day' : 'two to three days'} delivery.`,
    '',
    'You can check your order status any time by signing in at ' + SITE.url + '/account.'
  ].join('\n');

  await sendEmail({ to: email, subject: `Your BUBBLEHOPS order is confirmed — ${formatAmount(session.amount_total, session.currency)}`, text: body });
}

/** Refunds and disputes fire on `charge.*`/`charge.dispute.*` events, which are keyed by
 * payment intent, not by the checkout session id our `orders` rows are keyed on — so every
 * order also stores its payment_intent_id (set below on checkout.session.completed) purely
 * so these handlers can find their way back to the right row. */
async function markOrderByPaymentIntent(paymentIntentId: string | null | undefined, status: string) {
  if (!paymentIntentId) return;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.log('[stripe webhook] Supabase not configured — order status not updated:', paymentIntentId, status);
    return;
  }
  const admin = createClient(url, serviceKey);
  const { error } = await admin.from('orders').update({ status }).eq('payment_intent_id', paymentIntentId);
  if (error) console.error('Failed to update order status', paymentIntentId, status, error);
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook not configured.' }, { status: 500 });
  }

  const stripe = new Stripe(secretKey);
  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    if (!sig) throw new Error('Missing stripe-signature header');
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (e) {
    console.error('Webhook signature verification failed', e);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Optional: persist the paid order. Requires a service-role Supabase key
    // (server-only — never expose it with a NEXT_PUBLIC_ prefix) and an
    // `orders` table. Skipped gracefully if not configured.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && serviceKey) {
      const admin = createClient(url, serviceKey);
      const { error } = await admin.from('orders').insert({
        stripe_session_id: session.id,
        payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
        email: session.customer_details?.email,
        amount_total: session.amount_total,
        currency: session.currency,
        metadata: session.metadata,
        status: 'paid'
      });
      if (error) console.error('Failed to persist order', error);
    } else {
      console.log('[stripe webhook] checkout.session.completed', session.id, session.customer_details?.email);
    }

    await notifyStudio(stripe, session);
    await notifyCustomer(stripe, session);
  }

  // Refunds and disputes — surfaced on /admin so a cancelled/refunded/disputed order doesn't
  // sit there looking like a normal one still waiting to be painted and shipped. These event
  // types need enabling on the Stripe webhook endpoint itself (Stripe dashboard → Webhooks →
  // your endpoint → the same place checkout.session.completed is ticked).
  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
    const fullyRefunded = charge.amount_refunded >= charge.amount;
    await markOrderByPaymentIntent(paymentIntentId, fullyRefunded ? 'refunded' : 'partially_refunded');
  }

  if (event.type === 'charge.dispute.created') {
    const dispute = event.data.object as Stripe.Dispute;
    const paymentIntentId = typeof dispute.payment_intent === 'string' ? dispute.payment_intent : dispute.payment_intent?.id;
    await markOrderByPaymentIntent(paymentIntentId, 'disputed');
  }

  if (event.type === 'charge.dispute.closed') {
    const dispute = event.data.object as Stripe.Dispute;
    const paymentIntentId = typeof dispute.payment_intent === 'string' ? dispute.payment_intent : dispute.payment_intent?.id;
    await markOrderByPaymentIntent(paymentIntentId, dispute.status === 'won' ? 'dispute_won' : 'dispute_lost');
  }

  return NextResponse.json({ received: true });
}
