// Copied verbatim from esy.com, src/components/BrandShapes/sim.tsx (main at 4767ae31, 2026-10-06),
// so docs.esy.com ends the way esy.com does. Re-copy it rather than editing here.
'use client';

// The reef sim (2026-10-06): one octopus living its life on the seabed.
// A small job runner drives everything by time, not keyframes: it walks to a
// piece, crouches, lifts it overhead, carries it with a bob in its step,
// sets it in place with a puff of sand, rests, looks around, and when the
// build is done it stops and admires it. Then the build quietly resets and
// it starts again. CSS only adds the small life on top (arm curl, blinks,
// puffs, glows), keyed off classes the runner sets.
//
// It pauses while off screen, and with reduced motion it shows the finished
// build with the octopus resting beside it.

import { useEffect, useRef, type ReactNode } from 'react';
import { OctopusFigure } from './octopus-figure';
import { ReefBackdrop } from './reefkit';

export type Vec = [number, number];

export const ROUND_TEN_NOTE =
  'Prototype. The original octopus alone in the reef, living its life: a small script drives every step, so it walks, lifts, carries and builds rather than looping one motion. It pauses when it’s off screen. The footer on this page is the theme’s own.';

export const GROUND = 388;
const OW = 230; // octopus width in the scene
const OH = (OW * 360) / 480;
const SPEED = 240; // seabed units per second: it scoots
const CARRY_Y = GROUND - 172; // overhead, where a lifted piece rides

export interface SimItem {
  /** Where it waits to be picked up (its centre). */
  home: Vec;
  /** Where it ends up (its centre). */
  slot: Vec;
  /** Final rotation in degrees. */
  rot?: number;
  /** Drawn after the octopus (e.g. a den's front wall). */
  front?: boolean;
  /** Class added to the scene while this piece is in place (grows a plant, lights a glow…). */
  marks?: string;
  shape: ReactNode;
}

export type Job =
  | { kind: 'walk'; x: number }
  | { kind: 'pick'; item: number }
  | { kind: 'place'; item: number }
  | { kind: 'rest'; dur: number }
  | { kind: 'look'; dur: number }
  | { kind: 'dig'; dur: number }
  | { kind: 'flag'; cls: string; on: boolean }
  | { kind: 'reset'; dur: number };

/** Where to stand to set a piece down: beside the slot, on the side it's coming from. */
export const besideSlot = (it: SimItem) => (it.slot[0] < it.home[0] ? it.slot[0] + 120 : it.slot[0] - 120);

