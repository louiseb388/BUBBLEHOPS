'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getSupabase } from '@/lib/supabase';
import DesignPreview from '@/components/DesignPreview';
import type { DesignState } from '@/lib/designer-types';

type Tab = 'orders' | 'saved' | 'details';
type Order = { id: string; created_at: string; amount_total: number; status: string; stripe_session_id: string };
type SavedDesign = { id: string; base_id: string; design: DesignState; created_at: string };

export default function AccountPage() {
  const { session, loading, signOut } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [saved, setSaved] = useState<SavedDesign[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !session) router.replace('/sign-in?next=/account');
  }, [loading, session, router]);

  useEffect(() => {
    if (!session) return;
    const supabase = getSupabase();
    if (!supabase) {
      setFetching(false);
      return;
    }
    (async () => {
      const [ordersRes, savedRes] = await Promise.all([
        supabase.from('orders').select('id,created_at,amount_total,status,stripe_session_id').eq('email', session.user.email ?? '').order('created_at', { ascending: false }),
        supabase.from('saved_designs').select('id,base_id,design,created_at').eq('user_id', session.user.id).order('created_at', { ascending: false })
      ]);
      if (ordersRes.data) setOrders(ordersRes.data as Order[]);
      if (savedRes.data) setSaved(savedRes.data as SavedDesign[]);
      setFetching(false);
    })();
  }, [session]);

  if (loading || !session) return null;

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="h-display h1">Hey there.</h1>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => signOut()}>Sign out</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {(['orders', 'saved', 'details'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`tag ${tab === t ? 'tag-lime' : ''}`}
            style={{ background: tab === t ? undefined : '#fff', cursor: 'pointer' }}
          >
            {t === 'orders' ? 'Current orders' : t === 'saved' ? 'Saved design' : 'My details'}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div>
          {fetching ? (
            <p className="body-text">Loading…</p>
          ) : orders.length === 0 ? (
            <p className="body-text">No orders yet.</p>
          ) : (
            orders.map((o) => (
              <div key={o.id} style={{ borderBottom: '2px solid var(--ink)', padding: '16px 0', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700 }}>{o.stripe_session_id}</p>
                  <p className="body-text" style={{ margin: 0 }}>{new Date(o.created_at).toLocaleDateString('en-GB')}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="tag tag-lime">{o.status}</span>
                  <p style={{ margin: '6px 0 0', fontWeight: 800 }}>£{(o.amount_total / 100).toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'saved' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
          {fetching ? (
            <p className="body-text">Loading…</p>
          ) : saved.length === 0 ? (
            <p className="body-text">No saved designs yet — save one from the designer.</p>
          ) : (
            saved.map((s) => (
              <div key={s.id} style={{ border: '2px solid var(--ink)', padding: 12 }}>
                <DesignPreview design={s.design} width={220} />
                <p className="body-text" style={{ margin: '10px 0 0' }}>{new Date(s.created_at).toLocaleDateString('en-GB')}</p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'details' && (
        <div style={{ maxWidth: 420 }}>
          <p className="body-text" style={{ marginBottom: 8 }}>Signed in as</p>
          <p style={{ fontWeight: 800, marginBottom: 24 }}>{session.user.email}</p>
          <p className="body-text">
            Name, phone and address details are collected at checkout for each order. A dedicated profile-editing
            form can be wired up here against a Supabase <code>profiles</code> table when you&apos;re ready.
          </p>
        </div>
      )}
    </div>
  );
}
