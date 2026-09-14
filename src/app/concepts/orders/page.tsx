import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { CodeBlock, PageHeader, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Generation Orders',
  description:
    'Produce many artifacts from one workflow template with automated variation, per-child dedupe keys, and a budget cap — the batch primitive under every worker shift.',
};

const orderFlow = `POST /v1/orders            (create — resolves variations, estimates cost)
   └─▶ status: planned      children created, nothing executes, review freely
POST /v1/orders/{id}/start  (the explicit go)
   └─▶ status: running      children stream through the executor
   └─▶ status: completed | failed | cancelled`;

const orderExample = `{
  "id": "order-046b1a54",
  "workflowId": "generate-clip-art-asset-v2",
  "status": "completed",
  "targetCount": 50,
  "counts": { "planned": 0, "running": 0, "succeeded": 50, "failed": 0, "skipped": 0 },
  "budgetLimitUsd": 3.50,
  "budgetEnforcementMode": "hard_stop",
  "estimatedCostUsd": 2.65,
  "actualCostUsd": 2.73
}`;

export default function OrdersPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Generation Orders"
        title="Generation Orders"
        opener="fanout"
        lead={
          <>
            An order fans one workflow template out into N child runs with automated variation — the batch
            primitive behind catalog production. Every worker shift places its work as orders, so batches carry
            the same telemetry, budgets, and provenance as single runs.
          </>
        }
      />

      <h2>Two-phase by design</h2>
      <CodeBlock title="lifecycle" language="ascii">
        {orderFlow}
      </CodeBlock>
      <p>
        Creating an order plans it — variations resolve into children, the whole batch is estimated and checked
        against budgets — but nothing executes until the explicit start. Review the plan, then commit.
      </p>

      <h2>The order record</h2>
      <CodeBlock title="an order, settled" language="json">
        {orderExample}
      </CodeBlock>

      <h2>What each child carries</h2>
      <Table
        head={['Field', 'Meaning']}
        rows={[
          [<code key="p">parentOrderId</code>, 'The order that fanned it out — list children with GET /v1/runs?parentOrderId=.'],
          [<code key="d">orderDedupeKey</code>, 'A deterministic key per planned variation: re-running an order skips already-succeeded keys instead of regenerating.'],
          [<code key="w">workerId</code>, 'Set when a worker’s shift placed the order — the whole batch is attributed.'],
        ]}
      />

      <h2>Budgets</h2>
      <p>
        Orders take their own cap (<code>budgetLimitUsd</code>, default <code>hard_stop</code>) on top of
        workspace and project budgets. Enforcement happens pre-flight on estimates: a batch that would breach
        never starts.
      </p>
    </DocsPageShell>
  );
}
