// Copied verbatim from esy.com, src/components/BrandShapes/reefkit.tsx (main at 4767ae31, 2026-10-06),
// so docs.esy.com ends the way esy.com does. Re-copy it rather than editing here.
// The reef kit for round nine (2026-10-06): the world of W · Octopus Reef
// (water, light, far reef, sand, kelp, fish) as one backdrop, plus a helper
// to place several of the original octopuses in it, facing either way.
// Many octopuses, one shared thing: the reef is the brain, not any one of them.

import type { CSSProperties, ReactNode } from 'react';
import { Box, C, Chain, taper, Wide } from './draw';
import { OctopusFigure } from './octopus-figure';
import { noise, octagon, pts } from './symbols';

// Moved here from OctoReef.tsx so the live footer doesn't import a prototype page.
/** A small fish facing right, centred on (0, 0). */
export function Fish({ tone = C.ivory, fin = C.teal }: { tone?: string; fin?: string }) {
  return (
    <g>
      <polygon points="-12,0 -22,-7 -22,7" fill={fin} />
      <Box x={-13} y={-6} w={26} h={12} c={[3, 6, 6, 3]} fill={tone} />
      <Box x={6} y={-3} w={3} h={3} fill={C.navy} />
    </g>
  );
}

/** A kelp stalk growing up from (x, y): a chain drawn downward, turned over. */
export function Kelp({ x, y, n, len }: { x: number; y: number; n: number; len: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(180)`}>
      <Chain segs={taper(len, 26, 16, 9)} gap={3} className="bs-reef-kelp" vars={{ '--a': n, '--amp': '5deg' }} fill={(k) => (k % 2 ? C.deep : '#0F6B63')} />
    </g>
  );
}

export const SCHOOL = [[0, 0], [-34, -16], [-34, 16], [-68, -30], [-68, 2], [-68, 32], [-100, -14]];

export const ROUND_NINE_NOTE =
  'Prototype. Several of the original octopuses in the reef you liked, working on one shared thing. The footer on this page is the theme’s own; everything they handle is abstract.';

/** A stencil wave line along y: 45° crests that drift, the edge where the reef begins. */
function SurfaceEdge({ y }: { y: number }) {
  const crests = Array.from({ length: 76 }, (_, k) => k * 80 - 2400);
  return (
    <g>
      <g className="bs-reef-crests">
        <polygon points={`-2400,${y + 12} ${crests.map((x) => `${x},${y + 12} ${x + 22},${y - 6} ${x + 46},${y - 6} ${x + 68},${y + 12}`).join(' ')} 3680,${y + 12} 3680,${y + 40} -2400,${y + 40}`} fill="#0E4A5C" />
      </g>
      <g className="bs-reef-crests bs-reef-crests--back">
        {crests.map((x) => (
          <rect key={x} x={x + 30} y={y + 20} width={34} height={3} fill={C.mint} opacity={0.5} />
        ))}
      </g>
    </g>
  );
}

/** The reef around the work: everything except what the octopuses are doing. With `surface`, the
 * water starts lower, under a wave line, leaving open space above it (the footer's gap from the page). */
export function ReefBackdrop({ kelp = true, surface }: { kelp?: boolean; surface?: number }) {
  const top = surface ?? 0;
  return (
    <g>
      <defs>
        <linearGradient id="bs-reef-water" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0E4A5C" />
          <stop offset="0.6" stopColor="#0A2E48" />
          <stop offset="1" stopColor="#061527" />
        </linearGradient>
      </defs>
      <Wide y={top} h={560 - top} fill="url(#bs-reef-water)" />
      {[120, 360, 640, 880, 1100].map((x, n) => (
        <polygon key={n} className="bs-reef-ray" points={`${x},${top} ${x + 90},${top} ${x + 70},400 ${x + 30},400`} fill={C.mint} style={{ '--n': n } as CSSProperties} />
      ))}
      {surface === undefined ? <Wide y={0} h={6} fill={C.mint} className="bs-reef-surface" /> : <SurfaceEdge y={top} />}
      <polygon points="-2400,330 120,330 170,290 300,290 340,320 760,320 800,280 980,280 1020,320 3600,320 3600,400 -2400,400" fill="#0C3550" />
      <Wide y={380} h={180} fill={C.navy} />
      {[60, 210, 330, 760, 1000, 1150].map((x, n) => (
        <Box key={n} x={x} y={392 + (n % 2) * 6} w={34} h={4} c={2} fill="#163A5F" />
      ))}
      {kelp && (
        <>
          <Kelp x={40} y={392} n={0} len={11} />
          <Kelp x={86} y={392} n={1} len={8} />
          <Kelp x={1114} y={392} n={2} len={10} />
          <Kelp x={1160} y={392} n={3} len={12} />
        </>
      )}
      <g className="bs-reef-school bs-reef-school--a">
        {SCHOOL.map(([x, y], n) => (
          <g key={n} transform={`translate(${x} ${y})`}>
            <g className="bs-reef-fish" style={{ '--n': n } as CSSProperties}>
              <Fish />
            </g>
          </g>
        ))}
      </g>
      {Array.from({ length: 6 }, (_, n) => (
        <polygon
          key={n}
          className={surface === undefined ? 'bs-reef-bubble' : 'bs-reef-bubble bs-reef-bubble--under'}
          points={pts(octagon(+(200 + Math.abs(noise(n)) * 800).toFixed(1), 300, 8 + (n % 3) * 3))}
          fill="none"
          stroke={C.mint}
          strokeWidth={1.5}
          style={{ '--n': n } as CSSProperties}
        />
      ))}
    </g>
  );
}

/** One of the original octopuses at (x, y), `w` wide, optionally facing the other way. */
export function OctoIn({ x, y, w, flip = false, items = {}, className }: { x: number; y: number; w: number; flip?: boolean; items?: Record<number, ReactNode>; className?: string }) {
  const h = (w * 360) / 480;
  return (
    <g className={className} transform={flip ? `translate(${x * 2 + w} 0) scale(-1 1)` : undefined}>
      <svg x={x} y={y} width={w} height={h} viewBox="0 0 480 360">
        <OctopusFigure items={items} />
      </svg>
    </g>
  );
}

/** A small abstract piece: an octagon shell with a lighter heart. */
export function Shell({ x, y, s = 24, tone = C.ivory, heart = C.mint }: { x: number; y: number; s?: number; tone?: string; heart?: string }) {
  return (
    <g>
      <polygon points={pts(octagon(x, y, s))} fill={tone} />
      <polygon points={pts(octagon(x, y, s * 0.45))} fill={heart} />
    </g>
  );
}
