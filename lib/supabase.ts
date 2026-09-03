'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;
let attempted = false;

/**
 * Returns a Supabase client if NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY are set,
 * otherwise null. Account sign-in/sign-up and saved designs degrade to a
 * "sign in isn't configured yet" message when this is null — see
 * app/sign-in/page.tsx and app/account/page.tsx.
 */
export function getSupabase(): SupabaseClient | null {
  if (attempted) return client;
  attempted = true;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  client = createClient(url, anonKey);
  return client;
}
