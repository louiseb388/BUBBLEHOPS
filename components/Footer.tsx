import Link from 'next/link';
import Logo from './Logo';
import { SITE } from '@/lib/data';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.appBand}`}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--lime)' }}>Coming soon</p>
          <h2 className="h-display h3" style={{ color: '#fff' }}>Get the BUBBLEHOPS app</h2>
        </div>
        <div className={styles.appBadges}>
          <span className={styles.storeBadge}>App Store</span>
          <span className={styles.storeBadge}>Google Play</span>
        </div>
      </div>

      <div className={`container ${styles.grid}`}>
        <div className={styles.col}>
          <Logo small />
        </div>
        <div className={styles.col}>
          <h3>Shop</h3>
          <Link href="/create-your-own">Create your own</Link>
          <Link href="/base-trainers">Base trainers</Link>
          <Link href="/gallery">Gallery</Link>
        </div>
        <div className={styles.col}>
          <h3>Help</h3>
          <Link href="/sizing-and-care">Sizing & care</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/terms-and-conditions">Terms & conditions</Link>
        </div>
        <div className={styles.col}>
          <h3>Studio</h3>
          <Link href="/about">About</Link>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a href={SITE.instagramUrl} target="_blank" rel="noreferrer">
            {SITE.instagramHandle}
          </a>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} BUBBLEHOPS. Hand-painted in the UK.</span>
        <span>Every pair is one of a kind.</span>
      </div>
    </footer>
  );
}
