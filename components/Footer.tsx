'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MailingListForm from './MailingListForm';
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
