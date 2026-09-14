import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import {
  Callout,
  CodeBlock,
  EndpointList,
  PageHeader,
  Table,
  Takeaways,
} from '@/components/docs/Primitives';

export const metadata = {
  title: 'API conventions',
  description:
    'Base URL, versioning, casing, id formats, pagination, idempotency, and the shape every Esy endpoint shares.',
};

const envelope = `{
  "items": [ … ],
  "total": 128
}`;

const idempotent = `// Safe: reads can be retried freely.
GET /v1/runs/run-fb0677b2

// Not safe to blind-retry: a second call starts a second run and bills twice.
POST /v1/runs`;

export default function ApiConventionsPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="API reference · Conventions"
        title="API conventions"
        lead={
          <>
            Everything that is true of every endpoint, in one place, so the individual reference pages can
            stay short. Read this once and the rest of the API stops surprising you.
          </>
        }
      />

      <h2>Base URL and versioning</h2>
      <p>
        Every endpoint lives under <code>/v1</code>.
      </p>

      <CodeBlock title="base" language="text">
        {`https://api.esy.com/v1`}
      </CodeBlock>

      <p>
        The version is in the path, and a breaking change means a new path — <code>/v1</code> will not
        change shape under you. Additive changes, such as a new field in a response, happen within{' '}
        <code>/v1</code>, so parse responses tolerantly and ignore fields you do not recognise.
      </p>

      <h2>Authentication</h2>
      <p>
        One bearer token on every request. See <Link href="/authentication">Authentication</Link>.
      </p>

      <CodeBlock title="header" language="text">
        {`Authorization: Bearer esy_sk_…`}
      </CodeBlock>

      <h2>Casing</h2>
      <p>
        The wire format is <strong>camelCase</strong> in both directions —{' '}
        <code>templateId</code>, <code>workspaceId</code>, <code>actualCostUsd</code>. The Python service
        behind it uses snake_case internally, which occasionally leaks into an error message; the
        documented contract is camelCase.
      </p>

      <h2>Identifiers</h2>
      <p>
        Most ids are prefixed, which means you can tell what an id refers to without context — useful in
        logs.
      </p>

      <Table
        head={['Object', 'Format', 'Example']}
        rows={[
          ['Run', <code key="a">run-</code>, <code key="a2">run-fb0677b2</code>],
          ['Artifact', <code key="b">artifact-</code>, <code key="b2">artifact-5a6a9501</code>],
          ['Step', <code key="c">step-</code>, <code key="c2">step-3b</code>],
          ['Order', <code key="d">order-</code>, <code key="d2">order-1f2e3d4c</code>],
          ['Budget', <code key="e">budget-</code>, <code key="e2">budget-7a1c…</code>],
          ['Workspace / project', 'UUID', <code key="f2">9a1b6d4c-d1dc-…</code>],
          [
            'Workflow',
            'human slug',
            <code key="g2">generate-illustration</code>,
          ],
        ]}
      />

      <Callout title="Workflow ids are slugs, not opaque handles" tone="note">
        A workflow id is a readable, stable slug you can hard-code. It is never reused for a different
        workflow, so pinning one in your source is safe.
      </Callout>

      <h2>Pagination</h2>
      <p>
        List endpoints return an envelope with <code>items</code> and <code>total</code>, and take{' '}
        <code>offset</code> and <code>limit</code> query parameters. <code>limit</code> is capped at{' '}
        <strong>100</strong>.
      </p>

      <CodeBlock title="list envelope" language="json">
        {envelope}
      </CodeBlock>

      <Callout title="Pagination is not universal" tone="warning">
        Some endpoints take no <code>offset</code>/<code>limit</code> at all and return everything, and a
        few use a cursor instead. Check the page for the endpoint you are calling rather than assuming.
        Where you see <code>total</code>, it is the count of matching records, not the count in this
        page.
      </Callout>

      <h2>Filtering</h2>
      <p>
        Most list endpoints accept <code>workspaceId</code> and <code>projectId</code>, and collection
        endpoints for runs also accept <code>status</code>. Some require <code>workspaceId</code>
        outright — omitting it returns a <code>422</code> naming the missing query parameter.
      </p>

      <h2>Idempotency</h2>
      <p>
        There is no server-side idempotency yet. <code>POST /v1/runs</code> creates a run every time it
        is called, so a client that retries after a timeout can start — and pay for — the same work
        twice.
      </p>

      <CodeBlock title="what is safe to retry" language="text">
        {idempotent}
      </CodeBlock>

      <p>
        If a run creation times out, list recent runs and look for yours before retrying. For batch work,
        prefer <Link href="/concepts/orders">Generation Orders</Link>, which carry an{' '}
        <code>orderDedupeKey</code> so duplicate items collapse rather than multiply.
      </p>

      <h2>Errors</h2>
      <p>
        Every error body has a top-level <code>detail</code>, which may be a string, an object, or an
        array. <Link href="/errors">Errors</Link> covers each code with real responses.
      </p>

      <h2>Rate limits</h2>
      <p>
        None are enforced per key today, and no rate-limit headers are returned. Do not take that as
        licence to hammer the API: bound your own concurrency, especially when fanning out runs. Use an
        order rather than a thousand parallel <code>POST</code>s.
      </p>

      <h2>The endpoints you will use most</h2>
      <EndpointList
        items={[
          {
            method: 'GET',
            path: '/v1/catalog/workflows',
            desc: 'Browse runnable workflows. Public — no key needed.',
          },
          { method: 'POST', path: '/v1/runs', desc: 'Start a run.' },
          { method: 'GET', path: '/v1/runs/{run_id}', desc: 'Read a run and its step telemetry.' },
          {
            method: 'GET',
            path: '/v1/runs/{run_id}/events',
            desc: 'Stream a run over SSE instead of polling.',
          },
          { method: 'GET', path: '/v1/artifacts/{artifact_id}', desc: 'Read an artifact.' },
          { method: 'POST', path: '/v1/orders', desc: 'Plan a batch of runs.' },
          { method: 'GET', path: '/v1/queue', desc: 'See what is waiting on a human.' },
          { method: 'GET', path: '/v1/costs', desc: 'Aggregate spend.' },
        ]}
      />

      <h2>The full surface</h2>
      <p>
        The API is considerably larger than these docs cover — publications, outlets, workers, documents,
        media, finance. The authoritative list is the OpenAPI document, which is generated from the
        routers and therefore cannot drift:
      </p>

      <CodeBlock title="machine-readable spec" language="text">
        {`https://api.esy.com/openapi.json`}
      </CodeBlock>

      <p>
        These pages document the parts that are stable and that an external caller needs. If something
        appears in the spec but not here, treat it as internal and subject to change.
      </p>

      <Takeaways
        items={[
          <>
            Everything is under <code>/v1</code>, camelCase both ways, bearer auth on every call.
          </>,
          <>
            Lists return <code>{'{ items, total }'}</code> with <code>offset</code>/<code>limit</code>,
            capped at 100 — but not every endpoint paginates.
          </>,
          <>
            No idempotency keys: never blind-retry a <code>POST /v1/runs</code>.
          </>,
          <>
            <code>openapi.json</code> is the authoritative surface; these pages are the curated part.
          </>,
        ]}
      />
    </DocsPageShell>
  );
}
