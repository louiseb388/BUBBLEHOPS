'use client';

import { WORD_COLOURS } from '@/lib/data';
import type { Side } from '@/lib/designer-types';
import styles from './ShoeControls.module.css';

type Props = {
  label: string;
  side: Side;
  onChange: (patch: Partial<Side>) => void;
  onBeginChange: () => void;
};

export default function ShoeControls({ label, side, onChange, onBeginChange }: Props) {
  function discrete(patch: Partial<Side>) {
    onBeginChange();
    onChange(patch);
  }

  return (
    <div className={styles.panel}>
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
            <span className={styles.label}>Word colour</span>
            <div className={styles.swatches}>
              {WORD_COLOURS.map((c) => (
                <button
                  key={c.id}
                  className={`${styles.swatch} ${side.colour === c.id ? styles.active : ''}`}
                  style={{ background: c.value }}
                  aria-label={c.label}
                  title={c.label}
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
                title="No outline"
                onClick={() => discrete({ outline: 'none' })}
              />
              {WORD_COLOURS.map((c) => (
                <button
                  key={c.id}
                  className={`${styles.swatch} ${side.outline === c.id ? styles.active : ''}`}
                  style={{ background: c.value }}
                  aria-label={c.label}
                  title={c.label}
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
              min={1.2}
              max={2.56}
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
        </>
      )}
    </div>
  );
}
