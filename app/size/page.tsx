import type { Metadata } from 'next';
import { Suspense } from 'react';
import JsonLd from '@/components/JsonLd';
import SizeClient from './SizeClient';
import { ROUTES } from '@/lib/data';
import { breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: ROUTES.size.title,
  description: ROUTES.size.desc,
  alternates: { canonical: ROUTES.size.path }
};

export default function SizePage() {
  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: ROUTES.shop.crumb, path: ROUTES.shop.path },
          { name: ROUTES.size.crumb, path: ROUTES.size.path }
        ])}
      />
      <Suspense fallback={<div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Loading…</div>}>
        <SizeClient />
      </Suspense>
    </div>
  );
}
