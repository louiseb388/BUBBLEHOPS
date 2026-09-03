import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import FaqAccordion from '@/components/FaqAccordion';
import { CARE_STEPS, FAQS, ROUTES } from '@/lib/data';
import { breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: ROUTES.faq.title,
  description: ROUTES.faq.desc,
  alternates: { canonical: ROUTES.faq.path }
};

const faqPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }))
};

const infoRows = [
  { label: 'UK kids\u2019 sizing', body: 'We size to UK kids\u2019 10 through 6. If your child is between sizes, go up rather than down.' },
  { label: 'Turnaround', body: 'Usually about three days from order, plus two to three days for delivery. Next-day delivery is available at checkout.' },
  { label: 'Returns', body: 'Every pair is a one-off made to order, so we don\u2019t accept returns unless a pair arrives faulty.' },
  { label: 'Gifting', body: 'Add a gift note at checkout and we\u2019ll write it into the box and leave the invoice out.' },
  { label: 'Delivery', body: 'Free standard UK delivery on every order.' }
];

export default function SizingAndCarePage() {
  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: ROUTES.faq.crumb, path: ROUTES.faq.path }])} />
      <JsonLd data={faqPageJsonLd} />

      <p className="eyebrow">Sizing & care</p>
      <h1 className="h-display h1" style={{ marginBottom: 40 }}>The practical bit.</h1>

      <div style={{ borderTop: '2px solid var(--ink)', marginBottom: 72 }}>
        {infoRows.map((row) => (
          <div
            key={row.label}
            style={{
              display: 'grid',
              gridTemplateColumns: '240px 1fr',
              gap: 32,
              padding: '20px 0',
              borderBottom: '2px solid rgba(32,30,29,0.4)'
            }}
          >
            <p style={{ margin: 0, fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {row.label}
            </p>
            <p className="body-text" style={{ margin: 0 }}>{row.body}</p>
          </div>
        ))}
      </div>

      <section style={{ marginBottom: 72 }}>
        <h2 className="h-display h2" style={{ marginBottom: 32 }}>How we paint</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 32 }}>
          {CARE_STEPS.map((step) => (
            <div key={step.n}>
              <p style={{ margin: '0 0 12px', fontFamily: 'var(--font-archivo)', fontWeight: 900, fontSize: 40, color: 'var(--lime)' }}>
                {step.n}
              </p>
              <h3 style={{ margin: '0 0 10px', fontWeight: 800, fontSize: 17, textTransform: 'uppercase' }}>{step.title}</h3>
              <p className="body-text" style={{ margin: 0 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="h-display h2" style={{ marginBottom: 24 }}>Frequently asked</h2>
        <FaqAccordion items={FAQS} />
      </section>
    </div>
  );
}
