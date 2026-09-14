import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import {
  Callout,
  CodeBlock,
  Endpoint,
  EndpointList,
  PageHeader,
  PropertyTable,
  Status,
  Table,
} from '@/components/docs/Primitives';

export const metadata = {
  title: 'Orders API',
  description:
    'Plan a batch of runs, read its estimate, start it, retry failures, and accept a short settle.',
};

const create = `curl -X POST https://api.esy.com/v1/orders \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{
    "workflowId": "generate-clip-art-asset-v2",
    "workspaceId": "9a1b6d4c-…",
    "intakeBase": { "style": "clay", "aspectRatio": "1:1", "categories": "woodland" },
    "variationSpec": {
      "resolver": "list",
      "params": { "items": [ { "prompt": "a fox" }, { "prompt": "a badger" } ] }
    },
    "budgetLimitUsd": 2.0,
    "budgetEnforcementMode": "hard_stop"
  }'`;

const created = `{
  "id": "order-1f2e3d4c",
  "workflowId": "generate-clip-art-asset-v2",
  "workflowVersion": "2026.09.10",
  "status": "planned",
  "executionMode": "standard",
  "estimatedCostUsd": 0.09,
  "counts": { "planned": 2, "running": 0, "succeeded": 0, "failed": 0, "skipped": 0 },
  "currency": "USD"
}`;

const retry = `curl -X POST https://api.esy.com/v1/orders/order-1f2e3d4c/retry-failed \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{ "all": true }'`;

const gap = `curl -X POST https://api.esy.com/v1/orders/order-1f2e3d4c/accept-gap \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{ "reason": "Shipping 23 of 25; two prompts need a plan fix." }'`;

export default function OrdersApiPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="API reference · Orders"
        title="Orders"
        lead={
          <>
            One workflow, fanned into many runs, under one budget. Concepts are on{' '}
            <Link href="/concepts/orders">Generation Orders</Link>.
          </>
        }
      />

      <EndpointList
        items={[
          { method: 'POST', path: '/v1/orders', desc: 'Plan an order. Nothing runs yet.' },
          { method: 'GET', path: '/v1/orders', desc: 'List orders.' },
          { method: 'GET', path: '/v1/orders/{order_id}', desc: 'Read one, with its counts.' },
          { method: 'POST', path: '/v1/orders/{order_id}/start', desc: 'Begin executing.' },
          { method: 'POST', path: '/v1/orders/{order_id}/cancel', desc: 'Stop what has not started.' },
          { method: 'POST', path: '/v1/orders/{order_id}/retry-failed', desc: 'Re-run failed children.' },
          { method: 'POST', path: '/v1/orders/{order_id}/accept-gap', desc: 'Settle short, on purpose.' },
        ]}
      />

      <h2>Lifecycle</h2>
      <Table
        head={['Status', 'Meaning']}
        rows={[
          [<Status key="a" value="planned" />, 'Created and estimated. Children exist as planned runs. Nothing spent.'],
          [<Status key="b" value="running" tone="active" />, 'Started. Children are executing.'],
          [<Status key="c" value="attention" tone="warn" />, 'Settled short but still fulfillable — retry, or accept the gap.'],
          [<Status key="d" value="completed" tone="good" />, 'Every child settled successfully, or the gap was accepted.'],
          [<Status key="e" value="failed" tone="bad" />, 'Could not complete.'],
          [<Status key="f" value="cancelled" />, 'You stopped it.'],
        ]}
      />

      <Endpoint method="POST" path="/v1/orders" title="Plan an order. Returns in the planned state with an estimate; nothing executes.">
        <CodeBlock title="request" language="bash">
          {create}
        </CodeBlock>
        <CodeBlock title="201 Created" language="json">
          {created}
        </CodeBlock>
        <Callout title="Note the field name" tone="note">
          Orders take <code>workflowId</code>, while runs take <code>templateId</code>. Same value, two
          field names — an inconsistency in the API, not in these docs.
        </Callout>
        <h4>Body</h4>
        <PropertyTable
          rows={[
            { name: 'workflowId', type: 'string', required: true, desc: 'The workflow every child runs.' },
            {
              name: 'variationSpec',
              type: 'object',
              required: true,
              desc: (
                <>
                  How children differ. <code>resolver</code> is <code>list</code>, <code>matrix</code>, or{' '}
                  <code>csv</code>; <code>params</code> supplies the values.
                </>
              ),
            },
            { name: 'intakeBase', type: 'object', desc: 'Intake shared by every child; variations are merged over it.' },
            { name: 'workflowVersion', type: 'string', desc: 'Pin a version. Defaults to the live one.' },
            { name: 'workspaceId / projectId', type: 'uuid', desc: 'Where the runs and costs land.' },
            { name: 'targetCount', type: 'integer', desc: 'How many successful children you need.' },
            {
              name: 'executionMode',
              type: 'enum',
              desc: (
                <>
                  <code>standard</code> (default) or <code>batch</code> — provider batch APIs, slower and
                  cheaper.
                </>
              ),
            },
            { name: 'budgetLimitUsd', type: 'number', desc: 'A cap for this order alone.' },
            {
              name: 'budgetEnforcementMode',
              type: 'enum',
              desc: (
                <>
                  Same modes as <Link href="/concepts/costs">budgets</Link>.
                </>
              ),
            },
            { name: 'providerOverrides', type: 'object', desc: 'Role → model id, applied to every child.' },
            { name: 'planArtifactId', type: 'string', desc: 'Links children into a pack family.' },
          ]}
        />
      </Endpoint>

      <Endpoint method="POST" path="/v1/orders/{order_id}/start" title="Start executing a planned order.">
        <p>
          The budget is checked again here, against current spend — an order planned yesterday can be
          refused today with a <code>402</code>.
        </p>
      </Endpoint>

      <Endpoint method="GET" path="/v1/orders/{order_id}" title="Read an order and its rollup.">
        <p>
          <code>counts</code> gives planned, running, succeeded, failed, and skipped;{' '}
          <code>actualCostUsd</code> rolls up every child. To see the children themselves, list runs with{' '}
          <code>GET /v1/runs?parentOrderId=…</code>.
        </p>
      </Endpoint>

      <Endpoint method="POST" path="/v1/orders/{order_id}/retry-failed" title="Re-run failed children.">
        <CodeBlock title="request" language="bash">
          {retry}
        </CodeBlock>
        <p>
          Pass <code>all: true</code>, or name specific <code>children</code>. Failures classed as
          deterministic — the same input would fail the same way — are skipped unless you set{' '}
          <code>includeDeterministic: true</code>, because retrying them only buys a second identical
          failure.
        </p>
      </Endpoint>

      <Endpoint method="POST" path="/v1/orders/{order_id}/accept-gap" title="Settle an order short, deliberately, with a recorded reason.">
        <CodeBlock title="request" language="bash">
          {gap}
        </CodeBlock>
        <p>
          <code>reason</code> is required. Accepting a gap is a decision, and it is kept on the order so a
          short pack is never silent.
        </p>
      </Endpoint>
    </DocsPageShell>
  );
}
