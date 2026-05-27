import Link from 'next/link';
import { DocsPageShell } from '@/components/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Table } from '@/components/Primitives';

export const metadata = {
  title: 'Workflow specifications',
  description:
    'The per-run populated blueprint of a Workflow Template. Production reads it to build the artifact. Carries full provenance back to its Template and Schema versions.',
};

const specExample = `{
  "id": "spec-7f3c2a91",
  "runId": "run-a1b2c3d4",
  "templateId": "generate-clip-art-asset",
  "templateVersion": "2026.05.16",
  "schemaVersion": "workflow-schema-v1",
  "createdAt": "2026-05-16T22:14:12.604Z",
  "intake": {
    "prompt": "a chipmunk family in a nest",
    "style": "cartoon",
    "aspectRatio": "1:1",
    "runtime": { "backgroundRemovalEnabled": true }
  },
  "resolvedPrompt": "Cartoon-style illustration of a chipmunk family in a nest, 1024×1024, white background, vector-ready clean lines.",
  "providerBindings": {
    "image": "openai/gpt-image-2-2026-04-21",
    "backgroundRemoval": "fal/birefnet-light"
  },
  "stepInstructions": [
    { "step": "prompt.resolve", "input": "intake", "output": "resolvedPrompt" },
    { "step": "image.generate", "input": "resolvedPrompt", "output": "rawImage" },
    { "step": "background.remove", "input": "rawImage", "output": "finalImage" },
    { "step": "storage.upload", "input": "finalImage", "output": "artifactRef" }
  ],
  "estimatedCostUsd": 0.053,
  "budgetCheck": "passed"
}`;

const levelDiagram = `Workflow Schema  (rules)
       │
       ▼
Workflow Template  (declared)
       │
       ▼ a Run instantiates the Template
Workflow Specification  (runtime)    ← this page
       │
       ▼ production executes the Specification
Workflow Run + Artifact`;

const visualEssaySpecExample = `---
status: APPROVED
topic: Silk - 3,000 Years of Thread, Empire, and Espionage
generated: 2026-02-09
visual_treatment: photorealistic
chapters: 7
figures: 10
lens_applied: history
---

# Visual Essay Invocation: The Luminous Thread

## Layer 1: Strategic Foundation

### Project Title
"The Luminous Thread: 5,000 Years of Silk, Secrecy, and Civilization"

### Executive Brief
... (the deterministic blueprint production reads to build the rendered essay)`;

