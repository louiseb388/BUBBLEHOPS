import { WORD_COLOURS } from './data';

export type Sticker = { id: string; x: number; y: number; scale: number; rot?: number };

export type Side = {
  blank: boolean;
  word: string;
  colour: string; // WORD_COLOURS id
  outline: string; // WORD_COLOURS id, or 'none'
  font: 'graffiti' | 'regular';
  size: number; // 0.6 - 1.6
  rot: number; // -180 - 180
  x: number; // 0-100, % across the traced panel bounding box
  y: number; // 0-100
  stickers: Sticker[];
};

export type DesignState = {
  baseId: string;
  left: Side;
  right: Side;
};

export const DEFAULT_SIDE: Side = {
  blank: false,
  word: '',
  colour: 'teal',
  outline: 'lime',
  font: 'graffiti',
  size: 1.2,
  rot: 0,
  x: 50,
  y: 50,
  stickers: []
};

export function defaultDesign(baseId: string): DesignState {
  return {
    baseId,
    left: { ...DEFAULT_SIDE, stickers: [] },
    right: { ...DEFAULT_SIDE, stickers: [] }
  };
}

/** Flat price for a full pair (both shoes painted) — not derived from basePrice*2, since it's
 * priced as its own bundle rather than two single shoes. */
const PAIR_PRICE = 99;

/** Price for a design given per-shoe blank state and the base's starting (single-shoe) price.
 * Takes just the blank flags (a DesignState satisfies this too) so server-side pricing —
 * e.g. app/api/checkout/route.ts, recomputing price rather than trusting the client's — can
 * call it without needing a full fake DesignState for fields it never reads. */
export function priceForDesign(basePrice: number, design: { left: { blank: boolean }; right: { blank: boolean } }): number {
  const leftPainted = !design.left.blank;
  const rightPainted = !design.right.blank;
  const paintedCount = (leftPainted ? 1 : 0) + (rightPainted ? 1 : 0);
  if (paintedCount === 2) return PAIR_PRICE;
  return basePrice; // 0 or 1 painted — base pair, or a single painted shoe
}

function colourLabel(id: string): string {
  return WORD_COLOURS.find((c) => c.id === id)?.label || id;
}

/** Which side(s) are painted, e.g. "Both shoes" / "Left shoe only" / "Base only". */
export function paintingLabel(design: DesignState): string {
  const l = !design.left.blank;
  const r = !design.right.blank;
  if (l && r) return 'Both shoes';
  if (l) return 'Left shoe only';
  if (r) return 'Right shoe only';
  return 'Base only';
}

function sideSummary(side: Side): string | null {
  if (side.blank || !side.word) return null;
  const outline = side.outline === 'none' ? 'no outline' : `outlined in ${colourLabel(side.outline).toLowerCase()}`;
  return `${side.word.toUpperCase()} in graffiti letters, ${colourLabel(side.colour).toLowerCase()} ${outline}`;
}

/** One-line design description for order summaries, e.g. "Both shoes: ARLO in graffiti letters, teal outlined in lime." */
export function summarizeDesign(design: DesignState): string {
  const l = sideSummary(design.left);
  const r = sideSummary(design.right);
  if (!l && !r) return 'Left and right left blank.';
  if (l && l === r) return `Both shoes: ${l}.`;
  if (l && r) return `Left: ${l}. Right: ${r}.`;
  if (l) return `Left: ${l}. Right: blank.`;
  return `Right: ${r}. Left: blank.`;
}

/** Per-shoe description lines for order summaries, e.g. "Left shoe: ARLO in graffiti letters, teal outlined in lime." */
export function sideDescriptions(design: DesignState): { left: string; right: string } {
  const l = sideSummary(design.left);
  const r = sideSummary(design.right);
  return {
    left: l ? `Left shoe: ${l}.` : 'Left shoe: blank.',
    right: r ? `Right shoe: ${r}.` : 'Right shoe: blank.'
  };
}

export function encodeDesign(design: DesignState): string {
  if (typeof window === 'undefined') return '';
  return window.btoa(encodeURIComponent(JSON.stringify(design)));
}

export function decodeDesign(encoded: string): DesignState | null {
  try {
    return JSON.parse(decodeURIComponent(window.atob(encoded)));
  } catch {
    return null;
  }
}
