import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Status, Table, Takeaways } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Goals and pace — a number, a date, and whether you’ll make it',
  description:
    'An organization’s goals with a measure: where the number comes from, one reading a day, and a pace that says whether the line reaches the target in time.',
};

const measured = `POST /v1/goals
{
  "workspaceId": "…",
  "projectId": "…",                    // the brand; leave out for the organization
  "title": "1,000 newsletter subscribers",
  "horizon": "half",
  "startsOn": "2026-11-03",
  "endsOn": "2027-04-30",
  "metric": {
    "source": "newsletter.subscribers",
    "unit": "subscribers",
    "target": 1000                     // start: left out, Esy fills today's count
  }
}`;

const pace = `"pace": {
  "state": "behind",
  "expected": 240,        // where a straight line from start to target says you'd be today
  "projected": 667,       // where today's rate ends up by the end date
  "short": 333,
  "perWeekNeeded": 44,
  "perWeekNow": 26,
  "daysGone": 42,
  "daysLeft": 136
}`;

export default function GoalsConceptPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Planning"
        title="Goals and pace"
        lead={
          <>
            A goal is an outcome with a horizon. Give it a <strong>number and a date</strong> and it becomes a score:
            Esy reads the number from its source every hour, keeps one reading a day, and says whether the line is
            heading for the target in time, and what a week needs from here.
          </>
        }
      />

      <h2>Horizons</h2>
      <Table
        head={['Horizon', 'Ends']}
        rows={[
          [<code key="d">day</code>, 'Today'],
          [<code key="w">week</code>, 'This Sunday'],
          [<code key="m">month</code>, 'The month’s last day'],
          [<code key="q">quarter</code>, 'The quarter’s last day'],
          [<code key="h">half</code>, 'Six months on, less a day (Nov 1 → Apr 30)'],
          [<code key="y">year</code>, 'December 31'],
          [<code key="v">vision</code>, 'No end date'],
        ]}
      />

      <h2>A measure</h2>
      <p>
        <code>metric</code> holds the number. A measured goal needs <code>startsOn</code> and <code>endsOn</code>:
        pace is progress against time.
      </p>
      <Table
        head={['Field', 'Means']}
        rows={[
          [<code key="s">source</code>, 'Where the number comes from (below).'],
          [<code key="u">unit</code>, 'What’s counted, in words: “subscribers”, “sales”.'],
          [<code key="st">start</code>, 'The value on the start date. Left out, Esy fills it.'],
          [<code key="t">target</code>, 'The value to reach by the end date.'],
          [<code key="n">newsletterId</code>, 'For newsletter.subscribers: which newsletter. Left out, the organization’s main one.'],
        ]}
      />
      <Table
        head={['Source', 'Counts', 'Start when left out']}
        rows={[
          [<code key="n">newsletter.subscribers</code>, 'Confirmed readers on a newsletter’s list: the ones an issue reaches', 'Today’s count'],
          [<code key="s">stripe.sales</code>, 'Stripe charges since the start date, in the goal’s brand (or the whole organization). Refunds don’t count', '0'],
          [<code key="m">manual</code>, 'Values you check in, with a note', 'Required'],
        ]}
      />
      <p>A source Esy can’t read refuses the goal when it’s created, rather than saving a goal that can never show a number.</p>
      <CodeBlock title="a measured goal" language="jsonc">
        {measured}
      </CodeBlock>

      <h2>Readings</h2>
      <p>
        Esy keeps one reading per goal per day: the day’s latest. A sweep reads every measured goal hourly; you can
        ask for a read now, or check in a value yourself for a manual goal. The chart on the goal reads the readings,
        oldest first.
      </p>

      <h2>Pace</h2>
      <p>Every goal with a measure comes back with <code>pace</code>, worked out by Esy from the measure and the dates.</p>
      <CodeBlock title="pace on a goal" language="jsonc">
        {pace}
      </CodeBlock>
      <Table
        head={['State', 'Means']}
        rows={[
          [<Status key="e" value="early" />, 'Under a week in: one good day says more than the trend.'],
          [<Status key="o" value="on_pace" tone="good" />, 'The projection reaches at least 95% of the target.'],
          [<Status key="b" value="behind" tone="warn" />, 'The projection falls short.'],
          [<Status key="r" value="reached" tone="good" />, 'The target is met.'],
          [<Status key="x" value="ended" tone="bad" />, 'Past the end date, short.'],
        ]}
      />

      <h2>Milestones</h2>
      <p>
        A milestone is a smaller goal with <code>parentGoalId</code> set to the bigger one, with its own measure and
        end date. Dropping the big goal leaves its milestones.
      </p>

      <h2>Tasks under a goal</h2>
      <p>
        A task with a <code>goalId</code> is work toward that goal. That link is how the planner, and an agent, tell
        work that moves a goal from work that doesn’t.
      </p>

      <Callout title="Your goals, not a worker’s" tone="note">
        <code>metric</code> is your own score. A worker’s goal uses <code>target</code>, a catalog count its shifts
        work toward (<a href="/concepts/assigned-work">Assigned work</a>). The two are separate fields.
      </Callout>

      <p>
        Reference: <a href="/api/planning">Planning API</a>. Where goals sit: <a href="/concepts/planning">The planner</a>{' '}
        and <a href="/concepts/the-plan">The Plan</a>.
      </p>

      <Takeaways
        items={[
          'A measure is a source, a unit and a target, over a start and end date.',
          'Esy reads it hourly and keeps one reading a day.',
          'pace says where you are against the line, where you’ll land, and what a week needs.',
        ]}
      />
    </DocsPageShell>
  );
}
