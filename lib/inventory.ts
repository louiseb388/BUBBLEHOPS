'use client';

// Live stock, mirroring the behaviour documented in the original inventory.js.
//
// Configure Supabase via env vars (see .env.example):
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY
//   NEXT_PUBLIC_SUPABASE_INVENTORY_TABLE (optional, defaults to "inventory")
//
// Expected table shape (one row per base + size):
//   base_id  text     -- lamorra, advantage, vspace, borough, boroughmid, airforce
//   size     text     -- 'UK 10' ... 'UK 6'
//   qty      integer  -- 0 means sold out
//
// Suggested SQL:
//   create table inventory (
//     base_id text not null,
//     size    text not null,
//     qty     integer not null default 0,
//     primary key (base_id, size)
//   );
//   alter table inventory enable row level security;
//   create policy "public read" on inventory for select using (true);
//
// With no config the site falls back to SEED_STOCK, so the designer and
// checkout still behave correctly with no backend configured.

import { useEffect, useState } from 'react';
import { SEED_STOCK, SIZES } from './data';

export type Stock = Record<string, Record<string, number>>;

export async function loadStock(): Promise<{ stock: Stock; live: boolean; error?: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const table = process.env.NEXT_PUBLIC_SUPABASE_INVENTORY_TABLE || 'inventory';
  if (!url || !anonKey) return { stock: SEED_STOCK, live: false };

  const endpoint = `${url.replace(/\/+$/, '')}/rest/v1/${table}?select=base_id,size,qty`;
  try {
    const res = await fetch(endpoint, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, Accept: 'application/json' }
    });
    if (!res.ok) throw new Error(`inventory ${res.status}`);
    const rows: { base_id: string; size: string; qty: number }[] = await res.json();
    if (!Array.isArray(rows) || !rows.length) throw new Error('inventory empty');
    const stock: Stock = {};
    rows.forEach((r) => {
      if (!r || !r.base_id || !r.size) return;
      if (!stock[r.base_id]) stock[r.base_id] = {};
      stock[r.base_id][r.size] = Number(r.qty) || 0;
    });
    return { stock, live: true };
  } catch (e) {
    return { stock: SEED_STOCK, live: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export function sizesInStock(stock: Stock, baseId: string): string[] {
  const row = stock[baseId] || {};
  return SIZES.filter((z) => (row[z] || 0) > 0);
}

export function isSoldOut(stock: Stock, baseId: string): boolean {
  return sizesInStock(stock, baseId).length === 0;
}

/** Client hook: loads live stock once on mount, seed stock in the meantime. */
export function useStock() {
  const [state, setState] = useState<{ stock: Stock; live: boolean; loading: boolean }>({
    stock: SEED_STOCK,
    live: false,
    loading: true
  });

  useEffect(() => {
    let cancelled = false;
    loadStock().then(({ stock, live }) => {
      if (!cancelled) setState({ stock, live, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
