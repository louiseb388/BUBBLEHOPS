'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './PriceBar.module.css';

type SizeOption = { size: string; qty: number };

type Props = {
  price: number;
  bothPainted: boolean;
  baseName: string;
  size: string | null;
  onSizeChange: (size: string) => void;
  sizeOptions: SizeOption[];
  onAddToBasket: () => void;
  onSaveDesign: () => void;
  onShareDesign: () => void;
};

export default function PriceBar({
  price,
  bothPainted,
  baseName,
  size,
  onSizeChange,
  sizeOptions,
  onAddToBasket,
  onSaveDesign,
  onShareDesign
}: Props) {
  const [added, setAdded] = useState(false);
  const router = useRouter();

  function handleAdd() {
    if (!size) return;
    onAddToBasket();
    setAdded(true);
  }

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.inner}>
          <div className={styles.sizeGroup}>
            <label className={styles.sizeLabel} htmlFor="pricebar-size">Size</label>
            <select
              id="pricebar-size"
              className={styles.sizeSelect}
              value={size || ''}
              onChange={(e) => onSizeChange(e.target.value)}
            >
              <option value="" disabled>Choose size</option>
              {sizeOptions.map(({ size: s, qty }) => (
                <option key={s} value={s} disabled={qty === 0}>
                  {s}
                  {qty === 0 ? ' — Sold out' : qty <= 2 ? ' — Low stock' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.priceGroup}>
            <div className={styles.price}>Total £{price}</div>
            <div className={styles.priceNote}>{bothPainted ? 'Both shoes painted' : 'Single shoe painted'}</div>
          </div>
          <div className={styles.actions}>
            <button className="btn btn-lime" onClick={handleAdd} disabled={!size}>Choose size and checkout →</button>
            <button className="btn btn-outline-white" onClick={onSaveDesign} aria-label="Save design">
              <SaveIcon />
              <span className={styles.btnLabel}>Save design</span>
            </button>
            <button className="btn btn-outline-white" onClick={onShareDesign} aria-label="Share design">
              <ShareIcon />
              <span className={styles.btnLabel}>Share design</span>
            </button>
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
              <button className="btn btn-lime" onClick={() => router.push('/basket')}>View basket →</button>
              <button className="btn btn-outline" onClick={() => setAdded(false)}>Continue shopping</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SaveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 4h11l3 3v13H5V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 4v5h8V4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="8" y="14" width="8" height="6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 15V4M12 4l-4 4M12 4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
