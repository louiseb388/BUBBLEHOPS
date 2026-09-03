import type { Metadata } from 'next';
import { Suspense } from 'react';
import CheckoutClient from './CheckoutClient';
import { ROUTES } from '@/lib/data';

export const metadata: Metadata = {
  title: ROUTES.checkout.title,
  description: ROUTES.checkout.desc,
  robots: { index: false, follow: false }
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Loading checkout…</div>}>
      <CheckoutClient />
    </Suspense>
  );
}