export default function WorkflowSpecificationsPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Workflow specifications"
        title="Workflow specifications"
        lead={
          <>
            A Workflow Specification is the per-run populated instance of a{' '}
            <Link href="/concepts/workflow-templates">Workflow Template</Link>. It captures the operator&apos;s
            inputs, any intermediate artifacts the workflow generated (research, design research), and the
            synthesis decisions made along the way. Production reads it to build the artifact.
          </>
        }
      />

      <h2>Position in the model</h2>
      <p>
        Workflows on Esy are defined at three levels. The Specification is the runtime layer — produced when a{' '}
        <Link href="/concepts/runs">Run</Link> begins, executed by production, then archived with the Run for
        provenance. Many Specifications exist; one per Run.
      </p>

      <CodeBlock title="levels" language="tree">
        {levelDiagram}
      </CodeBlock>

      <h2>What a Specification contains</h2>
      <Table
        head={['Field', 'Purpose']}
        rows={[
          [<code key="id">id</code>, 'Stable identifier for this Specification. Addressable for the lifetime of its Run.'],
          [<code key="rid">runId</code>, 'The Run that produced this Specification.'],
          [
            <code key="tid">templateId</code>,
            'The Template this Specification instantiates. Resolved at Run start; immutable thereafter.',
          ],
          [
            <code key="tv">templateVersion</code>,
            'The exact Template version snapshot used. Pinned for reproducibility.',
          ],
          [
            <code key="sv">schemaVersion</code>,
            'The Schema version the Template conforms to. Captured for full provenance chain.',
          ],
          [
            <code key="ct">createdAt</code>,
            'Wall time the Specification was populated. Effectively the Run\'s start of synthesis.',
          ],
          [<code key="in">intake</code>, 'The operator-supplied inputs that initiated this Run.'],
          [
            <strong key="synth">synthesis fields</strong>,
            'Any decisions made by synthesis steps — resolved prompts, selected research, picked figures, chosen layouts. Specifics vary by Template.',
          ],
          [
            <code key="pb">providerBindings</code>,
            'The exact provider model/version routing used by this Run. Locked at Specification creation.',
          ],
          [
            <code key="si">stepInstructions</code>,
            'The deterministic blueprint each runtime step reads. Production does not consult the Template; it consults the Specification.',
          ],
          [
            <code key="ec">estimatedCostUsd</code>,
            'Pre-Run cost estimate, used to enforce budget policy before execution begins.',
          ],
        ]}
      />

      <h2>Example: clip art Specification</h2>
      <p>
        A populated Specification for one Run of <code>generate-clip-art-asset v2026.05.16</code>. Note the pinned
        Template version, the resolved prompt synthesized from the operator&apos;s intake, the locked provider
        bindings, and the deterministic step instructions.
      </p>
      <CodeBlock title="GET /v1/specifications/spec-7f3c2a91" language="json">
        {specExample}
      </CodeBlock>

      <h2>Example: visual essay Specification</h2>
      <p>
        A populated Specification for the <code>visual-essay</code> Template scales much larger — typically
        500–1,500 lines of structured content captured during the 14-gate synthesis pipeline. Below is the header
        from a real archived Specification for an essay on the history of silk.
      </p>
      <CodeBlock title="essays/silk/SPEC.md (excerpt)" language="markdown">
        {visualEssaySpecExample}
      </CodeBlock>

      <h2>Complexity scales with the artifact</h2>
      <p>
        Specifications range from a few lines (trivial workflows where the inputs effectively <em>are</em> the
        Specification) to thousands of lines (visual essays with full multi-layer populated structure). The
        primitive is the same; only the size varies with what is being produced.
      </p>

      <Callout title="Production reads the Specification, never the raw intake.">
        Once a Specification is created, downstream production gates do not look back at the operator&apos;s
        intake. They consult the Specification. This makes synthesis decisions explicit, auditable, and
        replayable. The Specification is the single source of truth for everything that happens after the Run
        starts.
      </Callout>

      <h2>Audience</h2>
      <p>
        Specifications are consumed by:
      </p>
      <ul>
        <li>
          <strong>Production agents and code</strong> — Every runtime step reads from the Specification, not
          from operator intake. This is what makes Runs reproducible.
        </li>
        <li>
          <strong>Reviewers</strong> inspecting how an artifact was made — provenance investigations, quality
          audits, or debugging when output deviated from intent.
        </li>
        <li>
          <strong>Platform tooling</strong> for replays, A/B testing across Template versions, and cost
          attribution.
        </li>
      </ul>

      <h2>Frequency</h2>
      <p>
        <strong>One per Run.</strong> Every Run produces exactly one Workflow Specification at the start of
        execution. Specifications are persisted alongside their Run record for the Run&apos;s retention period.
      </p>

      <h2>Provenance</h2>
      <p>
        Every Specification carries pointers up the chain:
      </p>
      <ul>
        <li>
          <code>schemaVersion</code> — which Workflow Schema version the Template conformed to.
        </li>
        <li>
          <code>templateId</code> and <code>templateVersion</code> — which Template version was instantiated.
        </li>
        <li>
          <code>runId</code> — which Run executed this Specification.
        </li>
      </ul>
      <p>
        And pointers down the chain:
      </p>
      <ul>
        <li>The Artifact(s) produced from this Specification.</li>
        <li>Step telemetry recorded against the Specification&apos;s step instructions.</li>
        <li>Cost reconciliation against the estimated cost.</li>
      </ul>
      <p>
        The full chain (Schema → Template → Specification → Run → Artifact) is queryable for any artifact Esy
        has ever produced.
      </p>

      <h2>Related concepts</h2>
      <ul>
        <li>
          <Link href="/concepts/workflow-schemas">Workflow schemas</Link> — the rules every Template (and
          transitively every Specification) must conform to.
        </li>
        <li>
          <Link href="/concepts/workflow-templates">Workflow templates</Link> — the predesigned workflows
          Specifications are instantiated from.
        </li>
        <li>
          <Link href="/concepts/runs">Runs</Link> — the durable execution records that produce Specifications.
        </li>
        <li>
          <Link href="/concepts/artifacts">Artifacts</Link> — the final outputs, traced back through the
          Specification to their Template and Schema versions.
        </li>
      </ul>
    </DocsPageShell>
  );
}
