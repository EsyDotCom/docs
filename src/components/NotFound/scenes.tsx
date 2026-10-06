'use client';

// Three 404 worlds for docs.esy.com (prototype, 2026-10-06). Each replaces the
// footer's reef with Mason in a moment that says "not found", using the same
// pieces as the footer (SiteFooter/mason): the reef, the sim that moves him,
// his slabs. Everything he handles is abstract.
//
//   drifted — Mason wanders and looks around; the page, a slab marked 404,
//             drifts up and away out of reach, leaving an empty outline.
//   piece   — his gate is missing its top slab. He fetches one marked 404,
//             tries it in the gap, it sits crooked, he looks around, and it
//             goes back. The piece you asked for isn't part of the build.
//   ink     — octopuses ink when something startles them: a cloud blooms
//             from Mason and clears to show 4-0-4 set in slabs on the seabed,
//             the 0 his octagon gate.

import type { CSSProperties } from 'react';

import { Box, C } from '@/components/SiteFooter/mason/draw';
import { besideSlot, GROUND, ReefSim, type Job, type SimItem } from '@/components/SiteFooter/mason/sim';
import { octagon, pts } from '@/components/SiteFooter/mason/symbols';
import '@/components/SiteFooter/mason/reef.css';
import './not-found.css';

const SURFACE = 92;

/** A slab with "404" set on it in the stencil face. */
function Slab404({ w = 120, h = 46, fill = C.ivory }: { w?: number; h?: number; fill?: string }) {
  return (
    <g>
      <Box x={-w / 2} y={-h / 2} w={w} h={h} c={[10, 10, 10, 10]} fill={fill} stroke={C.navy} strokeWidth={2} />
      <text className="nf-404" x={0} y={h * 0.2} textAnchor="middle" fontSize={h * 0.62}>
        404
      </text>
    </g>
  );
}

/** One side of an octagon ring (centre, outer and inner size), pulled back at both ends for a stencil gap. */
function ringSide(cx: number, cy: number, outer: number, inner: number, k: number): string {
  const o = octagon(cx, cy, outer);
  const n = octagon(cx, cy, inner);
  const j = (k + 1) % 8;
  const pull = (a: [number, number], b: [number, number]): [number, number] => [a[0] + (b[0] - a[0]) * 0.07, a[1] + (b[1] - a[1]) * 0.07];
  return pts([pull(o[k], o[j]), pull(o[j], o[k]), pull(n[j], n[k]), pull(n[k], n[j])]);
}

// ── A · Drifted ────────────────────────────────────────────────────────────
const WANDER: Job[] = [
  { kind: 'walk', x: 430 },
  { kind: 'look', dur: 2.4 },
  { kind: 'rest', dur: 1.4 },
  { kind: 'walk', x: 600 },
  { kind: 'look', dur: 2.2 },
  { kind: 'rest', dur: 1.2 },
  { kind: 'walk', x: 360 },
];

export function DriftedScene() {
  return (
    <ReefSim
      items={[]}
      jobs={WANDER}
      start={360}
      surface={SURFACE}
      className="nf-drift"
      label="Mason looking around the seabed while a slab marked 404 drifts up and away"
      back={
        <g>
          {/* Where the page should be: an empty outline on the seabed. */}
          <Box x={700} y={GROUND - 48} w={120} h={46} c={[10, 10, 10, 10]} fill="none" stroke={C.mint} strokeWidth={2} strokeDasharray="7 6" opacity={0.6} />
        </g>
      }
      front={
        <g className="nf-float">
          <g className="nf-float-bob">
            <Slab404 />
          </g>
        </g>
      }
    />
  );
}

// ── B · Missing piece ──────────────────────────────────────────────────────
const GATE: [number, number] = [860, 268];
const RING = { outer: 240, inner: 180 };
const MID = octagon(...GATE, 210);
const TOP: [number, number] = [(MID[0][0] + MID[1][0]) / 2, (MID[0][1] + MID[1][1]) / 2];

