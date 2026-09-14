import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Workers',
  description:
    'Durable principals that run bounded shifts on a schedule, produce artifacts against a standing job, and report to your Inbox in plain language.',
};

const shiftShape = `trigger (schedule or run-now)
   └─▶ SHIFT
        1. CONTEXT — read the catalog census + assigned work
        2. PLAN    — run a plan template (an internal, attributed run)
        3. EXECUTE — place a Generation Order (children fan out)
        4. PUBLISH — ship gated output to the job's outlet (optional)
        5. REPORT  — one Inbox report, in the worker's own voice
        └─▶ HALT   — a shift always ends; stop conditions escalate`;

const jobShape = `{
  "contentTypes": [{
    "key": "clipart",
    "planTemplate": "plan-clipart-batch",
    "targetTemplate": "generate-clip-art-asset-v2",
    "count": 50,
    "budgetUsd": 3.50
  }],
  "failureThreshold": 0.2,
  "defaultPriorities": "flowers, animals, space",
  "publishPolicy": "classified",
  "messaging": {
    "tone": "warm, direct, first person",
    "cadence": "every-shift",
    "requirements": ["per-type counts", "total spend"]
  }
}`;

const messagingShape = `"messaging": {
  "cadence": "every-shift",
  "voice": "plain English, first person",
  "requirements": [
    "how many images you created, and their categories",
    "for each pack: its title and the address it published to",
    "any pack that did NOT publish, and why it was staged instead",
    "the total spend, and the per-item cost"
  ]
}`;

