'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getSupabase } from '@/lib/supabase';

type Order = {
  id: string;
  created_at: string;
  amount_total: number;
  currency: string;
  status: string;
  photo_url: string | null;
  email: string | null;
  metadata: { delivery_name?: string; delivery_address?: string } | null;
  stripe_session_id: string;
};

const STATUSES = [
  { value: 'paid', label: 'Paid' },
  { value: 'painting', label: 'Painting' },
  { value: 'photo_sent', label: 'Photo sent' },
  { value: 'shipped', label: 'Shipped' }
];

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency.toUpperCase() }).format(amount / 100);
}

export default function AdminPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [authError, setAuthError] = useState('');
  const [drafts, setDrafts] = useState<Record<string, { status: string; photo: File | null }>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<{ id: string; emailed: boolean } | null>(null);

  const loadOrders = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;
    const res = await fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 401 || res.status === 403) {
      setAuthError("You're signed in, but not as the admin account.");
      return;
    }
    if (!res.ok) {
      setAuthError('Something went wrong loading orders.');
      return;
    }
    const body = await res.json();
    setOrders(body.orders);
    setDrafts((prev) => {
      const next = { ...prev };
      for (const o of body.orders as Order[]) {
        if (!next[o.id]) next[o.id] = { status: o.status, photo: null };
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!loading && !session) router.replace('/sign-in?next=/admin');
  }, [loading, session, router]);

  useEffect(() => {
    if (session) loadOrders();
  }, [session, loadOrders]);

  async function save(id: string) {
    const supabase = getSupabase();
    const draft = drafts[id];
    if (!supabase || !draft) return;
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;

    setSaving(id);
    setSaved(null);
    const hadPhoto = !!draft.photo;
    const form = new FormData();
    form.set('status', draft.status);
    if (draft.photo) form.set('photo', draft.photo);

    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    });
    setSaving(null);
    if (res.ok) {
      setSaved({ id, emailed: hadPhoto });
      setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], photo: null } }));
      loadOrders();
    }
  }

  if (loading || !session) return null;

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <p className="eyebrow">Admin</p>
      <h1 className="h-display h1" style={{ marginBottom: 32 }}>Orders</h1>

      {authError && <p className="body-text">{authError}</p>}

      {!authError && orders === null && <p className="body-text">Loading…</p>}
      {!authError && orders?.length === 0 && <p className="body-text">No orders yet.</p>}

      {!authError &&
        orders?.map((o) => {
          const draft = drafts[o.id] || { status: o.status, photo: null };
          const meta = o.metadata || {};
          return (
            <div key={o.id} style={{ border: '2px solid var(--ink)', padding: 20, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 800 }}>{meta.delivery_name || o.email || 'Unknown'}</p>
                  <p className="body-text" style={{ margin: 0 }}>{o.email}</p>
                  <p className="body-text" style={{ margin: 0 }}>{meta.delivery_address}</p>
                  <p className="body-text" style={{ margin: 0 }}>{new Date(o.created_at).toLocaleDateString('en-GB')} · {o.stripe_session_id}</p>
                </div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 20 }}>{formatAmount(o.amount_total, o.currency)}</p>
              </div>

              {o.photo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={o.photo_url} alt="" style={{ maxWidth: 160, display: 'block', marginBottom: 16, border: '2px solid var(--ink)' }} />
              )}

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <select
                  value={draft.status}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [o.id]: { ...draft, status: e.target.value } }))}
                  style={{ border: '2px solid var(--ink)', padding: '10px 12px', fontSize: 14, fontWeight: 700 }}
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [o.id]: { ...draft, photo: e.target.files?.[0] || null } }))}
                />

                <button className="btn btn-lime btn-sm" onClick={() => save(o.id)} disabled={saving === o.id}>
                  {saving === o.id ? 'Saving…' : 'Save'}
                </button>
                {saved?.id === o.id && <span className="body-text">Saved{saved.emailed ? ' — photo emailed to customer' : ''}.</span>}
              </div>
            </div>
          );
        })}
    </div>
  );
}
