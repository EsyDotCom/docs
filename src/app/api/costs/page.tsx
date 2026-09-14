import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import {
  CodeBlock,
  Endpoint,
  EndpointList,
  PageHeader,
  PropertyTable,
} from '@/components/docs/Primitives';

export const metadata = {
  title: 'Costs and budgets API',
  description: 'Aggregate spend by provider, workflow, or period; create and update budgets; read refusals.',
};

const costs = `curl -s "https://api.esy.com/v1/costs?workspaceId=$WS&groupBy=provider" \\
  -H "Authorization: Bearer $ESY_API_KEY"`;

const costsResponse = `{
  "groupBy": "provider",
  "currency": "USD",
  "estimatedUsd": 1665.31,
  "actualUsd": 1665.11,
  "entryCount": 331784,
  "buckets": [
    { "key": "openai",        "estimatedUsd": 872.33, "actualUsd": 872.13, "entryCount": 60197 },
    { "key": "anthropic",     "estimatedUsd": 700.66, "actualUsd": 700.66, "entryCount": 85892 },
    { "key": "fal",           "estimatedUsd": 91.22,  "actualUsd": 91.22,  "entryCount": 19526 },
    { "key": "cloudflare_r2", "estimatedUsd": 0.47,   "actualUsd": 0.47,   "entryCount": 104527 }
  ]
}`;

const update = `curl -X PATCH https://api.esy.com/v1/budgets/budget-7a1c… \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{ "limitUsd": 75.0 }'`;

export default function CostsApiPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="API reference · Costs"
        title="Costs and budgets"
        lead={
          <>
            Read spend and manage the limits in front of it. Concepts are on{' '}
            <Link href="/concepts/costs">Costs and budgets</Link>.
          </>
        }
      />

      <EndpointList
        items={[
          { method: 'GET', path: '/v1/costs', desc: 'Aggregate spend.' },
          { method: 'GET', path: '/v1/budgets', desc: 'List budgets in a workspace.' },
          { method: 'POST', path: '/v1/budgets', desc: 'Create a budget.' },
          { method: 'GET', path: '/v1/budgets/{budget_id}', desc: 'Read one.' },
          { method: 'PATCH', path: '/v1/budgets/{budget_id}', desc: 'Change a limit or mode.' },
          { method: 'DELETE', path: '/v1/budgets/{budget_id}', desc: 'Remove a budget.' },
          { method: 'GET', path: '/v1/budgets/{budget_id}/refusals', desc: 'What it turned away.' },
        ]}
      />

      <Endpoint method="GET" path="/v1/costs" title="Aggregate the cost ledger, grouped the way you ask.">
        <CodeBlock title="request" language="bash">
          {costs}
        </CodeBlock>
        <CodeBlock title="200 OK" language="json">
          {costsResponse}
        </CodeBlock>
        <p>
          Note <code>cloudflare_r2</code>: the most ledger entries and the least money. Storage is metered
          on every run and costs almost nothing — sort buckets by <code>actualUsd</code>, not by count.
        </p>
        <h4>Query parameters</h4>
        <PropertyTable
          rows={[
            { name: 'groupBy', type: 'string', desc: 'For example provider, workflow, operation, or period.' },
            { name: 'workspaceId / projectId', type: 'uuid', desc: 'Scope the aggregate.' },
            { name: 'workflowId', type: 'string', desc: 'One workflow only.' },
            { name: 'provider', type: 'string', desc: 'One provider only.' },
            { name: 'status', type: 'enum', desc: 'Only ledger rows in one cost state.' },
            { name: 'periodGranularity', type: 'string', desc: 'Bucket size when grouping by time.' },
            { name: 'from / to', type: 'datetime', desc: 'ISO-8601 bounds.' },
          ]}
        />
      </Endpoint>

      <Endpoint method="GET" path="/v1/budgets" title="Budgets in a workspace.">
        <p>
          <code>workspaceId</code> is <strong>required</strong> here — omit it and you get a{' '}
          <code>422</code> naming the missing query parameter. Narrow further with{' '}
          <code>projectId</code> or <code>workflowId</code>.
        </p>
      </Endpoint>

      <Endpoint method="POST" path="/v1/budgets" title="Create a budget.">
        <p>
          <code>workspaceId</code> and <code>limitUsd</code> are required. Set <code>projectId</code> or{' '}
          <code>workflowId</code> to narrow it — there is no <code>scope</code> field to send. Full field
          reference and a worked example are on <Link href="/concepts/costs">Costs and budgets</Link>.
        </p>
      </Endpoint>

      <Endpoint method="PATCH" path="/v1/budgets/{budget_id}" title="Update a budget. Send only what changes.">
        <CodeBlock title="request" language="bash">
          {update}
        </CodeBlock>
        <p>
          Patchable: <code>name</code>, <code>limitUsd</code>, <code>period</code>,{' '}
          <code>perRunCapUsd</code>, <code>enforcementMode</code>, <code>overageUsd</code>. A budget&rsquo;s
          workspace, project, and workflow are fixed at creation.
        </p>
      </Endpoint>

      <Endpoint method="GET" path="/v1/budgets/{budget_id}/refusals" title="Runs and orders this budget refused.">
        <p>
          Each refusal records the source (<code>run</code> or <code>order</code>), the reason, and the
          numbers at the moment it fired. Paginated with <code>offset</code>/<code>limit</code>.
        </p>
      </Endpoint>
    </DocsPageShell>
  );
}
