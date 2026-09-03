import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import ContactForm from '@/components/ContactForm';
import { ROUTES, SITE } from '@/lib/data';
import { breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: ROUTES.contact.title,
  description: ROUTES.contact.desc,
  alternates: { canonical: ROUTES.contact.path }
};

export default function ContactPage() {
  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: ROUTES.contact.crumb, path: ROUTES.contact.path }])} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 64 }}>
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="h-display h1" style={{ marginBottom: 16 }}>Let&apos;s talk.</h1>
          <p className="lede" style={{ marginBottom: 32 }}>
            For a custom pair use the Create your own page. For an extra special custom pair, get in touch.
            We&apos;d love to chat.
          </p>
          <p className="body-text" style={{ marginBottom: 6 }}>
            Email <a href={`mailto:${SITE.email}`} style={{ fontWeight: 700 }}>{SITE.email}</a>
          </p>
          <p className="body-text" style={{ marginBottom: 6 }}>
            Instagram{' '}
            <a href={SITE.instagramUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 700 }}>
              {SITE.instagramHandle}
            </a>
          </p>
          <p className="body-text">We reply within one working day.</p>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
