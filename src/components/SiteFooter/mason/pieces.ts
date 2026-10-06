// Copied verbatim from esy.com, src/components/BrandShapes/pieces.ts (main at 4767ae31, 2026-10-06),
// so docs.esy.com ends the way esy.com does. Re-copy it rather than editing here.
// The brand-shape kit: animals cut the way the esy "e" is cut.
//
// Black Ops One's e is three flat pieces with 45° chamfered corners and a
// stencil gap between them (see .esy-loader in globals.css). Every animal here
// is built from the same primitive: a box with each corner cut at 45° by its
// own amount. One stage is 480 × 360 units; pieces are placed in those units
// and rendered in percentages, so a stage scales to any width.
//
// Every figure has exactly 14 slots, so the Tangram take can morph any figure
// into any other by moving piece n to its new place. Unused slots are ghosts.

import type { CSSProperties } from 'react';

export const W = 480;
export const H = 360;

export type Tone = 'navy' | 'ink' | 'teal' | 'bright' | 'deep' | 'ivory' | 'none';

// The site's palette: navy and jade from the homepage, plus a deeper teal for
// the far side of a figure and a warm ivory for eyes and tusks.
export const TONES: Record<Tone, string> = {
  navy: '#0A2540',
  ink: '#061527',
  teal: '#00A896',
  bright: '#00D4AA',
  deep: '#00796C',
  ivory: '#F4F1EA',
  none: 'transparent',
};

// Idle-motion roles. A part swings or flaps about its `pivot` (stage units).
export type Part = 'body' | 'ear' | 'trunk' | 'tail' | 'leg-a' | 'leg-b';

export interface Piece {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** 45° corner cuts: one number for all four, or [top-left, top-right, bottom-right, bottom-left]. */
  c?: number | [number, number, number, number];
  tone: Tone;
  /** Static rotation in degrees about the piece's centre. Rotated pieces carry no part. */
  r?: number;
  part?: Part;
  pivot?: [number, number];
}

export interface Figure {
  slug: string;
  name: string;
  pieces: Piece[];
}

type Cuts = [number, number, number, number];

// Clamp each cut to half the shorter side so a corner never crosses its neighbour.
function cuts(p: Piece): Cuts {
  const raw: Cuts = typeof p.c === 'number' ? [p.c, p.c, p.c, p.c] : p.c ?? [0, 0, 0, 0];
  const max = Math.min(p.w, p.h);
  return raw.map((v) => Math.max(0, Math.min(v, max))) as Cuts;
}

/** The piece's eight corners in stage units (cut corners repeat a point when the cut is 0). */
export function points(p: Piece): [number, number][] {
  const [tl, tr, br, bl] = cuts(p);
  const { x, y, w, h } = p;
  return [
    [x + tl, y], [x + w - tr, y], [x + w, y + tr], [x + w, y + h - br],
    [x + w - br, y + h], [x + bl, y + h], [x, y + h - bl], [x, y + tl],
  ];
}

const pct = (n: number) => `${+n.toFixed(3)}%`;

/** The same eight corners as a clip-path relative to the piece's own box, so it transitions cleanly. */
export function clipPath(p: Piece): string {
  if (!p.w || !p.h) return `polygon(${Array(8).fill('50% 50%').join(', ')})`;
  return `polygon(${points(p)
    .map(([px, py]) => `${pct(((px - p.x) / p.w) * 100)} ${pct(((py - p.y) / p.h) * 100)}`)
    .join(', ')})`;
}

/** Absolute placement for a div-rendered piece. Motion pivots are converted to the piece's own box. */
export function pieceStyle(p: Piece, i: number): CSSProperties {
  const origin = p.pivot && p.w && p.h
    ? `${pct(((p.pivot[0] - p.x) / p.w) * 100)} ${pct(((p.pivot[1] - p.y) / p.h) * 100)}`
    : '50% 50%';
  return {
    left: pct((p.x / W) * 100),
    top: pct((p.y / H) * 100),
    width: pct((p.w / W) * 100),
    height: pct((p.h / H) * 100),
    clipPath: clipPath(p),
    rotate: p.r ? `${p.r}deg` : '0deg',
    transformOrigin: origin,
    opacity: p.tone === 'none' ? 0 : 1,
    ['--c' as string]: TONES[p.tone],
    ['--i' as string]: i,
  };
}

