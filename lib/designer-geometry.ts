import { PANELS, getBase } from './data';

export type Pt = { x: number; y: number };

const polygonCache = new Map<string, Pt[]>();

/** PANELS paths are `M x,y L x,y L x,y ... Z` in a 0-100 percentage space. */
function parsePanelPath(d: string): Pt[] {
  const cached = polygonCache.get(d);
  if (cached) return cached;
  const pts: Pt[] = [];
  const re = /([ML])\s*([\d.]+),([\d.]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(d))) {
    pts.push({ x: parseFloat(m[2]), y: parseFloat(m[3]) });
  }
  polygonCache.set(d, pts);
  return pts;
}

export function panelPolygon(panelKey: string): Pt[] {
  return parsePanelPath(PANELS[panelKey] || PANELS.base01);
}

export function panelForBase(baseId: string): Pt[] {
  const base = getBase(baseId);
  return panelPolygon(base?.panel || 'base01');
}

/** Standard ray-casting point-in-polygon test. */
export function isInsidePolygon(pt: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect = yi > pt.y !== yj > pt.y && pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function distToSegment(pt: Pt, a: Pt, b: Pt): { d: number; pt: Pt } {
  const abx = b.x - a.x, aby = b.y - a.y;
  const len2 = abx * abx + aby * aby;
  let t = len2 === 0 ? 0 : ((pt.x - a.x) * abx + (pt.y - a.y) * aby) / len2;
  t = Math.max(0, Math.min(1, t));
  const proj = { x: a.x + abx * t, y: a.y + aby * t };
  const d = Math.hypot(pt.x - proj.x, pt.y - proj.y);
  return { d, pt: proj };
}

/** Nearest point on the polygon boundary to `pt`. */
function nearestBoundaryPoint(pt: Pt, poly: Pt[]): Pt {
  let best = { d: Infinity, pt: poly[0] };
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const r = distToSegment(pt, poly[j], poly[i]);
    if (r.d < best.d) best = r;
  }
  return best.pt;
}

/**
 * Snaps a click/drag point (0-100 space) to the nearest valid point inside
 * the base's paintable side-panel silhouette. If already inside, returns it
 * unchanged; otherwise returns the nearest point on the panel boundary,
 * nudged slightly inward so the word doesn't sit exactly on the outline.
 */
export function snapToPanel(baseId: string, pt: Pt): Pt {
  const poly = panelForBase(baseId);
  if (poly.length < 3) return pt;
  if (isInsidePolygon(pt, poly)) return pt;
  const boundary = nearestBoundaryPoint(pt, poly);
  const cx = poly.reduce((s, p) => s + p.x, 0) / poly.length;
  const cy = poly.reduce((s, p) => s + p.y, 0) / poly.length;
  const dx = cx - boundary.x, dy = cy - boundary.y;
  const len = Math.hypot(dx, dy) || 1;
  const nudge = 3; // percentage points, inward
  return { x: boundary.x + (dx / len) * nudge, y: boundary.y + (dy / len) * nudge };
}

/** SVG path `d` for the panel outline, for drawing the lime "keep your text on the shoe" guide. */
export function panelPathD(baseId: string): string {
  const base = getBase(baseId);
  return PANELS[base?.panel || 'base01'] || PANELS.base01;
}
