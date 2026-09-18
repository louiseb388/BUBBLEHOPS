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
          <picture>
            {slide.mobileImg && <source media="(max-width: 640px)" srcSet={slide.mobileImg} />}
            <img
              src={slide.img}
              alt="Hand-painted custom kids' trainers by BUBBLEHOPS"
              className={styles.slideImg}
              style={{ '--slide-pos': slide.pos, '--slide-pos-mobile': slide.mobilePos || slide.pos } as React.CSSProperties}
              fetchPriority={i === 0 ? 'high' : 'low'}
            />
          </picture>
        </div>
      ))}
      <div className={styles.overlay} />

      <div className={styles.layout}>
        <div className={styles.spacer} />

        <div className={styles.content}>
          <h1 className={styles.headline}>YOUR KICKS</h1>
        </div>

        <div className={styles.greenBar}>
          <div className={styles.greenBarInner}>
            <div className={styles.wayCol}>
              <h2 className={styles.headlineWay}>YOUR WAY.</h2>
              <p className={styles.sub}>
                <span className={styles.subOuter} aria-hidden="true">&ldquo;What do yours say?&rdquo;</span>
                <span className={styles.subInner} aria-hidden="true">&ldquo;What do yours say?&rdquo;</span>
                <span className={styles.subFill}>&ldquo;What do yours say?&rdquo;</span>
              </p>
            </div>
            <Link href="/base-trainers" className={styles.snakeBtn}>
              <svg className={styles.snakeSvg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <rect x="1" y="1" width="98" height="98" pathLength="100" className={styles.snakeTrack} />
                <rect x="1" y="1" width="98" height="98" pathLength="100" className={styles.snakeDash} />
              </svg>
              <span className={styles.snakeBtnInner}>Create your own</span>
            </Link>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.delivery}>
            <span className={styles.deliveryLabel}>Free standard delivery</span>
            <div className={styles.progressTrack}>
              {HERO_SLIDES.map((slide, i) => (
                <div key={slide.img} className={styles.progressSeg}>
                  <div
                    className={styles.progressFill}
                    style={{ width: i < index ? '100%' : i === index ? `${progress}%` : '0%' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.controls}>
            <span className={styles.counter}>
              {String(index + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
            </span>
            <button className={styles.ctrlBtn} onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play' : 'Pause'}>
              {paused ? <PlayIcon /> : <PauseIcon />}
            </button>
            <button className={styles.ctrlBtn} onClick={prev} aria-label="Previous slide">
              <ChevronIcon flip />
            </button>
            <button className={`${styles.ctrlBtn} ${styles.ctrlBtnNext}`} onClick={next} aria-label="Next slide">
              <ChevronIcon />
            </button>
          </div>
        </div>
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
