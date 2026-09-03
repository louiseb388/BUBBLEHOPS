import type { Metadata } from 'next';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';
import ProductGrid from '@/components/ProductGrid';
import InstagramStrip from '@/components/InstagramStrip';
import { ROUTES } from '@/lib/data';
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
            <h2 className={`h-display h2 ${styles.sectionTitle}`}>You pick. We paint.</h2>
          </div>
          <Link href="/create-your-own" className={`btn btn-lime ${styles.noBorder}`}>
            Create your own
          </Link>
        </div>
        <ProductGrid />
      </section>

      <InstagramStrip />
    </>
  );
}
