type Props = {
  size?: number;
  ring?: string;
  fill?: string;
  pupil?: boolean;
  className?: string;
};

/**
 * The BUBBLEHOPS "bubble" mark: a googly-eye circle (white fill, lime ring,
 * off-centre black pupil) paired with a plain pupil-less bubble. Reused as
 * the logo, a placeable designer sticker (colour-matched to lettering) and
 * the account icon's motif.
 */
export default function BubbleMark({ size = 40, ring = 'var(--lime)', fill = '#fff', pupil = true, className }: Props) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="18" style={{ fill, stroke: 'var(--ink)' }} strokeWidth="4" />
      <circle cx="20" cy="20" r="18" style={{ fill: 'none', stroke: ring }} strokeWidth="3" />
      {pupil && <circle cx="15" cy="15" r="5.5" style={{ fill: 'var(--ink)' }} />}
    </svg>
  );
}
