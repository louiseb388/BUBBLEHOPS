'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import DesignPreview from '@/components/DesignPreview';

export default function BasketPage() {
  const { lines, removeLine, total, ready } = useCart();

  if (!ready) return null;

  if (lines.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h1 className="h-display h1" style={{ marginBottom: 20 }}>Your basket&apos;s empty.</h1>
        <Link href="/create-your-own" className="btn btn-lime">Create your own</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <h1 className="h-display h1" style={{ marginBottom: 32 }}>Your basket.</h1>

      <div style={{ borderTop: '2px solid var(--ink)' }}>
        {lines.map((line) => (
          <div
            key={line.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '220px 1fr auto',
              gap: 24,
              alignItems: 'center',
              padding: '24px 0',
              borderBottom: '2px solid var(--ink)'
            }}
          >
            <DesignPreview design={line.design} width={220} />
            <div>
              <p style={{ margin: '0 0 4px', fontWeight: 800, textTransform: 'uppercase' }}>{line.baseName}</p>
              <p className="body-text" style={{ margin: 0 }}>
                Left: {line.design.left.blank ? 'Blank' : line.design.left.word || '—'}
                <br />
                Right: {line.design.right.blank ? 'Blank' : line.design.right.word || '—'}
                <br />
                Size: {line.size || 'Not set'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 12px', fontWeight: 800, fontSize: 18 }}>£{line.price}</p>
              <button className="btn btn-outline btn-sm" onClick={() => removeLine(line.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0' }}>
        <span style={{ fontWeight: 800, fontSize: 20 }}>Total: £{total}</span>
        <Link href="/checkout" className="btn btn-lime">Checkout →</Link>
      </div>
    </div>
  );
}
