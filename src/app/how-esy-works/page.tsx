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
  title: 'How Esy works',
  description:
    'The execution model: workspaces and projects, what a workflow contains, what happens during a run, how steps and gates differ, and where cost is recorded.',
};

/**
 * Production assets, shown so the object model is concrete rather than abstract.
 * Every URL below is a live file on images.clip.art produced by the workflow it
 * illustrates — these are the real outputs, not mockups.
 */
const SHOT_COLORING = 'https://images.clip.art/coloring-pages/animals/cartoon-lion-coloring-page-yxa8qv.webp';
const SHOT_LINE_ART = 'https://images.clip.art/flower-clipart-black-and-white/mushroom-line-art-hd7srn.webp';
const SHOT_APPLES = [
  'https://images.clip.art/free/bright-red-apple-green-leaf-dp062c.webp',
  'https://images.clip.art/free/bright-red-apple-green-leaf-nufb2u.webp',
  'https://images.clip.art/free/bright-red-apple-green-leaf-xdo3dq.webp',
];
const SHOT_STYLES: [string, string][] = [
  ['cartoon', 'https://images.clip.art/ui/style-specimens/cartoon--fox.9a3f9b5419.webp'],
  ['black-and-white', 'https://images.clip.art/ui/style-specimens/black-and-white--fox.1adb60f42e.webp'],
];

const createRun = `curl -X POST https://api.esy.com/v1/runs \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{
    "templateId": "generate-coloring-page",
    "intake": {
      "prompt": "a cartoon lion sitting in tall grass",
      "aspectRatio": "3:4",
      "quality": "medium",
      "detail": "print",
      "categories": "animals-coloring"
    }
  }'`;

const runCreated = `{
  "id": "run-7c41e9a2",
  "status": "pending",
  "templateId": "generate-coloring-page",
  "templateName": "Generate Coloring Page",
  "currentStepIndex": 0,
  "workflowVersion": "2026.09.10",
  "specVersionHash": "sha256:eb3ced0c91a625e7ad47beaa28f5ff7b6db933ca5f6cac78fb93c1b030852fdb",
  "createdVia": "api_key",
  "queuedAt": "2026-09-16T14:22:08.317Z"
}`;

/* The template as the public catalog serves it. Prompt bodies come back as the
   literal string "redacted": the pipeline's shape is public, its wording is not. */
const templateShape = `{
  "id": "generate-coloring-page",
  "artifactClass": "visual",
  "schemaVersion": "workflow-schema-v1",
  "version": "2026.09.10",
  "visibility": "public",
  "intakeSchema": {
    "fields": [
      { "name": "prompt", "type": "string", "required": true },
      { "name": "aspectRatio", "type": "enum", "required": true,
        "options": ["3:4", "1:1", "4:3"] },
      { "name": "detail", "type": "enum", "required": false, "default": "print",
        "options": ["print", "app"] }
    ]
  },
  "runtimeSteps": [
    { "id": "step-1", "name": "Render line art", "kind": "image",
      "role": "imageGenerator", "promptTemplate": "redacted" },
    { "id": "step-2", "name": "Post-process line art", "kind": "tool",
      "tool": "esy/line-art-print", "inputPath": "step-1.url" },
    { "id": "step-3", "name": "Audit line art", "kind": "tool",
      "tool": "esy/line-art-audit", "inputPath": "step-2.url" },
    { "id": "step-3b", "name": "Text gate", "kind": "llm",
      "role": "textGate", "requireTrue": "pass" },
    { "id": "step-4", "name": "Classify", "kind": "llm", "role": "classifier" }
  ],
  "gates": [
    { "id": "gate-render", "name": "Provider execution", "type": "quality" },
    { "id": "gate-line-art", "name": "Line-art audit", "type": "quality" },
    { "id": "gate-text", "name": "OCR text gate", "type": "quality" }
  ],
  "providers": { "imageGenerator": "openai/gpt-image-2.5-flare-2026-09-08" },
  "budgetPolicy": { "perRunCapUsd": 0.30 },
  "artifactSchema": {
    "artifactClass": "visual",
    "artifactType": "coloring-page",
    "files": ["image/png"]
  }
}`;

const verdictStep = `{
  "id": "step-3b",
  "name": "Text gate",
  "kind": "llm",
  "role": "textGate",
  "requireTrue": "pass",
  "failMessage": "Lettering does not match the declared text contract",
  "jsonSchema": {
    "type": "object",
    "properties": {
      "pass": { "type": "boolean" },
      "readText": { "type": "string" }
    }
  }
}`;

const gateRejected = `{
  "id": "run-7c41e9a2",
  "status": "failed",
  "errorCode": "StepVerdictError",
  "error": "step 'step-3b' verdict false: lettering does not match",
  "failureDetails": {
    "kind": "gate_rejected",
    "failures": ["textContract"],
    "stepId": "step-3b",
    "rejectedUrl": "https://images.esy.com/artifacts/coloring-page/run-7c41e9a2/raw.webp"
  }
}`;