/** The default life: fetch and place every piece in order, rest every few, admire, reset. */
export function buildJobs(items: SimItem[], { restEvery = 3, finale = 'is-done' }: { restEvery?: number; finale?: string } = {}): Job[] {
  const jobs: Job[] = [];
  items.forEach((it, i) => {
    jobs.push({ kind: 'walk', x: it.home[0] }, { kind: 'pick', item: i }, { kind: 'walk', x: besideSlot(it) }, { kind: 'place', item: i });
    if ((i + 1) % restEvery === 0 && i < items.length - 1) jobs.push(i % 2 ? { kind: 'look', dur: 2.2 } : { kind: 'rest', dur: 1.8 });
  });
  jobs.push({ kind: 'flag', cls: finale, on: true }, { kind: 'rest', dur: 2.5 }, { kind: 'look', dur: 2.4 }, { kind: 'rest', dur: 3 });
  jobs.push({ kind: 'flag', cls: finale, on: false }, { kind: 'reset', dur: 1.8 });
  return jobs;
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const clamp = (t: number) => Math.max(0, Math.min(1, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function jobDuration(job: Job, x0: number): number {
  switch (job.kind) {
    case 'walk':
      return Math.abs(job.x - x0) / SPEED + 0.15;
    case 'pick':
      return 0.95;
    case 'place':
      return 0.9;
    case 'flag':
      return 0;
    default:
      return job.dur;
  }
}

export function ReefSim({
  items,
  jobs,
  start = 300,
  view,
  className,
  label,
  back,
  front,
  surface,
}: {
  items: SimItem[];
  jobs: Job[];
  start?: number;
  view?: string;
  className: string;
  label: string;
  /** Drawn behind everything that moves (the build site, the quarry). */
  back?: ReactNode;
  /** Drawn on top of everything (glows, school passing through). */
  front?: ReactNode;
  /** Start the water lower, under a wave line (see ReefBackdrop). */
  surface?: number;
}) {
  const root = useRef<SVGSVGElement>(null);
  const octo = useRef<SVGGElement>(null);
  const els = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    const svg = root.current;
    const body = octo.current;
    if (!svg || !body) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const pos: Vec[] = items.map((it) => [...it.home] as Vec);
    const rot: number[] = items.map(() => 0);
    const state: ('home' | 'carried' | 'placed')[] = items.map(() => 'home');
    let x = start;
    let facing = 1;
    let lookFrom = 1;
    let carry = -1;
    let pose = '';
    let j = -1;
    let jobStart = 0;
    let jobDur = 0;
    let fromX = x;
    let from: Vec = [0, 0];
    let fromRot = 0;
    let raf = 0;
    let running = true;
    let pausedAt = 0;

    const setPose = (p: string) => {
      if (p === pose) return;
      if (pose) body.classList.remove(pose);
      if (p) body.classList.add(p);
      pose = p;
    };
    const draw = (t: number) => {
      const bob = pose === 'is-walking' ? Math.sin(t * 9) * 2.5 : 0;
      body.setAttribute('transform', `translate(${x.toFixed(1)} ${(GROUND + bob).toFixed(1)}) scale(${facing} 1)`);
      items.forEach((_, i) => {
        if (state[i] === 'carried' && carry === i) pos[i] = [x, CARRY_Y + bob];
        els.current[i]?.setAttribute('transform', `translate(${pos[i][0].toFixed(1)} ${pos[i][1].toFixed(1)}) rotate(${rot[i].toFixed(1)})`);
      });
    };
    const settle = (i: number, placed: boolean) => {
      const el = els.current[i];
      el?.classList.toggle('is-placed', placed);
      if (items[i].marks) svg.classList.toggle(items[i].marks!, placed);
    };

    // Reduced motion: the finished build, the octopus resting beside it.
    if (still) {
      items.forEach((it, i) => {
        pos[i] = [...it.slot] as Vec;
        rot[i] = it.rot ?? 0;
        state[i] = 'placed';
        settle(i, true);
      });
      svg.classList.add('is-done');
      draw(0);
      return;
    }

    const next = (now: number) => {
      j = (j + 1) % jobs.length;
      const job = jobs[j];
      jobStart = now;
      fromX = x;
      jobDur = jobDuration(job, x);
      if (job.kind === 'pick' || job.kind === 'place') {
        from = [...pos[job.item]] as Vec;
        fromRot = rot[job.item];
      }
      if (job.kind === 'walk' && Math.abs(job.x - x) > 1) facing = job.x > x ? 1 : -1;
      if (job.kind === 'flag') svg.classList.toggle(job.cls, job.on);
      if (job.kind === 'dig') svg.classList.add('is-digging');
      if (job.kind === 'look') lookFrom = facing;
    };
    const finish = (job: Job) => {
      if (job.kind === 'pick') {
        state[job.item] = 'carried';
        carry = job.item;
      }
      if (job.kind === 'place') {
        state[job.item] = 'placed';
        pos[job.item] = [...items[job.item].slot] as Vec;
        rot[job.item] = items[job.item].rot ?? 0;
        carry = -1;
        settle(job.item, true);
      }
      if (job.kind === 'dig') svg.classList.remove('is-digging');
      if (job.kind === 'reset') {
        items.forEach((it, i) => {
          pos[i] = [...it.home] as Vec;
          rot[i] = 0;
          state[i] = 'home';
          settle(i, false);
          els.current[i]?.style.removeProperty('opacity');
        });
      }
    };

    // One frame: advance the current job by time, then draw.
    const tick = (now: number) => {
      if (!running) return;
      const t = now / 1000;
      if (j < 0) next(now);
      let job = jobs[j];
      let p = jobDur ? (now - jobStart) / 1000 / jobDur : 1;
      while (p >= 1) {
        finish(job);
        next(now);
        job = jobs[j];
        p = jobDur ? 0 : 1;
        if (job.kind !== 'flag') break;
      }
      const e = ease(clamp(p));
      switch (job.kind) {
        case 'walk':
          x = lerp(fromX, job.x, e);
          setPose(Math.abs(job.x - fromX) > 1 ? 'is-walking' : '');
          break;
        case 'pick': {
          setPose(p < 0.45 ? 'is-crouch' : '');
          const q = ease(clamp((p - 0.3) / 0.7));
          pos[job.item] = [lerp(from[0], x, q), lerp(from[1], CARRY_Y, q)];
          break;
        }
        case 'place': {
          setPose(p > 0.55 ? 'is-crouch' : '');
          const it = items[job.item];
          const q = e;
          const cy = Math.min(from[1], it.slot[1]) - 70;
          // An arc from overhead to the slot: a quadratic curve through a point above both.
          pos[job.item] = [
            (1 - q) ** 2 * from[0] + 2 * (1 - q) * q * ((from[0] + it.slot[0]) / 2) + q * q * it.slot[0],
            (1 - q) ** 2 * from[1] + 2 * (1 - q) * q * cy + q * q * it.slot[1],
          ];
          rot[job.item] = lerp(fromRot, it.rot ?? 0, q);
          state[job.item] = 'home';
          break;
        }
        case 'look':
          // Turn to look behind, then back.
          setPose('');
          facing = p > 0.33 && p < 0.66 ? -lookFrom : lookFrom;
          break;
        case 'dig':
          setPose(Math.floor(p * 8) % 2 ? 'is-crouch' : '');
          break;
        case 'reset':
          items.forEach((_, i) => {
            const el = els.current[i];
            if (el) el.style.opacity = String(p < 0.5 ? 1 - p * 2 : (p - 0.5) * 2);
            if (p >= 0.5 && state[i] !== 'home') {
              pos[i] = [...items[i].home] as Vec;
              rot[i] = 0;
              state[i] = 'home';
              settle(i, false);
            }
          });
          setPose('');
          break;
        default:
          setPose('');
      }
      draw(t);
      raf = requestAnimationFrame(tick);
    };

    // Pause off screen; on return, carry on from where it was.
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !running) {
        jobStart += performance.now() - pausedAt;
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!en.isIntersecting && running) {
        running = false;
        pausedAt = performance.now();
        cancelAnimationFrame(raf);
      }
    });
    io.observe(svg);
    draw(0);
    raf = requestAnimationFrame(tick);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [items, jobs, start]);

  const piece = (it: SimItem, i: number) => (
    <g key={i} ref={(el) => void (els.current[i] = el)} className="bs-sim-item" transform={`translate(${it.home[0]} ${it.home[1]})`}>
      {it.shape}
      <g className="bs-sim-puff">
        {[-14, -5, 5, 14].map((dx, k) => (
          <rect key={k} x={dx - 2} y={8} width={4} height={4} fill="#E3F4F0" transform={`rotate(45 ${dx} 10)`} style={{ ['--k' as string]: k }} />
        ))}
      </g>
    </g>
  );

  return (
    <svg ref={root} className={`bs-svg bs-fs bs-sim ${className}`} viewBox={view ?? '0 0 1200 560'} role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <ReefBackdrop kelp surface={surface} />
      {back}
      {items.map((it, i) => (!it.front ? piece(it, i) : null))}
      <g ref={octo} className="bs-sim-octo" transform={`translate(${start} ${GROUND})`}>
        <g className="bs-sim-octo-inner">
          <svg x={-OW / 2} y={-OH + 10} width={OW} height={OH} viewBox="0 0 480 360">
            <OctopusFigure items={{}} />
          </svg>
        </g>
      </g>
      {items.map((it, i) => (it.front ? piece(it, i) : null))}
      {front}
    </svg>
  );
}

