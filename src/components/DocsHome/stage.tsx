'use client';

import { useEffect, useState } from 'react';

import { FIRST_RUN, PAGE_COUNT, SECTION_COUNT, SUGGESTIONS, secs, usd } from './data';
import { artifactResponse, createResponse, createRun, finishedRun, getArtifact, pollRun } from '@/lib/quickstart-calls';
import { Code, SearchIcon } from './shared';
import './replay.css';

// ───────────────────────────────────────────────────────────────────────────
// C · Replay's parts, shared with the merges that reuse them (D and E): the
// hero's headline and search, and the replay of the quickstart's real run.
// ───────────────────────────────────────────────────────────────────────────

/** Headline left, search right: both on the first screen, with the replay under them. */
export function StageHero({ onFind }: { onFind: (q?: string) => void }) {
  return (
    <div className="rp-hero-in">
      <div className="rp-hero-copy">
        <p className="fo-eyebrow rp-eyebrow">Esy docs · API v1</p>
        <h1 className="fo-h1 rp-h1">
          AI marketing production,
          <br />
          <em>through one API.</em>
        </h1>
        <p className="fo-hero-lede">Brief in, approved assets out. Every image, video and post checked, costed and traceable.</p>
      </div>

      <div className="rp-hero-find">
        <p className="rp-find-label">Looking for something?</p>
        <button type="button" className="rp-search" onClick={() => onFind()}>
          <SearchIcon />
          <span>
            Search {PAGE_COUNT} pages and {SECTION_COUNT} sections
          </span>
          <kbd>⌘K</kbd>
        </button>
        <p className="rp-try">
          <span>Try</span>
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => onFind(s)}>
              {s}
            </button>
          ))}
        </p>
      </div>
    </div>
  );
}

// ── The replay ─────────────────────────────────────────────────────────────

const CHAPTERS = [
  { label: 'Start a run', beat: 'You post a workflow and its intake. Esy answers at once: pending.', ms: 3400 },
  { label: 'It runs', beat: 'Each step calls its model, and every call lands in the cost ledger.', ms: 5200 },
  { label: 'It’s checked', beat: 'A text gate checks the picture against its text policy before it’s stored.', ms: 3400 },
  { label: 'You get the file', beat: 'Read the artifact: the file, its QA record, and the run that made it.', ms: 6400 },
];
const TOTAL = CHAPTERS.reduce((n, c) => n + c.ms, 0);

// Where each step ends on the run's own clock (its durations, back to back).
const STEP_ENDS = FIRST_RUN.steps.reduce<number[]>((ends, s) => [...ends, (ends.at(-1) ?? 0) + s.durationMs], []);
const MODEL_DONE = STEP_ENDS[1]; // render + classify: chapter 2 covers these

/** Replay time → which chapter, how far into it, and where the real run would be. */
function at(t: number) {
  let acc = 0;
  let ch = CHAPTERS.length - 1;
  let f = 1;
  for (let i = 0; i < CHAPTERS.length; i++) {
    if (t < acc + CHAPTERS[i].ms) {
      ch = i;
      f = Math.max(0, (t - acc) / CHAPTERS[i].ms);
      break;
    }
    acc += CHAPTERS[i].ms;
  }
  const runMs =
    ch === 0 ? 0 : ch === 1 ? f * MODEL_DONE : ch === 2 ? MODEL_DONE + f * (FIRST_RUN.durationMs - MODEL_DONE) : FIRST_RUN.durationMs;
  return { ch, f, runMs };
}

