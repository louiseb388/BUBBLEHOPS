-- BUBBLEHOPS Supabase schema.
--
-- Run this once in your Supabase project's SQL editor (Dashboard → SQL Editor → New query),
-- after creating the project. Covers every table the app code already expects:
--   - saved_designs: designer "Save design" (components/designer/DesignerClient.tsx)
--   - orders:        Stripe webhook order log (app/api/webhook/route.ts) + account order history
--                     + status/photo_url set from /admin (app/admin/page.tsx)
--   - profiles:      name/phone/address editable on /account's "My details" tab
--   - inventory:     live stock, optional (lib/inventory.ts) — falls back to SEED_STOCK if unused
--   - order-photos:  Storage bucket for the "here's your finished pair" photo /admin sends
--
-- /admin (the order status/photo page) needs one more env var beyond the usual Supabase
-- ones: ADMIN_EMAIL, set to whichever email you'll sign in with — see .env.example.
--
-- Auth itself needs no schema: passwordless email-code sign-in (like Vercel's — no link to
-- click, the shopper types the code) uses Supabase's built-in auth.users table. Email auth
-- is enabled by default under Authentication → Providers. One extra step: Supabase's default
-- "Magic Link" email template only shows a clickable link, not a visible code — edit that
-- template (Authentication → Emails → Magic Link) to display {{ .Token }} as the code the
-- shopper types on /sign-in, e.g. add a line like "Your code: {{ .Token }}".

create table if not exists saved_designs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  base_id    text not null,
  design     jsonb not null,
  created_at timestamptz not null default now()
);
alter table saved_designs enable row level security;
create policy "read own saved designs" on saved_designs
  for select using (auth.uid() = user_id);
create policy "insert own saved designs" on saved_designs
  for insert with check (auth.uid() = user_id);
create policy "update own saved designs" on saved_designs
  for update using (auth.uid() = user_id);
create policy "delete own saved designs" on saved_designs
  for delete using (auth.uid() = user_id);

-- status moves through 'paid' -> 'painting' -> 'photo_sent' -> 'shipped', set from
-- /admin (app/admin/page.tsx) — plain text rather than an enum so a stage can be renamed
-- or added later without a migration. 'cancelled'/'refunded'/'partially_refunded'/'disputed'/
-- 'dispute_won'/'dispute_lost' are set automatically by the Stripe webhook (app/api/webhook/route.ts)
-- when Stripe reports a refund or dispute on the order's payment — see payment_intent_id below,
-- which is how the webhook maps a refund/dispute event (keyed by payment intent) back to a row
-- (keyed by checkout session) since Stripe doesn't include the session id on those event types.
create table if not exists orders (
  id                 uuid primary key default gen_random_uuid(),
  stripe_session_id  text not null unique,
  payment_intent_id  text,
  email              text,
  amount_total       integer,
  currency           text,
  metadata           jsonb,
  status             text not null default 'paid',
  photo_url          text,
  created_at         timestamptz not null default now()
);
alter table orders add column if not exists photo_url text;
alter table orders add column if not exists payment_intent_id text;
alter table orders enable row level security;
-- Written by the webhook using the service-role key, which bypasses RLS entirely — this
-- policy only governs the browser (anon key + user session) read in app/account/page.tsx.
create policy "read own orders by email" on orders
  for select using (auth.jwt() ->> 'email' = email);

-- Finished-pair photos, uploaded from /admin. Public bucket — the customer order-photo
-- email links straight to the file, no signed URL needed — but every write goes through
-- app/api/admin/orders/[id]/route.ts using the service-role key, which bypasses object
-- RLS entirely, so no insert/update policy on storage.objects is needed either.
insert into storage.buckets (id, name, public)
values ('order-photos', 'order-photos', true)
on conflict (id) do nothing;

create table if not exists profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text,
  phone      text,
  address    text,
  updated_at timestamptz not null default now()
);
alter table profiles enable row level security;
create policy "read own profile" on profiles
  for select using (auth.uid() = id);
create policy "insert own profile" on profiles
  for insert with check (auth.uid() = id);
create policy "update own profile" on profiles
  for update using (auth.uid() = id);

create table if not exists inventory (
  base_id text not null,
  size    text not null,
  qty     integer not null default 0,
  primary key (base_id, size)
);
alter table inventory enable row level security;
create policy "public read inventory" on inventory
  for select using (true);

-- Seed inventory with the same numbers lib/data.ts's SEED_STOCK uses, so switching
-- NEXT_PUBLIC_SUPABASE_URL/_ANON_KEY on doesn't silently zero out live stock. Adjust
-- freely afterwards — this table is what the site reads from once configured.
-- Green/black/pink are zeroed (out of stock) — only grey is currently sold.
insert into inventory (base_id, size, qty) values
  ('advgreen', 'UK 10', 0), ('advgreen', 'UK 11', 0), ('advgreen', 'UK 12', 0), ('advgreen', 'UK 13', 0),
  ('advgreen', 'UK 1', 0), ('advgreen', 'UK 2', 0), ('advgreen', 'UK 3', 0), ('advgreen', 'UK 4', 0),
  ('advgreen', 'UK 5', 0), ('advgreen', 'UK 6', 0),
  ('advblack', 'UK 10', 0), ('advblack', 'UK 11', 0), ('advblack', 'UK 12', 0), ('advblack', 'UK 13', 0),
  ('advblack', 'UK 1', 0), ('advblack', 'UK 2', 0), ('advblack', 'UK 3', 0), ('advblack', 'UK 4', 0),
  ('advblack', 'UK 5', 0), ('advblack', 'UK 6', 0),
  ('advpink', 'UK 10', 0), ('advpink', 'UK 11', 0), ('advpink', 'UK 12', 0), ('advpink', 'UK 13', 0),
  ('advpink', 'UK 1', 0), ('advpink', 'UK 2', 0), ('advpink', 'UK 3', 0), ('advpink', 'UK 4', 0),
  ('advpink', 'UK 5', 0), ('advpink', 'UK 6', 0),
  ('advgrey', 'UK 10', 3), ('advgrey', 'UK 11', 2), ('advgrey', 'UK 12', 2), ('advgrey', 'UK 13', 3),
  ('advgrey', 'UK 1', 2), ('advgrey', 'UK 2', 1), ('advgrey', 'UK 3', 2), ('advgrey', 'UK 4', 0),
  ('advgrey', 'UK 5', 1), ('advgrey', 'UK 6', 1)
on conflict (base_id, size) do nothing;
