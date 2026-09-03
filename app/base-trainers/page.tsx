import type { Metadata } from 'next';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import JsonLd from '@/components/JsonLd';
import { ROUTES } from '@/lib/data';
import { breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: ROUTES.shop.title,
  description: ROUTES.shop.desc,
  alternates: { canonical: ROUTES.shop.path }
};

export default function BaseTrainersPage() {
  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 80 }}>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: ROUTES.shop.crumb, path: ROUTES.shop.path }])} />
      <p className="eyebrow">Base trainers</p>
      <h1 className="h-display h1" style={{ marginBottom: 16 }}>Blank canvases.</h1>
      <p className="lede" style={{ marginBottom: 40 }}>
        Every base we hand-paint, bought new in your child&apos;s size. Pick one to start designing, or get in touch if you don&apos;t see what you&apos;re after.
      </p>

      <ProductGrid />

      <div
        style={{
          marginTop: 48,
          padding: '32px',
          background: 'var(--tint)',
          border: '2px solid var(--ink)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        <p style={{ margin: 0, fontWeight: 700 }}>Don&apos;t see something? Get in touch.</p>
        <Link href="/contact" className="btn btn-lime">Contact the studio →</Link>
      </div>
    </div>
  );
}
