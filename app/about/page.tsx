import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { ABOUT_USES, ROUTES } from '@/lib/data';
import { breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: ROUTES.about.title,
  description: ROUTES.about.desc,
  alternates: { canonical: ROUTES.about.path }
};

export default function AboutPage() {
  return (
    <div className="container" style={{ paddingTop: 56 }}>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: ROUTES.about.crumb, path: ROUTES.about.path }])} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
          gap: 64,
          alignItems: 'start',
          paddingBottom: 72,
          borderBottom: '2px solid var(--ink)'
        }}
      >
        <div>
          <p className="eyebrow">About</p>
          <h1 className="h-display h1" style={{ marginBottom: 28 }}>
            A desk, a lamp, and a lot of masking tape
          </h1>
          <p className="lede" style={{ marginBottom: 20 }}>
            BUBBLEHOPS began in 2006 with a single pair of hand-painted Stan Smiths and a passion for turning
            everyday footwear into something completely personal. Today, we work exclusively to custom order,
            creating one-of-a-kind trainers designed to reflect each customer&rsquo;s individual style, personality
            and imagination. Our kids&rsquo; trainers are made to be as unique as they are.
          </p>
          <p className="lede">
            Every pair is painted by hand with care and attention to detail, making no two designs exactly the
            same. We love creating footwear that feels special, whether it&rsquo;s a gift, a celebration or simply a
            fun way for kids to express themselves. At BUBBLEHOPS, we believe shoes don&rsquo;t have to be ordinary
            &mdash; they can be a little piece of art made just for you.
          </p>
        </div>
        <div style={{ background: 'var(--ink)' }}>
          <img
            src="/photos/bubblehops-hand-painted-custom-kids-trainers-02.jpg"
            alt="Hand-painted custom kids' trainers drying in the BUBBLEHOPS studio"
            style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', filter: 'grayscale(1)' }}
          />
        </div>
      </div>

      <section style={{ padding: '72px 0' }}>
        <h2 className="h-display h2" style={{ marginBottom: 40 }}>What we use</h2>
        <div style={{ borderTop: '2px solid var(--ink)' }}>
          {ABOUT_USES.map((row) => (
            <div
              key={row.label}
              style={{
                display: 'grid',
                gridTemplateColumns: '240px 1fr',
                gap: 32,
                padding: '22px 0',
                borderBottom: '2px solid rgba(32,30,29,0.4)'
              }}
            >
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {row.label}
              </p>
              <p className="body-text" style={{ margin: 0 }}>{row.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
