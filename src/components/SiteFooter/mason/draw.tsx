// Copied verbatim from esy.com, src/components/BrandShapes/draw.tsx (main at 4767ae31, 2026-10-06),
// so docs.esy.com ends the way esy.com does. Re-copy it rather than editing here.
// Drawing kit for the round-three mascots (2026-10-06): every part is a box
// with 45° corner cuts (the e's stencil), drawn as an SVG polygon so parts can
// nest into rigs (an arm's segments, a wing on a body) and pivot with CSS.

import type { CSSProperties, ReactNode, SVGProps } from 'react';
import type { Piece } from './pieces';
import { polygonPoints, polygonTransform } from './Stage';

export const C = {
  navy: '#0A2540',
  ink: '#061527',
  wing: '#163A5F',
  teal: '#00A896',
  bright: '#00D4AA',
  mint: '#2BD8BB',
  deep: '#00796C',
  ivory: '#F4F1EA',
  pale: '#E3F4F0',
};

export const MASCOT_NOTE =
  'Prototype. Each mascot is drawn in the 45° stencil cut of our e, in the site’s navy and teal. Nothing here is live yet.';

type BoxProps = { x: number; y: number; w: number; h: number; c?: Piece['c']; r?: number; fill?: string } & Omit<
  SVGProps<SVGPolygonElement>,
  'points' | 'fill' | 'x' | 'y' | 'r'
>;

/** A chamfered box: cuts are [top-left, top-right, bottom-right, bottom-left], rotation is about its centre. */
export function Box({ x, y, w, h, c, r, fill, ...rest }: BoxProps) {
  const p: Piece = { id: '', x, y, w, h, c, r, tone: 'none' };
  return <polygon points={polygonPoints(p)} transform={polygonTransform(p)} fill={fill} {...rest} />;
}

/** Pivot point for a CSS-animated SVG group, in the drawing's own units. */
export const pivot = (x: number, y: number) => ({ transformOrigin: `${x}px ${y}px` });

/** Sample vertical names for the round-four takes: kinds of marketing work, not real products. */
export const VERTICALS = ['Clip art', 'SEO pages', 'News', 'Films', 'Courses', 'Social', 'Email', 'Ads'];

export const ROUND_FOUR_NOTE =
  'Prototype. Mascots drawn in the 45° stencil cut of our e, in the site’s navy and teal. The vertical names are samples; nothing here is live yet.';

type Seg = { l: number; w: number };

/**
 * A limb as a chain of chamfered segments, drawn pointing down from (0, 0).
 * Each segment nests inside the one before, so a curl on every joint
 * compounds into a wave. `fill(k)` colours segment k; `tip` rides on the end.
 */
export function Chain({
  segs,
  gap = 4,
  fill,
  className = 'bs-chain-seg',
  vars,
  tip,
}: {
  segs: Seg[];
  gap?: number;
  fill: (k: number) => string;
  className?: string;
  vars?: Record<string, string | number>;
  tip?: ReactNode;
}) {
  const offsets: number[] = [];
  segs.reduce((top, s) => (offsets.push(top), top + s.l + gap), 0);
  const last = segs.length - 1;
  let inner: ReactNode = tip ? <g transform={`translate(0 ${offsets[last] + segs[last].l})`}>{tip}</g> : null;
  for (let k = last; k >= 0; k--) {
    const s = segs[k];
    inner = (
      <g className={className} style={{ ...pivot(0, offsets[k]), ...vars, '--k': k } as CSSProperties}>
        <Box x={-s.w / 2} y={offsets[k]} w={s.w} h={s.l} c={[0, 0, s.w * 0.36, s.w * 0.36]} style={{ fill: fill(k) }} />
        {inner}
      </g>
    );
  }
  return <>{inner}</>;
}

/** Evenly tapering segments: `n` of them from width `w0` to `w1`, starting `l` long and ending about a third shorter. */
export const taper = (n: number, l: number, w0: number, w1: number): Seg[] =>
  Array.from({ length: n }, (_, k) => {
    const t = k / Math.max(1, n - 1);
    return { l: l * (1 - 0.35 * t), w: w0 + (w1 - w0) * t };
  });

// ── Round five (2026-10-06): whole worlds ──
// Each theme draws one wide scene. The footer shows all of it (1200 × 560,
// the card covers roughly the bottom 140); the hero shows a crop of it.

export const SCENE_VIEW = '0 0 1200 560';

export const ROUND_FIVE_NOTE =
  'Prototype. Every world is drawn in the 45° stencil cut of our e, in the site’s navy and teal, and the footer on this page is the theme’s own. Nothing here is live yet.';

/** The scene's root: a crop (`view`) for the hero, the whole thing for the footer. */
export function SceneSvg({ view = SCENE_VIEW, className, label, children }: { view?: string; className: string; label: string; children: ReactNode }) {
  return (
    <svg className={`bs-svg bs-fs ${className}`} viewBox={view} role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      {children}
    </svg>
  );
}

/** A background band that runs far past both sides, so the footer has no edges at any width. */
export function Wide({ y, h, fill, className, style }: { y: number; h: number; fill: string; className?: string; style?: CSSProperties }) {
  return <rect x={-2400} width={6000} y={y} height={h} fill={fill} className={className} style={style} />;
}

/** A four-point sparkle (a diamond), used for stars and motes. */
export function Diamond({ x, y, s, fill, className, style }: { x: number; y: number; s: number; fill: string; className?: string; style?: CSSProperties }) {
  const r = (n: number) => +n.toFixed(1);
  return <polygon className={className} style={style} fill={fill} points={`${r(x)},${r(y - s)} ${r(x + s)},${r(y)} ${r(x)},${r(y + s)} ${r(x - s)},${r(y)}`} />;
}
