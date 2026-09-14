import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import {
  Callout,
  CodeBlock,
  Diagram,
  DiagramDefs,
  PageHeader,
  PropertyTable,
  Table,
  Takeaways,
} from '@/components/docs/Primitives';

export const metadata = {
  title: 'Costs and budgets',
  description:
    'What a run costs, the three cost states, how spend rolls up, and how budgets refuse work before anything is spent.',
};

const totals = `"totalCosts": {
  "estimatedUsd": 0.007749,
  "actualUsd": 0.007749,
  "currency": "USD",
  "status": "provider_reported",
  "providerSteps": [
    { "provider": "openai",        "operation": "Render illustration",
      "model": "gpt-image-2.5-sunburst",     "actualCostUsd": 0.0046 },
    { "provider": "anthropic",     "operation": "Classify asset",
      "model": "claude-haiku-4-5-20251001",  "actualCostUsd": 0.000884 },
    { "provider": "anthropic",     "operation": "Text gate",
      "model": "claude-haiku-4-5-20251001",  "actualCostUsd": 0.00226 },
    { "provider": "cloudflare_r2", "operation": "storage.upload",
      "model": null,                          "actualCostUsd": 0.0000045 }
  ]
}`;

const createBudget = `curl -X POST https://api.esy.com/v1/budgets \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{
    "workspaceId": "9a1b6d4c-…",
    "name": "Clip art, monthly",
    "workflowId": "generate-clip-art-asset-v2",
    "limitUsd": 50.0,
    "period": "monthly",
    "perRunCapUsd": 0.35,
    "enforcementMode": "hard_stop"
  }'`;

const refused = `HTTP 402

{
  "detail": {
    "code": "budget_exceeded",
    "reason": "hard_stop",
    "budgetId": "budget-…",
    "scope": "workspace",
    "enforcementMode": "hard_stop",
    "limitUsd": 50.0,
    "spendUsd": 49.82,
    "runEstimateUsd": 0.28,
    "remainingUsd": 0.18
  }
}`;

