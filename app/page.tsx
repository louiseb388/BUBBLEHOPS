import type { Metadata } from 'next';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';
import ProductGrid from '@/components/ProductGrid';
import InstagramStrip from '@/components/InstagramStrip';
import { GALLERY_IMAGES, ROUTES } from '@/lib/data';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: ROUTES.home.title,
  description: ROUTES.home.desc,
  alternates: { canonical: '/' }
};

export default function HomePage() {
  return (
    <>
      <HeroCarousel />

      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHead}>
          <div>
            <p className="eyebrow">The range</p>
            <h2 className="h-display h2">You pick. We paint.</h2>
          </div>
          <Link href="/create-your-own" className="btn btn-lime">
            Create your own →
          </Link>
        </div>
        <ProductGrid />
      </section>

      <section className={styles.galleryTeaser}>
        <div className="container">
          <div className={styles.galleryGrid}>
            {GALLERY_IMAGES.slice(0, 10).map((src) => (
              <div key={src} className={styles.galleryItem}>
                <img src={src} alt="Hand-painted custom kids' trainers by BUBBLEHOPS" loading="lazy" />
              </div>
            ))}
          </div>
          <div className={styles.closer}>
            <h2 className="h-display h2">Seen one you like?</h2>
            <Link href="/create-your-own" className="btn btn-lime">
              Create your own →
            </Link>
          </div>
        </div>
      </section>

      <InstagramStrip />
    </>
  );
}
