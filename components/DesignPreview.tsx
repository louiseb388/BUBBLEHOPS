'use client';

import { getBase } from '@/lib/data';
import type { DesignState } from '@/lib/designer-types';
import ShoeStage from './designer/ShoeStage';

export default function DesignPreview({ design, width = 220 }: { design: DesignState; width?: number }) {
  const base = getBase(design.baseId);
  if (!base) return null;
  const noop = () => {};
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, width, pointerEvents: 'none' }}>
      <ShoeStage base={base} side={design.left} which="left" active={false} onFocus={noop} onMoveWord={noop} onMoveSticker={noop} showStickerBadge={false} />
      <ShoeStage base={base} side={design.right} which="right" active={false} onFocus={noop} onMoveWord={noop} onMoveSticker={noop} showStickerBadge={false} />
    </div>
  );
}
