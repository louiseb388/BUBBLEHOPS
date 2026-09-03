type Props = {
  size?: number;
  ring?: string;
  fill?: string;
  glyph?: string;
  mark?: boolean;
  /** Extra ring drawn outside the main ring — used to highlight the mark next to the wordmark. */
  outerRing?: string;
  className?: string;
};

/**
 * The BUBBLEHOPS "bubble" mark: a ringed circle with a two-eye glyph, paired
 * with a plain black-ringed companion bubble (mark=false). Reused as the
 * logo (white ring/fill), a placeable designer sticker (colour-matched to
 * the selected word/outline colours) and the account icon's motif.
 */
export default function BubbleMark({ size = 40, ring = 'var(--lime)', fill = '#fff', glyph = 'var(--ink)', mark = true, outerRing, className }: Props) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" className={className} aria-hidden="true">
      {mark ? (
        <>
          {outerRing && <circle cx="50" cy="50" r="48" style={{ fill: outerRing }} />}
          <circle cx="50" cy="50" r="44" style={{ fill: ring }} />
          <circle cx="50" cy="50" r="39" style={{ fill: 'var(--ink)' }} />
          <circle cx="50" cy="50" r="34" style={{ fill }} />
          <path d="M 33,38 A 8,8 0 0 1 49,34 Z" style={{ fill: glyph }} transform="rotate(-30 41 36)" />
          <path d="M 46,50 A 10.5,10.5 0 0 1 67,45 Z" style={{ fill: glyph }} transform="rotate(12 56 47)" />
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
