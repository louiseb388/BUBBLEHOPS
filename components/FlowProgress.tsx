export type FlowStep = 'trainer' | 'size' | 'design' | 'delivery' | 'payment';

const STEPS: { key: FlowStep; label: string }[] = [
  { key: 'trainer', label: 'Trainer' },
  { key: 'size', label: 'Size' },
  { key: 'design', label: 'Design' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'payment', label: 'Payment' }
];

/** The step rail shown on every screen of the trainer → size → design → delivery → payment
 * flow (base-trainers, /size, create-your-own, checkout) — one shared component so the
 * numbering and styling stay consistent everywhere it appears. */
export default function FlowProgress({ step, complete = false }: { step: FlowStep; complete?: boolean }) {
  const idx = STEPS.findIndex((s) => s.key === step);
  const fillPct = complete ? 100 : ((idx + 1) / STEPS.length) * 100;

  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ height: 3, background: 'rgba(32,30,29,0.2)', marginBottom: 18 }}>
        <div style={{ height: '100%', width: `${fillPct}%`, background: 'var(--lime)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`, gap: 8 }}>
        {STEPS.map((s, i) => (
          <div key={s.key}>
            <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 2 }}>{String(i + 1).padStart(2, '0')}</div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: i === idx ? 'var(--ink)' : 'var(--muted)'
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