export default function CostsPage() {
  return (
    <DocsPageShell>
      <DiagramDefs />

      <PageHeader
        eyebrow="Core concepts · Costs"
        title="Costs and budgets"
        opener="meter"
        lead={
          <>
            Esy records cost per provider call, not per run, and every number has a documented source.
            Budgets sit in front of execution: a run that would breach one is refused before it spends
            anything.
          </>
        }
      />

      <h2>Cost is not price</h2>
      <p>
        What you see here is <strong>cost</strong> — what the providers charged to make the thing.
        It is not a price to a customer, and Esy does not compute margin for you. Every figure traces
        back to a model, a quantity, and a unit rate that was in effect at the time.
      </p>

      <h2>What one run costs</h2>
      <p>
        A finished run itemises its own bill. This is the real ledger from the{' '}
        <Link href="/quickstart">Quickstart</Link> run:
      </p>

      <CodeBlock title="GET /v1/runs/{run_id}" language="json">
        {totals}
      </CodeBlock>

      <p>
        The render was $0.0046 and the two checks around it were $0.0031 together — the quality apparatus
        cost two-thirds of what the image did. That ratio is normal for gated workflows, and it is the
        thing to look at before concluding a workflow is expensive.
      </p>

      <h2>The three cost states</h2>
      <p>
        Each ledger row moves through the same three states. There are three — not four.
      </p>

      <Diagram
        title="Cost states"
        minWidth={560}
        caption={<>Budgets are checked against the <em>estimate</em>, before the provider is ever called.</>}
      >
        <svg viewBox="0 0 560 120" role="img" aria-label="Cost states progress from estimated to provider reported to reconciled">
          <text x="0" y="14" className="dg-hdr">PROVIDER_COST_LEDGER</text>
          <rect x="0" y="34" width="160" height="46" rx="6" className="dg-node" />
          <text x="80" y="55" className="dg-label-sm" textAnchor="middle">estimated</text>
          <text x="80" y="71" className="dg-sub" textAnchor="middle">before the call</text>
          <path d="M166 57 L192 57" className="dg-edge" />
          <rect x="198" y="34" width="164" height="46" rx="6" className="dg-node" />
          <text x="280" y="55" className="dg-label-sm" textAnchor="middle">provider_reported</text>
          <text x="280" y="71" className="dg-sub" textAnchor="middle">after the call</text>
          <path d="M368 57 L394 57" className="dg-edge dg-accent" />
          <rect x="400" y="34" width="158" height="46" rx="6" className="dg-node dg-accent" />
          <text x="479" y="55" className="dg-label-sm" textAnchor="middle">reconciled</text>
          <text x="479" y="71" className="dg-sub" textAnchor="middle">against the invoice</text>
          <text x="0" y="106" className="dg-cap">step → run → workflow → project → workspace</text>
        </svg>
      </Diagram>

      <Table
        head={['State', 'When', 'What it means']}
        rows={[
          [
            <code key="a">estimated</code>,
            'Before the call',
            'Priced from the model’s published rate and an expected quantity. This is what budgets check.',
          ],
          [
            <code key="b">provider_reported</code>,
            'Immediately after',
            'The provider told us the real quantity. Usually close to the estimate; occasionally not.',
          ],
          [
            <code key="c">reconciled</code>,
            'Later, against the invoice',
            'Confirmed against what we were actually billed. The final word.',
          ],
        ]}
      />

      <Callout title="There is no “disputed” state" tone="note">
        Older material describes a fourth state for when an estimate and a provider figure diverge. It
        does not exist in the API. If you have code branching on it, that branch is dead.
      </Callout>

      <h2>Reading spend</h2>
      <p>
        <code>GET /v1/costs</code> aggregates across runs. Filter by workspace, project, workflow, or
        period to get the rollup you need rather than summing ledgers yourself.
      </p>

      <h2>Budgets</h2>
      <p>
        A budget is a limit attached to a scope, with a period and an enforcement mode. It is evaluated{' '}
        <em>before</em> a run executes, so a refusal costs nothing.
      </p>

      <CodeBlock title="POST /v1/budgets" language="bash">
        {createBudget}
      </CodeBlock>

      <PropertyTable
        rows={[
          {
            name: 'workspaceId',
            type: 'uuid',
            required: true,
            desc: 'Every budget belongs to a workspace.',
          },
          {
            name: 'projectId',
            type: 'uuid',
            desc: 'Narrows the budget to one project.',
          },
          {
            name: 'workflowId',
            type: 'string',
            desc: (
              <>
                Narrows it to one workflow. There is no <code>scope</code> field to send — the scope is
                inferred from which of these ids you set, and comes back on the response as{' '}
                <code>workspace</code>, <code>project</code>, or <code>workflow</code>.
              </>
            ),
          },
          {
            name: 'limitUsd',
            type: 'number',
            required: true,
            desc: 'The ceiling for one period.',
          },
          {
            name: 'period',
            type: 'enum',
            desc: (
              <>
                <code>total</code>, <code>daily</code>, <code>weekly</code>, or <code>monthly</code>.
              </>
            ),
          },
          {
            name: 'perRunCapUsd',
            type: 'number',
            desc: 'Refuses any single run estimated above this, regardless of remaining budget.',
          },
          {
            name: 'enforcementMode',
            type: 'enum',
            desc: 'What happens at the limit — see below.',
          },
        ]}
      />

      <h2>Enforcement modes</h2>
      <Table
        head={['Mode', 'At the limit', 'Use when']}
        rows={[
          [
            <code key="a">hard_stop</code>,
            'Refuses with 402. Nothing is spent.',
            'You want a real ceiling.',
          ],
          [
            <code key="b">allow_overage</code>,
            <>
              Keeps going until <code>overageUsd</code> is also used up.
            </>,
            'A limit with a deliberate grace margin.',
          ],
          [
            <code key="c">allow_one_more</code>,
            'Permits exactly one more run, then refuses.',
            'You would rather finish the item in flight than truncate it.',
          ],
          [
            <code key="d">track_only</code>,
            'Never refuses. Records everything.',
            'You want the number before you want the brake.',
          ],
        ]}
      />

      <h2>What a refusal looks like</h2>
      <CodeBlock title="POST /v1/runs" language="json">
        {refused}
      </CodeBlock>

      <p>
        The body carries everything you need to explain the refusal to a person: which budget, which
        rule, the limit, the spend so far, and what this run would have cost.{' '}
        <code>reason</code> is one of <code>per_run_cap_exceeded</code>, <code>hard_stop</code>,{' '}
        <code>allow_overage_exceeded</code>, or <code>allow_one_more_exhausted</code>.
      </p>

      <p>
        Refusals are durable. <code>GET /v1/budgets/{'{budget_id}'}/refusals</code> lists what a budget
        turned away — useful when someone asks why a batch came back short.
      </p>

      <Callout title="A failed run still costs money" tone="warning">
        Budgets stop runs from <em>starting</em>. They cannot refund a run that failed at its last gate
        after paying for a render. When you plan spend for a gated workflow, plan for the failures too.
      </Callout>

      <h2>Estimating before you commit</h2>
      <p>
        For a single run, the server estimates for you at creation and refuses with a <code>402</code>{' '}
        if a budget would be breached — nothing is spent. For batches, use a{' '}
        <Link href="/concepts/orders">Generation Order</Link>: it is created in the{' '}
        <code>planned</code> state with <code>estimatedCostUsd</code> already filled in, and the budget is
        checked both when you create it and again when you start it. Read the estimate, then decide —
        finding the limit at item 400 of 500 is an expensive way to learn it.
      </p>

      <Takeaways
        items={[
          <>
            Cost is recorded per provider call, with the model, quantity, and rate behind every figure.
          </>,
          <>
            Three cost states: <code>estimated</code> → <code>provider_reported</code> →{' '}
            <code>reconciled</code>.
          </>,
          <>
            Budgets refuse before execution, so a <code>402</code> is free — but a{' '}
            <code>failed</code> run is not.
          </>,
          <>
            Checks and gates are often the larger half of a workflow&rsquo;s bill. Look at{' '}
            <code>providerSteps</code> before optimising the wrong thing.
          </>,
        ]}
      />
    </DocsPageShell>
  );
}
