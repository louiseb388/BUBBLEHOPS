'use client';

import { useEffect, useState, useCallback, CSSProperties } from 'react';
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
  { value: 'shipped', label: 'Shipped' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'partially_refunded', label: 'Partially refunded' },
  { value: 'disputed', label: 'Disputed' },
  { value: 'dispute_won', label: 'Dispute won' },
  { value: 'dispute_lost', label: 'Dispute lost' }
];

// Which statuses count as "needs attention" for the filter below, and how each badge is
// coloured — 'refunded'/'disputed'/etc. are set automatically by the Stripe webhook
// (app/api/webhook/route.ts) when Stripe reports a refund or dispute; 'cancelled' is
// manual-only, for orders called off before Stripe involvement (e.g. customer emailed in).
const ATTENTION_STATUSES = new Set(['cancelled', 'refunded', 'partially_refunded', 'disputed', 'dispute_lost']);
const STATUS_LABEL: Record<string, string> = Object.fromEntries(STATUSES.map((s) => [s.value, s.label]));

function statusBadgeStyle(status: string): CSSProperties {
  const attention = ATTENTION_STATUSES.has(status);
  const won = status === 'dispute_won';
  return {
    display: 'inline-block',
    padding: '4px 10px',
    fontSize: 12,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    border: '2px solid var(--ink)',
    background: attention ? 'var(--danger, #b3261e)' : won ? '#fff' : 'var(--lime)',
    color: attention ? '#fff' : 'var(--ink)'
  };
}

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
  const [filter, setFilter] = useState<'all' | 'attention'>('all');

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

  const attentionCount = orders?.filter((o) => ATTENTION_STATUSES.has(o.status)).length ?? 0;
  const visibleOrders = filter === 'attention' ? orders?.filter((o) => ATTENTION_STATUSES.has(o.status)) : orders;

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <p className="eyebrow">Admin</p>
      <h1 className="h-display h1" style={{ marginBottom: 32 }}>Orders</h1>

      {authError && <p className="body-text">{authError}</p>}

      {!authError && orders === null && <p className="body-text">Loading…</p>}
      {!authError && orders?.length === 0 && <p className="body-text">No orders yet.</p>}

      {!authError && orders && orders.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <button
            className={filter === 'all' ? 'btn btn-lime btn-sm' : 'btn btn-outline btn-sm'}
            onClick={() => setFilter('all')}
          >
            All ({orders.length})
          </button>
          <button
            className={filter === 'attention' ? 'btn btn-lime btn-sm' : 'btn btn-outline btn-sm'}
            onClick={() => setFilter('attention')}
          >
            Needs attention ({attentionCount})
          </button>
        </div>
      )}

      {!authError && orders && orders.length > 0 && visibleOrders?.length === 0 && (
        <p className="body-text">Nothing needs attention right now.</p>
      )}

      {!authError &&
        visibleOrders?.map((o) => {
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
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 8px', fontWeight: 800, fontSize: 20 }}>{formatAmount(o.amount_total, o.currency)}</p>
                  <span style={statusBadgeStyle(o.status)}>{STATUS_LABEL[o.status] || o.status}</span>
                </div>
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