/** Is a stage point inside the piece? Used to sample figures into tiles. */
export function contains(p: Piece, px: number, py: number): boolean {
  if (p.tone === 'none' || !p.w || !p.h) return false;
  let lx = px - p.x;
  let ly = py - p.y;
  // Undo the piece's rotation about its centre before testing.
  if (p.r) {
    const a = (-p.r * Math.PI) / 180;
    const cx = p.w / 2;
    const cy = p.h / 2;
    const dx = lx - cx;
    const dy = ly - cy;
    lx = cx + dx * Math.cos(a) - dy * Math.sin(a);
    ly = cy + dx * Math.sin(a) + dy * Math.cos(a);
  }
  if (lx < 0 || ly < 0 || lx > p.w || ly > p.h) return false;
  const [tl, tr, br, bl] = cuts(p);
  return lx + ly >= tl && p.w - lx + ly >= tr && p.w - lx + (p.h - ly) >= br && lx + (p.h - ly) >= bl;
}

/** The topmost piece's tone at a stage point, or null for empty ground. */
export function toneAt(fig: Piece[], px: number, py: number): Tone | null {
  for (let i = fig.length - 1; i >= 0; i--) if (contains(fig[i], px, py)) return fig[i].tone;
  return null;
}

const ghost = (id: string): Piece => ({ id, x: 240, y: 180, w: 0, h: 0, tone: 'none' });

// ── The elephant ────────────────────────────────────────────────────────────
// Faces right. Navy body and head, a teal ear, far legs in deep teal so they
// read as behind. Slot order is paint order (later pieces sit on top).
const TAIL: [number, number] = [65, 156];
const TRUNK: [number, number] = [404, 200];
export const ELEPHANT: Figure = {
  slug: 'elephant',
  name: 'Elephant',
  pieces: [
    { id: 'tail', x: 60, y: 156, w: 10, h: 50, c: [0, 0, 5, 5], tone: 'navy', part: 'tail', pivot: TAIL },
    { id: 'tuft', x: 55, y: 210, w: 20, h: 22, c: 7, tone: 'teal', part: 'tail', pivot: TAIL },
    { id: 'far-back-leg', x: 150, y: 236, w: 40, h: 84, c: [0, 0, 10, 10], tone: 'deep', part: 'leg-b', pivot: [170, 236] },
    { id: 'far-front-leg', x: 232, y: 236, w: 40, h: 84, c: [0, 0, 10, 10], tone: 'deep', part: 'leg-a', pivot: [252, 236] },
    // A domed back: deep cuts on top, shallow ones underneath.
    { id: 'body', x: 72, y: 92, w: 238, h: 150, c: [58, 48, 28, 30], tone: 'navy', part: 'body', pivot: [190, 242] },
    { id: 'near-back-leg', x: 100, y: 248, w: 46, h: 72, c: [0, 0, 12, 12], tone: 'navy', part: 'leg-a', pivot: [123, 236] },
    { id: 'near-front-leg', x: 256, y: 248, w: 46, h: 72, c: [0, 0, 12, 12], tone: 'navy', part: 'leg-b', pivot: [279, 236] },
    { id: 'head', x: 316, y: 54, w: 108, h: 140, c: [50, 36, 22, 24], tone: 'navy' },
    // The big teal ear is the signature: it flaps.
    { id: 'ear', x: 290, y: 74, w: 84, h: 136, c: [16, 40, 52, 10], tone: 'teal', part: 'ear', pivot: [294, 142] },
    { id: 'eye', x: 394, y: 98, w: 11, h: 11, c: 3, tone: 'ivory' },
    { id: 'tusk', x: 404, y: 178, w: 38, h: 11, c: [0, 6, 6, 0], tone: 'ivory', r: -14 },
    { id: 'trunk', x: 388, y: 200, w: 34, h: 70, c: [0, 0, 0, 16], tone: 'navy', part: 'trunk', pivot: TRUNK },
    { id: 'trunk-low', x: 400, y: 276, w: 22, h: 30, c: [0, 0, 11, 0], tone: 'navy', part: 'trunk', pivot: TRUNK },
    { id: 'trunk-tip', x: 426, y: 288, w: 16, h: 18, c: [7, 0, 7, 0], tone: 'navy', part: 'trunk', pivot: TRUNK },
  ],
};

