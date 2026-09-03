import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { GALLERY_IMAGES, ROUTES } from '@/lib/data';
import { breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: ROUTES.gallery.title,
  description: ROUTES.gallery.desc,
  alternates: { canonical: ROUTES.gallery.path }
};

export default function GalleryPage() {
  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 80 }}>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: ROUTES.gallery.crumb, path: ROUTES.gallery.path }])} />
      <p className="eyebrow">Gallery</p>
      <h1 className="h-display h1" style={{ marginBottom: 16 }}>Some inspiration.</h1>
      <p className="lede" style={{ marginBottom: 40 }}>All one of a kind. What will yours say?</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
          gap: 3,
          background: 'var(--ink)',
          border: '2px solid var(--ink)',
          marginBottom: 48
        }}
      >
        {GALLERY_IMAGES.map((src) => (
          <div key={src} style={{ aspectRatio: '1', overflow: 'hidden' }}>
            <img
              src={src}
              alt="Hand-painted custom kids' trainers by BUBBLEHOPS"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 className="h-display h2" style={{ marginBottom: 20 }}>Seen one you like?</h2>
        <Link href="/create-your-own" className="btn btn-lime">Create your own →</Link>
      </div>
    </div>
  );
}
