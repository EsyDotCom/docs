import type { ReactNode } from 'react';

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="lead">{children}</p>;
}

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: ReactNode;
}) {
  return (
    <header className="pageHead">
      <div className="heroGrid" aria-hidden="true" />
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      {lead && <Lead>{lead}</Lead>}
    </header>
  );
}

export function Callout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="callout" role="note">
      <div className="calloutBody">
        <strong>{title}</strong>
        <p>{children}</p>
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

export function Table({
  head,
  rows,
}: {
  head: string[];
  rows: ReactNode[][];
}) {
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

export function EndpointList({
  items,
}: {
  items: { method: 'GET' | 'POST' | 'PATCH' | 'DELETE'; path: string; desc: ReactNode }[];
}) {
  return (
    <div className="endpointList">
      {items.map((item) => (
        <div key={`${item.method} ${item.path}`} className="endpointRow">
          <span
            className={`endpointMethod${item.method === 'GET' ? ' endpointGet' : ''}`}
          >
            {item.method}
          </span>
          <span className="endpointPath">{item.path}</span>
          <span className="endpointDesc">{item.desc}</span>
        </div>
      ))}
    </div>
  );
}

export function StepList({
  items,
}: {
  items: { name: string; desc: ReactNode }[];
}) {
  return (
    <ol className="stepList" style={{ listStyle: 'none', paddingLeft: 0 }}>
      {items.map((item) => (
        <li key={item.name} className="stepItem">
          <span className="stepName">{item.name}</span>
          <p className="stepDesc">{item.desc}</p>
        </li>
      ))}
    </ol>
  );
}
