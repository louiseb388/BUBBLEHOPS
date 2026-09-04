import Link from 'next/link';
import type { BagLine } from '@/lib/cart-context';
import { sideDescriptions, paintingLabel } from '@/lib/designer-types';
import DesignPreview from '../DesignPreview';

type Props = {
  lines: BagLine[];
  total: number;
  deliveryLabel: string;
  backHref?: string;
};

export default function OrderSummary({ lines, total, deliveryLabel, backHref = '/create-your-own' }: Props) {
  return (
    <aside>
      <p
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          marginBottom: 16
        }}
      >
        Your order
      </p>

      {lines.map((l) => {
        const desc = sideDescriptions(l.design);
        return (
          <div key={l.id} style={{ border: 'var(--border)', marginBottom: 24 }}>
            <div style={{ padding: 16 }}>
              <DesignPreview design={l.design} width="100%" showLabels />
            </div>
            <div style={{ borderTop: 'var(--border)', padding: 16 }}>
              <p style={{ margin: '0 0 6px', fontWeight: 800, fontSize: 15, textTransform: 'uppercase' }}>{l.baseName}</p>
              <p className="body-text" style={{ margin: '0 0 6px', fontSize: 13 }}>{desc.left}</p>
              <p className="body-text" style={{ margin: '0 0 14px', fontSize: 13 }}>{desc.right}</p>
              <Link href={backHref} className="btn btn-outline btn-sm">
                ← Back to my design
              </Link>
            </div>
          </div>
        );
      })}

      <div style={{ display: 'grid', gap: 12 }}>
        {lines.map((l) => (
          <div key={l.id} style={{ display: 'contents' }}>
            <Row label="Pair" value={l.baseName} />
            <Row label="Painting" value={paintingLabel(l.design)} />
            <Row label="Size" value={l.size || 'Not chosen'} />
            <Row label="Quantity" value={`× ${l.qty}`} />
          </div>
        ))}
        <Row label="Delivery" value={deliveryLabel} />
        <div style={{ borderTop: '2px solid var(--ink)', paddingTop: 14, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 800, fontSize: 14, textTransform: 'uppercase' }}>Total</span>
          <span style={{ fontWeight: 900, fontSize: 24 }}>£{total}</span>
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, gap: 12 }}>
      <span style={{ fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontWeight: 700, textAlign: 'right' }}>{value}</span>
    </div>
  );
}
