'use client';

import { useState } from 'react';
import { WORD_COLOURS } from '@/lib/data';
import type { Side } from '@/lib/designer-types';
import styles from './ShoeControls.module.css';

type Props = {
  label: string;
  side: Side;
  onChange: (patch: Partial<Side>) => void;
  onBeginChange: () => void;
  onResetSpot: () => void;
  onCopyToOther: () => void;
};

export default function ShoeControls({ label, side, onChange, onBeginChange, onResetSpot, onCopyToOther }: Props) {
  const [confirmReset, setConfirmReset] = useState(false);

  function discrete(patch: Partial<Side>) {
    onBeginChange();
    onChange(patch);
  }

  return (
    <div className={styles.panel}>
      <h3 style={{ margin: '0 0 16px', fontWeight: 800, fontSize: 14, textTransform: 'uppercase' }}>{label} shoe</h3>

      <div className={styles.row}>
        <div className={styles.toggleRow}>
          <label className={styles.label} style={{ margin: 0 }}>Leave blank</label>
          <input
            type="checkbox"
            checked={side.blank}
            onChange={(e) => discrete({ blank: e.target.checked })}
          />
        </div>
      </div>

      {!side.blank && (
        <>
          <div className={styles.row}>
            <label className={styles.label} htmlFor={`${label}-word`}>Word</label>
            <input
              id={`${label}-word`}
              className={styles.input}
              placeholder="Type a name or word"
              maxLength={12}
              value={side.word}
              onChange={(e) => discrete({ word: e.target.value })}
            />
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Lettering style</span>
            <div className={styles.fontRow}>
              <button
                className={`${styles.fontBtn} ${side.font === 'graffiti' ? styles.active : ''}`}
                onClick={() => discrete({ font: 'graffiti' })}
                style={{ fontFamily: 'Gloze' }}
              >
                Graffiti
              </button>
              <button
                className={`${styles.fontBtn} ${side.font === 'regular' ? styles.active : ''}`}
                onClick={() => discrete({ font: 'regular' })}
              >
                Regular
              </button>
            </div>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Word colour</span>
            <div className={styles.swatches}>
              {WORD_COLOURS.map((c) => (
                <button
                  key={c.id}
                  className={`${styles.swatch} ${side.colour === c.id ? styles.active : ''}`}
                  style={{ background: c.value }}
                  aria-label={c.label}
                  onClick={() => discrete({ colour: c.id })}
                />
              ))}
            </div>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Outline colour</span>
            <div className={styles.swatches}>
              <button
                className={styles.swatchNone}
                aria-label="No outline"
                onClick={() => discrete({ outline: 'none' })}
              />
              {WORD_COLOURS.map((c) => (
                <button
                  key={c.id}
                  className={`${styles.swatch} ${side.outline === c.id ? styles.active : ''}`}
                  style={{ background: c.value }}
                  aria-label={c.label}
                  onClick={() => discrete({ outline: c.id })}
                />
              ))}
            </div>
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor={`${label}-size`}>Size</label>
            <input
              id={`${label}-size`}
              className={styles.slider}
              type="range"
              min={0.6}
              max={1.6}
              step={0.02}
              value={side.size}
              onPointerDown={onBeginChange}
              onChange={(e) => onChange({ size: parseFloat(e.target.value) })}
            />
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor={`${label}-rot`}>Rotation</label>
            <input
              id={`${label}-rot`}
              className={styles.slider}
              type="range"
              min={-180}
              max={180}
              step={1}
              value={side.rot}
              onPointerDown={onBeginChange}
              onChange={(e) => onChange({ rot: parseInt(e.target.value, 10) })}
            />
          </div>

          <div className={styles.miniActions}>
            <button className="btn btn-outline btn-sm" onClick={() => discrete({ stickers: [...side.stickers, { id: `st_${Date.now()}`, x: 50, y: 50, scale: 1 }] })}>
              + Bubble sticker
            </button>
            <button className="btn btn-outline btn-sm" onClick={onResetSpot}>Reset spot</button>
            <button className="btn btn-outline btn-sm" onClick={onCopyToOther}>Copy to other shoe</button>
          </div>
        </>
      )}

      {!confirmReset ? (
        <button className="btn btn-outline btn-sm" style={{ marginTop: 20 }} onClick={() => setConfirmReset(true)}>
          Reset this shoe
        </button>
      ) : (
        <div style={{ marginTop: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Reset {label.toLowerCase()} shoe?</span>
          <button
            className="btn btn-lime btn-sm"
            onClick={() => {
              discrete({ word: '', blank: false, colour: 'ink', outline: 'white', font: 'graffiti', size: 1, rot: 0, x: 50, y: 50, stickers: [] });
              setConfirmReset(false);
            }}
          >
            Yes, reset
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => setConfirmReset(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
