type Props = {
  size?: number;
  ring?: string;
  fill?: string;
  mark?: boolean;
  className?: string;
};

/**
 * The BUBBLEHOPS "bubble" mark: a lime-ringed circle with an abstract face
 * glyph (two pill "eyes" and a curved smile) paired with a plain black-ringed
 * companion bubble (mark=false). Reused as the logo, a placeable designer
 * sticker (colour-matched to lettering) and the account icon's motif.
 */
export default function BubbleMark({ size = 40, ring = 'var(--lime)', fill = '#fff', mark = true, className }: Props) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" className={className} aria-hidden="true">
      {mark ? (
        <>
          <circle cx="50" cy="50" r="44" style={{ fill: ring }} />
          <circle cx="50" cy="50" r="37" style={{ fill: 'var(--ink)' }} />
          <circle cx="50" cy="50" r="30" style={{ fill }} />
          <rect x="39" y="26" width="11" height="21" rx="5.5" style={{ fill: 'var(--ink)' }} transform="rotate(-25 44.5 36.5)" />
          <rect x="54" y="38" width="11" height="21" rx="5.5" style={{ fill: 'var(--ink)' }} transform="rotate(20 59.5 48.5)" />
          <path d="M34,57 Q43,72 61,67" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" fill="none" />
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
