'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getSupabase } from '@/lib/supabase';
import DesignPreview from '@/components/DesignPreview';
import type { DesignState } from '@/lib/designer-types';

type Tab = 'orders' | 'saved' | 'details';
type Order = {
  id: string;
  created_at: string;
  amount_total: number;
  status: string;
  photo_url: string | null;
  stripe_session_id: string;
  metadata: { delivery_name?: string } | null;
};
type SavedDesign = { id: string; base_id: string; design: DesignState; created_at: string };
type Profile = { name: string; phone: string; address: string };

const STATUS_LABELS: Record<string, string> = {
  paid: 'Paid',
  painting: 'Painting',
  photo_sent: 'Photo sent — check below',
  shipped: 'Shipped'
};

function firstToken(name: string | null | undefined): string | null {
  return name?.trim().split(/\s+/)[0] || null;
}

export default function AccountPage() {
  const { session, loading, signOut } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [saved, setSaved] = useState<SavedDesign[]>([]);
  const [profile, setProfile] = useState<Profile>({ name: '', phone: '', address: '' });
  const [fetching, setFetching] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

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
      const [ordersRes, savedRes, profileRes] = await Promise.all([
        supabase.from('orders').select('id,created_at,amount_total,status,photo_url,stripe_session_id,metadata').eq('email', session.user.email ?? '').order('created_at', { ascending: false }),
        supabase.from('saved_designs').select('id,base_id,design,created_at').eq('user_id', session.user.id).order('created_at', { ascending: false }),
        supabase.from('profiles').select('name,phone,address').eq('id', session.user.id).maybeSingle()
      ]);
      if (ordersRes.data) setOrders(ordersRes.data as Order[]);
      if (savedRes.data) setSaved(savedRes.data as SavedDesign[]);
      if (profileRes.data) {
        setProfile({
          name: profileRes.data.name ?? '',
          phone: profileRes.data.phone ?? '',
          address: profileRes.data.address ?? ''
        });
      }
      setFetching(false);
    })();
  }, [session]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    const supabase = getSupabase();
    if (!supabase) return;
    setSavingProfile(true);
    setProfileSaved(false);
    await supabase.from('profiles').upsert({ id: session.user.id, ...profile, updated_at: new Date().toISOString() });
    setSavingProfile(false);
    setProfileSaved(true);
  }

  if (loading || !session) return null;

  // Sign-up only collects an email — a first name comes from the profile once someone's
  // saved one, or failing that from delivery_name on their most recent order (checkout
  // collects it even if they never filled in "My details"). null renders as "Hey there."
  const firstName =
    firstToken(profile.name) || firstToken(orders.find((o) => o.metadata?.delivery_name)?.metadata?.delivery_name);

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="h-display h1">Hey {firstName ? `${firstName}.` : 'there.'}</h1>
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
              <div key={o.id} style={{ borderBottom: '2px solid var(--ink)', padding: '16px 0', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  {o.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={o.photo_url} alt="Your finished trainers" style={{ width: 72, height: 72, objectFit: 'cover', border: '2px solid var(--ink)' }} />
                  )}
                  <div>
                    <p style={{ margin: 0, fontWeight: 700 }}>{o.stripe_session_id}</p>
                    <p className="body-text" style={{ margin: 0 }}>{new Date(o.created_at).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="tag tag-lime">{STATUS_LABELS[o.status] || o.status}</span>
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

          <form onSubmit={saveProfile} style={{ display: 'grid', gap: 16 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Name</span>
              <input
                type="text"
                autoComplete="name"
                value={profile.name}
                onChange={(e) => {
                  setProfile((p) => ({ ...p, name: e.target.value }));
                  setProfileSaved(false);
                }}
                style={{ border: '2px solid var(--ink)', padding: '12px 14px', fontSize: 15, width: '100%', boxSizing: 'border-box' }}
              />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Phone</span>
              <input
                type="tel"
                autoComplete="tel"
                value={profile.phone}
                onChange={(e) => {
                  setProfile((p) => ({ ...p, phone: e.target.value }));
                  setProfileSaved(false);
                }}
                style={{ border: '2px solid var(--ink)', padding: '12px 14px', fontSize: 15, width: '100%', boxSizing: 'border-box' }}
              />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Address</span>
              <textarea
                autoComplete="street-address"
                rows={3}
                value={profile.address}
                onChange={(e) => {
                  setProfile((p) => ({ ...p, address: e.target.value }));
                  setProfileSaved(false);
                }}
                style={{ border: '2px solid var(--ink)', padding: '12px 14px', fontSize: 15, width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button className="btn btn-lime btn-sm" type="submit" disabled={savingProfile}>
                {savingProfile ? 'Saving…' : 'Save details'}
              </button>
              {profileSaved && <span className="body-text">Saved.</span>}
            </div>
          </form>

          <p className="body-text" style={{ marginTop: 24 }}>
            These details are used to prefill checkout — they&apos;re separate from what you enter on each individual order.
          </p>
        </div>
      )}
    </div>
  );
}
