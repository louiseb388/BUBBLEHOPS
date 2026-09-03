export type CheckoutStep = 'bag' | 'delivery' | 'payment';

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: 'bag', label: 'Your bag' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'payment', label: 'Payment' }
];

export default function CheckoutProgress({ step, complete = false }: { step: CheckoutStep; complete?: boolean }) {
  const idx = STEPS.findIndex((s) => s.key === step);
  const fillPct = complete ? 100 : ((idx + 1) / STEPS.length) * 100;

  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ height: 3, background: 'rgba(32,30,29,0.2)', marginBottom: 18 }}>
        <div style={{ height: '100%', width: `${fillPct}%`, background: 'var(--lime)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`, gap: 16 }}>
        {STEPS.map((s, i) => (
          <div key={s.key}>
            <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 2 }}>{String(i + 1).padStart(2, '0')}</div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
