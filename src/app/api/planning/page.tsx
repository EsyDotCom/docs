import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { CodeBlock, EndpointList, PageHeader } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Planning API — goals, tasks, messages',
  description:
    'The planning plane: assignable goals with measurable targets, tasks and day directives, and the Inbox messages workers report through.',
};

const goalCreate = `POST /v1/goals
{
  "workspaceId": "…",
  "title": "Grow education clip art",
  "horizon": "quarter",
  "assigneeWorkerId": "worker-06997927",
  "target": { "count": 150, "categories": ["education"] }
}

// 422 without a target: a goal assigned to a worker
// needs a measurable target (count + categories).
// Goals decide WHAT gets made — never where it ships.
// Destination lives on the worker (team / Solo outlet).`;

export default function PlanningApiPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Reference · Planning API"
        title="Planning API"
        lead={
          <>
            Goals, tasks, and Inbox messages. Both goals and tasks carry an optional{' '}
            <code>assigneeWorkerId</code> — empty means yours; set means that worker’s shifts consume it, act on
            it, and account for it in their reports. Agents file tasks through the same API (
            <code>createdVia</code> records the auth class).
          </>
        }
      />

      <h2>Goals</h2>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/goals?workspaceId=&status=&assigneeWorkerId=', desc: 'List goals; filter by status, horizon, or assignee.' },
          { method: 'POST', path: '/v1/goals', desc: 'Create. Worker-assigned goals require a measurable target.' },
          { method: 'PATCH', path: '/v1/goals/{goalId}', desc: 'Update fields or status. Manual achieve stamps achievedBy: "user"; measurable worker goals achieve themselves.' },
          { method: 'DELETE', path: '/v1/goals/{goalId}', desc: 'Delete (linked tasks survive, unlinked).' },
        ]}
      />
      <CodeBlock title="assigning a measurable goal" language="json">
        {goalCreate}
      </CodeBlock>

      <h2>Tasks</h2>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/tasks?workspaceId=&status=&assigneeWorkerId=&dateFrom=&dateTo=', desc: 'List tasks; the date window matches dueOn OR scheduledOn (one query paints a calendar).' },
          { method: 'POST', path: '/v1/tasks', desc: 'Create. scheduledOn on a worker task makes it a day directive its shift checks off with a completionNote.' },
          { method: 'PATCH', path: '/v1/tasks/{taskId}', desc: 'Update fields or status; entering done stamps completedAt.' },
          { method: 'DELETE', path: '/v1/tasks/{taskId}', desc: 'Delete.' },
        ]}
      />

      <h2>Messages (the Inbox)</h2>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/messages?workspaceId=&kind=&unread=', desc: 'Your Inbox: reports, alerts, and messages (senderType distinguishes system | user | worker).' },
          { method: 'GET', path: '/v1/messages/unread-count', desc: 'Unread split by decision weight (messages vs alerts).' },
          { method: 'PATCH', path: '/v1/messages/{messageId}', desc: 'Read/archive state only — a message’s content is immutable.' },
        ]}
      />
    </DocsPageShell>
  );
}