// ── The whale ───────────────────────────────────────────────────────────────
export const WHALE: Figure = {
  slug: 'whale',
  name: 'Whale',
  pieces: [
    { id: 'spout', x: 124, y: 70, w: 10, h: 50, c: 5, tone: 'bright' },
    { id: 'spout-l', x: 98, y: 46, w: 10, h: 40, c: 5, tone: 'bright', r: -32 },
    { id: 'fluke-top', x: 410, y: 116, w: 36, h: 60, c: [0, 18, 0, 18], tone: 'teal', r: 22 },
    { id: 'fluke-low', x: 410, y: 194, w: 36, h: 60, c: [18, 0, 18, 0], tone: 'teal', r: -22 },
    { id: 'body', x: 56, y: 128, w: 304, h: 134, c: [64, 52, 60, 30], tone: 'navy' },
    { id: 'stock', x: 364, y: 168, w: 48, h: 36, c: [0, 10, 10, 0], tone: 'navy' },
    { id: 'fin', x: 192, y: 250, w: 62, h: 30, c: [0, 0, 30, 0], tone: 'teal', r: 18 },
    { id: 'belly', x: 110, y: 230, w: 226, h: 26, c: [0, 0, 22, 12], tone: 'deep' },
    { id: 'wave', x: 36, y: 304, w: 124, h: 10, c: 5, tone: 'teal' },
    { id: 'eye', x: 114, y: 172, w: 11, h: 11, c: 3, tone: 'ivory' },
    { id: 'mouth', x: 62, y: 206, w: 92, h: 6, c: 3, tone: 'deep' },
    { id: 'wave-2', x: 196, y: 316, w: 150, h: 10, c: 5, tone: 'teal' },
    { id: 'wave-3', x: 376, y: 304, w: 72, h: 10, c: 5, tone: 'teal' },
    { id: 'spout-r', x: 150, y: 46, w: 10, h: 40, c: 5, tone: 'bright', r: 32 },
  ],
};

// ── The owl ─────────────────────────────────────────────────────────────────
export const OWL: Figure = {
  slug: 'owl',
  name: 'Owl',
  pieces: [
    { id: 'ear-l', x: 166, y: 66, w: 40, h: 46, c: [0, 40, 0, 0], tone: 'navy' },
    { id: 'ear-r', x: 274, y: 66, w: 40, h: 46, c: [40, 0, 0, 0], tone: 'navy' },
    { id: 'wing-l', x: 142, y: 166, w: 30, h: 112, c: [15, 0, 15, 0], tone: 'deep' },
    { id: 'wing-r', x: 308, y: 166, w: 30, h: 112, c: [0, 15, 0, 15], tone: 'deep' },
    { id: 'body', x: 160, y: 106, w: 160, h: 194, c: [24, 24, 44, 44], tone: 'navy' },
    { id: 'branch', x: 84, y: 304, w: 312, h: 16, c: 8, tone: 'deep' },
    { id: 'belly', x: 202, y: 214, w: 76, h: 70, c: [10, 10, 30, 30], tone: 'teal' },
    { id: 'face-l', x: 180, y: 126, w: 58, h: 58, c: 18, tone: 'teal' },
    { id: 'face-r', x: 242, y: 126, w: 58, h: 58, c: 18, tone: 'teal' },
    { id: 'eye-l', x: 200, y: 146, w: 18, h: 18, c: 6, tone: 'ink' },
    { id: 'eye-r', x: 262, y: 146, w: 18, h: 18, c: 6, tone: 'ink' },
    { id: 'beak', x: 230, y: 184, w: 20, h: 24, c: [0, 0, 10, 10], tone: 'ivory' },
    { id: 'foot-l', x: 204, y: 294, w: 24, h: 14, c: [0, 0, 6, 6], tone: 'bright' },
    { id: 'foot-r', x: 252, y: 294, w: 24, h: 14, c: [0, 0, 6, 6], tone: 'bright' },
  ],
};

