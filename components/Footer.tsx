import Link from 'next/link';
import Logo from './Logo';
import MailingListForm from './MailingListForm';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <>
      <section className={styles.oneOfOne}>
        <div className={`container ${styles.oneOfOneInner}`}>
          <h2 className="h-display h2">
            One of one.
            <br />
            Just for you.
          </h2>
          <Link href="/create-your-own" className="btn">
            Create your own →
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.col}>
            <Logo small />
            <p className={styles.tagline}>
              Hand-crafted kicks just for you.
              <br />
              What do yours say?
            </p>
          </div>
          <div className={styles.col}>
            <h3>Shop</h3>
            <Link href="/create-your-own">Create your own</Link>
            <Link href="/base-trainers">Base trainers</Link>
            <Link href="/gallery">Gallery</Link>
          </div>
          <div className={styles.col}>
            <h3>Studio</h3>
            <Link href="/about">About the studio</Link>
            <Link href="/sizing-and-care">Sizing, care & FAQs</Link>
            <Link href="/terms-and-conditions">Terms & conditions</Link>
            <Link href="/contact">Contact</Link>
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
