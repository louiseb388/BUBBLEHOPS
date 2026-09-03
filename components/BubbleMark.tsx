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
 * logo (lime ring/white fill), a placeable designer sticker (colour-matched
 * to the selected word/outline colours) and the account icon's motif.
 */
export default function BubbleMark({ size = 40, ring = 'var(--lime)', fill = '#fff', glyph = 'var(--ink)', mark = true, className }: Props) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="-8 -8 174.62 174.29" className={className} aria-hidden="true">
      {mark ? (
        <>
          <path
            style={{ fill }}
            d="M121.68,32.41c10.57,10,17.38,24.01,19.2,39.46,3.3,28.17-10.79,61.78-49.53,68.99-4.84.9-9.55,1.35-14.1,1.35-18.7,0-34.67-7.53-45.89-21.9-15.16-19.42-18.41-47.6-8.09-70.13,9.39-20.51,28.03-32.46,52.48-33.67,18.11-.89,34,4.6,45.94,15.9Z"
          />
          <path
            style={{ fill: 'none', stroke: 'var(--ink)', strokeWidth: 9 }}
            d="M121.68,32.41c10.57,10,17.38,24.01,19.2,39.46,3.3,28.17-10.79,61.78-49.53,68.99-4.84.9-9.55,1.35-14.1,1.35-18.7,0-34.67-7.53-45.89-21.9-15.16-19.42-18.41-47.6-8.09-70.13,9.39-20.51,28.03-32.46,52.48-33.67,18.11-.89,34,4.6,45.94,15.9Z"
          />
          <path
            fillRule="evenodd"
            style={{ fill: ring }}
            d="M9.79,40.95c-12.93,24.38-13.06,53-.37,76.56,18.65,34.62,53.34,43.44,79.6,40.15,26.16-3.28,57.51-20.35,67.03-58.45,6.49-25.97.56-52-16.26-71.43C122.3,7.59,96.31-2.36,68.49.48,43.47,3.03,22.08,17.78,9.79,40.95ZM121.68,32.41c10.57,10,17.38,24.01,19.2,39.46,3.3,28.17-10.79,61.78-49.53,68.99-4.84.9-9.55,1.35-14.1,1.35-18.7,0-34.67-7.53-45.89-21.9-15.16-19.42-18.41-47.6-8.09-70.13,9.39-20.51,28.03-32.46,52.48-33.67,18.11-.89,34,4.6,45.94,15.9Z"
          />
          <path style={{ fill: glyph }} d="M65.74,80.36l-21.12-13.37c14.48-26.6,31.74-8.92,21.12,13.37Z" />
          <path style={{ fill: glyph }} d="M83.22,88.65l25.86,6.95c1.45-.64,9.09-16.7,2.02-26.64-11.19-12.71-25.71,9.24-27.88,19.69Z" />
        </>
      ) : (
        <>
          <circle cx="79.31" cy="79.15" r="70" style={{ fill: 'var(--ink)' }} />
          <circle cx="79.31" cy="79.15" r="46" style={{ fill }} />
        </>
      )}
    </svg>
  );
}
