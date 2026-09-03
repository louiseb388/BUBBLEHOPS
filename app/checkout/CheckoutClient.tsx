'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { SIZES } from '@/lib/data';
import { useStock } from '@/lib/inventory';
import CheckoutProgress, { type CheckoutStep } from '@/components/checkout/CheckoutProgress';
import OrderSummary from '@/components/checkout/OrderSummary';

type DeliveryMethod = 'standard' | 'express';
const DELIVERY_COST: Record<DeliveryMethod, number> = { standard: 0, express: 6 };

const STEP_HEADINGS: Record<CheckoutStep, string> = {
  size: 'Pick the size',
  delivery: 'Delivery details',
  payment: 'Pay and confirm'
};

export default function CheckoutClient() {
  const { lines, setLineSize, setLineQty, total: cartTotal, ready } = useCart();
  const { stock } = useStock();
  const { session } = useAuth();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get('cancelled') === '1';

  const [step, setStep] = useState<CheckoutStep>('size');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const allSized = lines.length > 0 && lines.every((l) => !!l.size);
  const total = cartTotal + DELIVERY_COST[deliveryMethod];
  const deliveryLabel = deliveryMethod === 'standard' ? 'Free' : `£${DELIVERY_COST.express}`;

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
            qty: l.qty,
            size: l.size,
            summary: `Left: ${l.design.left.blank ? 'blank' : l.design.left.word || '—'} · Right: ${l.design.right.blank ? 'blank' : l.design.right.word || '—'}`
          })),
          delivery: { name, email, address, city, postcode, method: deliveryMethod, cost: DELIVERY_COST[deliveryMethod] }
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
        <Link href="/create-your-own" className="btn btn-lime">Create your own</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <p className="eyebrow">Checkout</p>
      <h1 className="h-display h1" style={{ marginBottom: 40 }}>{STEP_HEADINGS[step]}</h1>

      {cancelled && (
        <p style={{ background: 'var(--tint)', border: '2px solid var(--ink)', padding: '12px 16px', marginBottom: 24 }}>
          Payment was cancelled — your basket is still saved.
        </p>
      )}

      <CheckoutProgress step={step} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 56 }}>
        <div>
          {step === 'size' && (
            <div>
              <h2 className="h-display h3" style={{ marginBottom: 4 }}>Size and quantity</h2>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
                Kids&rsquo; UK sizes. If they&rsquo;re between sizes, we recommend going up.
              </p>

              {lines.map((l) => {
                const inStockCount = SIZES.filter((s) => stockFor(l.baseId, s) > 0).length;
                return (
                  <div key={l.id} style={{ marginBottom: 32 }}>
                    {lines.length > 1 && <p style={{ fontWeight: 800, marginBottom: 6 }}>{l.baseName}</p>}
                    <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14, fontWeight: 600 }}>
                      Live stock: {inStockCount} of {SIZES.length} sizes available.
                    </p>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))',
                        border: '2px solid var(--ink)',
                        marginRight: -2,
                        marginBottom: -2,
                        overflow: 'hidden'
                      }}
                    >
                      {SIZES.map((size) => {
                        const qty = stockFor(l.baseId, size);
                        const soldOut = qty === 0;
                        const low = qty > 0 && qty <= 2;
                        const selected = l.size === size;
                        const statusLabel = soldOut ? 'Sold out' : low ? 'Low stock' : 'In stock';
                        return (
                          <button
                            key={size}
                            disabled={soldOut}
                            onClick={() => setLineSize(l.id, size)}
                            style={{
                              borderRight: '2px solid var(--ink)',
                              borderBottom: '2px solid var(--ink)',
                              padding: '12px 8px',
                              background: selected ? 'var(--lime)' : soldOut ? 'rgba(32,30,29,0.08)' : '#fff',
                              opacity: soldOut ? 0.55 : 1,
                              textAlign: 'left',
                              cursor: soldOut ? 'not-allowed' : 'pointer'
                            }}
                          >
                            <div style={{ fontWeight: 800, fontSize: 13 }}>UK {size.replace('UK ', '')}</div>
                            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: soldOut ? 'inherit' : low ? '#b3261e' : 'var(--muted)' }}>
                              {statusLabel}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ marginTop: 20, display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                          Quantity
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', border: '2px solid var(--ink)', width: 'fit-content' }}>
                          <button
                            type="button"
                            onClick={() => setLineQty(l.id, l.qty - 1)}
                            disabled={l.qty <= 1}
                            style={{ width: 40, height: 40, fontWeight: 800, fontSize: 16, borderRight: '2px solid var(--ink)' }}
                          >
                            −
                          </button>
                          <span style={{ width: 44, textAlign: 'center', fontWeight: 800 }}>{l.qty}</span>
                          <button
                            type="button"
                            onClick={() => setLineQty(l.id, l.qty + 1)}
                            disabled={l.qty >= 9}
                            style={{ width: 40, height: 40, fontWeight: 800, fontSize: 16, borderLeft: '2px solid var(--ink)' }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div style={{ flex: 1, minWidth: 260 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                          Delivery
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '2px solid var(--ink)' }}>
                          {(['standard', 'express'] as DeliveryMethod[]).map((m) => {
                            const active = deliveryMethod === m;
                            return (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setDeliveryMethod(m)}
                                style={{
                                  textAlign: 'left',
                                  padding: '12px 14px',
                                  background: active ? 'var(--ink)' : '#fff',
                                  color: active ? '#fff' : 'var(--ink)',
                                  borderLeft: m === 'express' ? '2px solid var(--ink)' : 'none'
                                }}
                              >
                                <div style={{ fontWeight: 800, fontSize: 13, textTransform: 'uppercase' }}>{m}</div>
                                <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>
                                  {m === 'standard' ? '3–5 days after painting · Free' : `Next day after painting · £${DELIVERY_COST.express}`}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <p className="body-text" style={{ fontSize: 13, marginBottom: 24 }}>
                We email you at every stage — painting, drying, sign-off and dispatch.
              </p>

              <button className="btn btn-lime" disabled={!allSized} onClick={() => setStep('delivery')}>
                Continue →
              </button>
            </div>
          )}

          {step === 'delivery' && (
            <div style={{ maxWidth: 520 }}>
              <h2 className="h-display h3" style={{ marginBottom: 4 }}>Where it&rsquo;s going</h2>
              <p className="body-text" style={{ marginBottom: 20 }}>
                We&apos;ll email you a photo of the finished pair before they ship. You&apos;ll have 24 hours to comment.
              </p>

              <button
                className="btn btn-sm"
                onClick={autofillAddress}
                type="button"
                style={{ background: '#fff', border: '2px solid var(--lime)', color: 'var(--olive)', marginBottom: 24 }}
              >
                Autofill saved address
              </button>

              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Full name" value={name} onChange={setName} />
                <Field label="Email" type="email" value={email} onChange={setEmail} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Address" value={address} onChange={setAddress} />
                  <Field label="Town or city" value={city} onChange={setCity} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Postcode" value={postcode} onChange={setPostcode} />
                  <div />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
                <button className="btn btn-outline" onClick={() => setStep('size')}>← Back</button>
                <button
                  className="btn btn-lime"
                  disabled={!name || !email || !address || !city || !postcode}
                  onClick={() => setStep('payment')}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div style={{ maxWidth: 520 }}>
              <h2 className="h-display h3" style={{ marginBottom: 4 }}>Payment</h2>
              <p className="body-text" style={{ marginBottom: 20 }}>
                Card, Apple Pay, Google Pay or Klarna — choose on the next screen. Klarna splits it into three,
                interest free.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <span className="tag" style={{ background: '#fff', fontStyle: 'italic', fontWeight: 800 }}>VISA</span>
                <span className="tag" style={{ background: '#fff', fontWeight: 800 }}>MASTERCARD</span>
                <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>Secured, 3-D Secure</span>
              </div>

              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20 }}>
                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} style={{ marginTop: 4 }} />
                <span className="body-text">
                  I accept the{' '}
                  <Link href="/terms-and-conditions" style={{ fontWeight: 700, color: 'var(--olive)' }}>
                    terms and conditions
                  </Link>
                  .
                </span>
              </label>

              {payError && <p style={{ color: '#b3261e', marginBottom: 16 }}>{payError}</p>}

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-outline" onClick={() => setStep('delivery')}>← Back</button>
                <button className="btn btn-lime" onClick={submitPayment} disabled={submitting}>
                  {submitting ? 'Redirecting to secure payment…' : 'Continue to secure payment →'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ borderLeft: '2px solid rgba(32,30,29,0.2)', paddingLeft: 40 }}>
          <OrderSummary lines={lines} total={total} deliveryLabel={deliveryLabel} />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ border: '2px solid var(--ink)', padding: '12px 14px', fontSize: 15 }}
      />
    </label>
  );
}
