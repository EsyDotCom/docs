import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, PageHeader, Pipeline, Table, Takeaways } from '@/components/docs/Primitives';

export const metadata = {
  title: 'The planner — plan, goals, commitments, tasks',
  description:
    'How os.esy.com runs an organization’s week: the Plan at the top, goals with a pace, commitments that must happen with proof, and tasks you check off. Home, Today and Days read them all.',
};

export default function PlanningConceptPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Planning"
        title="The planner"
        opener="meter"
        lead={
          <>
            The planner is how an organization runs its week in os.esy.com. It keeps four kinds of record, from the
            long-term bet down to what’s on today, and Esy checks the ones that can be checked. Everything here is an
            api.esy.com record: the dashboard shows it, and agents read the same thing.
          </>
        }
      />

      <h2>From the bet down to today</h2>
      <Pipeline
        steps={[
          { name: 'Plan', desc: 'The bet, each brand’s engine, the score' },
          { name: 'Goals', desc: 'A number and a date, with a pace' },
          { name: 'Commitments', desc: 'What must happen, with proof' },
          { name: 'Tasks', desc: 'The next things you do' },
        ]}
      />
      <p>
        Read it top to bottom. The <a href="/concepts/the-plan">Plan</a> says where the business is going and what
        it’s measured by. <a href="/concepts/goals">Goals</a> are that measure, with a line to stay on.{' '}
        <a href="/concepts/commitments">Commitments</a> are the few things that move a goal and must happen on
        time, every day, every week, or once. Tasks are everything else you’ll do, filed under the goal they serve.
      </p>

      <h2>Three kinds of record, two tones</h2>
      <Table
        head={['Kind', 'Example', 'Done when', 'Tone']}
        rows={[
          ['Commitment', 'Three news posts a day by 9am; the newsletter every Thursday', 'Esy sees the proof by the deadline (or you tick a step Esy can’t see)', <strong key="f">Firm</strong>],
          ['Goal', '1,000 newsletter subscribers by April 30', 'The measure reaches the target', 'Pace, explained'],
          ['Task', 'Reply to the agency that asked about pricing', 'You check it off', <strong key="g">Gentle</strong>],
        ]}
      />
      <p>
        <strong>Firm</strong> means a miss stays at the top of Home until it’s done or excused with a reason, and a
        deadline never moves on its own. <strong>Gentle</strong> means Esy mentions a task, never chases it; a task
        that keeps rolling over gets one offer to make it smaller, give it a time, or drop it.
      </p>

      <h2>Where you see it</h2>
      <Table
        head={['Section', 'What it shows']}
        rows={[
          ['Home', 'The score board (today’s ring, points, level, perfect days, six weeks, badges), each brand as a lane, and the navy rail: what’s left today, the next deadline with a countdown, the must-dos and tasks you can tick there, and this week’s dated steps.'],
          ['Today', 'The critical checklist as chains you don’t want to break, the Timeline (today’s deadlines and the tasks you gave a time, on one clock), then To do.'],
          ['Plan', 'The hierarchy: the bet, the score, each engine, this week’s course, the next moves. In design; it takes Goals’ place.'],
          ['Goals', 'Your goals by horizon, each measured one with its pace. Becomes part of Plan.'],
          ['Days', 'The record, day by day: what got done and what was planned and is still open.'],
        ]}
      />

      <h2>Scope: the organization and its brands</h2>
      <p>
        Every record belongs to the organization or to one of its brands (a project). The scope picker in the bar
        narrows every section to one brand, or shows them all. A new record files under the brand in scope; a brand
        with no project yet gets one the first time something is filed for it.
      </p>

      <h2>Tasks in a sentence or two</h2>
      <p>
        A task has a title, an optional goal, an optional day (<code>scheduledOn</code>) and time (
        <code>scheduledTime</code>, which puts it on the Timeline), and an optional deadline (<code>dueOn</code>).
        A task planned for an earlier day and not done rolls over to today and says how many days late it is.{' '}
        <strong>Move</strong> sends it to today, tomorrow, next Monday, a date, a time, or no day; <strong>Drop</strong>{' '}
        keeps it in the record as dropped, never deleted. Reference: <a href="/api/planning">Planning API</a>.
      </p>

      <Callout title="Your goals and a worker’s goals are separate" tone="note">
        Goals and tasks can also be assigned to a worker, which steers its shifts (<a href="/concepts/assigned-work">Assigned work</a>).
        The planner shows only your own: a worker’s directives stay with the worker.
      </Callout>

      <Takeaways
        items={[
          'Four records, top to bottom: the Plan, goals, commitments, tasks.',
          'Commitments are firm and checked by Esy; tasks are gentle and checked by you; goals have a pace.',
          'Home, Today and Days are views of the same records, and agents read them through the API.',
        ]}
      />
    </DocsPageShell>
  );
}