const TRY: SimItem[] = [{ home: [330, 365], slot: [TOP[0], TOP[1] + 6], rot: 22, shape: <Slab404 w={92} h={30} fill="#E2DCCB" /> }];
const TRYING: Job[] = [
  { kind: 'walk', x: TRY[0].home[0] },
  { kind: 'pick', item: 0 },
  { kind: 'walk', x: besideSlot(TRY[0]) },
  { kind: 'place', item: 0 },
  { kind: 'flag', cls: 'is-stuck', on: true },
  { kind: 'look', dur: 2.6 },
  { kind: 'rest', dur: 1.4 },
  { kind: 'flag', cls: 'is-stuck', on: false },
  { kind: 'reset', dur: 1.6 },
  { kind: 'rest', dur: 0.8 },
];

export function PieceScene() {
  return (
    <ReefSim
      items={TRY}
      jobs={TRYING}
      start={260}
      surface={SURFACE}
      className="nf-piece"
      label="Mason trying a slab marked 404 in the gap at the top of his gate; it doesn't fit"
      back={
        <g>
          {/* The gate, whole except for its top slab, and the gap's outline. */}
          {[1, 2, 3, 4, 5, 6, 7].map((k) => (
            <polygon key={k} points={ringSide(...GATE, RING.outer, RING.inner, k)} fill={k % 2 ? C.teal : C.ivory} stroke={C.navy} strokeWidth={1.5} />
          ))}
          <polygon className="nf-gap" points={ringSide(...GATE, RING.outer, RING.inner, 0)} fill="none" stroke={C.mint} strokeWidth={2} strokeDasharray="6 5" />
        </g>
      }
    />
  );
}

// ── C · Ink ────────────────────────────────────────────────────────────────
const LOITER: Job[] = [
  { kind: 'rest', dur: 2.2 },
  { kind: 'look', dur: 2.2 },
  { kind: 'walk', x: 380 },
  { kind: 'rest', dur: 2.4 },
  { kind: 'walk', x: 300 },
];

/** A stencil 4 standing on the seabed with its left edge at x. */
function Four({ x }: { x: number }) {
  return (
    <g>
      <Box x={x} y={GROUND - 136} w={24} h={78} c={[8, 0, 0, 0]} fill={C.ivory} stroke={C.navy} strokeWidth={1.5} />
      <Box x={x} y={GROUND - 54} w={96} h={22} c={[0, 0, 0, 6]} fill={C.teal} stroke={C.navy} strokeWidth={1.5} />
      <Box x={x + 62} y={GROUND - 136} w={26} h={134} c={[8, 8, 0, 0]} fill={C.ivory} stroke={C.navy} strokeWidth={1.5} />
    </g>
  );
}

export function InkScene() {
  const zero: [number, number] = [756, GROUND - 68];
  return (
    <ReefSim
      items={[]}
      jobs={LOITER}
      start={300}
      surface={SURFACE}
      className="nf-ink"
      label="An ink cloud from Mason clearing to show 404 set in slabs on the seabed"
      back={
        <g>
          <Four x={560} />
          {Array.from({ length: 8 }, (_, k) => (
            <polygon key={k} points={ringSide(...zero, 136, 96, k)} fill={k % 2 ? C.teal : C.ivory} stroke={C.navy} strokeWidth={1.5} />
          ))}
          <Four x={850} />
        </g>
      }
      front={
        <g className="nf-cloud">
          {[
            [420, 300, 150],
            [560, 250, 190],
            [700, 300, 220],
            [850, 260, 200],
            [980, 310, 160],
            [640, 360, 170],
          ].map(([x, y, s], n) => (
            <polygon key={n} className="nf-puff" points={pts(octagon(x, y, s))} style={{ '--n': n, transformOrigin: `${x}px ${y}px` } as CSSProperties} />
          ))}
        </g>
      }
    />
  );
}
