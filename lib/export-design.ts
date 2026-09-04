'use client';

// Renders a design to a JPEG blob for sharing/downloading — a from-scratch Canvas 2D
// reimplementation of ShoeStage's word/sticker rendering (gradient fills, multi-layer
// text stroke, the gloss highlight tile), rather than a DOM screenshot: DOM-to-canvas
// libraries (tested with html2canvas) don't support -webkit-text-stroke or
// background-clip:text, both load-bearing for the bubble-letter look, and render this
// component's word as a broken/flat mess. Canvas natively supports gradient text fill
// and stroked text, so this stays pixel-faithful instead.

import type { BaseTrainer } from './data';
import { METALLIC_GRADIENT_STOPS, METALLIC_STROKE_TONES, METALLIC_SWATCH_GRADIENT, WORD_COLOURS } from './data';
import type { DesignState, Side, Sticker } from './designer-types';

const INK = '#201e1d';

const BUBBLE_VIEWBOX = { x: -8, y: -8, w: 174.62, h: 174.29 };
const BUBBLE_FILL_D =
  'M121.68,32.41c10.57,10,17.38,24.01,19.2,39.46,3.3,28.17-10.79,61.78-49.53,68.99-4.84.9-9.55,1.35-14.1,1.35-18.7,0-34.67-7.53-45.89-21.9-15.16-19.42-18.41-47.6-8.09-70.13,9.39-20.51,28.03-32.46,52.48-33.67,18.11-.89,34,4.6,45.94,15.9Z';
const BUBBLE_RING_D =
  'M9.79,40.95c-12.93,24.38-13.06,53-.37,76.56,18.65,34.62,53.34,43.44,79.6,40.15,26.16-3.28,57.51-20.35,67.03-58.45,6.49-25.97.56-52-16.26-71.43C122.3,7.59,96.31-2.36,68.49.48,43.47,3.03,22.08,17.78,9.79,40.95ZM121.68,32.41c10.57,10,17.38,24.01,19.2,39.46,3.3,28.17-10.79,61.78-49.53,68.99-4.84.9-9.55,1.35-14.1,1.35-18.7,0-34.67-7.53-45.89-21.9-15.16-19.42-18.41-47.6-8.09-70.13,9.39-20.51,28.03-32.46,52.48-33.67,18.11-.89,34,4.6,45.94,15.9Z';
const BUBBLE_EYE1_D = 'M65.74,80.36l-21.12-13.37c14.48-26.6,31.74-8.92,21.12,13.37Z';
const BUBBLE_EYE2_D = 'M83.22,88.65l25.86,6.95c1.45-.64,9.09-16.7,2.02-26.64-11.19-12.71-25.71,9.24-27.88,19.69Z';

function colourValue(id: string) {
  return WORD_COLOURS.find((c) => c.id === id)?.value || id;
}

function glyphFor(hex: string) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return '#fff';
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? INK : '#fff';
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

/** Same-direction equivalent of CSS `linear-gradient(135deg, ...)` for a box at (x,y,w,h). */
function angledLinearGradient(
  ctx: CanvasRenderingContext2D,
  stops: { offset: string; color: string }[] | undefined,
  x: number,
  y: number,
  w: number,
  h: number,
  angleDeg = 135
): CanvasGradient | null {
  if (!stops) return null;
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const lineLength = Math.abs(w * dx) + Math.abs(h * dy);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const x0 = cx - (dx * lineLength) / 2;
  const y0 = cy - (dy * lineLength) / 2;
  const x1 = cx + (dx * lineLength) / 2;
  const y1 = cy + (dy * lineLength) / 2;
  const grad = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const s of stops) grad.addColorStop(Math.min(1, Math.max(0, parseFloat(s.offset) / 100)), s.color);
  return grad;
}

/** Repeating tile matching WORD_HIGHLIGHT_GRADIENT's two round gloss blobs, used as a
 * text fillStyle so it clips to the glyphs exactly like CSS background-clip:text does. */
