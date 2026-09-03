'use client';

import { useRef } from 'react';
import { INSTAGRAM_STRIP, SITE } from '@/lib/data';
import styles from './InstagramStrip.module.css';

export default function InstagramStrip() {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <h2 className="h-display h2">
            <span className={styles.highlight}>Inspiration from other bubblers</span>
          </h2>
          <div className={styles.arrows}>
            <button className={styles.arrowBtn} onClick={() => scroll(-1)} aria-label="Scroll left">←</button>
            <button className={styles.arrowBtn} onClick={() => scroll(1)} aria-label="Scroll right">→</button>
          </div>
        </div>
      </div>
      <div className={styles.wrap}>
        <div className={styles.scroller} ref={ref}>
          {INSTAGRAM_STRIP.map((src, i) => (
            <a
              key={src + i}
              className={styles.item}
              href={SITE.instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <img src={src} alt="BUBBLEHOPS customer trainer photo on Instagram" loading="lazy" />
            </a>
          ))}
        </div>
      </div>
      <div className="container" style={{ marginTop: 24 }}>
        <a href={SITE.instagramUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
          Follow on Instagram →
        </a>
      </div>
    </section>
  );
}
