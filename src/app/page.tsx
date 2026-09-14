import Link from 'next/link';

import { Eyebrow } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Esy API documentation',
  description:
    'Run declared workflows against api.esy.com and get durable artifacts back, with provenance, quality gates, and itemised cost.',
};

/**
 * Three entry paths, in reading order. A reader arrives wanting to build
 * something, understand something, or look something up — this hub is arranged
 * by that intent rather than by how the system is structured internally.
 */
const paths = [
  {
    href: '/quickstart',
    label: 'Start here',
    title: 'Quickstart',
    desc: 'Four curl commands from an empty shell to a finished image. Real requests, real responses.',
  },
  {
    href: '/how-esy-works',
    label: 'Start here',
    title: 'How Esy works',
    desc: 'The whole system on one page — the five nouns, what happens inside a run, and where cost is counted.',
  },
  {
    href: '/api',
    label: 'Start here',
    title: 'API conventions',
    desc: 'Base URL, auth, casing, ids, pagination, idempotency. Everything true of every endpoint.',
  },
];

const atlas = [
  {
    href: '/concepts/workflows',
    label: 'Concepts',
    title: 'Workflows',
    desc: 'The versioned definition a run executes — intake, steps, bindings, gates, and declared output.',
  },
  {
    href: '/concepts/intake',
    label: 'Concepts',
    title: 'Intake',
    desc: 'The inputs a workflow accepts, and why they ask for outcomes rather than mechanisms.',
  },
  {
    href: '/concepts/runs',
    label: 'Concepts',
    title: 'Runs and steps',
    desc: 'Nine statuses, per-step telemetry, and how steps bind to models through roles.',
  },
  {
    href: '/concepts/gates-and-review',
    label: 'Concepts',
    title: 'Gates and review',
    desc: 'Quality gates, the escalation ladder, the human review queue, and typed holds.',
  },
  {
    href: '/concepts/artifacts',
    label: 'Concepts',
    title: 'Artifacts',
    desc: 'What a run produced, with its QA record, cost ledger, and provenance back to the run.',
  },
  {
    href: '/concepts/costs',
    label: 'Concepts',
    title: 'Costs and budgets',
    desc: 'Three cost states, how spend rolls up, and how a budget refuses a run before it spends.',
  },
  {
    href: '/concepts/versioning',
    label: 'Concepts',
    title: 'Versioning',
    desc: 'Immutable versions, a movable live pointer, and the frozen spec each run pins.',
  },
  {
    href: '/concepts/orders',
    label: 'Concepts',
    title: 'Generation Orders',
    desc: 'One workflow fanned into N child runs with variation, dedupe keys, and a budget cap.',
  },
  {
    href: '/concepts/source-policies',
    label: 'Concepts',
    title: 'Source policies',
    desc: 'Which approved sources a subject may be researched from, what each covers, and where it stops.',
  },
  {
    href: '/errors',
    label: 'Reference',
    title: 'Errors',
    desc: 'Every status code with the real response body, what causes it, and how to fix it.',
  },
  {
    href: '/api/run-events',
    label: 'Reference',
    title: 'Run events (SSE)',
    desc: 'Stream a run instead of polling it — snapshot on connect, then every transition.',
  },
  {
    href: '/glossary',
    label: 'Reference',
    title: 'Glossary',
    desc: 'Every term in a sentence, including the names the code uses when they differ.',
  },
];

