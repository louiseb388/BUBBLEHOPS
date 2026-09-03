'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { SIZES } from '@/lib/data';
import { useStock } from '@/lib/inventory';
import DesignPreview from '@/components/DesignPreview';

type Step = 'size' | 'delivery' | 'payment';

export default function CheckoutClient() {
  const { lines, setLineSize, total, ready } = useCart();
  const { stock } = useStock();
  const { session } = useAuth();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get('cancelled') === '1';

  const [step, setStep] = useState<Step>('size');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [giftNote, setGiftNote] = useState('');
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const allSized = lines.length > 0 && lines.every((l) => !!l.size);

  function stockFor(baseId: string, size: string) {
    return stock[baseId]?.[size] ?? 0;
  }

  function autofillAddress() {
    setName(name || 'Sam Parker');
    setAddress(address || '14 Bridge Street');
    setCity(city || 'Leeds');
    setPostcode(postcode || 'LS1 4AA');
  }

  async function submitPayment() {
    setPayError(null);
    if (!terms) {
      setPayError('Please agree to the Terms & Conditions to continue.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            id: l.id,
            baseName: l.baseName,
            price: l.price,
            size: l.size,
            summary: `Left: ${l.design.left.blank ? 'blank' : l.design.left.word || '—'} · Right: ${l.design.right.blank ? 'blank' : l.design.right.word || '—'}`
          })),
          delivery: { name, email, address, city, postcode, giftNote }
        })
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Could not start checkout.');
      window.location.href = data.url;
    } catch (e) {
      setPayError(e instanceof Error ? e.message : 'Could not start checkout.');
      setSubmitting(false);
    }
  }

  if (!ready) return null;

  if (lines.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h1 className="h-display h1" style={{ marginBottom: 20 }}>Nothing to check out yet.</h1>
        <Link href="/create-your-own" className="btn btn-lime">Create your own →</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <h1 className="h-display h1" style={{ marginBottom: 32 }}>Checkout.</h1>

      {cancelled && (
        <p style={{ background: 'var(--tint)', border: '2px solid var(--ink)', padding: '12px 16px', marginBottom: 24 }}>
          Payment was cancelled — your basket is still saved.
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 48 }}>
        <aside>
          <h2 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', marginBottom: 16 }}>Order preview</h2>
          {lines.map((l) => (
            <div key={l.id} style={{ marginBottom: 24, borderBottom: '2px solid var(--ink)', paddingBottom: 16 }}>
              <DesignPreview design={l.design} width={280} />
              <p className="body-text" style={{ margin: '10px 0 0' }}>
                {l.baseName}
                <br />
                Left: {l.design.left.blank ? 'Blank' : l.design.left.word || '—'}
                <br />
                Right: {l.design.right.blank ? 'Blank' : l.design.right.word || '—'}
                <br />
                {l.size ? `Size ${l.size}` : 'Size not chosen'} · £{l.price}
              </p>
            </div>
          ))}
          <p style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Total: £{total}</p>
          <Link href="/create-your-own" className="btn btn-outline btn-sm">Back to my design</Link>
        </aside>

        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {(['size', 'delivery', 'payment'] as Step[]).map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`tag ${step === s ? 'tag-lime' : ''}`}
                style={{ background: step === s ? undefined : '#fff', cursor: 'pointer' }}
              >
                {i + 1}. {s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {step === 'size' && (
            <div>
              <h2 className="h-display h3" style={{ marginBottom: 20 }}>Size</h2>
              {lines.map((l) => (
                <div key={l.id} style={{ marginBottom: 28 }}>
                  <p style={{ fontWeight: 700, marginBottom: 10 }}>{l.baseName}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(64px,1fr))', gap: 8 }}>
                    {SIZES.map((size) => {
                      const qty = stockFor(l.baseId, size);
                      const soldOut = qty === 0;
                      const low = qty > 0 && qty <= 2;
                      const selected = l.size === size;
                      return (
                        <button
                          key={size}
                          disabled={soldOut}
                          onClick={() => setLineSize(l.id, size)}
                          style={{
                            border: '2px solid var(--ink)',
                            padding: '10px 4px',
                            background: selected ? 'var(--lime)' : '#fff',
                            opacity: soldOut ? 0.35 : 1,
                            fontWeight: 700,
                            fontSize: 13,
                            position: 'relative'
                          }}
                        >
                          {size}
                          {soldOut && <div style={{ fontSize: 9, fontWeight: 600 }}>Sold out</div>}
                          {low && <div style={{ fontSize: 9, fontWeight: 600, color: '#b3261e' }}>Low stock</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button className="btn btn-lime" disabled={!allSized} onClick={() => setStep('delivery')}>
                Continue to delivery →
              </button>
            </div>
          )}

          {step === 'delivery' && (
            <div style={{ maxWidth: 460 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 className="h-display h3" style={{ margin: 0 }}>Delivery</h2>
                <button className="btn btn-outline btn-sm" onClick={autofillAddress} type="button">
                  Autofill saved address
                </button>
              </div>

              <p className="body-text" style={{ marginBottom: 20 }}>
                We&apos;ll send a photo of the finished pair before it ships, with 24 hours to confirm or comment.
              </p>

              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Full name" value={name} onChange={setName} />
                <Field label="Email" type="email" value={email} onChange={setEmail} />
                <Field label="Address" value={address} onChange={setAddress} />
                <Field label="City" value={city} onChange={setCity} />
                <Field label="Postcode" value={postcode} onChange={setPostcode} />
                <label style={{ display: 'grid', gap: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Gift note (optional)
                  </span>
                  <textarea
                    rows={3}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    style={{ border: '2px solid var(--ink)', padding: '12px 14px', fontSize: 15, resize: 'vertical' }}
                  />
                </label>
              </div>

              <button
                className="btn btn-lime"
                style={{ marginTop: 24 }}
                disabled={!name || !email || !address || !city || !postcode}
                onClick={() => setStep('payment')}
              >
                Continue to payment →
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div style={{ maxWidth: 460 }}>
              <h2 className="h-display h3" style={{ marginBottom: 20 }}>Payment</h2>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {['Card', 'Apple Pay', 'Google Pay', 'Klarna'].map((m) => (
                  <span key={m} className="tag" style={{ background: '#fff' }}>{m}</span>
                ))}
              </div>
              <p className="body-text" style={{ marginBottom: 20 }}>
                You&apos;ll choose exactly how to pay — card (Visa/Mastercard), Apple Pay, Google Pay, or Klarna&apos;s
                3 interest-free instalments — on Stripe&apos;s secure payment page in the next step.
              </p>

              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20 }}>
                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} style={{ marginTop: 4 }} />
                <span className="body-text">
                  I agree to the{' '}
                  <Link href="/terms-and-conditions" style={{ fontWeight: 700, textDecoration: 'underline' }}>
                    Terms & Conditions
                  </Link>
                </span>
              </label>

              {payError && <p style={{ color: '#b3261e', marginBottom: 16 }}>{payError}</p>}

              <button className="btn btn-lime" onClick={submitPayment} disabled={submitting}>
                {submitting ? 'Redirecting to secure payment…' : `Pay £${total} →`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text'
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ border: '2px solid var(--ink)', padding: '12px 14px', fontSize: 15 }}
      />
    </label>
  );
}
