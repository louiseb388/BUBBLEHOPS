'use client';

import { useState } from 'react';
import { BASES_IN_STOCK, type BaseTrainer } from '@/lib/data';
import { isSoldOut, type Stock } from '@/lib/inventory';
import styles from './Toolbar.module.css';

type Props = {
  base: BaseTrainer;
  bothPainted: boolean;
  stock: Stock;
  onPickBase: (id: string) => void;
  onShare: () => void;
  onSurprise: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export default function Toolbar({ base, bothPainted, stock, onPickBase, onShare, onSurprise, onUndo, onRedo, canUndo, canRedo }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.toolbar}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.baseName}>{base.name}</span>
          <span className={styles.status}>{bothPainted ? 'Both shoes painted' : 'One painted'}</span>
          <div className={styles.dropdownWrap}>
            <button className={styles.textBtn} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
              More base shoes
            </button>
            {open && (
              <div className={styles.dropdown}>
                {BASES_IN_STOCK.map((b) => {
                  const soldOut = isSoldOut(stock, b.id);
                  return (
                    <button
                      key={b.id}
                      className={styles.dropdownItem}
                      data-sold={soldOut}
                      disabled={soldOut}
                      onClick={() => {
                        onPickBase(b.id);
                        setOpen(false);
                      }}
                    >
                      <img src={b.img} alt="" />
                      <span>
                        <span style={{ display: 'block', fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>{b.name}</span>
                        <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)' }}>
                          {soldOut ? 'Sold out' : `From £${b.price}`}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.textBtn} onClick={onShare}>Share design</button>
          <button className={styles.textBtn} onClick={onSurprise}>Surprise me</button>
          <button className={styles.iconBtn} onClick={onUndo} disabled={!canUndo} aria-label="Undo">↺</button>
          <button className={styles.iconBtn} onClick={onRedo} disabled={!canRedo} aria-label="Redo">↻</button>
        </div>
      </div>
    </div>
  );
}
