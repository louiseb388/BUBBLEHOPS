type Props = {
  size?: number;
  ring?: string;
  fill?: string;
  className?: string;
};

/**
 * The BUBBLEHOPS "bubble" mark: nested circles (lime ring -> black keyline ->
 * white/teal fill -> a gloss arc). Reused as the logo, a placeable designer
 * sticker (colour-matched to lettering) and the account icon's motif.
 */
export default function BubbleMark({ size = 40, ring = 'var(--lime)', fill = '#fff', className }: Props) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="19" style={{ fill: ring, stroke: 'var(--ink)' }} strokeWidth="2" />
      <circle cx="20" cy="20" r="14" style={{ fill: 'var(--ink)' }} />
      <circle cx="20" cy="20" r="12" style={{ fill, stroke: 'var(--teal)' }} strokeWidth="1.5" />
      <path d="M12 14a10 10 0 0 1 12-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85" />
    </svg>
  );
}
