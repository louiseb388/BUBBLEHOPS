type Props = {
  size?: number;
  ring?: string;
  fill?: string;
  glyph?: string;
  mark?: boolean;
  className?: string;
};

/**
 * The BUBBLEHOPS "bubble" mark: a ringed circle with a two-eye glyph, paired
 * with a plain black-ringed companion bubble (mark=false). Reused as the
 * logo (white ring/fill), a placeable designer sticker (colour-matched to
 * the selected word/outline colours) and the account icon's motif.
 */
export default function BubbleMark({ size = 40, ring = 'var(--lime)', fill = '#fff', glyph = 'var(--ink)', mark = true, className }: Props) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" className={className} aria-hidden="true">
      {mark ? (
        <>
          <circle cx="50" cy="50" r="44" style={{ fill: ring }} />
          <circle cx="50" cy="50" r="39" style={{ fill: 'var(--ink)' }} />
          <circle cx="50" cy="50" r="34" style={{ fill }} />
          <path d="M 34,38 A 9,9 0 0 1 52,34 Z" style={{ fill: glyph }} transform="rotate(-25 43 36)" />
          <path d="M 49,52 A 11,11 0 0 1 71,48 Z" style={{ fill: glyph }} transform="rotate(15 60 50)" />
        </>
      ) : (
        <>
          <circle cx="50" cy="50" r="44" style={{ fill: 'var(--ink)' }} />
          <circle cx="50" cy="50" r="29" style={{ fill }} />
        </>
      )}
    </svg>
  );
}
