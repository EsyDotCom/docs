import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Assigned work — goals & tasks',
  description:
    'Goals are outcomes; tasks are units of work. Both are assignable to you or to a worker — and worker goals are measurable, tracked, and achieved by the system.',
};

const goalTarget = `{
  "title": "Grow education clip art",
  "assigneeWorkerId": "worker-06997927",
  "target": { "count": 150, "categories": ["education"] },
  "progressCount": 41,
  "activity": [
    { "at": "2026-07-06T10:14:02Z", "shiftId": "shift-1a2b3c4d",
      "delta": 38, "progress": 41, "note": "+38 this shift · 41/150" }
  ]
}`;

export default function AssignedWorkPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Assigned work"
        title="Assigned work: goals & tasks"
        lead={
          <>
            There are things you need to do and things your workers need to do — the planning plane keeps them
            distinct with one field: the <strong>assignee</strong>. A goal or task belongs to you (assignee empty)
            or to a worker, whose shifts then consume it, act on it, and account for it by name in every report.
          </>
        }
      />

      <h2>The two nouns</h2>
      <Table
        head={['', 'Goal', 'Task']}
        rows={[
          ['What it is', 'an outcome to reach', 'a discrete unit of work'],
          ['Done means', 'the target is met (measurable) or the owner judges it done', 'the work happened'],
          [
            'Marked by',
            'measurable goals: the system, automatically, stamped with the worker id; judgment goals: you',
            'the assignee — a worker checks off its own scheduled directives with a completion note',
          ],
          ['Time', 'horizon (vision → week) + optional start/end window', 'scheduledOn (a day directive) or dueOn (a deadline)'],
          ['A worker uses it as', 'steering for every shift inside the window', 'a hard directive for that day’s shift'],
        ]}
      />

      <h2>Measurable goals</h2>
      <p>
        A goal assigned to a worker must carry a <strong>target</strong> — a worker never holds an outcome nobody
        can verify. Progress is a live catalog census (finished artifacts whose classification matches the
        target’s categories), computed every shift. When the number crosses the line, the goal achieves itself
        and the worker announces it in its report.
      </p>
      <CodeBlock title="a measurable goal, mid-flight" language="json">
        {goalTarget}
      </CodeBlock>
      <p>
        The <code>activity</code> ledger is the feedback loop made visible: every consuming shift appends an
        entry, so the goal record reads like a log of the work — never a sticky note that just sits there.
      </p>
      <p>
        Goals decide <strong>what</strong> gets made — never where it ships. Destination is the worker&rsquo;s
        assignment (its team&rsquo;s designated <a href="/concepts/outlets">outlet</a>, or its Solo outlet)
        and the site&rsquo;s sections. Steering demand and routing distribution are separate systems by design.
      </p>

      <h2>Day directives</h2>
      <p>
        “Focus on education Monday, flowers Tuesday” is two tasks assigned to the worker with{' '}
        <code>scheduledOn</code> set. The shift folds the day’s directives into planning before it starts, and —
        only off a healthy shift — checks them off itself with a completion note (“Worked in shift shift-1a2b:
        80/80 succeeded, $3.99”). Deadline-only (<code>dueOn</code>) worker tasks stay open for explicit
        completion: multi-shift outcomes belong in goals, not tasks.
      </p>

      <h2>The feedback loop</h2>
      <Table
        head={['Where', 'What you see']}
        rows={[
          ['The shift record', <><code>links.goalIds / taskIds</code> — “Steered by” provenance on every shift.</>],
          ['The goal record', 'progress count, the per-shift activity ledger, and who achieved it.'],
          ['The report', 'each assigned item accounted for by name, with its numbers — assigned work is never unmentioned.'],
        ]}
      />

      <Callout title="Unassigned goals steer nobody">
        Assignment is the steering contract. Your own goals never leak into a worker’s planning, and a workspace
        goal without an assignee is shared context — not an instruction.
      </Callout>
    </DocsPageShell>
  );
}