const principles = [
  {
    n: '01',
    title: 'Structure over prompting',
    desc: 'You pick a workflow and fill in its declared intake. There is no prompt box hoping for the right output.',
  },
  {
    n: '02',
    title: 'Artifacts over conversations',
    desc: 'Every output is persisted with its provenance, telemetry, and review state. Nothing that matters is ephemeral.',
  },
  {
    n: '03',
    title: 'Gated, not hopeful',
    desc: 'Work is judged before it reaches you, and a check only counts if something actually measured it.',
  },
];

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
      <path
        d="M3.5 8h9M8.5 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DocsHome() {
  return (
    <div className="content">
      <section className="heroSection">
        <div className="heroGrid" aria-hidden="true" />
        <div className="heroGlow" aria-hidden="true" />
        <div className="heroLeft">
          <h1>Run a workflow. Keep the receipt.</h1>
          <p className="heroLead">
            Esy executes declared workflows and returns durable artifacts — with the provenance, the
            quality checks, and the itemised cost that produced them. These docs are written for someone
            with an API key and a terminal.
          </p>
          <div className="heroActions">
            <Link className="buttonPrimary" href="/quickstart">
              Quickstart <Arrow />
            </Link>
            <Link className="buttonSecondary" href="/how-esy-works">
              How Esy works
            </Link>
          </div>
        </div>

        <aside className="apiPreview" aria-label="Example API request">
          <div className="apiHeader">
            <span className="apiDots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="apiTitle">
              <span className="methodBadge">POST</span>
              /v1/runs
            </span>
            <span className="apiMeta">api · v1</span>
          </div>
          <pre className="apiBody">
            <code>
              <span className="tokenPunct">{'{'}</span>
              {'\n  '}
              <span className="tokenKey">&quot;templateId&quot;</span>
              <span className="tokenPunct">:</span>{' '}
              <span className="tokenStr">&quot;generate-illustration&quot;</span>
              <span className="tokenPunct">,</span>
              {'\n  '}
              <span className="tokenKey">&quot;intake&quot;</span>
              <span className="tokenPunct">:</span> <span className="tokenPunct">{'{'}</span>
              {'\n    '}
              <span className="tokenKey">&quot;prompt&quot;</span>
              <span className="tokenPunct">:</span>{' '}
              <span className="tokenStr">&quot;a lighthouse at dusk, storm rolling in&quot;</span>
              <span className="tokenPunct">,</span>
              {'\n    '}
              <span className="tokenKey">&quot;style&quot;</span>
              <span className="tokenPunct">:</span> <span className="tokenStr">&quot;flat&quot;</span>
              <span className="tokenPunct">,</span>
              {'\n    '}
              <span className="tokenKey">&quot;aspectRatio&quot;</span>
              <span className="tokenPunct">:</span> <span className="tokenStr">&quot;4:3&quot;</span>
              <span className="tokenPunct">,</span>
              {'\n    '}
              <span className="tokenKey">&quot;categories&quot;</span>
              <span className="tokenPunct">:</span>{' '}
              <span className="tokenStr">&quot;landscapes&quot;</span>
              {'\n  '}
              <span className="tokenPunct">{'}'}</span>
              {'\n'}
              <span className="tokenPunct">{'}'}</span>
            </code>
          </pre>
          <div className="apiFooter">
            <strong>
              <span className="statusDot" aria-hidden="true" />
              201 created
            </strong>
            <span className="sep">·</span>
            <span>16.1s runtime</span>
            <span className="sep">·</span>
            <span>$0.0077 actual</span>
          </div>
        </aside>
      </section>

      <section>
        <div className="sectionHead">
          <Eyebrow>New here</Eyebrow>
          <h2>Three pages, in this order.</h2>
          <p className="sectionLead">
            Make something work first, then understand why it worked, then look up the details. About
            five minutes each.
          </p>
        </div>

        <div className="atlasGrid">
          {paths.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="atlasCard"
              data-index={String(i + 1).padStart(2, '0')}
            >
              <span className="atlasCardLabel">{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span className="atlasArrow">
                Read <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="sectionHead">
          <Eyebrow>Reference atlas</Eyebrow>
          <h2>The nouns everything else is built from.</h2>
          <p className="sectionLead">
            A <strong>workspace</strong> holds projects. A <strong>workflow</strong> is a versioned
            definition. A <strong>run</strong> is one execution of it, and an <strong>artifact</strong>{' '}
            is what it produced. Everything below is a detail of one of those.
          </p>
        </div>

        <div className="atlasGrid">
          {atlas.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="atlasCard"
              data-index={String(i + 1).padStart(2, '0')}
            >
              <span className="atlasCardLabel">{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span className="atlasArrow">
                Read <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="sectionHead">
          <Eyebrow>Operating principles</Eyebrow>
          <h2>How Esy thinks about producing output.</h2>
        </div>

        <div className="principleStrip">
          {principles.map((p) => (
            <div key={p.n} className="principleItem">
              <span className="principleNumber">{p.n}</span>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
