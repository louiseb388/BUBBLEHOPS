import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

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
  }

  return NextResponse.json({ received: true });
}
