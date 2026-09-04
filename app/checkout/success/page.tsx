'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart, type BagLine } from '@/lib/cart-context';
import CheckoutProgress from '@/components/checkout/CheckoutProgress';
import OrderSummary from '@/components/checkout/OrderSummary';
import styles from '../checkout.module.css';

function orderRef(sessionId: string) {
  const tail = sessionId.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase();
  return `BH-${tail || '0000'}`;
}

function SuccessInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { lines, total, clear, ready } = useCart();
  const [snapshot, setSnapshot] = useState<{ lines: BagLine[]; total: number } | null>(null);

  useEffect(() => {
    if (!ready || !sessionId || snapshot) return;
    setSnapshot({ lines, total });
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, sessionId]);

  const orderLines = snapshot?.lines ?? [];
  const orderTotal = snapshot?.total ?? 0;

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <p className="eyebrow">Checkout</p>
      <h1 className="h-display h1" style={{ marginBottom: 40 }}>Thanks — that&rsquo;s ordered</h1>

      <CheckoutProgress step="payment" complete />

      <div className={styles.grid}>
        <div>
          <h2 className="h-display h3" style={{ marginBottom: 4 }}>
            {sessionId ? `Order ${orderRef(sessionId)} is in` : 'Order confirmed'}
          </h2>
          <p className="body-text" style={{ marginBottom: 24, maxWidth: 460 }}>
            We&apos;ve emailed you a copy. Painting takes about three days, then two to three days for delivery —
            next-day if you picked it. You&apos;ll get a photo before it ships.
          </p>

          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/create-your-own" className="btn btn-lime">Design another →</Link>
            <Link href="/" className="btn btn-outline">Back home</Link>
          </div>
        </div>

        {orderLines.length > 0 && (
          <div className={styles.sidebar}>
            <OrderSummary lines={orderLines} total={orderTotal} deliveryLabel="Included" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessInner />
    </Suspense>
  );
}
