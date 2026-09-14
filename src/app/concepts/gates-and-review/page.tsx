import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import {
  Callout,
  CodeBlock,
  Diagram,
  DiagramDefs,
  PageHeader,
  Status,
  Table,
  Takeaways,
} from '@/components/docs/Primitives';

export const metadata = {
  title: 'Gates and review',
  description:
    'How Esy judges work: quality gates between steps, the escalation ladder, the human review queue, and typed holds.',
};

const gate = `{
  "id": "gate-text",
  "name": "OCR text gate",
  "type": "quality",
  "inputs": ["audited"],
  "outputs": ["lettering-checked"],
  "unlocks": ["step-4"]
}`;

const qa = `"qa": {
  "status": "pending_review",
  "checks": [
    { "id": "text-gate", "label": "Text gate", "status": "pass", "detail": "" }
  ]
}`;

const rejected = `{
  "status": "failed",
  "error": "step 'step-4': OCR text gate rejected the render — verdict: {
    \\"foundText\\": \\"BRIEF, STRATEGY, CREATIVE\\",
    \\"pass\\": false,
    \\"reason\\": \\"The image contains multiple legible text elements, which
                 violates the 'none' text policy requiring zero readable text.\\"
  }"
}`;

const decide = `curl -X POST https://api.esy.com/v1/queue/run-a1b2c3d4/decision \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{ "decision": "approve", "note": "Colours match the pack." }'`;

const hold = `curl -X POST https://api.esy.com/v1/queue/run-a1b2c3d4/decision \\
  -H "Authorization: Bearer $ESY_API_KEY" \\
  -H "content-type: application/json" \\
  -d '{
    "decision": "approve",
    "patch": { "category": "woodland-animals" }
  }'`;

