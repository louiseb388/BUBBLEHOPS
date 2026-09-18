'use client';

import { SIZES } from '@/lib/data';
import { useStock } from '@/lib/inventory';

type Props = {
  baseId: string;
  size: string | null;
  qty: number;
  onSizeChange: (size: string) => void;
  onQtyChange: (qty: number) => void;
};

/** The size grid (with live in-stock/low-stock/sold-out badges) plus a quantity stepper for
 * one base trainer — shared by the /size page (step 2 of the trainer → size → design →
 * delivery → payment flow) and checkout's own size step, which the same UI still needs as a
 * fallback for a basket line that somehow arrives at checkout without a size already set. */
export default function SizeQtyPicker({ baseId, size, qty, onSizeChange, onQtyChange }: Props) {
  const { stock } = useStock();
  const stockFor = (s: string) => stock[baseId]?.[s] ?? 0;
  const inStockCount = SIZES.filter((s) => stockFor(s) > 0).length;

  return (
    <div>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14, fontWeight: 600 }}>
        Live stock: {inStockCount} of {SIZES.length} sizes available.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))',
          gap: 8,
          marginBottom: 20
        }}
      >
        {SIZES.map((s) => {
          const stockQty = stockFor(s);
          const soldOut = stockQty === 0;
          const low = stockQty > 0 && stockQty <= 2;
          const selected = size === s;
          const statusLabel = soldOut ? 'Sold out' : low ? 'Low stock' : 'In stock';
          return (
            <button
              key={s}
              disabled={soldOut}
              onClick={() => onSizeChange(s)}
              style={{
                padding: '12px 8px',
                background: selected ? 'var(--lime)' : soldOut ? 'rgba(32,30,29,0.08)' : '#fff',
                opacity: soldOut ? 0.55 : 1,
                textAlign: 'left',
                cursor: soldOut ? 'not-allowed' : 'pointer',
                border: 'none'
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 13 }}>UK {s.replace('UK ', '')}</div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: soldOut ? 'inherit' : low ? '#b3261e' : 'var(--muted)'
                }}
              >
                {statusLabel}
              </div>
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
        Quantity
      </p>
      <div style={{ display: 'flex', alignItems: 'center', background: '#fff', width: 'fit-content' }}>
        <button
          type="button"
          onClick={() => onQtyChange(qty - 1)}
          disabled={qty <= 1}
          style={{ width: 40, height: 40, fontWeight: 800, fontSize: 16 }}
        >
          −
        </button>
        <span style={{ width: 44, textAlign: 'center', fontWeight: 800 }}>{qty}</span>
        <button
          type="button"
          onClick={() => onQtyChange(qty + 1)}
          disabled={qty >= 9}
          style={{ width: 40, height: 40, fontWeight: 800, fontSize: 16 }}
        >
          +
        </button>
      </div>
    </div>
  );
}
