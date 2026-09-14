import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import {
  Callout,
  CodeBlock,
  PageHeader,
  PropertyTable,
  Status,
  Table,
  Takeaways,
} from '@/components/docs/Primitives';

export const metadata = {
  title: 'Workflows',
  description:
    'The versioned definition a run executes: intake schema, runtime steps, provider bindings, gates, budget policy, and artifact schema.',
};

const contract = `{
  "id": "generate-coloring-page",
  "name": "Generate Coloring Page",
  "artifactClass": "visual",
  "outputType": "visual",
  "status": "active",
  "supersededById": null,
  "version": "2026.09.10",

  "intakeSchema":  { "fields": [ … ] },
  "runtimeSteps":  [ … ],
  "gates":         [ … ],
  "providers":     { "imageGenerator": "…", "classifier": "…", "textGate": "…" },
  "budgetPolicy":  { "perRunCapUsd": 0.35 },
  "artifactSchema": {
    "artifactClass": "visual",
    "artifactType": "coloring-page",
    "files": ["image/png"],
    "metadata": { "aspectRatio": "enum [3:4, 1:1, 4:3]", "classification": "object" }
  }
}`;

const listCatalog = `curl -s https://api.esy.com/v1/catalog/workflows`;

const oneContract = `curl -s https://api.esy.com/v1/catalog/workflows/generate-coloring-page`;

const dryRun = `curl -X POST https://api.esy.com/v1/workflows/dry-run \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{
    "intakeSchema": { "fields": [ … ] },
    "runtimeSteps": [ … ],
    "providers":    { "imageGenerator": "openai/gpt-image-2-2026-04-21" },
    "intake":       { "prompt": "a lighthouse at dusk" }
  }'`;

const dryRunResponse = `{
  "ok": true,
  "stepCount": 3,
  "steps": [ … ],
  "errors": [],
  "warnings": [],
  "estimate": {
    "estimatedCost": { "min": 0.004, "typical": 0.008, "max": 0.012, "currency": "USD" },
    "highCost": false
  }
}`;