export default function GatesAndReviewPage() {
  return (
    <DocsPageShell>
      <DiagramDefs />

      <PageHeader
        eyebrow="Core concepts · Gates"
        title="Gates and review"
        opener="review"
        lead={
          <>
            Steps do the work; gates decide whether it was good enough. Most gates are automatic and
            invisible — you only meet them when one rejects something. A few are human, and those are why
            a run can end in <code>review</code> rather than <code>completed</code>.
          </>
        }
      />

      <h2>Steps do, gates judge</h2>
      <p>
        A gate is not a step. It runs no model and produces no output of its own. It inspects what the
        previous step produced and declares which step id it <code>unlocks</code> — that is the whole
        mechanism.
      </p>

      <CodeBlock title="a gate, as declared in a workflow" language="json">
        {gate}
      </CodeBlock>

      <Table
        head={['Gate type', 'Who decides', 'Effect']}
        rows={[
          [
            <code key="a">quality</code>,
            'The engine, automatically',
            'Passes silently, or fails the step and triggers escalation.',
          ],
          [
            <code key="b">approval</code>,
            'A person',
            <>
              Parks the run in <Status key="s" value="review" tone="warn" /> until someone decides.
            </>,
          ],
          [
            <code key="c">hitl</code>,
            'A person',
            'Same as approval; the two names are interchangeable in practice.',
          ],
        ]}
      />

      <Callout title="Only approval gates produce a review" tone="note">
        If a workflow declares no <code>approval</code> or <code>hitl</code> gate, its runs go straight
        from <code>running</code> to <code>completed</code>. Most public workflows are in that category —
        they are gated on quality, not on a human.
      </Callout>

      <h2>When an automatic gate rejects</h2>
      <p>
        A failed quality gate does not necessarily fail the run. The engine has an escalation ladder: it
        rewinds the cursor, rebinds the role that produced the bad output to a different tool, and re-runs
        that segment. Only when the ladder is exhausted does the run fail.
      </p>

      <Diagram
        title="The escalation ladder"
        minWidth={760}
        caption={
          <>
            The failed attempt survives as a step record carrying{' '}
            <code>escalatedToRung</code> and <code>escalatedToTool</code>. Work already paid for is never
            re-bought.
          </>
        }
      >
        <svg viewBox="0 0 760 250" role="img" aria-label="A failed audit rewinds to the removal step, rebinds it to a different tool, and re-runs">
          <text x="8" y="16" className="dg-hdr">WHEN A VERDICT STEP REJECTS</text>

          <text x="8" y="62" className="dg-sub">attempt 1</text>
          <rect x="96" y="38" width="140" height="48" rx="7" className="dg-node" />
          <text x="166" y="60" className="dg-label-sm" textAnchor="middle">Render</text>
          <text x="166" y="76" className="dg-sub" textAnchor="middle">step-1</text>
          <path d="M240 62 L250 62" className="dg-edge" />
          <rect x="256" y="38" width="140" height="48" rx="7" className="dg-node" />
          <text x="326" y="60" className="dg-label-sm" textAnchor="middle">Remove bg</text>
          <text x="326" y="76" className="dg-sub" textAnchor="middle">fal/birefnet</text>
          <path d="M400 62 L410 62" className="dg-edge" />
          <rect x="416" y="38" width="140" height="48" rx="7" className="dg-node dg-bad" />
          <text x="486" y="60" className="dg-label-sm" textAnchor="middle">Alpha audit</text>
          <text x="486" y="76" className="dg-sub" textAnchor="middle">halo rejected</text>
          <rect x="576" y="38" width="140" height="48" rx="7" className="dg-node dg-ghost" />
          <text x="646" y="66" className="dg-label-sm dg-muted" textAnchor="middle">not reached</text>

          <path d="M486 92 C 486 126, 331 126, 331 150" className="dg-edge dg-bad" />
          <text x="408" y="120" className="dg-cap" textAnchor="middle">rewind + rebind the anchor role</text>

          <text x="8" y="182" className="dg-sub">attempt 2</text>
          <rect x="256" y="158" width="140" height="48" rx="7" className="dg-node dg-accent" />
          <text x="326" y="180" className="dg-label-sm" textAnchor="middle">Remove bg</text>
          <text x="326" y="196" className="dg-sub" textAnchor="middle">esy/difference-matte</text>
          <path d="M400 182 L410 182" className="dg-edge" />
          <rect x="416" y="158" width="140" height="48" rx="7" className="dg-node" />
          <text x="486" y="180" className="dg-label-sm" textAnchor="middle">Alpha audit</text>
          <text x="486" y="196" className="dg-sub" textAnchor="middle">pass</text>
          <path d="M560 182 L570 182" className="dg-edge dg-accent" />
          <rect x="576" y="158" width="140" height="48" rx="7" className="dg-node dg-accent" />
          <text x="646" y="186" className="dg-label-sm" textAnchor="middle">Classify</text>

          <text x="8" y="234" className="dg-cap">only when the ladder is exhausted does the run fail</text>
        </svg>
      </Diagram>

      <p>
        When it does fail, you get the gate&rsquo;s actual reasoning rather than a code. This is a real
        failure from a text gate catching lettering the image model invented:
      </p>

      <CodeBlock title="GET /v1/runs/{run_id}" language="json">
        {rejected}
      </CodeBlock>

      <h2>The QA record</h2>
      <p>
        Whatever happens, the checks that ran are recorded on the artifact. Each carries a status of{' '}
        <code>pass</code>, <code>fail</code>, or <code>pending</code>.
      </p>

      <CodeBlock title="artifact.qa" language="json">
        {qa}
      </CodeBlock>

      <Callout title="A check only exists if something measured it" tone="tip">
        There is no &ldquo;assumed pass&rdquo;. If a check is absent from <code>qa.checks</code>, nothing
        verified that property — which is different from it having been verified and passed. When you
        care, look for the check rather than the absence of a failure.
      </Callout>

      <h2>The review queue</h2>
      <p>
        Runs sitting in <code>review</code> make up the queue. It is a view, not a separate table —
        which is why there is nothing to keep in sync.
      </p>

      <Table
        head={['Endpoint', 'Does']}
        rows={[
          [<code key="a">GET /v1/queue</code>, 'Everything waiting on a person.'],
          [<code key="b">GET /v1/queue/count</code>, 'Just the number, for a badge.'],
          [<code key="c">POST /v1/queue/{'{run_id}'}/decision</code>, 'Decide one run.'],
          [<code key="d">POST /v1/queue/decisions</code>, 'Decide many at once.'],
        ]}
      />

      <CodeBlock title="approving a run" language="bash">
        {decide}
      </CodeBlock>

      <p>
        <code>decision</code> is <code>approve</code>, <code>reject</code>, or{' '}
        <code>request_changes</code>, and each maps to the matching terminal run status. Every decision
        is written to a durable ledger with who decided, when, and any note — so review is auditable
        rather than a state flip.
      </p>

      <h2>What approval will refuse</h2>
      <p>Two rules protect the queue from rubber-stamping:</p>

      <ul>
        <li>
          <strong>You cannot approve over a failed check.</strong> If any entry in{' '}
          <code>qa.checks</code> is <code>fail</code>, approval is rejected. Fix the work or re-run it.
        </li>
        <li>
          <strong>You cannot approve while a check is still pending.</strong> A verification that has not
          finished is not a verification.
        </li>
      </ul>

      <h2>Typed holds</h2>
      <p>
        Sometimes a run is held not because the work is wrong but because something is{' '}
        <em>missing</em> — most often a classification the model could not confidently assign. That is a
        typed hold, and it declares exactly which fields a reviewer must supply.
      </p>

      <CodeBlock title="releasing a typed hold" language="bash">
        {hold}
      </CodeBlock>

      <p>
        The patch must match the hold exactly — no more fields, no fewer. Supplying extra keys is
        refused, and so is the placeholder <code>&quot;uncategorized&quot;</code>: a hold exists
        precisely because that answer is not acceptable.
      </p>

      <Callout title="Humans approve at gates; machines preserve between them" tone="note">
        Between two gates the engine is not allowed to quietly improve things — it preserves what it was
        given. A decision belongs at a gate, where it is recorded and attributable. That is what makes an
        approved artifact mean something later.
      </Callout>

      <Takeaways
        items={[
          <>
            Gates judge and unlock; they never execute work. Only <code>approval</code>/<code>hitl</code>{' '}
            gates involve a person.
          </>,
          <>
            A failed quality gate first tries to recover by rewinding and rebinding, and records every
            escalation.
          </>,
          <>
            Approval is refused over a failed or pending check, and a typed hold must be patched
            exactly.
          </>,
        ]}
      />
    </DocsPageShell>
  );
}
