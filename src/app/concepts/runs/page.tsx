import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import {
  Callout,
  CodeBlock,
  Diagram,
  DiagramDefs,
  PageHeader,
  PropertyTable,
  Status,
  Table,
  Takeaways,
} from '@/components/docs/Primitives';

export const metadata = {
  title: 'Runs and steps',
  description:
    'One execution of a workflow: the nine statuses, per-step telemetry, how steps bind to models, and what a run records.',
};

const runExample = `{
  "id": "run-fb0677b2",
  "templateId": "generate-illustration",
  "status": "completed",
  "artifactId": "artifact-5a6a9501",
  "durationMs": 16088,
  "workflowVersion": "2026.09.09",
  "specVersionHash": "sha256:eb3ced0c…",
  "createdVia": "api_key",
  "totalCosts": {
    "estimatedUsd": 0.007749,
    "actualUsd": 0.007749,
    "currency": "USD",
    "status": "provider_reported"
  }
}`;

const steps = `"runSteps": [
  {
    "name": "Render illustration",
    "status": "completed",
    "provider": "openai",
    "model": "gpt-image-2.5-sunburst",
    "durationMs": 11178,
    "costActualUsd": 0.0046
  },
  {
    "name": "Classify asset",
    "status": "completed",
    "provider": "anthropic",
    "model": "claude-haiku-4-5-20251001",
    "durationMs": 1260,
    "costActualUsd": 0.000884
  },
  {
    "name": "Text gate",
    "status": "completed",
    "provider": "anthropic",
    "model": "claude-haiku-4-5-20251001",
    "durationMs": 3040,
    "costActualUsd": 0.00226
  },
  { "name": "artifact.create", "status": "completed", "durationMs": 26 }
]`;

const stepDef = `{
  "id": "step-3b",
  "name": "Text gate",
  "kind": "llm",
  "capability": "text",
  "role": "textGate",
  "inputPath": "step-2.url",
  "requireTrue": "pass",
  "failMessage": "OCR text gate rejected the render",
  "jsonSchema": {
    "type": "object",
    "properties": {
      "foundText": { "type": "string" },
      "pass": { "type": "boolean" },
      "reason": { "type": "string" }
    },
    "required": ["foundText", "pass", "reason"]
  }
}`;

const override = `{
  "templateId": "generate-illustration",
  "intake": { … },
  "providers": {
    "imageGenerator": "openai/gpt-image-2-2026-04-21"
  }
}`;

