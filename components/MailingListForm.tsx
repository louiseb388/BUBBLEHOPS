'use client';

import styles from './Footer.module.css';

export default function MailingListForm() {
  return (
    <form className={styles.mailingForm} onSubmit={(e) => e.preventDefault()}>
      <input type="email" required placeholder="you@email.com" aria-label="Email address" className={styles.mailingInput} />
      <button type="submit" className={styles.mailingBtn}>Join</button>
    </form>
  );
}
