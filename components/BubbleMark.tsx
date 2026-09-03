type Props = {
  size?: number;
  ring?: string;
  fill?: string;
  pupil?: boolean;
  className?: string;
};

/**
 * The BUBBLEHOPS "bubble" mark: a googly-eye circle (white fill, thin black
 * keyline, lime ring) paired with a plain pupil-less bubble. Reused as the
 * logo, a placeable designer sticker (colour-matched to lettering) and the
 * account icon's motif.
 */
export default function BubbleMark({ size = 40, ring = 'var(--lime)', fill = '#fff', pupil = true, className }: Props) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="18" style={{ fill: ring }} />
      <circle cx="20" cy="20" r="14.5" style={{ fill, stroke: 'var(--ink)' }} strokeWidth="2.5" />
      {pupil && <circle cx="15" cy="15" r="6" style={{ fill: 'var(--ink)' }} />}
    </svg>
  );
}