export default function RunsPage() {
  return (
    <DocsPageShell>
      <DiagramDefs />

      <PageHeader
        eyebrow="Core concepts · Runs"
        title="Runs and steps"
        opener="pipeline"
        lead={
          <>
            A run is one execution of one workflow, and the durable record of it: what happened, in what
            order, on which model, how long each part took, and what it cost. Runs are the thing you poll,
            stream, cancel, and audit.
          </>
        }
      />

      <h2>The lifecycle</h2>
      <p>
        Nine statuses. Most runs only ever visit four of them — the right-hand column exists only for
        workflows that declare an approval gate.
      </p>

      <Diagram
        title="Run status transitions"
        minWidth={880}
        caption={
          <>
            <code>planned</code> is how child runs of a{' '}
            <Link href="/concepts/orders">Generation Order</Link> start life, before the order is
            started.
          </>
        }
      >
        <svg viewBox="0 0 900 288" role="img" aria-label="Run statuses from pending through queued and running to completed, review, failed or cancelled">
          <text x="8" y="18" className="dg-hdr">RUN STATUS</text>

          <path d="M84 96 L84 44 L766 44 L766 74" className="dg-edge" />
          <text x="420" y="38" className="dg-cap" textAnchor="middle">no approval gate declared</text>

          <rect x="16" y="96" width="136" height="40" rx="6" className="dg-node" />
          <text x="84" y="121" className="dg-label-sm" textAnchor="middle">pending</text>
          <rect x="16" y="176" width="136" height="40" rx="6" className="dg-node" />
          <text x="84" y="201" className="dg-label-sm" textAnchor="middle">planned</text>
          <text x="84" y="232" className="dg-cap" textAnchor="middle">order children</text>

          <path d="M156 116 L192 116" className="dg-edge" />
          <path d="M156 196 C 176 196, 176 116, 192 116" className="dg-edge" />

          <rect x="196" y="96" width="136" height="40" rx="6" className="dg-node" />
          <text x="264" y="121" className="dg-label-sm" textAnchor="middle">queued</text>
          <path d="M336 116 L372 116" className="dg-edge" />

          <rect x="376" y="96" width="136" height="40" rx="6" className="dg-node dg-accent" />
          <text x="444" y="121" className="dg-label-sm" textAnchor="middle">running</text>

          <path d="M420 140 L392 176" className="dg-edge dg-bad" />
          <path d="M470 140 L498 176" className="dg-edge" />
          <rect x="306" y="180" width="126" height="38" rx="6" className="dg-node dg-term" />
          <text x="369" y="204" className="dg-label-sm" textAnchor="middle">failed</text>
          <rect x="446" y="180" width="126" height="38" rx="6" className="dg-node dg-term" />
          <text x="509" y="204" className="dg-label-sm" textAnchor="middle">cancelled</text>

          <path d="M516 116 L562 116" className="dg-edge dg-warn" />
          <text x="539" y="106" className="dg-cap" textAnchor="middle">gate</text>
          <rect x="566" y="96" width="136" height="40" rx="6" className="dg-node dg-warn" />
          <text x="634" y="121" className="dg-label-sm" textAnchor="middle">review</text>

          <path d="M706 108 L740 74" className="dg-edge dg-accent" />
          <path d="M706 116 L740 116" className="dg-edge dg-bad" />
          <path d="M706 126 L740 172" className="dg-edge dg-warn" />
          <text x="728" y="66" className="dg-cap" textAnchor="end">approve</text>

          <rect x="744" y="56" width="140" height="38" rx="6" className="dg-node dg-accent" />
          <text x="814" y="80" className="dg-label-sm" textAnchor="middle">completed</text>
          <rect x="744" y="98" width="140" height="38" rx="6" className="dg-node dg-term" />
          <text x="814" y="122" className="dg-label-sm" textAnchor="middle">rejected</text>
          <rect x="744" y="158" width="140" height="38" rx="6" className="dg-node dg-term" />
          <text x="814" y="177" className="dg-label-sm" textAnchor="middle">changes_</text>
          <text x="814" y="190" className="dg-label-sm" textAnchor="middle">requested</text>

          <text x="8" y="266" className="dg-cap">terminal: completed · review · failed · cancelled · rejected · changes_requested</text>
        </svg>
      </Diagram>

      <Table
        head={['Status', 'Meaning', 'Terminal?']}
        rows={[
          [<Status key="a" value="pending" />, 'Accepted by the API, not yet picked up.', 'No'],
          [<Status key="b" value="queued" />, 'Waiting for an execution slot.', 'No'],
          [<Status key="c" value="running" tone="active" />, 'Executing steps.', 'No'],
          [
            <Status key="d" value="planned" />,
            'A child of an order that has not been started yet.',
            'No',
          ],
          [
            <Status key="e" value="completed" tone="good" />,
            'Finished. An artifact exists and is accepted.',
            'Yes',
          ],
          [
            <Status key="f" value="review" tone="warn" />,
            'Produced an artifact that is waiting on a human.',
            'Yes',
          ],
          [<Status key="g" value="failed" tone="bad" />, 'Terminal error. Read error and errorCode.', 'Yes'],
          [<Status key="h" value="cancelled" />, 'You cancelled it.', 'Yes'],
          [<Status key="i" value="rejected" tone="bad" />, 'A reviewer rejected the output.', 'Yes'],
          [
            <Status key="j" value="changes_requested" tone="warn" />,
            'A reviewer asked for changes.',
            'Yes',
          ],
        ]}
      />

      <Callout title="Poll on terminal, not on completed" tone="warning">
        A loop that waits for <code>completed</code> will hang forever on a workflow that ends in{' '}
        <code>review</code>. Break on any terminal status, then decide what to do about the one you got.
      </Callout>

      <h2>What a run records</h2>

      <CodeBlock title="GET /v1/runs/{run_id}" language="json">
        {runExample}
      </CodeBlock>

      <PropertyTable
        rows={[
          { name: 'id', type: 'string', desc: <>Always <code>run-</code> plus eight hex characters.</> },
          { name: 'status', type: 'enum', desc: 'One of the nine above.' },
          { name: 'artifactId', type: 'string | null', desc: 'Set once the run has produced something.' },
          {
            name: 'workflowVersion',
            type: 'string',
            desc: 'The version this run pinned at creation — not necessarily the live one now.',
          },
          {
            name: 'specVersionHash',
            type: 'string',
            desc: 'Hash of the frozen definition plus intake. Identical hashes mean identical inputs.',
          },
          {
            name: 'createdVia',
            type: 'enum',
            desc: (
              <>
                <code>session</code>, <code>api_key</code>, or <code>worker</code>. Accompanied by{' '}
                <code>apiKeyId</code> and <code>apiKeyName</code> where relevant.
              </>
            ),
          },
          {
            name: 'totalCosts',
            type: 'object',
            desc: (
              <>
                Estimated and actual, plus the rollup{' '}
                <Link href="/concepts/costs">cost state</Link>.
              </>
            ),
          },
          {
            name: 'parentRunId',
            type: 'string | null',
            desc: (
              <>
                Set when this run was spawned by a{' '}
                <Link href="/concepts/sub-workflows">sub-workflow step</Link>.
              </>
            ),
          },
          {
            name: 'parentOrderId',
            type: 'string | null',
            desc: <>Set when this run is a child of a <Link href="/concepts/orders">Generation Order</Link>.</>,
          },
          {
            name: 'failureDetails',
            type: 'object | null',
            desc: 'Structured evidence when a gate rejected the work.',
          },
        ]}
      />

      <h2>Step telemetry</h2>
      <p>
        Every run carries a <code>runSteps</code> array — one entry per unit of work, with its own
        provider, model, duration, and cost. This is where you look when a run was slow or expensive,
        because it tells you <em>which part</em> was.
      </p>

      <CodeBlock title="runSteps, from the run above" language="json">
        {steps}
      </CodeBlock>

      <p>
        In that run the render took 11 seconds and cost $0.0046, while the two checks around it cost
        $0.0031 between them. Steps have their own statuses — <code>pending</code>,{' '}
        <code>completed</code>, <code>failed</code>, <code>skipped</code> — and a skipped step is
        informative: it usually means the engine determined the work was already delivered upstream.
      </p>

      <h2>How a step is defined</h2>
      <p>
        Steps live in the workflow&rsquo;s <code>runtimeSteps</code>. Each one declares its kind, what it
        consumes, and — for anything that calls a model — the exact JSON it must return.
      </p>

      <CodeBlock title="a verdict step from generate-coloring-page" language="json">
        {stepDef}
      </CodeBlock>

      <PropertyTable
        rows={[
          {
            name: 'kind',
            type: 'enum',
            required: true,
            desc: (
              <>
                <code>llm</code>, <code>image</code>, <code>tool</code>, <code>subWorkflow</code>,{' '}
                <code>agent</code>, or <code>code</code>.
              </>
            ),
          },
          {
            name: 'role',
            type: 'string',
            desc: (
              <>
                What this step needs, abstractly — <code>imageGenerator</code>, <code>classifier</code>,{' '}
                <code>textGate</code>. The workflow binds roles to models.
              </>
            ),
          },
          {
            name: 'inputPath',
            type: 'string',
            desc: (
              <>
                A dotted reference into the run context, such as <code>step-2.url</code>. Steps read each
                other&rsquo;s outputs this way.
              </>
            ),
          },
          {
            name: 'jsonSchema',
            type: 'object',
            desc: 'Structured output the model must conform to. Not a suggestion — it is enforced.',
          },
          {
            name: 'requireTrue',
            type: 'string',
            desc: (
              <>
                Makes the step a verdict: if the named field is not <code>true</code>, the step fails and{' '}
                <code>failMessage</code> explains why.
              </>
            ),
          },
          {
            name: 'emitsArtifact',
            type: 'boolean',
            desc: 'Ships a real artifact mid-run, so partial work survives a later failure.',
          },
        ]}
      />

      <h2>Roles, not models</h2>
      <p>
        A step never names a model directly. It names a role, and the workflow&rsquo;s{' '}
        <code>providers</code> map binds that role to a registry id. Two roles commonly share one model,
        and swapping a model is a binding change rather than a step rewrite.
      </p>

      <Diagram
        title="Role binding"
        minWidth={720}
        caption={<>A run may override any binding for itself, and the override is validated against the registry.</>}
      >
        <svg viewBox="0 0 760 216" role="img" aria-label="Workflow roles mapped onto model registry entries">
          <text x="8" y="16" className="dg-hdr">ROLE</text>
          <text x="392" y="16" className="dg-hdr">MODEL REGISTRY ID</text>

          <rect x="8" y="34" width="170" height="38" rx="6" className="dg-node" />
          <text x="93" y="58" className="dg-label-sm" textAnchor="middle">imageGenerator</text>
          <rect x="8" y="86" width="170" height="38" rx="6" className="dg-node" />
          <text x="93" y="110" className="dg-label-sm" textAnchor="middle">classifier</text>
          <rect x="8" y="138" width="170" height="38" rx="6" className="dg-node" />
          <text x="93" y="162" className="dg-label-sm" textAnchor="middle">textGate</text>

          <path d="M182 53 L384 53" className="dg-edge" />
          <path d="M182 105 L384 105" className="dg-edge" />
          <path d="M182 157 C 290 157, 300 105, 384 105" className="dg-edge" />

          <rect x="388" y="34" width="364" height="38" rx="6" className="dg-node" />
          <text x="570" y="58" className="dg-sub" textAnchor="middle">openai/gpt-image-2.5-sunburst-2026-09-08</text>
          <rect x="388" y="86" width="364" height="38" rx="6" className="dg-node" />
          <text x="570" y="110" className="dg-sub" textAnchor="middle">anthropic/claude-haiku-4-5</text>

          <text x="388" y="150" className="dg-cap">two roles, one model — bindings are a map, not a list</text>
          <text x="8" y="200" className="dg-cap">run.providers overrides a single role for one run only</text>
        </svg>
      </Diagram>

      <CodeBlock title="POST /v1/runs — pinning one model for this run" language="json">
        {override}
      </CodeBlock>

      <Callout title="Pin dated snapshots for batch work" tone="tip">
        Registry ids like <code>openai/gpt-image-2-2026-04-21</code> name a dated snapshot. For a catalog
        or a large order, pin one so every item in the batch was made by the same model — otherwise a
        mid-batch model change shows up as inconsistent output you cannot explain later.
      </Callout>

      <h2>Watching a run</h2>
      <p>
        Polling works and is fine for scripts. For anything a person is waiting on, stream instead:{' '}
        <Link href="/api/run-events">
          <code>GET /v1/runs/{'{run_id}'}/events</code>
        </Link>{' '}
        sends a full snapshot on connect and then each transition as it happens, so reconnecting can
        never lose you a state change.
      </p>

      <h2>Cancelling</h2>
      <p>
        <code>POST /v1/runs/{'{run_id}'}/cancel</code> stops a run at its next step boundary. Work already
        paid for stays billed — cancellation stops future spend, it does not refund past spend.
      </p>

      <Takeaways
        items={[
          <>
            There are nine statuses. Break your polling loop on any terminal one, not on{' '}
            <code>completed</code>.
          </>,
          <>
            <code>runSteps</code> tells you which part of a run was slow or expensive — the render is
            often not the biggest line.
          </>,
          <>
            Steps name roles; the workflow binds roles to models. A run can override a binding for
            itself.
          </>,
          <>
            Every run pins its workflow version and a spec hash, so it stays explainable long after the
            workflow moves on.
          </>,
        ]}
      />
    </DocsPageShell>
  );
}
