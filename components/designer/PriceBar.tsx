'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './PriceBar.module.css';

type Props = {
  price: number;
  bothPainted: boolean;
  onAddToBasket: () => void;
  onSaveDesign: () => void;
};

export default function PriceBar({ price, bothPainted, onAddToBasket, onSaveDesign }: Props) {
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
          <div>
            <div className={styles.price}>£{price}</div>
            <div className={styles.priceNote}>{bothPainted ? 'Both shoes painted' : 'Single shoe painted'}</div>
          </div>
          <div className={styles.actions}>
            <button className="btn btn-outline-white" onClick={onSaveDesign}>Save design</button>
            <button className="btn btn-lime" onClick={handleAdd}>Add to basket</button>
          </div>
        </div>
      </div>

      {added && (
        <div className={styles.popupBackdrop} role="dialog" aria-modal="true">
          <div className={styles.popup}>
            <h3 className="h-display h3">Added to your basket</h3>
            <div className={styles.popupActions}>
              <button className="btn btn-lime" onClick={() => router.push('/checkout')}>Checkout</button>
              <button className="btn btn-outline" onClick={() => setAdded(false)}>Create another pair</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
