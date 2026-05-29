import Link from 'next/link';
import { DocsPageShell } from '@/components/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Table } from '@/components/Primitives';

export const metadata = {
  title: 'Sub-workflows',
  description:
    'How a workflow composes another workflow as a child run. The parent step invokes a pinned template, maps intake into it, links the produced artifact, and rolls the child cost up into the parent run.',
};

// A subWorkflow step references a pinned child template and maps parent
// context paths into the child's intake fields.
const stepExample = `{
  "id": "step-1",
  "name": "Research report",
  "kind": "subWorkflow",
  "subWorkflow": {
    "templateId": "generate-research-report",
    "templateVersion": "2026.05.29",
    "intakeMapping": {
      "intake.topic": "topic",
      "intake.audience": "audience"
    }
  }
}`;

const runShape = `Parent run  (generate-research-infographic)
   ├── step-1  subWorkflow ─────────────┐
   │                                    ▼
   │                            Child run  (generate-research-report)
   │                               └── artifact: research-report
   ├── step-2  llm   (compose infographic prompt)
   └── step-3  image (render infographic)
          └── artifact: infographic
                 └── sourceReportArtifactId → research-report`;

const costRollup = `parent run total
   = parent's own step costs (llm + image)
   + Σ child run totals (each child's own step costs)`;

export default function SubWorkflowsPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Sub-workflows"
        title="Sub-workflows"
        lead={
          <>
            A sub-workflow is a workflow invoked by another workflow. A{' '}
            <Link href="/concepts/workflow-templates">Workflow Template</Link> can declare a step that runs a
            second template as a child <Link href="/concepts/runs">Run</Link>, producing its own{' '}
            <Link href="/concepts/artifacts">Artifact</Link> and rolling its cost up into the parent. This is how
            Esy keeps artifacts reusable instead of re-deriving the same work inside every workflow.
          </>
        }
      />

      <h2>Why composition</h2>
      <p>
        Some artifacts are inputs to others. A research report is valuable on its own, and it is also the
        substrate for a research infographic, a brief, or a slide. Rather than re-implement research inside each
        of those workflows, the report is authored once as <code>generate-research-report</code> and{' '}
        <em>composed</em> by the others. The child run is a first-class Run: it has its own steps, telemetry,
        cost, artifact, and review state.
      </p>

      <h2>The subWorkflow step</h2>
      <p>
        Composition is declared as a runtime step with <code>kind: &quot;subWorkflow&quot;</code>. The step
        pins a child template <strong>id and version</strong> and supplies an <code>intakeMapping</code> — a map
        from parent context paths to the child template&rsquo;s intake field names.
      </p>

      <CodeBlock title="runtime step" language="json">
        {stepExample}
      </CodeBlock>

      <Table
        head={['Field', 'Purpose']}
        rows={[
          [<code key="t">templateId</code>, 'The child Workflow Template to invoke.'],
          [
            <code key="tv">templateVersion</code>,
            'Pinned child version. Composition is reproducible against the exact child definition used.',
          ],
          [
            <code key="im">intakeMapping</code>,
            <>
              Maps a parent context path (for example <code>intake.topic</code>) to a child intake field name
              (for example <code>topic</code>). The engine resolves each path against the parent run context and
              passes the result as the child&rsquo;s intake.
            </>,
          ],
        ]}
      />

      <h2>Parent and child runs</h2>
      <p>
        When the engine reaches a <code>subWorkflow</code> step, it creates a child run linked to its parent by{' '}
        <code>parentRunId</code> and <code>parentStepId</code>. The child executes to completion and persists its
        own artifact; the parent step records the <code>childRunId</code> so the two are navigable in both
        directions in the app.
      </p>

      <CodeBlock title="run shape" language="tree">
        {runShape}
      </CodeBlock>

      <p>
        The downstream artifact links back to the artifact the sub-workflow produced. An infographic composed
        from a report carries <code>sourceReportArtifactId</code>, so a reader can open the underlying{' '}
        <Link href="/concepts/artifacts">research artifact</Link> from the visual.
      </p>

      <h2>Cost rollup</h2>
      <p>
        A child run captures its own provider cost the same way any run does. The parent run&rsquo;s total is the
        sum of its own step costs plus the totals of every child it spawned, so a composed workflow reports the
        full cost of producing its artifact — not just the parent&rsquo;s steps.
      </p>

      <CodeBlock title="rollup" language="tree">
        {costRollup}
      </CodeBlock>

      <p>
        Cost <Link href="/concepts/costs">estimation</Link> mirrors this at planning time: estimating a template
        that contains a <code>subWorkflow</code> step resolves the pinned child template and adds its estimate to
        the parent&rsquo;s, so a <Link href="/concepts/budgets">budget</Link> pre-check sees the true per-run cost
        before launch.
      </p>

      <Callout title="Depth and cycles are bounded">
        Sub-workflow composition is guarded against runaway depth and cycles. A template cannot compose itself,
        directly or transitively, and nesting is capped. This keeps a single operator action from fanning out into
        an unbounded tree of runs and cost.
      </Callout>

      <h2>Related concepts</h2>
      <ul>
        <li>
          <Link href="/concepts/workflow-templates">Workflow templates</Link> — declare the{' '}
          <code>subWorkflow</code> step.
        </li>
        <li>
          <Link href="/concepts/runs">Runs</Link> — child runs link to their parent via <code>parentRunId</code>.
        </li>
        <li>
          <Link href="/concepts/artifacts">Artifacts</Link> — composed artifacts back-reference their source.
        </li>
        <li>
          <Link href="/concepts/costs">Costs</Link> and <Link href="/concepts/budgets">Budgets</Link> — child
          cost rolls up into the parent and into pre-run estimates.
        </li>
      </ul>
    </DocsPageShell>
  );
}
