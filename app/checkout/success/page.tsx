'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart-context';

function SuccessInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clear } = useCart();

  useEffect(() => {
    if (sessionId) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="container" style={{ padding: '96px 0', textAlign: 'center' }}>
      <h1 className="h-display h1" style={{ marginBottom: 16 }}>Thanks, that&apos;s ordered.</h1>
      <p className="lede" style={{ margin: '0 auto 32px' }}>
        You&apos;ll get a photo before it ships.
      </p>
      <Link href="/" className="btn btn-lime">Back to home</Link>
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
