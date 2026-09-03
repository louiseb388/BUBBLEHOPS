'use client';

import { useRef, useState, useCallback } from 'react';
import type { BaseTrainer } from '@/lib/data';
import { SOLE_ABOVE_CLIP, WORD_COLOURS } from '@/lib/data';
import type { Side } from '@/lib/designer-types';
import { isInsidePolygon, panelForBase, panelPathD, snapToPanel } from '@/lib/designer-geometry';
import BubbleMark from '../BubbleMark';
import styles from './ShoeStage.module.css';

function colourValue(id: string) {
  return WORD_COLOURS.find((c) => c.id === id)?.value || id;
}

/** Black glyph on light fills, white glyph on dark/non-hex (e.g. oklch) fills, so the sticker face stays visible against any selected colour. */
function glyphFor(hex: string) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return '#fff';
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? 'var(--ink)' : '#fff';
}

export const MAX_STICKERS = 5;

type Props = {
  base: BaseTrainer;
  side: Side;
  which: 'left' | 'right';
  active: boolean;
  onMoveWord: (x: number, y: number) => void;
  onMoveSticker: (id: string, x: number, y: number) => void;
  onAddSticker?: () => void;
  onRemoveSticker?: (id: string) => void;
  onFocus: () => void;
  showStickerBadge?: boolean;
};

export default function ShoeStage({
  base,
  side,
  which,
  active,
  onMoveWord,
  onMoveSticker,
  onAddSticker,
  onRemoveSticker,
  onFocus,
  showStickerBadge = true
}: Props) {
  const flip = which === 'left';
  const ref = useRef<HTMLDivElement>(null);
  const [dragStickerId, setDragStickerId] = useState<string | null>(null);

  const toLocalPoint = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return { x: 50, y: 50 };
      const rect = el.getBoundingClientRect();
      let x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      if (flip) x = 100 - x;
      return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
    },
    [flip]
  );

  function onStageClick(e: React.MouseEvent) {
    if (dragStickerId) return;
    onFocus();
    const pt = snapToPanel(base.id, toLocalPoint(e.clientX, e.clientY));
    onMoveWord(pt.x, pt.y);
  }

  function onStickerPointerDown(id: string, e: React.PointerEvent) {
    e.stopPropagation();
    onFocus();
    setDragStickerId(id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onStickerPointerMove(e: React.PointerEvent) {
    if (!dragStickerId) return;
    const pt = snapToPanel(base.id, toLocalPoint(e.clientX, e.clientY));
    onMoveSticker(dragStickerId, pt.x, pt.y);
  }
  function onStickerPointerUp() {
    setDragStickerId(null);
  }

  const wordOutside = side.word && !isInsidePolygon({ x: side.x, y: side.y }, panelForBase(base.id));
  const showGuide = active || wordOutside;

  const wordColour = colourValue(side.colour);
  const outlineColour = side.outline === 'none' ? 'transparent' : colourValue(side.outline);
  const stickerGlyph = glyphFor(wordColour);

  const atMaxStickers = side.stickers.length >= MAX_STICKERS;

  return (
    <div className={`${styles.stageOuter} ${which === 'right' ? styles.stageOuterRight : ''}`}>
      {showStickerBadge && (
        <div className={styles.badgeRow}>
          <button
            type="button"
            className={styles.stickerBadge}
            onClick={onAddSticker}
            disabled={atMaxStickers}
            aria-label="Add a BUBBLEHOPS sticker"
          >
            <BubbleMark size={64} ring={outlineColour} fill={wordColour} glyph={stickerGlyph} />
          </button>
          <div className={styles.badgeLabel}>
            <strong>BUBBLEHOPS STICKER · {side.stickers.length}/{MAX_STICKERS}</strong>
            <span>Drag to move · Double-click to remove</span>
          </div>
        </div>
      )}

      <div className={styles.shoeWrap}>
        <div
          ref={ref}
          className={`${styles.shoe} ${flip ? styles.flip : ''}`}
          style={{ aspectRatio: String(base.ar), containerType: 'inline-size' } as React.CSSProperties}
          onPointerMove={onStickerPointerMove}
          onPointerUp={onStickerPointerUp}
        >
          <img src={base.img} alt="" className={styles.photo} draggable={false} />

          {showGuide && (
            <svg className={styles.outlineSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d={panelPathD(base.id)} className={styles.outlinePath} />
            </svg>
          )}

          <div className={styles.paintLayer} style={{ clipPath: SOLE_ABOVE_CLIP[base.panel] }}>
            {!side.blank && side.word && (
              <div
                className={`${styles.word} ${styles.wordGraffiti}`}
                style={{
                  left: `${side.x}%`,
                  top: `${side.y}%`,
                  color: wordColour,
                  WebkitTextStroke: side.outline === 'none' ? undefined : `3px ${outlineColour}`,
                  paintOrder: 'stroke fill',
                  transform: `translate(-50%, -50%) ${flip ? 'scaleX(-1) ' : ''}rotate(${side.rot}deg) scale(${side.size})`
                } as React.CSSProperties}
              >
                {side.word}
              </div>
            )}

            {side.stickers.map((s) => (
              <div
                key={s.id}
                className={styles.sticker}
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  transform: `translate(-50%, -50%) ${flip ? 'scaleX(-1) ' : ''}scale(${s.scale})`
                }}
                onPointerDown={(e) => onStickerPointerDown(s.id, e)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onRemoveSticker?.(s.id);
                }}
              >
                <BubbleMark size={30} ring={outlineColour} fill={wordColour} glyph={stickerGlyph} />
              </div>
            ))}
          </div>

          <div className={styles.hit} onClick={onStageClick} aria-hidden="true" />
        </div>

        {base.placeholderPhoto && <span className={styles.placeholderPhoto}>Placeholder photo</span>}
        {showGuide && <span className={styles.guideCaption}>Keep your text on the shoe</span>}
      </div>
    </div>
  );
}
