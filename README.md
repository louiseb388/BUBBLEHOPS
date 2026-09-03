# BUBBLEHOPS — Next.js production site

Rebuilt from `design_handoff_bubblehops_website/` (the approved design prototype)
as a real Next.js 14 App Router app: reusable components, typed data, live
Stripe + Klarna checkout, Supabase-backed inventory/auth, and per-route SEO.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

## Environment variables

See `.env.example`. At minimum for a working local build you need:

- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — from the
  [Stripe dashboard](https://dashboard.stripe.com/apikeys). Test keys are fine
  to start. Checkout uses Stripe's **hosted Checkout Session**, which
  supports Visa/Mastercard (`card`) and **Klarna** directly, and shows
  **Apple Pay** / **Google Pay** automatically as express-checkout buttons
  on supported devices/browsers — no extra integration needed for those two.
- `STRIPE_WEBHOOK_SECRET` — only needed once you wire up
  `app/api/webhook/route.ts` to a real endpoint in the Stripe dashboard (for
  order fulfilment after payment).
- `NEXT_PUBLIC_SITE_URL` — used for canonical/OG tags and Stripe redirect URLs.

Everything else is optional and degrades gracefully if unset:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — powers live
  inventory (`lib/inventory.ts`) and account sign-in / saved designs
  (`lib/auth-context.tsx`, `lib/supabase.ts`). Without these the site falls
  back to the seed stock table and sign-in shows a "not configured" notice,
  exactly like the original `inventory.js` fallback behaviour.
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, **never** `NEXT_PUBLIC_`-prefixed)
  — lets the Stripe webhook persist paid orders to an `orders` table.
- `RESEND_API_KEY` — sends the contact form via [Resend](https://resend.com);
  without it, submissions are logged server-side instead of emailed.

## Suggested Supabase schema

```sql
create table inventory (
  base_id text not null,
  size    text not null,
  qty     integer not null default 0,
  primary key (base_id, size)
);
alter table inventory enable row level security;
create policy "public read" on inventory for select using (true);

create table saved_designs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  base_id    text not null,
  design     jsonb not null,
  created_at timestamptz default now()
);
alter table saved_designs enable row level security;
create policy "own designs" on saved_designs for all using (auth.uid() = user_id);

create table orders (
  id                uuid primary key default gen_random_uuid(),
  stripe_session_id text not null,
  email             text,
  amount_total      integer,
  currency          text,
  metadata          jsonb,
  status            text,
  created_at        timestamptz default now()
);
alter table orders enable row level security;
-- orders are written server-side via the service-role key in the webhook;
-- add a select policy here (e.g. matching auth.jwt() ->> 'email') if you
-- want app/account/page.tsx to read a signed-in user's own orders.
```

## What's real vs. what needs a decision

- **Payments** — real: `app/api/checkout/route.ts` creates a genuine Stripe
  Checkout Session; `app/api/webhook/route.ts` verifies signatures for order
  fulfilment.
- **Inventory** — real, with graceful fallback: `lib/inventory.ts` mirrors
  `source/inventory.js` exactly.
- **Auth / saved designs** — real Supabase magic-link auth, but you'll want
  to add the `profiles` table + edit form referenced in `app/account/page.tsx`
  once you're ready to collect name/phone/address outside of checkout.
- **Contact form** — sends via Resend if configured, else logs server-side.
  Swap in whatever provider you actually use.
- **Fonts** — `Gloze` and `Maximback` are carried over from the design
  handoff (`assets/fonts/` → `public/fonts/`). License them for production
  use per the original handoff note before shipping.
- **Air Force 1 base** — still uses a placeholder photo (flagged with a
  visible badge in the designer and in `lib/data.ts`). Swap in the real
  product shot and re-derive its `PANELS`/`SOLE_CLIP` geometry — see below.

## The shoe designer's geometry

`lib/data.ts` embeds `PANELS` (paintable side-panel outline) and `SOLE_CLIP`
(midsole clip line) exactly as hand-sampled per base trainer in the original
prototype — these are photo-derived, not generic shapes. `lib/designer-geometry.ts`
parses them for point-in-polygon hit-testing (click/drag snapping) and derives
`SOLE_ABOVE_CLIP`, the complementary "paint stops here" mask used to clip
lettering/stickers so they tuck behind the sole. If you replace a base's
product photo, these need re-deriving from the new image.