function makeHighlightPattern(ctx: CanvasRenderingContext2D, fontSize: number): CanvasPattern | null {
  const tileW = Math.max(1, fontSize * 0.95);
  const tileH = Math.max(1, fontSize);
  const tileDpr = 2;
  const tile = document.createElement('canvas');
  tile.width = Math.ceil(tileW * tileDpr);
  tile.height = Math.ceil(tileH * tileDpr);
  const tctx = tile.getContext('2d');
  if (!tctx) return null;
  tctx.scale(tileDpr, tileDpr);

  const blobs: { cx: number; cy: number; r: number; inner: number; outer: number }[] = [
    { cx: tileW * 0.27, cy: tileH * 0.26, r: 0.2, inner: 0.82, outer: 0.86 },
    { cx: tileW * 0.72, cy: tileH * 0.66, r: 0.1, inner: 0.78, outer: 0.82 }
  ];
  for (const b of blobs) {
    tctx.save();
    tctx.translate(b.cx, b.cy);
    tctx.scale(tileW * b.r, tileH * b.r);
    const g = tctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    g.addColorStop(0, '#f0f0f0');
    g.addColorStop(b.inner, '#f0f0f0');
    g.addColorStop(b.outer, 'rgba(240,240,240,0)');
    g.addColorStop(1, 'rgba(240,240,240,0)');
    tctx.fillStyle = g;
    tctx.beginPath();
    tctx.arc(0, 0, 1, 0, Math.PI * 2);
    tctx.fill();
    tctx.restore();
  }
  return ctx.createPattern(tile, 'repeat');
}

function drawWord(ctx: CanvasRenderingContext2D, side: Side, stageW: number, stageH: number, flip: boolean) {
  if (side.blank || !side.word) return;
  const word = side.word.toUpperCase();
  const wordColour = colourValue(side.colour);
  const outlineColour = side.outline === 'none' ? 'transparent' : colourValue(side.outline);
  const metallicFillStops = METALLIC_GRADIENT_STOPS[side.colour];
  const metallicOutline = side.outline !== 'none' ? METALLIC_STROKE_TONES[side.outline] : undefined;

  const fontSize = stageW * 0.06;
  const strokeThick = stageW * 0.0154;
  const strokeThin = stageW * 0.0075;

  const px = (side.x / 100) * stageW;
  const py = (side.y / 100) * stageH;

  ctx.save();
  ctx.translate(px, py);
  ctx.scale(flip ? -1 : 1, 1);
  ctx.rotate((side.rot * Math.PI) / 180);
  ctx.scale(side.size, side.size);

  ctx.font = `800 ${fontSize}px Gloze, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${fontSize * 0.01}px`;

  const textW = ctx.measureText(word).width;
  const boxX = -textW / 2;
  const boxY = -fontSize / 2;

  ctx.lineJoin = 'round';

  if (side.outline !== 'none') {
    ctx.lineWidth = strokeThick;
    ctx.strokeStyle = metallicOutline ? metallicOutline.base : outlineColour;
    ctx.strokeText(word, 0, 0);
  }
  if (metallicOutline) {
    ctx.lineWidth = strokeThick * 0.45;
    ctx.strokeStyle = metallicOutline.highlight;
    ctx.strokeText(word, 0, 0);
  }
  ctx.lineWidth = strokeThin;
  ctx.strokeStyle = INK;
  ctx.strokeText(word, 0, 0);

  ctx.fillStyle = metallicFillStops ? angledLinearGradient(ctx, metallicFillStops, boxX, boxY, textW, fontSize) || wordColour : wordColour;
  ctx.fillText(word, 0, 0);

  const pattern = makeHighlightPattern(ctx, fontSize);
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillText(word, 0, 0);
  }

  ctx.restore();
}