const artifactShape = `{
  "id": "artifact-0dc32dbb",
  "runId": "run-7c41e9a2",
  "templateId": "generate-coloring-page",
  "status": "ready",
  "artifactClass": "visual",
  "artifactType": "coloring-page",
  "version": 1,
  "specVersionHash": "sha256:eb3ced0c...",
  "content": {
    "type": "image",
    "url": "https://images.esy.com/artifacts/coloring-page/artifact-0dc32dbb/processed.webp",
    "storageKey": "artifacts/coloring-page/artifact-0dc32dbb/processed.webp",
    "model": "openai/gpt-image-2.5-flare-2026-09-08"
  },
  "qa": {
    "status": "pass",
    "checks": [
      { "id": "line-art-audit", "status": "pass", "detail": "stroke 1.8pt" },
      { "id": "text-gate", "status": "pass", "detail": "" }
    ]
  },
  "metadata": { "aspectRatio": "3:4", "detail": "print" }
}`;

const budgetRefusal = `HTTP/1.1 402 Payment Required

{
  "code": "budget_exceeded",
  "reason": "hard_stop",
  "budgetId": "b7f1c0e2-...",
  "scope": "project",
  "enforcementMode": "hard_stop",
  "limitUsd": 50.0,
  "spendUsd": 49.92,
  "runEstimateUsd": 0.3,
  "remainingUsd": 0.08
}`;

const finishedRun = `{
  "id": "run-7c41e9a2",
  "status": "completed",
  "artifactId": "artifact-0dc32dbb",
  "durationMs": 48213,
  "totalCosts": {
    "estimatedUsd": 0.0142,
    "actualUsd": 0.0142,
    "currency": "USD",
    "status": "provider_reported"
  }
}`;

/**
 * Local figure for production screenshots. Reuses the Diagram plate/caption
 * classes so a photo and a drawing sit in the same frame; it stays on this page
 * rather than moving into Primitives because only this page shows real output.
 */
function Shot({ src, alt, title, caption }: { src: string; alt: string; title: string; caption: string }) {
  return (
    <figure className="diagram">
      <div className="diagramPlate">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8 }}
        />
      </div>
      <figcaption className="diagramCaption">
        <span className="diagramTitle">{title}</span>
        {caption}
      </figcaption>
    </figure>
  );
}

