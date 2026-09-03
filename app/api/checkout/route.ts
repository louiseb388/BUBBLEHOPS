import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { SITE } from '@/lib/data';

// Card covers Visa/Mastercard/etc; Apple Pay and Google Pay are shown
// automatically as express-checkout buttons on Stripe's hosted Checkout page
// whenever 'card' is enabled and the browser/device supports them — no
// separate payment_method_type is needed for those two. Klarna is listed
// explicitly so its 3-instalment option appears alongside card.
const PAYMENT_METHOD_TYPES: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ['card', 'klarna'];

type CheckoutLine = {
  id: string;
  baseName: string;
  price: number; // GBP, whole pounds
  qty: number;
  size: string | null;
  summary: string; // e.g. "Left: ARLO · Right: blank"
};

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in your environment (see .env.example).' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey);

  const body = await req.json().catch(() => null);
  const lines: CheckoutLine[] = body?.lines;
  const delivery = body?.delivery as
    | { name: string; email: string; address: string; city: string; postcode: string; method?: string; cost?: number }
    | undefined;

  if (!lines || !Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: 'Basket is empty.' }, { status: 400 });
  }
  if (lines.some((l) => !l.size)) {
    return NextResponse.json({ error: 'Every pair needs a size before checkout.' }, { status: 400 });
  }
  if (!delivery?.email) {
    return NextResponse.json({ error: 'Delivery details are required.' }, { status: 400 });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = lines.map((l) => ({
    quantity: Math.max(1, l.qty || 1),
    price_data: {
      currency: 'gbp',
      unit_amount: Math.round(l.price * 100),
      product_data: {
        name: `${l.baseName} — hand-painted`,
        description: `${l.summary} · Size ${l.size}`
      }
    }
  }));

  if (delivery?.method === 'express' && delivery.cost) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'gbp',
        unit_amount: Math.round(delivery.cost * 100),
        product_data: { name: 'Express delivery', description: 'Next day after painting' }
      }
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: PAYMENT_METHOD_TYPES,
      line_items,
      customer_email: delivery.email,
      shipping_address_collection: { allowed_countries: ['GB'] },
      metadata: {
        delivery_name: delivery.name,
        delivery_address: `${delivery.address}, ${delivery.city}, ${delivery.postcode}`.slice(0, 480),
        delivery_method: delivery.method || 'standard',
        line_count: String(lines.length)
      },
      success_url: `${SITE.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE.url}/checkout?cancelled=1`
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error('Stripe session creation failed', e);
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Could not start checkout.' }, { status: 502 });
  }
}
