import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { CodeBlock, EndpointList, PageHeader, PropertyTable } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Planning API — goals, tasks, messages',
  description:
    'Goals with measures, readings and pace; tasks with a day, a time and a goal; and the Inbox messages workers report through. Goals and tasks can be yours or a worker’s.',
};

const goalMeasured = `POST /v1/goals
{
  "workspaceId": "…",
  "title": "1,000 newsletter subscribers",
  "horizon": "half",
  "startsOn": "2026-11-03",
  "endsOn": "2027-04-30",
  "metric": { "source": "newsletter.subscribers", "unit": "subscribers", "target": 1000 }
}

// The response carries pace: state, expected, projected,
// short, perWeekNeeded, perWeekNow, daysGone, daysLeft.`;

const goalWorker = `POST /v1/goals
{
  "workspaceId": "…",
  "title": "Grow education clip art",
  "horizon": "quarter",
  "assigneeWorkerId": "worker-06997927",
  "target": { "count": 150, "categories": ["education"] }
}

// 422 without a target: a goal assigned to a worker
// needs a measurable target (count + categories).`;

const task = `POST /v1/tasks
{
  "workspaceId": "…",
  "projectId": "…",
  "goalId": "…",
  "title": "Write the LinkedIn post on this week's system",
  "scheduledOn": "2026-11-04",
  "scheduledTime": "10:00"
}`;

export default function PlanningApiPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Reference · Planning API"
        title="Planning API"
        lead={
          <>
            Goals, tasks and Inbox messages. A goal or task is yours when <code>assigneeWorkerId</code> is empty, or a
            worker’s when it’s set (its shifts consume it and account for it). Agents file tasks through the same API;{' '}
            <code>createdVia</code> records how. The model: <a href="/concepts/planning">The planner</a>,{' '}
            <a href="/concepts/goals">Goals and pace</a>, <a href="/concepts/assigned-work">Assigned work</a>.
          </>
        }
      />

      <h2>Goals</h2>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/goals?workspaceId=&status=&assigneeWorkerId=', desc: 'List goals; filter by status, horizon or assignee.' },
          { method: 'POST', path: '/v1/goals', desc: 'Create. A measured goal needs startsOn and endsOn; a worker’s goal needs a target.' },
          { method: 'GET', path: '/v1/goals/{goalId}', desc: 'One goal, with pace when it has a measure.' },
          { method: 'PATCH', path: '/v1/goals/{goalId}', desc: 'Update fields, the measure or status. Achieving by hand stamps achievedBy: "user".' },
          { method: 'DELETE', path: '/v1/goals/{goalId}', desc: 'Delete (linked tasks survive, unlinked).' },
          { method: 'GET', path: '/v1/goals/{goalId}/readings', desc: 'One reading a day, oldest first: the chart.' },
          { method: 'POST', path: '/v1/goals/{goalId}/readings', desc: 'Check in a value, with a note (manual measures).' },
          { method: 'POST', path: '/v1/goals/{goalId}:read', desc: 'Read the source now instead of waiting for the hourly sweep.' },
        ]}
      />
      <PropertyTable
        rows={[
          { name: 'metric.source', type: '"newsletter.subscribers" | "stripe.sales" | "manual"', required: true, desc: 'Where the number comes from.' },
          { name: 'metric.unit', type: 'string', required: true, desc: 'What’s counted, in words.' },
          { name: 'metric.target', type: 'number', required: true, desc: 'The value to reach by endsOn.' },
          { name: 'metric.start', type: 'number', desc: 'The value on startsOn. Left out, Esy fills it from the source.' },
          { name: 'metric.newsletterId', type: 'uuid', desc: 'newsletter.subscribers only: which newsletter.' },
          { name: 'parentGoalId', type: 'uuid', desc: 'Makes it a milestone of a bigger goal.' },
        ]}
      />
      <CodeBlock title="your own goal, with a measure" language="jsonc">
        {goalMeasured}
      </CodeBlock>
      <CodeBlock title="a worker’s goal, with a target" language="jsonc">
        {goalWorker}
      </CodeBlock>

      <h2>Tasks</h2>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/tasks?workspaceId=&status=&assigneeWorkerId=&dateFrom=&dateTo=', desc: 'List tasks; the date window matches dueOn or scheduledOn (one query paints a calendar).' },
          { method: 'POST', path: '/v1/tasks', desc: 'Create. scheduledOn plans it for a day; scheduledTime puts it on the Timeline; goalId files it under a goal.' },
          { method: 'GET', path: '/v1/tasks/{taskId}', desc: 'One task.' },
          { method: 'PATCH', path: '/v1/tasks/{taskId}', desc: 'Update fields or status; entering done stamps completedAt. status: dropped keeps it in the record.' },
          { method: 'DELETE', path: '/v1/tasks/{taskId}', desc: 'Delete.' },
        ]}
      />
      <CodeBlock title="a task under a goal, at a time" language="json">
        {task}
      </CodeBlock>

      <h2>Messages (the Inbox)</h2>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/messages?workspaceId=&kind=&unread=', desc: 'Your Inbox: reports, alerts and messages (senderType: system, user or worker).' },
          { method: 'GET', path: '/v1/messages/unread-count', desc: 'Unread, split by decision weight (messages vs alerts).' },
          { method: 'PATCH', path: '/v1/messages/{messageId}', desc: 'Read and archive state only; a message’s content never changes.' },
        ]}
      />
      <p>
        What must happen on a schedule, with proof, is a commitment, not a task: <a href="/api/commitments">Commitments API</a>.
      </p>
    </DocsPageShell>
  );
}
