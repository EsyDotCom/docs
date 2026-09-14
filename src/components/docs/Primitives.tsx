import type { ReactNode } from 'react';

/**
 * The docs authoring toolkit.
 *
 * Every page is hand-written JSX, so this file is the vocabulary those pages
 * write in. A primitive belongs here when the same shape appears on three or
 * more pages; anything rarer stays local to its page. Styling lives in
 * docs-theme.css against the class names below — no inline styles, so a theme
 * change is one file.
 */

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="lead">{children}</p>;
}

/**
 * Page masthead. `opener` names a transparent cutout in public/brand/docs —
 * it is decorative (hence aria-hidden) and is omitted on reference pages,
 * which are scanned rather than read.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  opener,
}: {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  opener?: string;
}) {
  return (
    <header className={`pageHead${opener ? ' pageHeadArt' : ''}`}>
      <div className="heroGrid" aria-hidden="true" />
      <div className="pageHeadText">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        {lead && <Lead>{lead}</Lead>}
      </div>
      {opener && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          className="pageHeadOpener"
          src={`/brand/docs/${opener}.webp`}
          alt=""
          aria-hidden="true"
          width={900}
          height={600}
          loading="eager"
        />
      )}
    </header>
  );
}

/**
 * Aside. `tone` carries the meaning — a warning and a tip must not look alike,
 * because readers skim callouts before they read them.
 */
export function Callout({
  title,
  tone = 'note',
  children,
}: {
  title: string;
  tone?: 'note' | 'tip' | 'warning' | 'danger';
  children: ReactNode;
}) {
  return (
    <div className={`callout callout-${tone}`} role="note">
      <div className="calloutBody">
        <strong>{title}</strong>
        <div className="calloutText">{children}</div>
      </div>
    </div>
  );
}

export function CodeBlock({
  title,
  language,
  children,
}: {
  title?: string;
  language?: string;
  children: string;
}) {
  return (
    <div className="codeBlock">
      {title && (
        <div className="apiHeader">
          <span className="apiDots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="apiTitle">{title}</span>
          {language && <span className="apiMeta">{language}</span>}
        </div>
      )}
      <pre>
        <code>{children.trim()}</code>
      </pre>
    </div>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Field reference — the shape every intake schema and response body is
 * documented in. `required` is rendered as a word, not a symbol: an asterisk
 * means nothing to a reader who has not found the legend.
 */
export function PropertyTable({
  rows,
}: {
  rows: { name: string; type: string; required?: boolean; desc: ReactNode }[];
}) {
  return (
    <div className="tableWrap">
      <table className="table propTable">
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td>
                <code className="propName">{r.name}</code>
              </td>
              <td>
                <span className="propType">{r.type}</span>
              </td>
              <td>
                {r.required ? (
                  <span className="propReq">required</span>
                ) : (
                  <span className="propOpt">optional</span>
                )}
              </td>
              <td>{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const METHOD_CLASS: Record<string, string> = {
  GET: 'endpointGet',
  POST: 'endpointPost',
  PATCH: 'endpointPatch',
  PUT: 'endpointPatch',
  DELETE: 'endpointDelete',
};

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export function EndpointList({
  items,
}: {
  items: { method: HttpMethod; path: string; desc: ReactNode }[];
}) {
  return (
    <div className="endpointList">
      {items.map((item) => (
        <div key={`${item.method} ${item.path}`} className="endpointRow">
          <span className={`endpointMethod ${METHOD_CLASS[item.method] ?? ''}`}>{item.method}</span>
          <span className="endpointPath">{item.path}</span>
          <span className="endpointDesc">{item.desc}</span>
        </div>
      ))}
    </div>
  );
}

/** One endpoint, documented in full. The anchor id makes it linkable from the TOC. */
export function Endpoint({
  method,
  path,
  title,
  children,
}: {
  method: HttpMethod;
  path: string;
  title: string;
  children: ReactNode;
}) {
  const id = `${method.toLowerCase()}-${path.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')}`;
  return (
    <section className="endpointCard" id={id}>
      <h3 className="endpointCardHead">
        <span className={`endpointMethod ${METHOD_CLASS[method] ?? ''}`}>{method}</span>{' '}
        <code className="endpointCardPath">{path}</code>
      </h3>
      <p className="endpointCardTitle">{title}</p>
      {children}
    </section>
  );
}

export function StepList({ items }: { items: { name: string; desc: ReactNode }[] }) {
  return (
    <ol className="stepList">
      {items.map((item) => (
        <li key={item.name} className="stepItem">
          <span className="stepName">{item.name}</span>
          <div className="stepDesc">{item.desc}</div>
        </li>
      ))}
    </ol>
  );
}

/**
 * Status pill. Six pages document a state machine, and colour is how a reader
 * tells a terminal success from a terminal failure at a glance.
 */
export function Status({
  value,
  tone = 'neutral',
}: {
  value: string;
  tone?: 'neutral' | 'good' | 'warn' | 'bad' | 'active';
}) {
  return <span className={`statusPill statusPill-${tone}`}>{value}</span>;
}

/** Closing summary. Styling already existed in docs-theme.css with no component. */
export function Takeaways({ items }: { items: ReactNode[] }) {
  return (
    <div className="docs-takeaways">
      <strong>In short</strong>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/** Left-to-right stage strip. Also had orphan CSS before this component existed. */
export function Pipeline({ steps }: { steps: { name: string; desc?: ReactNode }[] }) {
  return (
    <div className="pipeline">
      {steps.map((s) => (
        <div key={s.name} className="pipelineStep">
          <span className="pipelineName">{s.name}</span>
          {s.desc && <span className="pipelineDesc">{s.desc}</span>}
        </div>
      ))}
    </div>
  );
}

/**
 * Diagram frame for the hand-authored inline SVGs.
 *
 * The SVG is authored against the theme tokens (see `.dg-*` rules in
 * docs-theme.css) so one drawing serves light and dark. `minWidth` keeps a
 * wide diagram legible on a phone by scrolling it inside this frame rather
 * than shrinking the labels to nothing — the page itself never scrolls
 * sideways.
 */
export function Diagram({
  title,
  caption,
  minWidth = 720,
  children,
}: {
  title: string;
  caption?: ReactNode;
  minWidth?: number;
  children: ReactNode;
}) {
  return (
    <figure className="diagram">
      <div className="diagramPlate">
        <div className="diagramScroll" style={{ ['--dg-min' as string]: `${minWidth}px` }}>
          {children}
        </div>
      </div>
      {caption && (
        <figcaption className="diagramCaption">
          <span className="diagramTitle">{title}</span>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Shared arrowhead defs for every Diagram on a page. Markers cannot inherit the
 * referencing path's stroke, so there is one marker per semantic colour. Render
 * this once per page, above the first diagram.
 */
export function DiagramDefs() {
  return (
    <svg width="0" height="0" className="diagramDefs" aria-hidden="true" focusable="false">
      <defs>
        {[
          ['dg-ar', 'dg-mk'],
          ['dg-ar-accent', 'dg-mk-accent'],
          ['dg-ar-bad', 'dg-mk-bad'],
          ['dg-ar-warn', 'dg-mk-warn'],
        ].map(([id, cls]) => (
          <marker
            key={id}
            id={id}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,1 L9,5 L0,9 z" className={cls} />
          </marker>
        ))}
      </defs>
    </svg>
  );
}