function drawBubbleMark(
  ctx: CanvasRenderingContext2D,
  opts: { size: number; ring: string; fill: string; glyph: string; keylineWidth: number; fillMetallic?: string; ringMetallic?: string }
) {
  const vb = BUBBLE_VIEWBOX;
  const scale = opts.size / vb.w;

  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-(vb.x + vb.w / 2), -(vb.y + vb.h / 2));

  const fillPath = new Path2D(BUBBLE_FILL_D);
  const ringPath = new Path2D(BUBBLE_RING_D);

  ctx.fillStyle = (opts.fillMetallic && angledLinearGradient(ctx, METALLIC_GRADIENT_STOPS[opts.fillMetallic], vb.x, vb.y, vb.w, vb.h)) || opts.fill;
  ctx.fill(fillPath);

  ctx.strokeStyle = INK;
  ctx.lineWidth = opts.keylineWidth;
  ctx.stroke(fillPath);

  ctx.fillStyle = (opts.ringMetallic && angledLinearGradient(ctx, METALLIC_GRADIENT_STOPS[opts.ringMetallic], vb.x, vb.y, vb.w, vb.h)) || opts.ring;
  ctx.fill(ringPath, 'evenodd');

  ctx.fillStyle = opts.glyph;
  ctx.fill(new Path2D(BUBBLE_EYE1_D));
  ctx.fill(new Path2D(BUBBLE_EYE2_D));

  ctx.restore();
}

function drawSticker(ctx: CanvasRenderingContext2D, s: Sticker, side: Side, stageW: number, stageH: number, stickerSize: number, flip: boolean) {
  const wordColour = colourValue(side.colour);
  const outlineColour = side.outline === 'none' ? 'transparent' : colourValue(side.outline);
  const metallicFill = METALLIC_SWATCH_GRADIENT[side.colour];
  const metallicOutline = side.outline !== 'none' ? METALLIC_STROKE_TONES[side.outline] : undefined;

  const px = (s.x / 100) * stageW;
  const py = (s.y / 100) * stageH;

  ctx.save();
  ctx.translate(px, py);
  ctx.scale(flip ? -1 : 1, 1);
  ctx.rotate(((s.rot || 0) * Math.PI) / 180);
  ctx.scale(s.scale, s.scale);

  drawBubbleMark(ctx, {
    size: stickerSize,
    ring: outlineColour,
    fill: wordColour,
    glyph: glyphFor(wordColour),
    keylineWidth: 20.25,
    fillMetallic: metallicFill ? side.colour : undefined,
    ringMetallic: metallicOutline ? side.outline : undefined
  });

  ctx.restore();
}

function drawCoverImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const imgAr = img.naturalWidth / img.naturalHeight;
  const boxAr = w / h;
  let sx: number, sy: number, sw: number, sh: number;
  if (imgAr > boxAr) {
    sh = img.naturalHeight;
    sw = sh * boxAr;
    sx = (img.naturalWidth - sw) / 2;
    sy = 0;
  } else {
    sw = img.naturalWidth;
    sh = sw / boxAr;
    sx = 0;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawStage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, side: Side, x: number, y: number, w: number, h: number, flip: boolean) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  // Container-level mirror: flips the photo and the space word/sticker positions are
  // read against, matching ShoeStage's `.flip` on the whole stage. Each word/sticker
  // then applies its own counter scaleX(-1) below so the artwork itself reads normally
  // while its position still follows this flip — same two-level trick as the DOM.
  if (flip) {
    ctx.translate(x + w, y);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(x, y);
  }

  drawCoverImage(ctx, img, 0, 0, w, h);

  if (!side.blank) {
    if (side.word) drawWord(ctx, side, w, h, flip);
    const stickerSize = w * 0.06;
    for (const s of side.stickers) drawSticker(ctx, s, side, w, h, stickerSize, flip);
  }

  ctx.restore();
}

export async function renderDesignJpeg(design: DesignState, base: BaseTrainer, quality = 0.92): Promise<Blob> {
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.load('800 64px Gloze');
      await document.fonts.ready;
    } catch {
      /* fall through with whatever font is available */
    }
  }

  const stageW = 760;
  const stageH = stageW / base.ar;
  const gap = 20;
  const totalW = stageW * 2 + gap;
  const totalH = stageH;
  const dpr = 2;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(totalW * dpr);
  canvas.height = Math.round(totalH * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.scale(dpr, dpr);

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, totalW, totalH);

  const img = await loadImage(base.img);

  drawStage(ctx, img, design.left, 0, 0, stageW, stageH, false);
  drawStage(ctx, img, design.right, stageW + gap, 0, stageW, stageH, true);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not export image'))), 'image/jpeg', quality);
  });
}
