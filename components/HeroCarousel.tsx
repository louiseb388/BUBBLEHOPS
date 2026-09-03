'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { HERO_SLIDES } from '@/lib/data';
import styles from './HeroCarousel.module.css';

const SLIDE_MS = 5500;
const TICK_MS = 50;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const elapsedRef = useRef(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % HERO_SLIDES.length);
    elapsedRef.current = 0;
    setProgress(0);
  }, []);
  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    elapsedRef.current = 0;
    setProgress(0);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      elapsedRef.current += TICK_MS;
      const pct = Math.min(100, (elapsedRef.current / SLIDE_MS) * 100);
      setProgress(pct);
      if (elapsedRef.current >= SLIDE_MS) next();
    }, TICK_MS);
    return () => clearInterval(id);
  }, [paused, index, next]);

  return (
    <section className={styles.hero} aria-roledescription="carousel" aria-label="Customer trainer photos">
      {HERO_SLIDES.map((slide, i) => (
        <div key={slide.img} className={`${styles.slide} ${i === index ? styles.active : ''}`} aria-hidden={i !== index}>
          <img
            src={slide.img}
            alt="Hand-painted custom kids' trainers by BUBBLEHOPS"
            className={styles.slideImg}
            style={{ objectPosition: slide.pos }}
            fetchPriority={i === 0 ? 'high' : 'low'}
          />
        </div>
      ))}
      <div className={styles.overlay} />

      <div className={styles.content}>
        <p className={styles.sub}>&ldquo;What do yours say?&rdquo;</p>
        <h1 className={styles.headline}>
          YOUR KICKS
          <br />
          YOUR WAY.
        </h1>
        <div>
          <Link href="/create-your-own" className="btn btn-lime">
            Create your own →
          </Link>
        </div>
      </div>

      <div className={styles.controls}>
        <button className={styles.ctrlBtn} onClick={prev} aria-label="Previous slide">
          <ChevronIcon flip />
        </button>
        <button className={styles.ctrlBtn} onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play' : 'Pause'}>
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>
        <button className={styles.ctrlBtn} onClick={next} aria-label="Next slide">
          <ChevronIcon />
        </button>
      </div>

      <div className={styles.progressTrack}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}

function ChevronIcon({ flip = false }: { flip?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="4" width="5" height="16" /><rect x="14" y="4" width="5" height="16" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4l14 8-14 8V4z" />
    </svg>
  );
}