// ── The tortoise ────────────────────────────────────────────────────────────
export const TORTOISE: Figure = {
  slug: 'tortoise',
  name: 'Tortoise',
  pieces: [
    { id: 'tail', x: 92, y: 244, w: 22, h: 12, c: [6, 0, 0, 6], tone: 'navy' },
    { id: 'leaf', x: 428, y: 236, w: 36, h: 14, c: [7, 0, 7, 0], tone: 'bright' },
    { id: 'far-back-leg', x: 172, y: 262, w: 30, h: 46, c: [0, 0, 8, 8], tone: 'deep' },
    { id: 'far-front-leg', x: 262, y: 262, w: 30, h: 46, c: [0, 0, 8, 8], tone: 'deep' },
    { id: 'shell', x: 116, y: 128, w: 228, h: 126, c: [84, 84, 0, 0], tone: 'navy' },
    { id: 'back-leg', x: 130, y: 262, w: 36, h: 50, c: [0, 0, 10, 10], tone: 'navy' },
    { id: 'front-leg', x: 298, y: 262, w: 36, h: 50, c: [0, 0, 10, 10], tone: 'navy' },
    { id: 'neck', x: 336, y: 220, w: 30, h: 28, tone: 'navy' },
    { id: 'head', x: 354, y: 198, w: 70, h: 52, c: [20, 20, 8, 14], tone: 'navy' },
    { id: 'eye', x: 398, y: 212, w: 9, h: 9, c: 3, tone: 'ivory' },
    { id: 'plate-1', x: 150, y: 188, w: 50, h: 46, c: 12, tone: 'teal' },
    { id: 'plate-2', x: 206, y: 158, w: 50, h: 76, c: 14, tone: 'teal' },
    { id: 'plate-3', x: 262, y: 188, w: 50, h: 46, c: 12, tone: 'teal' },
    { id: 'rim', x: 104, y: 250, w: 252, h: 14, c: 7, tone: 'deep' },
  ],
};

// ── The e ───────────────────────────────────────────────────────────────────
// The real Black Ops One e, decomposed from the loader's clip-paths in
// globals.css (glyph box 1152 × 1062, drawn 260 × 240 at x 110, y 60). The
// bowl's notch becomes three boxes that butt together; the rest are ghosts
// gathered at the e's centre, so the other figures grow out of it.
export const E: Figure = {
  slug: 'e',
  name: 'The e',
  pieces: [
    ghost('g0'), ghost('g1'), ghost('g2'), ghost('g3'),
    { id: 'spine', x: 110, y: 60, w: 100, h: 240, c: [60, 0, 0, 60], tone: 'teal' },
    ghost('g5'), ghost('g6'),
    { id: 'bowl-top', x: 225.5, y: 60, w: 144.5, h: 60.5, c: [0, 60, 0, 0], tone: 'teal' },
    { id: 'bowl-right', x: 278, y: 120, w: 92, h: 83.7, tone: 'teal' },
    ghost('g9'), ghost('g10'),
    { id: 'bowl-mid', x: 225.5, y: 162, w: 53, h: 41.7, tone: 'teal' },
    { id: 'bar', x: 225.5, y: 244, w: 134, h: 56, c: [0, 0, 28, 0], tone: 'teal' },
    ghost('g13'),
  ],
};

export const FIGURES: Figure[] = [ELEPHANT, WHALE, OWL, TORTOISE, E];

// The e's real box inside FIGURES' E: x 110–370, y 60–300 (260 × 240).
const E_BOX = { x: 110, y: 60, w: 260, h: 240 };
export const E_ASPECT = E_BOX.w / E_BOX.h;

/** The e's five real pieces, scaled to `height` units with the top-left at (x, y). */
export function eAt(x: number, y: number, height: number, tone: Tone = 'teal'): Piece[] {
  const k = height / E_BOX.h;
  return E.pieces
    .filter((p) => p.tone !== 'none')
    .map((p) => ({
      ...p,
      tone,
      x: x + (p.x - E_BOX.x) * k,
      y: y + (p.y - E_BOX.y) * k,
      w: p.w * k,
      h: p.h * k,
      c: typeof p.c === 'number' ? p.c * k : p.c ? (p.c.map((v) => v * k) as Piece['c']) : undefined,
    }));
}