export default function WorkflowsPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Core concepts · Workflows"
        title="Workflows"
        opener="template"
        lead={
          <>
            A workflow is the versioned definition a run executes. It declares what it accepts, what it
            does, which models it uses, what has to pass, and what it produces. You do not write prompts
            against Esy — you pick a workflow and fill in its intake.
          </>
        }
      />

      <Callout title="Workflow, or template?" tone="note">
        Both. The object is a <strong>workflow</strong> and lives at <code>/v1/workflows</code>; the
        field you pass when starting a run is <code>templateId</code>. Same thing, two names, and the
        field name is not going to change.
      </Callout>

      <h2>The contract</h2>
      <p>
        Every workflow is a contract with two ends. <code>intakeSchema</code> declares what goes in;{' '}
        <code>artifactSchema</code> declares what comes out. Between them sit the steps, the bindings,
        and the gates.
      </p>

      <CodeBlock title="GET /v1/catalog/workflows/generate-coloring-page" language="json">
        {contract}
      </CodeBlock>

      <PropertyTable
        rows={[
          {
            name: 'id',
            type: 'string',
            required: true,
            desc: (
              <>
                Stable slug, and the value you pass as <code>templateId</code>. Never reused for a
                different workflow.
              </>
            ),
          },
          {
            name: 'artifactClass',
            type: 'enum',
            required: true,
            desc: (
              <>
                <code>visual</code>, <code>research</code>, <code>video</code>, or{' '}
                <code>knowledge</code>.
              </>
            ),
          },
          {
            name: 'version',
            type: 'string',
            required: true,
            desc: (
              <>
                A date-like label such as <code>2026.09.10</code>. Runs pin this. See{' '}
                <Link href="/concepts/versioning">Versioning</Link>.
              </>
            ),
          },
          {
            name: 'status',
            type: 'enum',
            desc: (
              <>
                <code>active</code> or <code>deprecated</code>. A deprecated workflow refuses new runs
                and names its successor.
              </>
            ),
          },
          {
            name: 'intakeSchema',
            type: 'object',
            required: true,
            desc: (
              <>
                The fields this workflow accepts. See <Link href="/concepts/intake">Intake</Link>.
              </>
            ),
          },
          {
            name: 'runtimeSteps',
            type: 'array',
            required: true,
            desc: (
              <>
                The ordered program. See <Link href="/concepts/runs">Runs and steps</Link>.
              </>
            ),
          },
          {
            name: 'gates',
            type: 'array',
            desc: (
              <>
                What must pass, and which step each gate unlocks. See{' '}
                <Link href="/concepts/gates-and-review">Gates and review</Link>.
              </>
            ),
          },
          {
            name: 'providers',
            type: 'object',
            desc: <>Role → model-registry id. The bindings a run may override.</>,
          },
          {
            name: 'budgetPolicy',
            type: 'object',
            desc: (
              <>
                Advisory, chiefly <code>perRunCapUsd</code>. Real enforcement comes from{' '}
                <Link href="/concepts/costs">budgets</Link>.
              </>
            ),
          },
          {
            name: 'artifactSchema',
            type: 'object',
            required: true,
            desc: <>The declared output: class, type, file types, and promised metadata.</>,
          },
        ]}
      />

      <h2>Finding one to run</h2>
      <p>
        The catalog is public and needs no key, which makes it the right thing to point a build script
        at.
      </p>

      <CodeBlock title="GET /v1/catalog/workflows" language="bash">
        {listCatalog}
      </CodeBlock>

      <p>
        The list gives you the summary of each workflow — what it is for, roughly how long it takes,
        whether it includes QA, what you provide and what you get. To see the actual input contract, ask
        for one by id:
      </p>

      <CodeBlock title="GET /v1/catalog/workflows/{id}" language="bash">
        {oneContract}
      </CodeBlock>

      <Callout title="Prompts and bindings are redacted in the catalog" tone="note">
        The public contract shows you the <em>shape</em> — fields, steps, gates, outputs — but the prompt
        templates and the exact model ids come back as <code>&quot;redacted&quot;</code>. You get everything you
        need to call the workflow correctly, and nothing you would need to clone it.
      </Callout>

      <h2>Naming</h2>
      <p>
        Ids are <code>verb-noun</code> in kebab case, and the verb is load-bearing: it tells you what
        kind of work happens, which is usually what you actually want to know when choosing between two
        workflows.
      </p>

      <Table
        head={['Verb', 'Means', 'Example']}
        rows={[
          ['generate', 'Invents something new from a description.', <code key="a">generate-illustration</code>],
          ['plan', 'Researches and produces a structured plan, not the thing itself.', <code key="b">plan-clipart-pack</code>],
          ['build', 'Computes a result from inputs, deterministically where it can.', <code key="c">build-…</code>],
          ['compose', 'Writes from supplied sources rather than inventing.', <code key="d">compose-…</code>],
          ['edit', 'Changes an existing artifact you supply.', <code key="e">edit-image</code>],
          ['remove', 'Takes something away from an input.', <code key="f">remove-image-background</code>],
          ['transcribe', 'Converts between media, preserving content.', <code key="g">transcribe-…</code>],
        ]}
      />

      <p>
        <code>assemble</code> is reserved for an internal stage and never appears in an id.{' '}
        <code>create</code> and <code>make</code> are deliberately unused — they say nothing that{' '}
        <code>generate</code> or <code>build</code> does not say more precisely.
      </p>

      <h2>Visibility</h2>
      <p>
        Not every workflow is runnable, and the ladder is strict. A workflow must be at least{' '}
        <code>internal</code> before a run against it will execute.
      </p>

      <Table
        head={['Visibility', 'In the catalog?', 'Runnable?']}
        rows={[
          [<Status key="a" value="draft" />, 'No', 'No — creating a run does not execute it'],
          [<Status key="b" value="internal" tone="warn" />, 'No', 'Yes'],
          [<Status key="c" value="public" tone="good" />, 'Yes', 'Yes'],
        ]}
      />

      <h2>Validating a published workflow</h2>
      <p>
        For a workflow in the catalog, validation happens on the server the moment you call it:{' '}
        <code>POST /v1/runs</code> checks your intake against the <code>intakeSchema</code> and returns a{' '}
        <code>422</code> naming every bad field <em>before</em> a provider is called. A rejected run costs
        nothing, so the cheapest pre-check is to read the schema, build the intake from it, and let the
        server have the final word. See <Link href="/errors">Errors</Link>.
      </p>

      <h2>Validating a workflow you are writing</h2>
      <p>
        <code>POST /v1/workflows/dry-run</code> is an authoring tool. It does <strong>not</strong> take a{' '}
        <code>templateId</code> — you send a draft definition (its steps, bindings, and intake schema)
        plus a sample intake, and it resolves the plan and prices it without calling a provider.
      </p>

      <CodeBlock title="POST /v1/workflows/dry-run" language="bash">
        {dryRun}
      </CodeBlock>

      <CodeBlock title="200 OK" language="json">
        {dryRunResponse}
      </CodeBlock>

      <Callout title="Sending a templateId does nothing" tone="warning">
        A body of <code>{'{ "templateId": …, "intake": … }'}</code> is accepted and silently ignored — you
        get back <code>ok: true</code> with zero steps and the warning{' '}
        <em>&ldquo;template has no runtime steps&rdquo;</em>. That is not a pass. Check{' '}
        <code>stepCount</code> and <code>warnings</code>, not just <code>ok</code>.
      </Callout>

      <p>
        <code>POST /v1/workflows/estimate</code> works the same way — it prices a draft{' '}
        <code>runtimeSteps</code> + <code>providers</code> pair, not a published workflow. Because the
        public catalog redacts prompts and bindings, you cannot dry-run or estimate someone else&rsquo;s
        workflow; you can only call it.
      </p>

      <Callout title="On “workflow schema”" tone="note">
        You may see <code>schemaVersion: &quot;workflow-schema-v1&quot;</code> on a workflow. It is a label, not a
        registry: there is no v2, and no separate validator keyed to it. The validation that actually
        runs is the dry-run above. Treat the field as provenance, not as a contract you can look up.
      </Callout>

      <Takeaways
        items={[
          <>
            A workflow declares both ends of its contract: <code>intakeSchema</code> in,{' '}
            <code>artifactSchema</code> out.
          </>,
          <>
            The catalog is public and unauthenticated — read the contract before you call, rather than
            guessing field names.
          </>,
          <>
            The verb in the id tells you what kind of work it does. <code>generate</code> invents;{' '}
            <code>compose</code> writes from sources.
          </>,
          <>
            A bad intake is rejected with a <code>422</code> before anything is spent. Dry-run and estimate
            are for workflows you are authoring, and take a definition rather than a{' '}
            <code>templateId</code>.
          </>,
        ]}
      />
    </DocsPageShell>
  );
}
