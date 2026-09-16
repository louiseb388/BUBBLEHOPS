import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { SITE } from '@/lib/data';

function formatAmount(amount: number | null, currency: string | null): string {
  if (amount == null || !currency) return 'unknown amount';
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency.toUpperCase() }).format(amount / 100);
}

/** Emails the studio the same way the contact form does (RESEND_API_KEY) — this is the
 * only place a paid order actually reaches a human; without it, an order only shows up
 * in the Stripe dashboard and (if configured) the Supabase orders table. */
async function notifyStudio(stripe: Stripe, session: Stripe.Checkout.Session) {
  const resendKey = process.env.RESEND_API_KEY;
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

  if (!resendKey) {
    console.log('[stripe webhook] RESEND_API_KEY not set — order not emailed, only logged:\n' + body);
    return;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `BUBBLEHOPS orders <noreply@${new URL(SITE.url).hostname}>`,
        to: SITE.email,
        subject: `New order — ${formatAmount(session.amount_total, session.currency)}`,
        text: body
      })
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  } catch (e) {
    console.error('Order notification email failed to send', e);
  }
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
  }

  return NextResponse.json({ received: true });
}
