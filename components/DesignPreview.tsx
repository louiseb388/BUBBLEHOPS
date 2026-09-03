'use client';

import { getBase } from '@/lib/data';
import type { DesignState } from '@/lib/designer-types';
import ShoeStage from './designer/ShoeStage';

export default function DesignPreview({
  design,
  width = 220,
  showLabels = false
}: {
  design: DesignState;
  width?: number | string;
  showLabels?: boolean;
}) {
  const base = getBase(design.baseId);
  if (!base) return null;
  const noop = () => {};
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, width, pointerEvents: 'none' }}>
      <div>
        <ShoeStage base={base} side={design.left} which="left" active={false} onFocus={noop} onMoveWord={noop} onMoveSticker={noop} showStickerBadge={false} />
        {showLabels && (
          <p style={{ margin: '6px 0 0', textAlign: 'center', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Left
          </p>
        )}
      </div>
      <div>
        <ShoeStage base={base} side={design.right} which="right" active={false} onFocus={noop} onMoveWord={noop} onMoveSticker={noop} showStickerBadge={false} />
        {showLabels && (
          <p style={{ margin: '6px 0 0', textAlign: 'center', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Right
          </p>
        )}
      </div>
    </div>
  );
}