export default function HowEsyWorksPage() {
  return (
    <DocsPageShell>
      <DiagramDefs />

      <PageHeader
        eyebrow="Get started · Execution model"
        title="How Esy works"
        opener="template"
        lead={
          <>
            Esy executes AI workflows that produce artifacts. A workflow defines the inputs it accepts,
            the steps it runs, the models and tools those steps call, and the checks its output must
            pass. Executing a workflow creates a run. During the run Esy executes each step in order,
            records every provider call and its cost, applies automated and human checks, and stores
            the output as an artifact.
          </>
        }
      />

      <h2>Execution overview</h2>
      <p>
        Every request follows the same path. The rest of this page explains each part, and links to the
        reference page for it.
      </p>

      <Diagram
        title="Request to artifact"
        minWidth={860}
        caption="Steps execute in the order the workflow declares. Gates check output between them. The run ends when the last step completes, a gate fails, or a human decision is required."
      >
        <svg viewBox="0 0 900 132" role="img" aria-label="Input flows into a workflow, which creates a run, which executes steps and gates, which produces an artifact">
          <text x="8" y="18" className="dg-hdr">INPUT → WORKFLOW → RUN → STEPS → GATES → ARTIFACT</text>

          <rect x="8" y="40" width="128" height="58" rx="7" className="dg-node" />
          <text x="72" y="64" className="dg-label-sm" textAnchor="middle">Input</text>
          <text x="72" y="82" className="dg-sub" textAnchor="middle">intake JSON</text>

          <path d="M140 69 L156 69" className="dg-edge" />

          <rect x="160" y="40" width="128" height="58" rx="7" className="dg-node" />
          <text x="224" y="64" className="dg-label-sm" textAnchor="middle">Workflow</text>
          <text x="224" y="82" className="dg-sub" textAnchor="middle">versioned definition</text>

          <path d="M292 69 L308 69" className="dg-edge" />

          <rect x="312" y="40" width="128" height="58" rx="7" className="dg-node" />
          <text x="376" y="64" className="dg-label-sm" textAnchor="middle">Run</text>
          <text x="376" y="82" className="dg-sub" textAnchor="middle">one execution</text>

          <path d="M444 69 L460 69" className="dg-edge" />

          <rect x="464" y="40" width="128" height="58" rx="7" className="dg-node" />
          <text x="528" y="64" className="dg-label-sm" textAnchor="middle">Steps</text>
          <text x="528" y="82" className="dg-sub" textAnchor="middle">model / tool calls</text>

          <path d="M596 69 L612 69" className="dg-edge dg-warn" />

          <rect x="616" y="40" width="128" height="58" rx="7" className="dg-node dg-warn" />
          <text x="680" y="64" className="dg-label-sm" textAnchor="middle">Gates</text>
          <text x="680" y="82" className="dg-sub" textAnchor="middle">automated + human</text>

          <path d="M748 69 L764 69" className="dg-edge dg-accent" />

          <rect x="768" y="40" width="124" height="58" rx="7" className="dg-node dg-accent" />
          <text x="830" y="64" className="dg-label-sm" textAnchor="middle">Artifact</text>
          <text x="830" y="82" className="dg-sub" textAnchor="middle">stored output</text>

          <text x="8" y="122" className="dg-cap">every provider call along the way writes one row to the cost ledger</text>
        </svg>
      </Diagram>

      <Shot
        src={SHOT_COLORING}
        alt="A printable coloring page of a cartoon lion sitting in tall grass, black outlines on white."
        title="A finished artifact"
        caption="The output of one generate-coloring-page run, served from images.clip.art. The run that produced it recorded the render model, the audit metrics, the OCR verdict, and the cost of each provider call."
      />

      <h2>Workspaces and projects</h2>
      <p>
        These are organizational, not execution concepts. Nothing about them changes how a workflow
        runs — they determine who can see a run and where its spend is counted.
      </p>

      <Table
        head={['Object', 'What it is', 'Endpoint']}
        rows={[
          [
            <strong key="w">Workspace</strong>,
            <>
              The billing and membership boundary. Every run, artifact, and budget belongs to one.
              <code>kind</code> is <code>organization</code> or <code>personal</code>, and that set is
              enforced by the database. Your personal workspace is created for you at signup.
            </>,
            <code key="wp">/v1/workspaces</code>,
          ],
          [
            <strong key="p">Project</strong>,
            <>
              An optional grouping inside a workspace, so runs and costs roll up somewhere meaningful.
              <code>kind</code> defaults to <code>general</code>; <code>brand</code> is the other value
              in active use. Unlike workspace kind, it is a free-form string.
            </>,
            <code key="pp">…/projects</code>,
          ],
        ]}
      />

      <Callout title="The API says workspace" tone="note">
        You will see the word &ldquo;organization&rdquo; in places. The resource is a{' '}
        <strong>workspace</strong>; an organization is a workspace whose <code>kind</code> is{' '}
        <code>organization</code>. These docs say workspace throughout.
      </Callout>

      <h2>Workflows</h2>
      <p>
        A workflow is a versioned definition, not a prompt. It declares what it accepts, what it runs,
        and what it produces. The persisted type is <code>WorkflowTemplate</code>, and these are its
        fields:
      </p>

      <PropertyTable
        rows={[
          { name: 'intakeSchema', type: 'object', required: true, desc: 'The inputs this workflow accepts — field names, types, enums, defaults, and which are required.' },
          { name: 'runtimeSteps', type: 'array', required: true, desc: 'The ordered list of steps to execute. Note the field name: it is runtimeSteps, not steps.' },
          { name: 'gates', type: 'array', required: false, desc: 'Declared checks. An entry with type "approval" or "hitl" makes the run stop for a human decision.' },
          { name: 'providers', type: 'object', required: true, desc: 'Binds each step role (imageGenerator, textGate, classifier) to a concrete registry model id.' },
          { name: 'budgetPolicy', type: 'object', required: false, desc: 'Per-run ceiling for this workflow, e.g. perRunCapUsd.' },
          { name: 'artifactSchema', type: 'object', required: true, desc: 'The declared output: artifactClass, artifactType, file types, and expected metadata keys.' },
          { name: 'version', type: 'string', required: true, desc: 'The template version a run pins. Versions are immutable; a live pointer moves between them.' },
          { name: 'visibility', type: 'enum', required: true, desc: 'draft (unlisted), internal (operators can run it), or public (listed in the public catalog).' },
        ]}
      />

      <p>
        Here is a real one — <code>generate-coloring-page</code>, trimmed to the fields above. Prompt
        bodies come back as the literal string <code>redacted</code>: the catalog publishes the shape of
        a pipeline, not its wording.
      </p>

      <CodeBlock title="GET /v1/catalog/workflows/generate-coloring-page" language="json">
        {templateShape}
      </CodeBlock>

      <p>
        A step names a <em>role</em> rather than a model, and <code>providers</code> binds that role to a
        registry id. Swapping the image model is a change to one binding, not to any step.{' '}
        <Link href="/concepts/workflows">Workflows</Link> covers the full contract.
      </p>

      <h2>Runs</h2>
      <p>
        A run is one execution of one workflow version. It records per-step timing, the provider and
        model each step used, the cost of each call, and the artifact it produced. Create one by posting
        a <code>templateId</code> and an <code>intake</code> matching that workflow&rsquo;s{' '}
        <code>intakeSchema</code>:
      </p>

      <CodeBlock title="POST /v1/runs" language="bash">
        {createRun}
      </CodeBlock>

      <CodeBlock title="201 created" language="json">
        {runCreated}
      </CodeBlock>

      <p>
        The response returns immediately with <code>status: &quot;pending&quot;</code>. Execution is
        asynchronous — poll <code>GET /v1/runs/&#123;id&#125;</code> or subscribe to{' '}
        <Link href="/api/run-events">run events over SSE</Link>.
      </p>

      <h3>Run statuses</h3>
      <p>
        There are ten status values. Six are terminal for the executor; four mean the run is still
        moving. Break a polling loop on any terminal status, not on <code>completed</code> alone.
      </p>

      <Table
        head={['Status', 'Meaning', 'Terminal']}
        rows={[
          [<Status key="s1" value="pending" />, 'Created, not yet queued.', 'No'],
          [<Status key="s2" value="planned" />, 'A child run of a Generation Order, created but not yet dispatched.', 'No'],
          [<Status key="s3" value="queued" />, 'Waiting for an executor.', 'No'],
          [<Status key="s4" value="running" tone="active" />, 'Executing steps.', 'No'],
          [<Status key="s5" value="completed" tone="good" />, 'All steps finished and any human gate approved.', 'Yes'],
          [<Status key="s6" value="review" tone="warn" />, 'Steps finished; a human decision is required before the run resolves.', 'Yes *'],
          [<Status key="s7" value="failed" tone="bad" />, 'A step raised, or an automated gate rejected the output with no fallback left.', 'Yes'],
          [<Status key="s8" value="cancelled" tone="bad" />, 'Cancelled through the API.', 'Yes'],
          [<Status key="s9" value="rejected" tone="bad" />, 'A reviewer rejected the output.', 'Yes'],
          [<Status key="s10" value="changes_requested" tone="bad" />, 'A reviewer asked for changes. Revising spawns a new run.', 'Yes'],
        ]}
      />

      <Callout title="review is terminal for the executor only" tone="note">
        The engine stops advancing a run in <code>review</code>, which is why it belongs in your
        polling loop&rsquo;s exit set. It is not final: a reviewer resolves it into{' '}
        <code>completed</code>, <code>rejected</code>, or <code>changes_requested</code> through{' '}
        <code>POST /v1/queue/&#123;runId&#125;/decide</code>. A run only enters <code>review</code> if
        its workflow declares an <code>approval</code> or <code>hitl</code> gate — otherwise{' '}
        <code>running</code> goes straight to <code>completed</code>.
      </Callout>

      <Diagram
        title="Run status transitions"
        minWidth={880}
        caption="The three statuses on the right exist only for workflows that declare a human gate. A stalled run is returned to the queue rather than failed: the reaper resets it to planned if it belongs to an order, otherwise to pending."
      >
        <svg viewBox="0 0 900 288" role="img" aria-label="Run statuses from pending through queued and running to completed, review, failed or cancelled">
          <text x="8" y="18" className="dg-hdr">RUN STATUS</text>

          <path d="M84 96 L84 44 L766 44 L766 74" className="dg-edge" />
          <text x="420" y="38" className="dg-cap" textAnchor="middle">no human gate declared</text>

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
          <text x="539" y="106" className="dg-cap" textAnchor="middle">human gate</text>
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

          <text x="8" y="266" className="dg-cap">stop polling on: completed · review · failed · cancelled · rejected · changes_requested</text>
        </svg>
      </Diagram>

      <p>
        <Link href="/concepts/runs">Runs and steps</Link> documents per-step telemetry and recovery.
      </p>

      <h2>Steps and gates</h2>
      <p>
        A step performs work: it calls a model, runs a tool, or invokes another workflow. A gate does not
        perform work — it evaluates output that already exists and determines whether execution
        continues. The two are declared in different places and fail in different ways.
      </p>

      <h3>Step kinds</h3>
      <p>Five kinds are dispatched by the engine:</p>

      <Table
        head={['Kind', 'What it does']}
        rows={[
          [<code key="k1">llm</code>, 'Calls a language model. Can declare a jsonSchema for structured output, and repeat to fan out over chunks.'],
          [<code key="k2">image</code>, 'Calls an image model. Resolves its model from the binding, or from an intake field when the template declares one.'],
          [<code key="k3">tool</code>, 'Runs a registered Esy tool — image post-processing, audits, format conversion. Most tools are local and cost nothing.'],
          [<code key="k4">subWorkflow</code>, 'Runs another workflow as a child run, and rolls its cost up into this one.'],
          [<code key="k5">agent</code>, 'Runs an agent step with tool access.'],
        ]}
      />

      <Callout title="code and qa steps do not execute" tone="warning">
        A step whose <code>kind</code> is anything else — including <code>code</code> and{' '}
        <code>qa</code> — falls through to a pass-through branch that records the step for provenance
        and makes no provider call. If you declare a <code>code</code> step expecting it to run code, it
        will not; it becomes a no-op marker in the run record.
      </Callout>

      <h3>Automated gates</h3>
      <p>
        An automated check is declared on the step that produces the verdict, using{' '}
        <code>requireTrue</code>. It names a field of that step&rsquo;s parsed JSON output which must be
        truthy for execution to continue:
      </p>

      <CodeBlock title="A step with a verdict gate" language="json">
        {verdictStep}
      </CodeBlock>

      <p>
        If the field is missing, unparseable, or falsy, the step raises a verdict error. Before failing
        the run, the engine tries the next available fallback mechanism for that output — for image
        work, an alternative background-removal approach on the same render. If no fallback remains, the
        run fails and records structured evidence, including the URL of the output that was rejected:
      </p>

      <CodeBlock title="GET /v1/runs/run-7c41e9a2" language="json">
        {gateRejected}
      </CodeBlock>

      <h3>Human gates</h3>
      <p>
        A human check is declared in the template&rsquo;s <code>gates</code> array with{' '}
        <code>type: &quot;approval&quot;</code> or <code>type: &quot;hitl&quot;</code>. When a workflow
        declares one, the run stops at <code>review</code> after its steps finish and waits for a
        decision. A gate entry with <code>type: &quot;quality&quot;</code> is automated and never parks
        a run.
      </p>

      <Callout title="unlocks is descriptive, not executable" tone="note">
        Gate entries in published templates carry an <code>unlocks</code> field naming a step id. It
        documents intent in the published contract; the engine does not read it to schedule work.
        Execution order is the order of <code>runtimeSteps</code>, and what actually blocks progress is
        a <code>requireTrue</code> verdict or a human gate. Do not build a client that expects{' '}
        <code>unlocks</code> to control sequencing.
      </Callout>

      <Diagram
        title="generate-coloring-page, as declared"
        minWidth={860}
        caption="Five steps and three declared gates. Each step names a role; providers binds that role to a registry model. The text gate is an llm step carrying requireTrue, so its verdict decides whether step-4 runs."
      >
        <svg viewBox="0 0 860 196" role="img" aria-label="Five steps separated by three quality gates: render, post-process, audit, text gate, classify">
          <text x="8" y="16" className="dg-hdr">5 STEPS · 3 GATES</text>

          <text x="72" y="46" className="dg-cap" textAnchor="middle">image</text>
          <rect x="8" y="54" width="128" height="58" rx="7" className="dg-node" />
          <text x="72" y="79" className="dg-label-sm" textAnchor="middle">Render</text>
          <text x="72" y="96" className="dg-sub" textAnchor="middle">step-1</text>
          <text x="72" y="140" className="dg-cap" textAnchor="middle">imageGenerator</text>

          <path d="M140 83 L148 83" className="dg-edge" />
          <rect x="150" y="69" width="28" height="28" rx="5" className="dg-node dg-warn" />
          <path d="M180 83 L188 83" className="dg-edge" />
          <text x="164" y="112" className="dg-cap" textAnchor="middle">g1</text>

          <text x="256" y="46" className="dg-cap" textAnchor="middle">tool</text>
          <rect x="192" y="54" width="128" height="58" rx="7" className="dg-node" />
          <text x="256" y="79" className="dg-label-sm" textAnchor="middle">Post-process</text>
          <text x="256" y="96" className="dg-sub" textAnchor="middle">step-2</text>
          <text x="256" y="140" className="dg-cap" textAnchor="middle">seal gaps</text>

          <path d="M324 83 L330 83" className="dg-edge" />

          <text x="398" y="46" className="dg-cap" textAnchor="middle">tool</text>
          <rect x="334" y="54" width="128" height="58" rx="7" className="dg-node" />
          <text x="398" y="79" className="dg-label-sm" textAnchor="middle">Audit</text>
          <text x="398" y="96" className="dg-sub" textAnchor="middle">step-3</text>
          <text x="398" y="140" className="dg-cap" textAnchor="middle">stroke, margin</text>

          <path d="M466 83 L474 83" className="dg-edge" />
          <rect x="476" y="69" width="28" height="28" rx="5" className="dg-node dg-warn" />
          <path d="M506 83 L514 83" className="dg-edge" />
          <text x="490" y="112" className="dg-cap" textAnchor="middle">g2</text>

          <text x="582" y="46" className="dg-cap" textAnchor="middle">llm</text>
          <rect x="518" y="54" width="128" height="58" rx="7" className="dg-node" />
          <text x="582" y="79" className="dg-label-sm" textAnchor="middle">Text gate</text>
          <text x="582" y="96" className="dg-sub" textAnchor="middle">step-3b</text>
          <text x="582" y="140" className="dg-cap" textAnchor="middle">requireTrue: pass</text>

          <path d="M650 83 L658 83" className="dg-edge" />
          <rect x="660" y="69" width="28" height="28" rx="5" className="dg-node dg-warn" />
          <path d="M690 83 L698 83" className="dg-edge dg-accent" />
          <text x="674" y="112" className="dg-cap" textAnchor="middle">g3</text>

          <text x="766" y="46" className="dg-cap" textAnchor="middle">llm</text>
          <rect x="702" y="54" width="128" height="58" rx="7" className="dg-node dg-accent" />
          <text x="766" y="79" className="dg-label-sm" textAnchor="middle">Classify</text>
          <text x="766" y="96" className="dg-sub" textAnchor="middle">step-4</text>
          <text x="766" y="140" className="dg-cap" textAnchor="middle">classifier</text>

          <text x="8" y="176" className="dg-cap">each step names a ROLE; providers binds that role to a model in the registry</text>
        </svg>
      </Diagram>

      <Shot
        src={SHOT_LINE_ART}
        alt="Black and white line art of woodland mushrooms, continuous outlines with no shading."
        title="What the audit step measures"
        caption="The line-art audit measures stroke weight, surviving grey, margin ink, and unsealed contour gaps on output like this. A page whose gaps would leak when filled fails the gate and the order re-renders it."
      />

      <p>
        <Link href="/concepts/gates-and-review">Gates and review</Link> covers the review queue and
        typed holds.
      </p>

      <h2>Artifacts</h2>
      <p>
        An artifact is the stored output of a run, plus the record of how it was produced. It has its own
        id and endpoint, and outlives the run.
      </p>

      <CodeBlock title="GET /v1/artifacts/artifact-0dc32dbb" language="json">
        {artifactShape}
      </CodeBlock>

      <p>
        Three fields carry everything Esy preserves. <code>content</code> holds the output itself —
        file URL, storage key, and the model that produced it. <code>qa</code> holds each check that ran
        and its verdict. <code>metadata</code> holds the keys the workflow&rsquo;s{' '}
        <code>artifactSchema</code> declared. Alongside them, <code>specVersionHash</code> pins the exact
        workflow version the run executed, so an artifact can be traced to the definition that made it.
      </p>

      <Callout title="Provenance is a convention, not a column" tone="note">
        There is no top-level <code>provenance</code> field on an artifact. Provenance data — the model
        used, the mechanism chosen, per-check verdicts — is written by the engine into the{' '}
        <code>content</code> and <code>qa</code> JSON. Read it from there, and do not expect a fixed
        schema across artifact types.
      </Callout>

      <p>
        Files are stored under <code>artifacts/&#123;artifactType&#125;/&#123;artifactId&#125;/</code>.{' '}
        <Link href="/concepts/artifacts">Artifacts</Link> has the full storage layout.
      </p>

      <h2>Inputs and model selection</h2>
      <p>
        An <code>intakeSchema</code> field asks for a result, not for the technique used to get it. A
        clip-art workflow accepts <code>backgroundRemovalEnabled: true</code>; it does not ask which
        removal algorithm to apply. The engine resolves that from the bound model.
      </p>

      <p>
        Concretely: each entry in the model registry carries capability flags, one of which is{' '}
        <code>supports_native_transparency</code>. If the bound image model declares it, the engine
        renders transparency directly and skips the removal step. If it does not, the engine renders
        normally and runs a removal tool afterwards. Either way it records which path it took in the
        step output as <code>transparencyMechanism</code>, one of:
      </p>

      <Table
        head={['Value', 'What ran']}
        rows={[
          [<code key="m1">native</code>, 'The image model produced transparency directly; the removal step was skipped.'],
          [<code key="m2">chroma-key</code>, 'Rendered on a keyable background, then keyed out.'],
          [<code key="m3">difference-matte</code>, 'Rendered twice against different backgrounds and matted by difference.'],
          [<code key="m4">post-process</code>, 'A background-removal model ran on the finished render.'],
        ]}
      />

      <p>
        The practical consequence is compatibility: because a saved intake never names a mechanism, it
        stays valid when a model gains a capability or a binding changes. Only the recorded
        provenance differs between runs. Quality checks evaluate the resulting image, so a new
        mechanism does not require rewriting them.
      </p>

      <Diagram
        title="Intake and binding"
        minWidth={880}
        caption="The intake carries the requested result. The engine reads the bound model's capability flags to choose a mechanism, and records which one it used."
      >
        <svg viewBox="0 0 900 296" role="img" aria-label="The intake declares the requested result; the engine selects a mechanism from model capability flags">
          <text x="8" y="18" className="dg-hdr">1 · INTAKE DECLARES</text>
          <text x="478" y="18" className="dg-hdr">2 · ENGINE RESOLVES</text>
          <path d="M450 8 L450 250" className="dg-rule" strokeDasharray="3 4" />

          <text x="8" y="48" className="dg-label">Requested result</text>
          <rect x="8" y="62" width="420" height="92" rx="7" className="dg-node" />
          <text x="26" y="88" className="dg-sub">prompt</text>
          <text x="410" y="88" className="dg-label-sm" textAnchor="end">&ldquo;a fox in a waistcoat&rdquo;</text>
          <text x="26" y="114" className="dg-sub">backgroundRemoval</text>
          <text x="410" y="114" className="dg-label-sm" textAnchor="end">true</text>
          <text x="26" y="140" className="dg-sub">aspectRatio</text>
          <text x="410" y="140" className="dg-label-sm" textAnchor="end">1:1</text>
          <text x="8" y="180" className="dg-cap">no mechanism field — stays valid across model changes</text>

          <text x="478" y="48" className="dg-label">Selected mechanism</text>
          <rect x="478" y="62" width="414" height="48" rx="7" className="dg-node" />
          <text x="496" y="84" className="dg-sub">model registry</text>
          <text x="874" y="92" className="dg-label-sm" textAnchor="end">supports_native_transparency</text>

          <path d="M600 114 L560 146" className="dg-edge dg-accent" />
          <path d="M770 114 L810 146" className="dg-edge" />
          <text x="566" y="132" className="dg-cap" textAnchor="end">true</text>
          <text x="806" y="132" className="dg-cap">false</text>

          <rect x="478" y="150" width="190" height="56" rx="7" className="dg-node dg-accent" />
          <text x="573" y="174" className="dg-label-sm" textAnchor="middle">render transparent</text>
          <text x="573" y="192" className="dg-sub" textAnchor="middle">removal skipped · $0</text>

          <rect x="702" y="150" width="190" height="56" rx="7" className="dg-node" />
          <text x="797" y="174" className="dg-label-sm" textAnchor="middle">render, then remove</text>
          <text x="797" y="192" className="dg-sub" textAnchor="middle">esy/chroma-key</text>

          <rect x="8" y="226" width="884" height="46" rx="7" className="dg-node dg-term" />
          <text x="26" y="248" className="dg-label-sm">
            Both record <tspan className="dg-sub">transparencyMechanism</tspan> in the step output.
          </text>
          <text x="26" y="264" className="dg-cap">quality checks evaluate the resulting image, so either path is checked the same way</text>
        </svg>
      </Diagram>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        {SHOT_STYLES.map(([name, src]) => (
          <figure key={name} className="diagram" style={{ margin: 0 }}>
            <div className="diagramPlate">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`The same fox subject rendered in the ${name} style.`}
                loading="lazy"
                style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8 }}
              />
            </div>
            <figcaption className="diagramCaption">
              <span className="diagramTitle">style: {name}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p>
        Two production renders of the same subject under different intake values. The style is an intake
        field; the model behind it is a binding.{' '}
        <Link href="/concepts/intake">Intake</Link> documents schema field types.
      </p>

      <h2>Costs and budgets</h2>
      <p>
        Cost is recorded per provider call, not per run. Every call writes one row to the provider cost
        ledger, carrying the provider, model, quantity, unit price, and the run and step it belongs to.
        A single step can produce several rows — a step that fans out over chunks writes one per call.
      </p>

      <p>Each row moves through three states:</p>

      <Diagram
        title="Cost states"
        minWidth={520}
        caption="A run's reported cost is the least-settled state among its rows: one estimated row makes the whole run estimated. Rows roll up step → run → workflow → project → workspace."
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
          <text x="0" y="106" className="dg-cap">three states — estimated · provider_reported · reconciled</text>
        </svg>
      </Diagram>

      <h3>Budgets</h3>
      <p>
        A budget attaches to a workspace, a project, or a workflow, over a period of{' '}
        <code>total</code>, <code>daily</code>, <code>weekly</code>, or <code>monthly</code>. It is
        evaluated <em>before</em> a run starts, against the run&rsquo;s estimate — not against actual
        spend afterwards. Its <code>enforcementMode</code> decides what happens when the estimate would
        push spend past the limit:
      </p>

      <Table
        head={['Mode', 'Behaviour']}
        rows={[
          [<code key="e1">hard_stop</code>, 'Refuses the run when spend plus estimate exceeds the limit.'],
          [<code key="e2">allow_overage</code>, 'Permits spend past the limit up to a declared overage amount, then refuses.'],
          [<code key="e3">allow_one_more</code>, 'Permits one run that crosses the limit; refuses once already at or over it.'],
          [<code key="e4">track_only</code>, 'Records spend and never refuses.'],
        ]}
      />

      <p>
        A budget can also carry <code>perRunCapUsd</code>, an independent ceiling on a single
        run&rsquo;s estimate, checked in every mode except <code>track_only</code>. A refused run
        returns <strong>402</strong> and is never created:
      </p>

      <CodeBlock title="402 Payment Required" language="json">
        {budgetRefusal}
      </CodeBlock>

      <p>
        The refusal is durably recorded even though no run exists, so refusals are auditable.{' '}
        <Link href="/concepts/costs">Costs and budgets</Link> covers rollups and the refusal log.
      </p>

      <h2>End to end</h2>
      <p>
        One request, followed through every object above. The workflow is{' '}
        <code>generate-coloring-page</code>; the intake asks for a cartoon lion.
      </p>

      <Table
        head={['Stage', 'What happens', 'What you can read']}
        rows={[
          [
            <strong key="t1">1. Budget check</strong>,
            'Before anything is created, the run estimate is evaluated against any workspace, project, or workflow budget.',
            <>402 <code>budget_exceeded</code> if refused; nothing created</>,
          ],
          [
            <strong key="t2">2. Run created</strong>,
            <>The run is persisted with an id and pinned to workflow version <code>2026.09.10</code>.</>,
            <><code>run-7c41e9a2</code>, status <code>pending</code></>,
          ],
          [
            <strong key="t3">3. step-1 render</strong>,
            'The image model bound to imageGenerator renders the line art. One cost row is written.',
            <>ledger row, <code>estimated</code> → <code>provider_reported</code></>,
          ],
          [
            <strong key="t4">4. step-2 post-process</strong>,
            'A local tool thresholds the image, seals contour gaps, and raises strokes to the print floor. No provider call, no cost.',
            <>step record, <code>$0</code></>,
          ],
          [
            <strong key="t5">5. step-3 audit</strong>,
            'A local tool measures stroke weight, grey, margin ink, and gaps.',
            <><code>qa.checks[line-art-audit]</code></>,
          ],
          [
            <strong key="t6">6. step-3b text gate</strong>,
            <>An llm step OCRs the page and returns a verdict. <code>requireTrue: &quot;pass&quot;</code> means a falsy verdict stops the run here.</>,
            <><code>qa.checks[text-gate]</code></>,
          ],
          [
            <strong key="t7">7. step-4 classify</strong>,
            'An llm step produces catalog metadata from the declared category list.',
            <><code>metadata.classification</code></>,
          ],
          [
            <strong key="t8">8. Artifact</strong>,
            'The output is persisted with its content, qa record, and metadata, and linked to the run.',
            <><code>artifact-0dc32dbb</code></>,
          ],
        ]}
      />

      <CodeBlock title="GET /v1/runs/run-7c41e9a2 — after completion" language="json">
        {finishedRun}
      </CodeBlock>

      <p>
        Because this template declares no <code>approval</code> gate, the run went from{' '}
        <code>running</code> to <code>completed</code> without stopping. Had it declared one, the run
        would be sitting at <code>review</code> with the same artifact already stored, waiting for a
        decision.
      </p>

      <p>
        Running the same intake again produces a different artifact — the model samples differently each
        time. These are three production runs of one prompt:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
        {SHOT_APPLES.map((src, i) => (
          <figure key={src} className="diagram" style={{ margin: 0 }}>
            <div className="diagramPlate">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Clip art of a bright red apple with a green leaf, variation ${i + 1} of three.`}
                loading="lazy"
                style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8 }}
              />
            </div>
            <figcaption className="diagramCaption">
              <span className="diagramTitle">run {i + 1}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p>
        Each is its own artifact with its own id, cost rows, and quality record. This is why runs and
        artifacts are separate objects: the workflow is the constant, and each execution of it is
        independently stored and independently auditable.
      </p>

      <p>
        <Link href="/guides/generate-clip-art-asset">Generate a clip-art asset</Link> walks a full run
        with live request and response bodies.
      </p>

      <h2>What Esy manages</h2>
      <p>
        Esy is responsible for executing workflows and preserving how their outputs were produced:
        provider routing, retries, quality checks, human review state, artifact storage, and cost
        capture.
      </p>
      <p>
        It does not measure what happens to an artifact after it leaves — sales, clicks, engagement, or
        watch-through are the consuming product&rsquo;s concern. It does not integrate with
        distribution marketplaces as a core responsibility. And it is not a chat API: a conversation can
        be an input to a workflow or be stored as an artifact, but the unit of work is a run, not a
        message.
      </p>

      <Takeaways
        items={[
          <>
            Workspace and project organize access and spend. Workflow, run, and artifact are the
            execution objects.
          </>,
          <>
            A workflow declares <code>intakeSchema</code>, <code>runtimeSteps</code>,{' '}
            <code>gates</code>, <code>providers</code>, <code>budgetPolicy</code>, and{' '}
            <code>artifactSchema</code>. Steps name roles; <code>providers</code> binds roles to models.
          </>,
          <>
            Ten run statuses, six terminal. A run only stops at <code>review</code> if its workflow
            declares an <code>approval</code> or <code>hitl</code> gate.
          </>,
          <>
            Steps execute; gates evaluate. Automated checks are <code>requireTrue</code> on the step
            that produces the verdict; human checks are entries in <code>gates</code>.
          </>,
          <>
            Cost is one ledger row per provider call, in three states, enforced against budgets before
            the run is created.
          </>,
        ]}
      />
    </DocsPageShell>
  );
}