export default function WorkersPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Workers"
        title="Workers"
        opener="shift"
        lead={
          <>
            A worker is a durable principal you hire to own one responsibility — one worker per report you want to
            read. It runs bounded <strong>shifts</strong> on its <strong>schedule</strong>, produces artifacts
            against its standing <strong>job</strong>, optionally publishes them to an <strong>outlet</strong>, and
            reports to your Inbox in plain language.
          </>
        }
      />

      <h2>Vocabulary</h2>
      <Table
        head={['Term', 'Meaning']}
        rows={[
          [<strong key="w">Worker</strong>, 'The durable principal: identity, title, job, template allow-list, status (active | paused | retired). Tenure ends only by decision.'],
          [<strong key="ti">Title</strong>, 'The worker’s role, especially within a team (e.g. Illustrator). Colors how it signs its reports; no routing keys off it.'],
          [<strong key="tm">Team</strong>, 'A department: named for what it PRODUCES (its domain — members inherit it as their specialty), with an optionally designated outlet — the fence: everything the crew publishes ships there.'],
          [<strong key="sp">Specialty</strong>, 'The worker’s own WHAT — it steers what every shift plans and produces. Blank on a team = inherit the team’s produces; a solo worker must state one. No worker exists without a WHAT.'],
          [<strong key="so">Solo outlet</strong>, 'A worker’s own channel, active only while solo. Joining a team defers to the team’s outlet — the solo outlet stays set but dormant, and wakes back up on leaving.'],
          [<strong key="j">Job</strong>, 'The standing per-shift spec: what to produce, how many, at what caps, in what voice, and where it publishes. Singular by discipline — the countable things that run are runs and orders.'],
          [<strong key="s">Shift</strong>, 'One bounded activation: trigger → plan → execute → publish → report → halt. A shift always ends; its record links every run, order, artifact, and message it touched.'],
          [<strong key="sc">Schedule</strong>, 'The WHEN primitive — a cron expression (UTC) that wakes a worker, or fires a single template directly.'],
          [<strong key="t">Trigger</strong>, 'What started a shift: schedule or manual run-now.'],
          [<strong key="r">Report</strong>, 'One Inbox message per shift, written in the worker’s own voice per its messaging spec. Figures come from the mechanical record — never invented.'],
        ]}
      />

      <h2>The shift</h2>
      <CodeBlock title="one shift" language="ascii">
        {shiftShape}
      </CodeBlock>
      <p>
        Every run a shift creates is attributed to the worker (<code>createdVia: &quot;worker&quot;</code> +{' '}
        <code>workerId</code>), so the whole trail — plan runs, order children, artifacts, spend — is auditable
        per worker, per shift.
      </p>

      <h2>The job</h2>
      <CodeBlock title="Worker.job" language="json">
        {jobShape}
      </CodeBlock>
      <p>
        Producing is not publishing: <code>publishPolicy</code> is the worker’s selection bar
        (<code>classified</code> publishes only work the classifier titled and categorized; <code>none</code>, the
        default, publishes nothing). <em>Where</em> it ships is the framework below — destination lives on the
        worker’s assignment, never in the job (and never on a goal).
      </p>

      <h3>Every field a content type takes</h3>
      <p>
        A <code>contentType</code> is one thing the worker makes. Each is planned, executed, capped, and published
        independently — a worker with six of them runs six small production lines every shift.
      </p>
      <Table
        head={['Field', 'Meaning']}
        rows={[
          [
            <code key="pt">planTemplate</code>,
            'The template that decides WHAT to make. It emits a plan artifact — the auditable record of what the worker knew and chose — and nothing is generated until it settles.',
          ],
          [
            <code key="tt">targetTemplate</code>,
            'The template that MAKES each item. Every planned item becomes one child run of this template, under a single order.',
          ],
          [
            <code key="c">count</code>,
            <>
              Items per shift. <strong>A count of 0 skips the content type entirely</strong> — no plan, no order, no
              cost. That is how you park a category until you want it.
            </>,
          ],
          [
            <code key="b">budgetUsd</code>,
            'Hard cap for this content type, per shift, enforced against the recorded cost ledger. Reaching it stops the line and settles what completed.',
          ],
          [
            <code key="if">itemFields</code>,
            'Which fields of a planned item are passed through as the child run’s intake.',
          ],
          [
            <code key="rf">requiredFields</code>,
            'Fields an item must carry to run at all. The planner is instructed, not trusted — an item missing one is dropped, not guessed at.',
          ],
          [
            <code key="sw">styleWhitelist</code>,
            'The worker’s style specialty. One knob, two jobs: it tells the planner which styles to choose among, and clamps anything off-list afterward.',
          ],
          [
            <code key="ib">intakeBase</code>,
            'Intake defaults every item inherits — quality tier, aspect ratio, the classifier’s category vocabulary.',
          ],
          [
            <code key="pie">planIntakeExtra</code>,
            'Extra intake passed to the PLAN template only: audience, pack goal, a pack-wide base style.',
          ],
          [
            <code key="pp">publishPolicy</code>,
            <>
              An object here (<code>{'{ "mode": "auto" | "hitl" }'}</code>), governing whether a finished{' '}
              <em>pack</em> is pushed to its ingest endpoint or staged for review. Not to be confused with the
              worker-level string of the same name.
            </>,
          ],
        ]}
      />

      <Callout title="Two fields named publishPolicy">
        <code>job.publishPolicy</code> is a <em>string</em> deciding whether individual artifacts publish to the
        outlet. <code>job.contentTypes[].publishPolicy</code> is an <em>object</em> deciding whether a finished pack
        is pushed to its ingest endpoint. They are independent, and both default to publishing nothing — a worker can
        cheerfully publish every asset while never shipping a single pack.
      </Callout>

      <h2>Composite output: the publish leg</h2>
      <p>
        Some work is bigger than one artifact. A themed pack is a plan, dozens of assets, product mockups, and a
        cover — and it is worthless delivered in pieces. After an order settles cleanly, the shift runs a{' '}
        <strong>publish leg</strong>: it composes the cover from the pack’s own hero assets, assembles one payload,
        and delivers it signed to the outlet’s ingest URL. Everything is idempotent on the order id, so re-publishing
        is always safe.
      </p>
      <p>
        A pack that is not clean is never pushed. Failed items, a cover that could not be generated or categorized, or
        a missing outlet each leave the pack <em>staged</em> — and the reason is recorded in the shift report rather
        than swallowed. See{' '}
        <a href="/guides/publish-packs-with-a-worker-team">Publish packs with a worker team</a> for the full
        build.
      </p>

      <h2>Teams, designations, and where work ships</h2>
      <p>
        One law governs distribution: <strong>designations and sections decide where work ships.</strong> Demand
        has its own hierarchy: the team’s <strong>produces</strong> (its domain) → the worker’s{' '}
        <strong>specialty</strong> (narrower, inherited when blank) → <strong>goals</strong> (measurable
        campaigns, refining further). The resolved specialty steers every shift’s planning — and a worker
        cannot exist without one.
      </p>
      <ol>
        <li>
          <strong>On a designated team → the team’s outlet. Period.</strong> A team with an outlet is a
          publishing contract for the whole crew — the fence. A member’s Solo outlet defers (kept, dormant), a
          matching sibling section can’t poach, and no goal can redirect. “This team publishes only to X” is
          provable, with zero asterisks. A team <em>without</em> an outlet is organizational only.
        </li>
        <li>
          <strong>Otherwise, the home site’s sections sort</strong> — the section outlet matching the artifact’s
          category claims it (<code>/flowers</code> catches <code>flowers</code>): permanent site taxonomy that
          outlives any goal.
        </li>
        <li>
          <strong>The rest lands on the worker’s Solo outlet.</strong> No home channel → unpublished, never a
          wrong page. A hard pin for a solo worker is a team of one.
        </li>
      </ol>
      <p>
        Every publish records its provenance (<code>routedVia</code>) and every assignment change is logged —
        designations are audit-grade. One artifact can still appear in many outlets via{' '}
        <a href="/concepts/outlets">syndication</a>: carrying is the outlet’s act, not the worker’s.
      </p>

      <h2>Stop conditions</h2>
      <p>
        A shift halts — never silently — when a stop condition trips: hard budget caps, a child-failure rate above
        the job’s threshold, or empty and skipped plans. Every breach files a high-priority task and an Inbox
        alert in the worker’s name, with the technical detail attached behind a disclosure.
      </p>

      <Callout title="The inbox speaks human">
        Workers communicate in natural language: what happened, what was done, what needs you. A report may be
        plain (the voice layer falls back to the mechanical summary on any failure) — but it may never be lost,
        and it may never omit assigned work.
      </Callout>

      <h2>What a report must contain</h2>
      <p>
        The prose is short on purpose, so the record rides with it rather than inside it. Every report carries a{' '}
        <strong>manifest</strong> behind a disclosure: each image with its URL and category, each pack with the
        address it published to, its cover, tags and facts — and, for anything that did not ship, the reason it was
        staged instead.
      </p>
      <p>
        You can make specific facts contractual with <code>messaging.requirements</code>. Each entry becomes a
        &ldquo;must include&rdquo; instruction, so a pack worker can be required to name the address it published to
        every single shift:
      </p>
      <CodeBlock title="job.messaging" language="json">
        {messagingShape}
      </CodeBlock>

      <h2>Steering a worker</h2>
      <p>
        You steer a worker by <strong>assigning work</strong>, not by editing its job: goals carry measurable
        targets it plans against every shift, and scheduled tasks are day directives it checks off itself. See{' '}
        <a href="/concepts/assigned-work">Assigned work</a>.
      </p>
    </DocsPageShell>
  );
}
