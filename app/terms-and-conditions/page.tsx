import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { ROUTES } from '@/lib/data';
import { breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: ROUTES.terms.title,
  description: ROUTES.terms.desc,
  alternates: { canonical: ROUTES.terms.path }
};

const CLAUSES = [
  { h: 'One-off designs', b: 'Every pair is painted to order and is a one-off. No two pairs are ever exactly the same, even from an identical design.' },
  { h: 'Returns', b: "We don't accept returns or exchanges unless a pair arrives faulty. Because each pair is made to order, we can't resell a returned design." },
  { h: 'Ordering confirms the design', b: 'Placing an order means you agree to the design as shown in the online designer at checkout, including word, colours, size, rotation and stickers.' },
  { h: 'Natural variation', b: 'Because every pair is hand-painted, the finished result may vary slightly from the on-screen preview — brush texture, exact colour depth and paint flow are never perfectly identical between the digital render and a real, hand-painted shoe.' },
  { h: 'Photo before shipping', b: "Before your pair ships, we send a photo of the finished trainers. You have 24 hours to confirm or comment. If we don't hear from you within that window, we go ahead and ship." }
];

export default function TermsPage() {
  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96, maxWidth: 900 }}>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: ROUTES.terms.crumb, path: ROUTES.terms.path }])} />
      <p className="eyebrow">Terms & conditions</p>
      <h1 className="h-display h1" style={{ marginBottom: 40 }}>The small print.</h1>

      <div style={{ borderTop: '2px solid var(--ink)' }}>
        {CLAUSES.map((c) => (
          <div key={c.h} style={{ padding: '28px 0', borderBottom: '2px solid rgba(32,30,29,0.4)' }}>
            <h2 style={{ margin: '0 0 10px', fontWeight: 800, fontSize: 18, textTransform: 'uppercase' }}>{c.h}</h2>
            <p className="body-text" style={{ margin: 0, maxWidth: '68ch' }}>{c.b}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
