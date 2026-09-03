'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './PriceBar.module.css';

type Props = {
  price: number;
  bothPainted: boolean;
  baseName: string;
  onAddToBasket: () => void;
  onSaveDesign: () => void;
};

export default function PriceBar({ price, bothPainted, baseName, onAddToBasket, onSaveDesign }: Props) {
  const [added, setAdded] = useState(false);
  const router = useRouter();

  function handleAdd() {
    onAddToBasket();
    setAdded(true);
  }

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.inner}>
          <div className={styles.priceGroup}>
            <div className={styles.price}>Total £{price}</div>
            <div className={styles.priceNote}>{bothPainted ? 'Both shoes painted' : 'Single shoe painted'}</div>
          </div>
          <div className={styles.actions}>
            <button className="btn btn-lime" onClick={handleAdd}>Add to basket →</button>
            <button className="btn btn-outline-white" onClick={onSaveDesign}>Save design</button>
          </div>
        </div>
      </div>

      {added && (
        <div className={styles.popupBackdrop} role="dialog" aria-modal="true">
          <div className={styles.popup}>
            <p className="eyebrow" style={{ color: 'var(--olive)', marginBottom: 12 }}>Added to basket</p>
            <h3 className="h-display h2" style={{ marginBottom: 16 }}>{baseName}</h3>
            <p className="body-text" style={{ marginBottom: 24 }}>
              Checkout now, or keep going and design another pair — your basket holds them both.
            </p>
            <div className={styles.popupActions}>
              <button className="btn btn-lime" onClick={() => router.push('/checkout')}>Pick size and checkout →</button>
              <button className="btn btn-outline" onClick={() => setAdded(false)}>Create another pair</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
