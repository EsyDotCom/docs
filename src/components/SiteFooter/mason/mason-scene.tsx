// Copied verbatim from esy.com, src/components/BrandShapes/mason-scene.tsx (main at 4767ae31, 2026-10-06),
// so docs.esy.com ends the way esy.com does. Re-copy it rather than editing here.
'use client';

// Mason's footer world (shipped 2026-10-06): Mason, Esy's octopus, quarries
// slabs from a pile and builds an octagon gate, bottom first, then the sides,
// the top last. He walks, crouches, lifts each slab overhead, carries it over
// and sets it with a puff of sand, stopping now and then to rest or look
// around. When the gate is whole it fills with light and a school swims
// through; he admires it, the gate quietly resets, and he starts again.
//
// Used by FooterWorld on every page with the site footer, and by the AV · Mason
// prototype. The motion is driven by sim.tsx; the looping life (arm curl,
// fish, light) comes from reef.css.

import type { CSSProperties } from 'react';
import { Box, C } from './draw';
import { Fish } from './reefkit';
import { buildJobs, ReefSim, type SimItem } from './sim';
import { octagon, pts } from './symbols';
import './reef.css';

const GATE: [number, number] = [860, 268];
const MID = octagon(...GATE, 210); // the centreline of the gate's ring
// Build order: bottom, the two lower diagonals, the sides, the upper diagonals, the top.
const ORDER = [4, 3, 5, 2, 6, 1, 7, 0];
// The quarry: two stacks of slabs, taken from the top.
const PILE: [number, number][] = [[400, 288], [500, 288], [400, 316], [500, 316], [400, 344], [500, 344], [400, 372], [500, 372]];
const TONES = [C.ivory, C.teal, '#E2DCCB', C.deep];

const ITEMS: SimItem[] = ORDER.map((k, n) => {
  const a = MID[k];
  const b = MID[(k + 1) % 8];
  const deg = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  return {
    home: PILE[n],
    slot: [+((a[0] + b[0]) / 2).toFixed(1), +((a[1] + b[1]) / 2).toFixed(1)],
    rot: +deg.toFixed(1),
    shape: <Box x={-46} y={-14} w={92} h={28} c={[8, 8, 8, 8]} fill={TONES[n % TONES.length]} stroke={C.navy} strokeWidth={1.5} />,
  };
});
const JOBS = buildJobs(ITEMS);

export function MasonScene({ view }: { view?: string }) {
  return (
    <ReefSim
      items={ITEMS}
      jobs={JOBS}
      start={240}
      view={view}
      className="bs-mason"
      surface={92}
      label="Mason the octopus quarrying slabs and building an octagon gate, slab by slab"
      back={
        <g>
          {/* The gate's footprint, and its light once it's whole. */}
          <polygon points={pts(octagon(...GATE, 240))} fill="none" stroke={C.mint} strokeWidth={1.5} strokeDasharray="6 8" opacity={0.3} />
          <polygon className="bs-mason-glow" points={pts(octagon(...GATE, 176))} fill={C.mint} />
          {/* The quarry floor. */}
          <Box x={340} y={384} w={220} h={8} fill="#163A5F" />
        </g>
      }
      front={
        <g className="bs-mason-school">
          {[[0, 0], [-30, -12], [-30, 12], [-60, 0]].map(([x, y], n) => (
            <g key={n} transform={`translate(${x} ${y})`}>
              <g className="bs-reef-fish" style={{ '--n': n } as CSSProperties}>
                <Fish tone={C.bright} fin={C.ivory} />
              </g>
            </g>
          ))}
        </g>
      }
    />
  );
}
