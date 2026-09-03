'use client';

import Link from 'next/link';
import type { BaseTrainer } from '@/lib/data';
import { sizesInStock, type Stock } from '@/lib/inventory';
import styles from './BaseTrainerCard.module.css';

export default function BaseTrainerCard({ base, stock }: { base: BaseTrainer; stock: Stock }) {
  const inStock = sizesInStock(stock, base.id);
  const soldOut = inStock.length === 0;
  const href = soldOut ? '/contact' : `/create-your-own?base=${base.id}`;

  return (
    <Link href={href} className={`${styles.card} ${soldOut ? styles.soldOut : ''}`}>
      <div className={styles.imgWrap}>
        <img src={base.img} alt={`${base.name} — blank base trainer ready to hand-paint`} className={styles.img} loading="lazy" />
        <span className={`tag tag-lime ${styles.badge}`}>Blank base</span>
        {soldOut && (
          <span className={`tag tag-warn ${styles.badge} ${styles.badgeSoldOut}`}>Sold out</span>
        )}
        {!soldOut && (
          <div className={styles.sizes}>
            {inStock.map((s) => (
              <span key={s} className={styles.sizeChip}>{s}</span>
            ))}
          </div>
        )}
      </div>
      <div className={styles.body}>
        <p className={styles.name}>{base.name}</p>
        <p className={styles.meta}>{base.meta}</p>
        <div className={styles.foot}>
          <p className={styles.price}>From £{base.price}</p>
          <span className={`btn btn-outline btn-sm ${styles.designBtn}`} aria-hidden="true">
            {soldOut ? 'Notify me →' : 'Design it →'}
          </span>
        </div>
      </div>
    </Link>
  );
}
