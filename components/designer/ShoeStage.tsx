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

type Props = {
  base: BaseTrainer;
  side: Side;
  which: 'left' | 'right';
  active: boolean;
  onMoveWord: (x: number, y: number) => void;
  onMoveSticker: (id: string, x: number, y: number) => void;
  onFocus: () => void;
};

export default function ShoeStage({ base, side, which, active, onMoveWord, onMoveSticker, onFocus }: Props) {
  const flip = which === 'right';
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

  return (
    <div
      ref={ref}
      className={`${styles.shoe} ${flip ? styles.flip : ''}`}
      style={{ aspectRatio: String(base.ar), containerType: 'inline-size' } as React.CSSProperties}
      onPointerMove={onStickerPointerMove}
      onPointerUp={onStickerPointerUp}
    >
      <img src={base.img} alt="" className={styles.photo} draggable={false} />

      {base.placeholderPhoto && <span className={styles.placeholderPhoto}>Placeholder photo</span>}

      {showGuide && (
        <svg className={styles.outlineSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d={panelPathD(base.id)} className={styles.outlinePath} />
        </svg>
      )}

      <div className={styles.paintLayer} style={{ clipPath: SOLE_ABOVE_CLIP[base.panel] }}>
        {!side.blank && side.word && (
          <div
            className={`${styles.word} ${side.font === 'graffiti' ? styles.wordGraffiti : styles.wordRegular}`}
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
              transform: `translate(-50%, -50%) scale(${s.scale})`
            }}
            onPointerDown={(e) => onStickerPointerDown(s.id, e)}
          >
            <BubbleMark size={30} ring={wordColour} />
          </div>
        ))}
      </div>

      <div className={styles.hit} onClick={onStageClick} aria-hidden="true" />

      {showGuide && <span className={styles.guideCaption}>Keep your text on the shoe</span>}
    </div>
  );
}
