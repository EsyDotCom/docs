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

const lookupExample = `{
  "id": "render",
  "kind": "image",
  "model": "openai/gpt-image-2",
  "promptTemplate": "{intake.prompt}. Style: {lookup.styleDescriptor}, clip art, transparent background",
  "lookups": {
    "styleDescriptor": {
      "from": "intake.style",
      "map": {
        "flat": "flat vector, bold outlines, clean shapes, solid colors",
        "doodle": "hand-drawn doodle, sketchy lines, playful ink"
      },
      "default": "flat vector, bold outlines, clean shapes, solid colors"
    }
  }
}`;

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
          [
            <code key="vis">visibility</code>,
            <>
              The publish ladder — <code>draft</code>, <code>internal</code>, or <code>public</code> — controlling
              where the template is listed. See <a href="#publishing">Publishing &amp; visibility</a> below.
            </>,
          ],
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

      <h2>The definition is the program</h2>
      <p>
        A template is <strong>data-driven</strong>: its stored <code>runtimeSteps</code> are not documentation of
        what some server code does — they <em>are</em> what executes. A single generic engine reads a
        template&rsquo;s steps and runs them (LLM call, image generation, tool call, agent loop, sub-workflow). There
        is no per-template, hand-written execution path: changing a template&rsquo;s behavior means editing the
        template, not editing and redeploying server code. Two templates with different steps are the same engine
        running different data.
      </p>

      <Callout title="One execution path">
        Every template runs through the same engine from its stored definition. A capability a template needs — for
        example a background-removal tool step — is added to the engine once as a step kind, after which any
        template can use it. The platform direction is zero template-specific execution code.
      </Callout>

      <h2>Resolving intake into prompts</h2>
      <p>
        A central promise of Esy is that operators <strong>don&rsquo;t write prompts</strong> — they supply
        structured intake and context, and the template composes the real provider prompt behind the scenes. A
        step&rsquo;s <code>promptTemplate</code> interpolates intake values by path (<code>{'{intake.prompt}'}</code>),
        so a short subject plus a few selections becomes the full engineered prompt the model actually sees. The
        operator never writes — or sees — that expansion.
      </p>
      <p>
        Some composition needs more than substitution: a selection like a style key has to become a rich descriptor
        phrase. Templates express this declaratively with <strong>lookups</strong> — a named map from an intake
        value to a fragment, with a default — exposed to the prompt as <code>{'{lookup.<name>}'}</code>. This keeps
        the mapping as template <em>data</em>, not code, so authors can add or tune styles without touching the
        engine.
      </p>
      <CodeBlock title="step with a declarative lookup" language="json">
        {lookupExample}
      </CodeBlock>
      <p>
        Here an operator submits <code>prompt: &ldquo;a fox&rdquo;</code> and <code>style: &ldquo;doodle&rdquo;</code>;
        the engine resolves <code>{'{lookup.styleDescriptor}'}</code> to the doodle phrase and renders the complete
        prompt. An unknown style falls back to the declared default. Lookups are a generic engine primitive — any
        template can use them for any intake-to-prompt mapping, not just visual styles.
      </p>

      <h2>The database is the single source of truth</h2>
      <p>
        A template&rsquo;s definition lives in the database and is authored, edited, and{' '}
        <Link href="/concepts/workflow-versioning">versioned</Link> through the API (<code>POST</code> /{' '}
        <code>PATCH /v1/workflows</code>) — the same path the Factory uses. The stored row is authoritative.
        Seed scripts are bootstrap-only: they may create initial rows, but they are <strong>not</strong> the source
        of truth and a row must never depend on re-running a script to stay correct. If a script and a row ever
        disagree, the row is what runs.
      </p>

      <h2 id="publishing">Publishing &amp; visibility</h2>
      <p>
        A template&rsquo;s <code>visibility</code> is the single control over <em>where it is listed</em> — a
        three-rung ladder, independent of any lifecycle status. Publishing is a deliberate promotion up the ladder,
        never a side effect of saving.
      </p>
      <Table
        head={['Visibility', 'Listed', 'Validated on save?']}
        rows={[
          [
            <code key="d">draft</code>,
            'Nowhere — private work in progress',
            'No — a draft may be saved incomplete or broken while it is authored',
          ],
          [
            <code key="i">internal</code>,
            'The operator app, runnable but not on the public site',
            'Yes',
          ],
          [
            <code key="p">public</code>,
            'The operator app and the public workflow catalog',
            'Yes',
          ],
        ]}
      />
      <p>
        Because the rungs nest (anything public is also runnable in the app), demoting from <code>public</code> to{' '}
        <code>internal</code> unlists a template from the public catalog while keeping it runnable; demoting to{' '}
        <code>draft</code> pulls it everywhere. The public catalog shows only <code>public</code>, system-owned
        templates.
      </p>

      <h3>Publish guards</h3>
      <p>
        Promoting a template to a listed rung (<code>internal</code> or <code>public</code>) runs publish-time
        validation. Two guards keep a listed template honest:
      </p>
      <Table
        head={['Guard', 'Rule']}
        rows={[
          [
            <strong key="x">Executability</strong>,
            <>
              A listed template must have a runnable definition — steps the engine can actually execute — and all
              references and sub-workflows must resolve. A decorative or empty definition cannot be listed.
            </>,
          ],
          [
            <strong key="e">Estimability</strong>,
            <>
              Every metered step must resolve to a known rate. See{' '}
              <Link href="/concepts/costs">Costs</Link> — a metered step with an unresolved rate is blocked so a
              template can never silently estimate <code>$0</code> while incurring real spend.
            </>,
          ],
        ]}
      />

      <h2>Audience</h2>
      <p>
        Templates serve two audiences:
      </p>
      <ul>
        <li>
          <strong>Workflow designers</strong> — Author new Templates that conform to the{' '}
          <Link href="/concepts/workflow-schemas">Workflow Schema</Link>. Decide what gates a Template has, what
          providers route each step, and what artifact schema it produces. Authoring is <strong>admin-only</strong>:
          creating and editing templates is restricted to platform admins, and admin-published templates are
          system-owned.
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
