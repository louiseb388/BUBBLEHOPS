'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import type { BaseTrainer } from '@/lib/data';
import { SOLE_ABOVE_CLIP, WORD_COLOURS } from '@/lib/data';
import type { Side } from '@/lib/designer-types';
import { isInsidePolygon, panelForBase, panelPathD, snapToPanel } from '@/lib/designer-geometry';
import BubbleMark from '../BubbleMark';
import styles from './ShoeStage.module.css';

function colourValue(id: string) {
  return WORD_COLOURS.find((c) => c.id === id)?.value || id;
}

// One modest gloss blob clipped to the letter glyphs, tiled across the word so every
// letter or two picks up a single highlight regardless of what was typed —
// approximates the hand-painted bubble-letter shine without dominating the fill.
const WORD_HIGHLIGHT_GRADIENT = [
  'radial-gradient(ellipse 26% 16% at 27% 26%, #fff 0%, #fff 82%, rgba(255,255,255,0) 86%)',
  'radial-gradient(ellipse 12% 9% at 72% 66%, #fff 0%, #fff 78%, rgba(255,255,255,0) 82%)'
].join(', ');

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
  /** Read-only thumbnail (basket/checkout order summary): skips the interactive
   * designer's legibility floor on word/outline size, so word and stickers stay
   * proportional to the shoe at any thumbnail size instead of looking oversized. */
  preview?: boolean;
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
  showStickerBadge = true,
  preview = false
}: Props) {
  const flip = which === 'left';
  const ref = useRef<HTMLDivElement>(null);
  const [dragStickerId, setDragStickerId] = useState<string | null>(null);
  const [shoeWidth, setShoeWidth] = useState(420);

  // Tracked in JS rather than via CSS container queries: `container-type` establishes
  // a blend-isolation boundary in Chromium, which cuts the word's mix-blend-mode off
  // from the shoe photo behind it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setShoeWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  const wordColour = colourValue(side.colour);
  const outlineColour = side.outline === 'none' ? 'transparent' : colourValue(side.outline);
  const stickerGlyph = glyphFor(wordColour);

  const atMaxStickers = side.stickers.length >= MAX_STICKERS;

  const wordFontSize = preview ? shoeWidth * 0.06 : Math.min(128, Math.max(28, shoeWidth * 0.06));
  const strokeThick = preview ? shoeWidth * 0.0154 : Math.min(9.8, Math.max(2.8, shoeWidth * 0.0154));
  const strokeThin = preview ? shoeWidth * 0.0075 : Math.min(4.5, Math.max(1.5, shoeWidth * 0.0075));
  const stickerSize = Math.max(20, shoeWidth * 0.122);

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
            <BubbleMark size={44} ring={outlineColour} fill={wordColour} glyph={stickerGlyph} keylineWidth={13.5} />
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
          style={{ aspectRatio: String(base.ar), opacity: side.blank ? 0.5 : 1 } as React.CSSProperties}
          onPointerMove={onStickerPointerMove}
          onPointerUp={onStickerPointerUp}
        >
          <img src={base.img} alt="" className={styles.photo} draggable={false} />

          {wordOutside && (
            <svg className={styles.outlineSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d={panelPathD(base.id)} className={styles.outlinePath} />
            </svg>
          )}

          <div className={styles.paintLayer} style={{ clipPath: SOLE_ABOVE_CLIP[base.panel] }}>
            {!side.blank && side.word && (
              <div
                className={styles.wordWrap}
                style={{
                  left: `${side.x}%`,
                  top: `${side.y}%`,
                  transform: `translate(-50%, -50%) ${flip ? 'scaleX(-1) ' : ''}rotate(${side.rot}deg) scale(${side.size})`
                }}
              >
                <span
                  className={`${styles.word} ${styles.wordGraffiti}`}
                  style={{
                    fontSize: wordFontSize,
                    color: wordColour
                  } as React.CSSProperties}
                >
                  {side.word}
                </span>
                <span
                  className={`${styles.word} ${styles.wordGraffiti} ${styles.wordHighlightLayer}`}
                  style={{
                    fontSize: wordFontSize,
                    backgroundImage: WORD_HIGHLIGHT_GRADIENT,
                    backgroundSize: `${wordFontSize * 0.95}px 100%`
                  } as React.CSSProperties}
                  aria-hidden="true"
                >
                  {side.word}
                </span>
                {side.outline !== 'none' && (
                  <span
                    className={`${styles.word} ${styles.wordGraffiti} ${styles.wordOutlineLayer}`}
                    style={{
                      fontSize: wordFontSize,
                      color: 'transparent',
                      WebkitTextStroke: `${strokeThick}px ${outlineColour}`,
                      paintOrder: 'stroke fill'
                    } as React.CSSProperties}
                    aria-hidden="true"
                  >
                    {side.word}
                  </span>
                )}
                <span
                  className={`${styles.word} ${styles.wordGraffiti} ${styles.wordOutlineLayer}`}
                  style={{
                    fontSize: wordFontSize,
                    color: 'transparent',
                    WebkitTextStroke: `${strokeThin}px var(--ink)`,
                    paintOrder: 'stroke fill'
                  } as React.CSSProperties}
                  aria-hidden="true"
                >
                  {side.word}
                </span>
              </div>
            )}

            {side.stickers.map((s) => (
              <div
                key={s.id}
                className={styles.sticker}
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  transform: `translate(-50%, -50%) ${flip ? 'scaleX(-1) ' : ''}rotate(${s.rot || 0}deg) scale(${s.scale})`
                }}
                onPointerDown={(e) => onStickerPointerDown(s.id, e)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onRemoveSticker?.(s.id);
                }}
              >
                <BubbleMark size={stickerSize} ring={outlineColour} fill={wordColour} glyph={stickerGlyph} keylineWidth={13.5} />
              </div>
            ))}
          </div>

          <div className={styles.hit} onClick={onStageClick} aria-hidden="true" />
        </div>

        {base.placeholderPhoto && <span className={styles.placeholderPhoto}>Placeholder photo</span>}
        {wordOutside && <span className={styles.guideCaption}>Keep your text on the shoe</span>}
      </div>
    </div>
  );
}
