'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MailingListForm from './MailingListForm';
import { SITE } from '@/lib/data';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();
  const hideBanner = pathname?.startsWith('/create-your-own');

  return (
    <>
      {!hideBanner && (
        <section className={styles.oneOfOne}>
          <div className={`container ${styles.oneOfOneInner}`}>
            <h2 className="h-display h2">
              One of one.
              <br />
              Just for you.
            </h2>
            <Link href="/create-your-own" className="btn">
              Create your own
            </Link>
          </div>
        </section>
      )}

      <footer className={styles.footer}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.col}>
            <Link href="/" aria-label="BUBBLEHOPS home" className={styles.footerMark}>
              <FooterMark />
            </Link>
            <p className={styles.tagline}>
              Hand-crafted kicks just for you.
              <br />
              What do yours say?
            </p>
            <div className={styles.socialRow}>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="BUBBLEHOPS on Instagram"
                className={styles.socialIcon}
              >
                <InstagramIcon />
              </a>
              <a
                href={SITE.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="BUBBLEHOPS on TikTok"
                className={styles.socialIcon}
              >
                <TikTokIcon />
              </a>
            </div>
          </div>
          <div className={styles.col}>
            <h3>Shop</h3>
            <Link href="/create-your-own" className={styles.navLink}>Create your own</Link>
            <Link href="/base-trainers" className={styles.navLink}>Base trainers</Link>
            <Link href="/gallery" className={styles.navLink}>Gallery</Link>
          </div>
          <div className={styles.col}>
            <h3>Studio</h3>
            <Link href="/about" className={styles.navLink}>About the studio</Link>
            <Link href="/sizing-and-care" className={styles.navLink}>Sizing, care & FAQs</Link>
            <Link href="/terms-and-conditions" className={styles.navLink}>Terms & conditions</Link>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
          </div>
          <div className={styles.col}>
            <h3>Mailing list</h3>
            <p className={styles.mailingCopy}>Sign up to enter our prize draw</p>
            <MailingListForm />
          </div>
        </div>

        <div className={`container ${styles.bottom}`}>
          <span>© {new Date().getFullYear()} BUBBLEHOPS. Not affiliated with any footwear brand named on this site.</span>
        </div>
      </footer>
    </>
  );
}

function FooterMark() {
  return (
    <svg width="80" height="80" viewBox="0 0 124.93 124.93" aria-hidden="true">
      <circle fill="#bdd631" cx="62.46" cy="62.46" r="62.46" />
      <path
        fill="#231f20"
        d="M62.46,16.2c25.55,0,46.26,20.71,46.26,46.26s-20.71,46.26-46.26,46.26-46.26-20.71-46.26-46.26S36.91,16.2,62.46,16.2M62.46,8.42c-29.8,0-54.04,24.24-54.04,54.04s24.24,54.04,54.04,54.04,54.04-24.24,54.04-54.04S92.26,8.42,62.46,8.42h0Z"
      />
      <circle fill="#fff" cx="62.46" cy="62.46" r="49.68" />
      <path fill="#231f20" d="M87.43,75.3l-21.26-6.35c7.03-27.75,34.76-22.58,21.26,6.35Z" />
      <path fill="#231f20" d="M51.53,62.73l-18.47-10.71c11.5-21.23,25.9-9.8,18.47,10.71Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="#000" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.2" stroke="#000" strokeWidth="2" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="#000" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="15" height="17" viewBox="0 0 448 512" fill="#000" aria-hidden="true">
      <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
    </svg>
  );
}