export function Replay({ className = '' }: { className?: string }) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);

  // Reduced motion: no replay, just the end of the story.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setT(TOTAL);
      setPlaying(false);
    }
  }, []);

  // The clock: advance with the frame while playing.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = now - prev;
      prev = now;
      setT((x) => Math.min(TOTAL, x + dt));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(() => {
    if (t >= TOTAL) setPlaying(false);
  }, [t]);

  const { ch, f, runMs } = at(t);
  const allDone = runMs >= STEP_ENDS.at(-1)!;
  const status = ch === 0 ? (f < 0.35 ? 'sending' : 'pending') : allDone ? 'completed' : 'running';
  const spent = allDone ? FIRST_RUN.costUsd : FIRST_RUN.steps.reduce((n, s, i) => (runMs >= STEP_ENDS[i] ? n + s.costUsd : n), 0);
  const elapsed = allDone ? FIRST_RUN.durationMs : runMs;
  const ended = t >= TOTAL;

  // Jump to a chapter's start and play on from there.
  const jump = (i: number) => {
    setT(CHAPTERS.slice(0, i).reduce((n, c) => n + c.ms, 0));
    setPlaying(true);
  };

  return (
    <div className={`rp-stage ${className}`}>
      <div className="rp-stage-top">
        <div className="fo-chapters rp-chapters" role="tablist" aria-label="The run, step by step">
          {CHAPTERS.map((c, i) => (
            <button
              key={c.label}
              role="tab"
              aria-selected={i === ch}
              className={i === ch ? 'is-on' : i < ch ? 'is-done' : ''}
              onClick={() => jump(i)}
              style={{ ['--fill' as string]: i < ch ? 1 : i === ch ? f : 0 }}
            >
              <small>{i + 1}</small>
              {c.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="rp-play"
          onClick={() => (ended ? jump(0) : setPlaying(!playing))}
          aria-label={ended ? 'Play again' : playing ? 'Pause' : 'Play'}
        >
          {ended ? '↺ Play again' : playing ? 'Pause' : 'Play'}
        </button>
      </div>
      <p className="fo-beat-line rp-beat" aria-live="polite">
        {CHAPTERS[ch].beat}
      </p>

      <div className="fo-device rp-device">
        <div className="fo-device-bar">
          <span className="rp-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="fo-device-url">
            api.esy.com/v1/{ch === 3 ? `artifacts/${FIRST_RUN.artifactId}` : ch === 0 ? 'runs' : `runs/${FIRST_RUN.id}`}
          </span>
          <span className="fo-device-tag">
            <span className={`fo-live ${playing ? '' : 'is-idle'}`} />
            Replay
          </span>
        </div>
        <div className="fo-device-screen rp-screen">
          <Terminal ch={ch} f={f} status={status} elapsed={elapsed} />
          {ch === 3 ? <FileCard f={f} /> : <RunCard status={status} runMs={runMs} elapsed={elapsed} spent={spent} />}
        </div>
      </div>
      <p className="rp-caption">
        A replay of <code>{FIRST_RUN.id}</code> from the quickstart, sped up: its real requests and responses, its
        step times and costs, and the file it stored.
      </p>
    </div>
  );
}

/** The left half: the call this chapter makes, and what came back. */
function Terminal({ ch, f, status, elapsed }: { ch: number; f: number; status: string; elapsed: number }) {
  const call =
    ch === 0
      ? { label: 'POST /v1/runs', code: createRun, reply: f > 0.35 ? createResponse : null, replyLabel: '201 Created' }
      : ch === 3
        ? { label: 'GET /v1/artifacts/{artifact_id}', code: getArtifact, reply: artifactResponse, replyLabel: '200 OK' }
        : { label: 'GET /v1/runs/{run_id}', code: pollRun, reply: status === 'completed' ? finishedRun : null, replyLabel: '200 OK' };

  return (
    <div className="rp-term is-night">
      <div className="rp-term-bar">
        <b>{call.label}</b>
      </div>
      <Code code={call.code} lang="bash" className="rp-term-req" />
      <div className="rp-term-reply">
        {call.reply ? (
          <>
            <span className="rp-term-status">
              <i /> {call.replyLabel}
            </span>
            <Code code={call.reply} lang="json" />
          </>
        ) : (
          <span className="rp-term-wait">
            <span className="fo-live" />
            {ch === 0 ? 'sending…' : `status: "${status}" · ${secs(elapsed)}`}
          </span>
        )}
      </div>
    </div>
  );
}

/** The right half while it runs: the run, its steps, the clock and the spend. */
function RunCard({ status, runMs, elapsed, spent }: { status: string; runMs: number; elapsed: number; spent: number }) {
  return (
    <div className="rp-run">
      <div className="rp-run-head">
        <div>
          <span className="fo-label">Generate Illustration</span>
          <p className="rp-run-id">{FIRST_RUN.id}</p>
        </div>
        <span className={`rp-pill is-${status}`}>{status === 'sending' ? '—' : status}</span>
      </div>
      <p className="rp-run-intake">“{FIRST_RUN.prompt}”</p>
      <ol className="rp-steps">
        {FIRST_RUN.steps.map((s, i) => {
          const start = i === 0 ? 0 : STEP_ENDS[i - 1];
          const state = status === 'pending' || status === 'sending' ? 'wait' : runMs >= STEP_ENDS[i] ? 'done' : runMs >= start ? 'live' : 'wait';
          return (
            <li key={s.name} className={`is-${state}`}>
              <span className="rp-step-dot" />
              <span className="rp-step-main">
                <b>
                  {s.name}
                  {s.gate && state === 'done' && <em> passed</em>}
                </b>
                <small>{s.who}</small>
              </span>
              <span className="rp-step-num">{state === 'done' ? secs(s.durationMs) : state === 'live' ? '…' : ''}</span>
              <span className="rp-step-num">{state === 'done' && s.costUsd ? usd(s.costUsd) : ''}</span>
            </li>
          );
        })}
      </ol>
      <dl className="rp-run-totals">
        <div>
          <dt>Elapsed</dt>
          <dd>{secs(elapsed)}</dd>
        </div>
        <div className={status === 'completed' ? 'is-you' : ''}>
          <dt>Spent</dt>
          <dd>{usd(spent)}</dd>
        </div>
        <div>
          <dt>Cost state</dt>
          <dd className="rp-small">{status === 'completed' ? 'provider_reported' : 'estimated'}</dd>
        </div>
      </dl>
    </div>
  );
}

/** The right half at the end: the file, and what the artifact says about it. */
function FileCard({ f }: { f: number }) {
  return (
    <div className="rp-file" style={{ ['--in' as string]: Math.min(1, f * 3) }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={FIRST_RUN.image} alt={FIRST_RUN.title} />
      <div className="rp-file-meta">
        <b>{FIRST_RUN.title}</b>
        <span>
          {FIRST_RUN.artifactId} · visual / illustration · v1 · text gate passed · {usd(FIRST_RUN.costUsd)} ·{' '}
          {secs(FIRST_RUN.durationMs)}
        </span>
      </div>
    </div>
  );
}
