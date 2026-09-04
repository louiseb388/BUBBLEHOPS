import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { GALLERY_IMAGES, ROUTES } from '@/lib/data';
import { breadcrumbJsonLd } from '@/lib/seo';
import styles from './gallery.module.css';

export const metadata: Metadata = {
  title: ROUTES.gallery.title,
  description: ROUTES.gallery.desc,
  alternates: { canonical: ROUTES.gallery.path }
};

export default function GalleryPage() {
  return (
    <div style={{ paddingTop: 56, paddingBottom: 80 }}>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: ROUTES.gallery.crumb, path: ROUTES.gallery.path }])} />
      <div className="container">
        <p className="eyebrow">Gallery</p>
        <h1 className="h-display h1" style={{ marginBottom: 16 }}>Some inspiration.</h1>
        <p className="lede" style={{ marginBottom: 40 }}>All one of a kind. What will yours say?</p>
      </div>

      <div className={`container ${styles.grid}`}>
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
    </div>
  );
}
