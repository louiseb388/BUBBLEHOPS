'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

function SignInInner() {
  const { configured, signInWithEmail, session } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/account';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [message, setMessage] = useState('');

  if (session) {
    router.replace(next);
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    const res = await signInWithEmail(email);
    setMessage(res.message);
    setStatus(res.ok ? 'sent' : 'idle');
  }

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96, maxWidth: 460 }}>
      <p className="eyebrow">Sign in</p>
      <h1 className="h-display h1" style={{ marginBottom: 16 }}>Great to meet you.</h1>
      <p className="lede" style={{ marginBottom: 32 }}>
        Sign in to save designs to your account, and track your orders.
      </p>

      {!configured && (
        <p style={{ background: 'var(--tint)', border: '2px solid var(--ink)', padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
          Sign-in isn&apos;t configured yet — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </p>
      )}

      {status === 'sent' ? (
        <p className="body-text">{message}</p>
      ) : (
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ border: '2px solid var(--ink)', padding: '12px 14px', fontSize: 15, width: '100%', boxSizing: 'border-box' }}
            />
          </label>
          {message && <p style={{ color: '#b3261e', margin: 0 }}>{message}</p>}
          <button className="btn btn-lime" type="submit" disabled={status === 'sending' || !configured}>
            {status === 'sending' ? 'Sending link…' : 'Email me a sign-in link'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInInner />
    </Suspense>
  );
}
