import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { CodeBlock, EndpointList, PageHeader } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Workers API',
  description:
    'Hire, steer, and observe workers: worker CRUD, run-now, the shift record, and the schedules that wake them.',
};

const shiftExample = `GET /v1/workers/{workerId}/shifts/{shiftId}

{
  "id": "shift-1a2b3c4d",
  "workerId": "worker-06997927",
  "trigger": "schedule",
  "status": "completed",
  "healthy": true,
  "summary": "Daily batch — 80/80 succeeded, $3.99",
  "totalCostUsd": 3.99,
  "links": {
    "runIds": ["run-…"], "orderIds": ["order-…"],
    "artifactIds": ["artifact-…"], "goalIds": ["goal-…"],
    "taskIds": ["task-…"], "messageIds": ["msg-…"]
  },
  "startedAt": "2026-07-06T10:00:04Z",
  "completedAt": "2026-07-06T10:14:31Z"
}`;

export default function WorkersApiPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Reference · Workers API"
        title="Workers API"
        lead={
          <>
            Workers are durable principals with a standing job; shifts are their bounded activations; schedules
            wake them. Everything a shift touches is linked on its record, and shift lifecycle events stream on
            the run-events firehose (<code>shift.started</code> / <code>shift.completed</code> /{' '}
            <code>shift.failed</code>).
          </>
        }
      />

      <h2>Workers</h2>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/workers?workspaceId=', desc: 'The roster.' },
          { method: 'POST', path: '/v1/workers', desc: 'Hire a worker: name, description (the responsibility), job, template allow-list.' },
          { method: 'GET', path: '/v1/workers/{workerId}', desc: 'One worker.' },
          { method: 'PATCH', path: '/v1/workers/{workerId}', desc: 'Update the job, allow-list, or status (active | paused | retired).' },
          { method: 'POST', path: '/v1/workers/{workerId}/run', desc: 'Start a shift now (409 if one is already running; preconditions fail here, visibly).' },
        ]}
      />

      <h2>Shifts</h2>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/workers/{workerId}/shifts', desc: 'The shift timeline, newest first.' },
          { method: 'GET', path: '/v1/workers/{workerId}/shifts/{shiftId}', desc: 'One shift — deep-linkable; links update live during the shift.' },
          { method: 'GET', path: '/v1/runs?workerId=', desc: 'Every run attributed to a worker (plan runs + order children).' },
        ]}
      />

      <CodeBlock title="a shift record" language="json">
        {shiftExample}
      </CodeBlock>

      <h2>Schedules</h2>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/schedules?workspaceId=', desc: 'All schedules.' },
          { method: 'POST', path: '/v1/schedules', desc: 'Create: five-field cron (UTC) + exactly one target — a worker to wake, or a template to run.' },
          { method: 'PATCH', path: '/v1/schedules/{scheduleId}', desc: 'Retime, rename, enable/disable.' },
          { method: 'DELETE', path: '/v1/schedules/{scheduleId}', desc: 'Remove a schedule.' },
        ]}
      />
    </DocsPageShell>
  );
}
