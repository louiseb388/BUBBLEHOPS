'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

function SignInInner() {
  const { configured, signInWithEmail, verifyCode, session } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/account';
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (session) {
    router.replace(next);
    return null;
  }

  async function onSubmitEmail(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const res = await signInWithEmail(email);
    setSubmitting(false);
    if (res.ok) setStep('code');
    else setError(res.message);
  }

  async function onSubmitCode(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const res = await verifyCode(email, code);
    setSubmitting(false);
    // On success the session updates via onAuthStateChange, and the `if (session)` check
    // above redirects — nothing else to do here.
    if (!res.ok) setError(res.message);
  }

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96, maxWidth: 460 }}>
      <p className="eyebrow">Sign in</p>
      <h1 className="h-display h1" style={{ marginBottom: 16 }}>Great to meet you.</h1>
      <p className="lede" style={{ marginBottom: 32 }}>
        {step === 'email'
          ? 'No password — we’ll email you a code to sign in with.'
          : <>We&rsquo;ve sent a 6-digit code to <strong>{email}</strong>.</>}
      </p>

      {!configured && (
        <p style={{ background: 'var(--tint)', border: '2px solid var(--ink)', padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
          Sign-in isn&apos;t configured yet — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </p>
      )}

      {step === 'email' ? (
        <form onSubmit={onSubmitEmail} style={{ display: 'grid', gap: 16 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</span>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ border: '2px solid var(--ink)', padding: '12px 14px', fontSize: 15, width: '100%', boxSizing: 'border-box' }}
            />
          </label>
          {error && <p style={{ color: '#b3261e', margin: 0 }}>{error}</p>}
          <button className="btn btn-lime" type="submit" disabled={submitting || !configured}>
            {submitting ? 'Sending code…' : 'Send me a code'}
          </button>
        </form>
      ) : (
        <form onSubmit={onSubmitCode} style={{ display: 'grid', gap: 16 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>6-digit code</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              autoFocus
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              style={{
                border: '2px solid var(--ink)',
                padding: '12px 14px',
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: '0.3em',
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </label>
          {error && <p style={{ color: '#b3261e', margin: 0 }}>{error}</p>}
          <button className="btn btn-lime" type="submit" disabled={submitting || code.length !== 6}>
            {submitting ? 'Checking…' : 'Sign in'}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setStep('email');
              setCode('');
              setError('');
            }}
          >
            ← Use a different email
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
