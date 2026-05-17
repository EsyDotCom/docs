import Link from 'next/link';
import { Eyebrow } from '@/components/Primitives';

const atlas = [
  {
    href: '/concepts/workflows',
    label: 'Concepts',
    title: 'Workflows',
    desc: 'Reusable templates that define intake, runtime steps, providers, quality gates, and budget policy.',
  },
  {
    href: '/concepts/runs',
    label: 'Concepts',
    title: 'Runs',
    desc: 'Durable execution records with per-step telemetry, provider settings, costs, and outcomes.',
  },
  {
    href: '/concepts/artifacts',
    label: 'Concepts',
    title: 'Artifacts',
    desc: 'Generated outputs — visual, video, research, or knowledge — with full provenance back to their run.',
  },
  {
    href: '/concepts/costs',
    label: 'Concepts',
    title: 'Costs',
    desc: 'Estimated, provider-reported, and reconciled cost states. Every number has a documented source.',
  },
  {
    href: '/api',
    label: 'Reference',
    title: 'API',
    desc: 'Runtime endpoints for creating runs, listing persisted outputs, and inspecting telemetry.',
  },
  {
    href: '/guides',
    label: 'Reference',
    title: 'Guides',
    desc: 'Step-by-step walkthroughs for the workflow templates running in production today.',
  },
];

const principles = [
  {
    n: '01',
    title: 'Structure over prompting',
    desc: 'Work begins with a workflow template — a structured intake designed for a specific artifact class. Not a chat box hoping for the right output.',
  },
  {
    n: '02',
    title: 'Artifacts over conversations',
    desc: 'Outputs are persisted with provenance, telemetry, and review state. A conversation can be the artifact; ephemeral chat history cannot.',
  },
  {
    n: '03',
    title: 'Ready-to-use over requires-editing',
    desc: 'Finished work, not rough drafts. Artifacts pass quality gates before they reach review or delivery.',
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

export default function Home() {
  return (
    <div className="content">
      <section className="heroSection">
        <div className="heroGrid" aria-hidden="true" />
        <div className="heroGlow" aria-hidden="true" />
        <div className="heroLeft">
          <h1>The reference for an artifact factory.</h1>
          <p className="heroLead">
            Esy automates the production of high-quality, reviewable artifacts. The reference covers the API
            contract, runtime semantics, cost accounting, and the workflow templates running in production today.
          </p>
          <div className="heroActions">
            <Link className="buttonPrimary" href="/api">
              API reference <Arrow />
            </Link>
            <Link className="buttonSecondary" href="/concepts/workflows">
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
              <span className="tokenStr">&quot;generate-clip-art-asset&quot;</span>
              <span className="tokenPunct">,</span>
              {'\n  '}
              <span className="tokenKey">&quot;intake&quot;</span>
              <span className="tokenPunct">:</span> <span className="tokenPunct">{'{'}</span>
              {'\n    '}
              <span className="tokenKey">&quot;intent&quot;</span>
              <span className="tokenPunct">:</span> <span className="tokenPunct">{'{'}</span>
              {'\n      '}
              <span className="tokenKey">&quot;prompt&quot;</span>
              <span className="tokenPunct">:</span>{' '}
              <span className="tokenStr">&quot;a chipmunk family in a nest&quot;</span>
              <span className="tokenPunct">,</span>
              {'\n      '}
              <span className="tokenKey">&quot;style&quot;</span>
              <span className="tokenPunct">:</span>{' '}
              <span className="tokenStr">&quot;cartoon&quot;</span>
              <span className="tokenPunct">,</span>
              {'\n      '}
              <span className="tokenKey">&quot;aspectRatio&quot;</span>
              <span className="tokenPunct">:</span>{' '}
              <span className="tokenStr">&quot;1:1&quot;</span>
              {'\n    '}
              <span className="tokenPunct">{'}'}</span>
              <span className="tokenPunct">,</span>
              {'\n    '}
              <span className="tokenKey">&quot;runtime&quot;</span>
              <span className="tokenPunct">:</span> <span className="tokenPunct">{'{'}</span>
              {'\n      '}
              <span className="tokenKey">&quot;backgroundRemovalEnabled&quot;</span>
              <span className="tokenPunct">:</span> <span className="tokenBool">true</span>
              {'\n    '}
              <span className="tokenPunct">{'}'}</span>
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
            <span>42.1s runtime</span>
            <span className="sep">·</span>
            <span>$0.053 estimated</span>
          </div>
        </aside>
      </section>

      <section>
        <div className="sectionHead">
          <Eyebrow>Reference atlas</Eyebrow>
          <h2>The primitives that make Esy measurable.</h2>
          <p className="sectionLead">
            Six entries define the surface area. Read these first; everything else is a specialization.
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
