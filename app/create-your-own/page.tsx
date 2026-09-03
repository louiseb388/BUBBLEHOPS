import type { Metadata } from 'next';
import { Suspense } from 'react';
import JsonLd from '@/components/JsonLd';
import DesignerClient from '@/components/designer/DesignerClient';
import { ROUTES } from '@/lib/data';
import { breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: ROUTES.design.title,
  description: ROUTES.design.desc,
  alternates: { canonical: ROUTES.design.path }
};

export default function CreateYourOwnPage() {
  return (
    <div>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: ROUTES.design.crumb, path: ROUTES.design.path }])} />
      <Suspense fallback={<div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Loading designer…</div>}>
        <DesignerClient />
      </Suspense>
    </div>
  );
}
