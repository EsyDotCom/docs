import Link from 'next/link';
import { DocsPageShell } from '@/components/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Table } from '@/components/Primitives';

export const metadata = {
  title: 'Workflow templates',
  description:
    'Reusable workflow templates that define intake, runtime steps, providers, quality gates, and budget policy. The middle layer between Workflow Schemas (the rules) and Workflow Specifications (per-run instances).',
};

const workflowExample = `{
  "id": "generate-clip-art-asset",
  "name": "Generate Clip Art Asset",
  "artifactClass": "visual",
  "version": "2026.05.16",
  "schemaVersion": "workflow-schema-v1",
  "cadence": "On demand",
  "providers": {
    "image": "openai/gpt-image-2",
    "backgroundRemoval": "fal/birefnet-light"
  },
  "gates": ["prompt resolution", "provider execution", "background removal", "storage metadata", "HITL review"],
  "budgetPolicy": "Records estimated OpenAI image and fal.ai background-removal costs per run"
}`;

const anatomy = `workflow template
   ├── intake schema
   ├── runtime steps
   ├── provider policy
   ├── quality gates
   ├── budget policy
   └── artifact schema`;

const levelDiagram = `Workflow Schema  (rules)
       │
       ▼ a Template satisfies the Schema
Workflow Template  (declared)         ← this page
       │
       ▼ a Run instantiates the Template
Workflow Specification  (runtime)
       │
       ▼ production executes the Specification
Workflow Run + Artifact`;

export default function WorkflowTemplatesPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Workflow templates"
        title="Workflow templates"
        lead={
          <>
            Workflow templates are reusable definitions for producing artifacts. They specify intake, runtime
            steps, provider policy, artifact schema, quality gates, and budget policy. Templates sit between{' '}
            <Link href="/concepts/workflow-schemas">Workflow Schemas</Link> (the platform rules) and{' '}
            <Link href="/concepts/workflow-specifications">Workflow Specifications</Link> (per-run populated
            instances).
          </>
        }
      />

      <h2>Position in the model</h2>
      <p>
        Workflows on Esy are defined at three levels of abstraction. The Template is the middle layer — the
        named, packaged thing an operator picks when starting work. &ldquo;Visual Essay,&rdquo; &ldquo;Generate
        Clip Art Asset,&rdquo; &ldquo;Generate Coloring Page&rdquo; are all Templates. Each Template conforms to
        a <Link href="/concepts/workflow-schemas">Workflow Schema</Link>; each Run instantiates a Template into
        a <Link href="/concepts/workflow-specifications">Workflow Specification</Link>.
      </p>

      <CodeBlock title="levels" language="tree">
        {levelDiagram}
      </CodeBlock>

      <h2>Composition</h2>
      <p>
        A workflow template is a versioned definition for how a particular kind of artifact gets produced. The id
        is stable; runtime behavior evolves through explicit versions and configuration snapshots captured on each
        run.
      </p>

      <CodeBlock title="workflow.json" language="json">
        {workflowExample}
      </CodeBlock>

      <h2>Anatomy</h2>
      <CodeBlock title="anatomy" language="tree">
        {anatomy}
      </CodeBlock>

      <h2>Fields</h2>
      <Table
        head={['Field', 'Purpose']}
        rows={[
          [<code key="id">id</code>, 'Stable workflow identifier. Cannot change once published.'],
          [<code key="name">name</code>, 'Human-readable label shown in the app and admin tooling.'],
          [
            <code key="ac">artifactClass</code>,
            <>
              One of <code>visual</code>, <code>video</code>, <code>research</code>, or <code>knowledge</code>.
              Determines the artifact contract.
            </>,
          ],
          [<code key="v">version</code>, 'Date-tagged version of the workflow template definition.'],
          [
            <code key="sv">schemaVersion</code>,
            <>
              The <Link href="/concepts/workflow-schemas">Workflow Schema</Link> version this Template conforms
              to. Validated at publish time.
            </>,
          ],
          [<code key="cd">cadence</code>, 'How the template is invoked: on demand, scheduled, continuous, per pack.'],
          [<code key="g">gates</code>, 'Quality, safety, approval, and budget checkpoints before execution continues.'],
          [<code key="p">providers</code>, 'Provider routing for each runtime step.'],
          [<code key="bp">budgetPolicy</code>, 'Constraints that keep execution predictable before a run launches.'],
          [
            <code key="as">artifactSchema</code>,
            <>
              The shape of the artifact this Template produces — its artifact type, files, and metadata. The
              output end of the Template, parallel to <code>intakeSchema</code> at the input end.
            </>,
          ],
        ]}
      />

      <Callout title="Version snapshots are required">
        Every run must persist the workflow version, prompt template, model ids, background-removal model, file
        format and codec, quality gates, and pricing version used at execution time. The same workflow id can
        produce different runtime behavior across versions; runs must remain reproducible against the exact
        snapshot that produced them. These snapshots live in the{' '}
        <Link href="/concepts/workflow-specifications">Workflow Specification</Link> for each Run.
      </Callout>

      <h2>Audience</h2>
      <p>
        Templates serve two audiences:
      </p>
      <ul>
        <li>
          <strong>Workflow designers</strong> — Author new Templates that conform to the{' '}
          <Link href="/concepts/workflow-schemas">Workflow Schema</Link>. Decide what gates a Template has, what
          providers route each step, and what artifact schema it produces.
        </li>
        <li>
          <strong>Operators</strong> — Pick a Template from a library and supply intake to start a Run. Operators
          do not author Templates; they instantiate them.
        </li>
      </ul>

      <h2>Frequency</h2>
      <p>
        <strong>Many.</strong> One per artifact class, versioned. Esy ships several Templates today
        (<code>generate-clip-art-asset</code>, <code>visual-essay</code>, <code>generate-coloring-page-educational</code>,
        and more) and new Templates are added as new artifact classes are introduced.
      </p>

      <h2>Related concepts</h2>
      <ul>
        <li>
          <Link href="/concepts/workflow-schemas">Workflow schemas</Link> — the rules every Template must
          conform to.
        </li>
        <li>
          <Link href="/concepts/workflow-versioning">Workflow versioning</Link> — how a Template&rsquo;s immutable
          versions are published, selected, and pinned by runs.
        </li>
        <li>
          <Link href="/concepts/workflow-specifications">Workflow specifications</Link> — per-run populated
          instances of a Template.
        </li>
        <li>
          <Link href="/concepts/runs">Runs</Link> — durable execution records that instantiate Templates.
        </li>
        <li>
          <Link href="/concepts/artifacts">Artifacts</Link> — the outputs produced by a Run, traced back to
          their Template version.
        </li>
      </ul>
    </DocsPageShell>
  );
}
