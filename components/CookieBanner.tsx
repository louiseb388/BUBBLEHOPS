'use client';

import { useEffect, useState } from 'react';
import styles from './CookieBanner.module.css';

const KEY = 'bubblehops_cookie_consent';

export default function CookieBanner() {
  const [choice, setChoice] = useState<string | null>('pending');

  useEffect(() => {
    setChoice(window.localStorage.getItem(KEY));
  }, []);

  function choose(value: 'essential' | 'all') {
    window.localStorage.setItem(KEY, value);
    setChoice(value);
  }

  if (choice === 'pending' || choice) return null;

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie preferences">
      <div className={styles.inner}>
        <p className={styles.text}>
          We use cookies to keep the designer working and to understand how the site is used. Choose what you&apos;re happy with.
        </p>
        <div className={styles.actions}>
          <button className="btn btn-outline-white btn-sm" onClick={() => choose('essential')}>
            Essential only
          </button>
          <button className="btn btn-lime btn-sm" onClick={() => choose('all')}>
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
