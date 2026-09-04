'use client';

import { useRouter } from 'next/navigation';
import styles from './PriceBar.module.css';

type Props = {
  price: number;
  bothPainted: boolean;
  onAddToBasket: () => void;
  onSaveDesign: () => void;
  onShareDesign: () => void;
};

export default function PriceBar({ price, bothPainted, onAddToBasket, onSaveDesign, onShareDesign }: Props) {
  const router = useRouter();

  function handleAdd() {
    onAddToBasket();
    router.push('/checkout');
  }

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.priceGroup}>
          <div className={styles.price}>Total £{price}</div>
          <div className={styles.priceNote}>{bothPainted ? 'Both shoes painted' : 'Single shoe painted'}</div>
        </div>
        <div className={styles.actions}>
          <button className="btn btn-lime" onClick={handleAdd}>Choose size and checkout →</button>
          <button className="btn btn-outline-white" onClick={onSaveDesign} aria-label="Save design">
            <SaveIcon />
          </button>
          <button className="btn btn-outline-white" onClick={onShareDesign} aria-label="Share design">
            <ShareIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function SaveIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 4h11l3 3v13H5V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 4v5h8V4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="8" y="14" width="8" height="6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 15V4M12 4l-4 4M12 4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
