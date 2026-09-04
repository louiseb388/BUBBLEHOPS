'use client';

import { useState } from 'react';
import { BASES_IN_STOCK, type BaseTrainer } from '@/lib/data';
import { isSoldOut, sizesInStock, type Stock } from '@/lib/inventory';
import styles from './Toolbar.module.css';

type Props = {
  base: BaseTrainer;
  stock: Stock;
  onPickBase: (id: string) => void;
};

export default function Toolbar({ base, stock, onPickBase }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.toolbar}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.dropdownWrap}>
            <button className={styles.moreBasesBtn} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
              {base.name}
            </button>
            {open && (
              <div className={styles.dropdown}>
                {BASES_IN_STOCK.map((b) => {
                  const soldOut = isSoldOut(stock, b.id);
                  const sizes = sizesInStock(stock, b.id).map((s) => s.replace('UK ', ''));
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
                      <span style={{ display: 'block', fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>{b.name}</span>
                      <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)' }}>
                        {soldOut ? 'Sold out' : `From £${b.price}`}
                      </span>
                      {!soldOut && sizes.length > 0 && (
                        <span style={{ display: 'block', fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                          Sizes: {sizes.join(', ')}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
