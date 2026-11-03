import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, EndpointList, PageHeader, PropertyTable } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Commitments API',
  description:
    'Create daily, weekly and once commitments; read today’s, judged now, with the record, the chain, the score and rest days; mark steps done, excuse a day, take a rest day.',
};

const create = `POST /v1/commitments
{
  "workspaceId": "…",
  "projectId": "…",
  "title": "One Instagram post for the newsletter",
  "cadence": "daily",
  "timezone": "America/New_York",
  "startsOn": "2026-11-03",
  "items": [
    { "label": "Posted", "dayOffset": 0, "at": "12:00", "proof": "manual" }
  ]
}`;

const today = `GET /v1/commitments/today?workspaceId=…
{
  "items": [
    {
      "commitment": { "id": "…", "title": "Three news posts", "cadence": "daily", "etag": "\\"4\\"", … },
      "occurrence": {
        "dueOn": "2026-11-03",
        "status": "open",
        "summary": "1 of 3",
        "items": [
          { "label": "News post 1", "proof": "news_feed", "dueAt": "2026-11-03T14:00:00Z",
            "state": "done", "onTime": true, "doneAt": "…", "evidence": { "title": "…", "url": "…" } },
          { "label": "News post 2", "proof": "news_feed", "dueAt": "2026-11-03T14:00:00Z",
            "state": "open", "onTime": false }
        ]
      },
      "record":  [ { "dueOn": "2026-11-02", "status": "met", "onTime": true } ],
      "history": [ { "dueOn": "2026-11-02", "status": "met", "onTime": true, "rested": false } ],
      "streak": 6,
      "best": 12
    }
  ],
  "unresolved": [],
  "score": { "dailyDone": 1, "dailyDue": 3, "todayPoints": 10, "level": 3, … },
  "rests":  { "perMonth": 2, "used": 0, "left": 2 }
}`;

export default function CommitmentsApiPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Reference · Commitments API"
        title="Commitments API"
        lead={
          <>
            What must happen, with proof. Members read; owners and admins create and change. Changes carry the
            commitment’s etag and return <code>409</code> with the current one when it’s stale. The model:{' '}
            <a href="/concepts/commitments">Commitments</a>.
          </>
        }
      />

      <h2>Commitments</h2>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/commitments?workspaceId=', desc: 'The active commitments.' },
          { method: 'POST', path: '/v1/commitments', desc: 'Create one. Owners and admins.' },
          { method: 'PATCH', path: '/v1/commitments/{commitmentId}', desc: 'Change one, with If-Match. startsOn: null clears a fresh start.' },
          { method: 'DELETE', path: '/v1/commitments/{commitmentId}', desc: 'Archive it. Its record stays.' },
        ]}
      />
      <PropertyTable
        rows={[
          { name: 'workspaceId', type: 'uuid', required: true, desc: 'The organization.' },
          { name: 'projectId', type: 'uuid', desc: 'The brand it belongs to.' },
          { name: 'title', type: 'string', required: true, desc: 'In words.' },
          { name: 'cadence', type: '"daily" | "weekly" | "once"', required: true, desc: 'How often it comes due.' },
          { name: 'weekday', type: '0–6', desc: 'Weekly only: the due day, 0 = Monday.' },
          { name: 'dueDate', type: 'date', desc: 'Once only: the date it’s due by.' },
          { name: 'startsOn', type: 'date', desc: 'The first day it counts. Nothing before it is judged; earlier steps are skipped.' },
          { name: 'timezone', type: 'IANA zone', desc: 'The zone its times are in.' },
          { name: 'items', type: 'CommitmentItem[]', required: true, desc: <>Each <code>{'{label, dayOffset, at, proof}'}</code>. proof: news_feed, issue_sent, youtube, manual.</> },
          { name: 'firm', type: 'boolean', desc: 'A miss stays on top until done or excused.' },
          { name: 'position', type: 'integer', desc: 'Its order on the page.' },
        ]}
      />
      <CodeBlock title="a daily commitment, ticked by hand" language="json">
        {create}
      </CodeBlock>

      <h2>Today</h2>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/commitments/today?workspaceId=', desc: 'Each commitment’s current day judged now, with its record, history, streak and best; the unresolved misses; the score; the month’s rest days.' },
        ]}
      />
      <CodeBlock title="today, abridged" language="jsonc">
        {today}
      </CodeBlock>
      <p>
        An item’s <code>state</code> is <code>done</code>, <code>late</code>, <code>open</code>, <code>unknown</code>{' '}
        (Esy couldn’t read the source just now) or <code>skipped</code> (due before <code>startsOn</code>, so not
        counted). <code>unresolved</code> holds days in the last week that were missed and not excused.
      </p>

      <h2>A day: done, excused, rested</h2>
      <EndpointList
        items={[
          { method: 'POST', path: '/v1/commitments/{commitmentId}/occurrences/{dueOn}/items/{index}:done', desc: 'Mark a step done by hand. Not news: the feed proves those.' },
          { method: 'POST', path: '/v1/commitments/{commitmentId}/occurrences/{dueOn}/items/{index}:undo', desc: 'Take a by-hand mark back.' },
          { method: 'POST', path: '/v1/commitments/{commitmentId}/occurrences/{dueOn}:excuse', desc: 'Excuse the day (or the week) with {reason}. It stays on the record.' },
          { method: 'POST', path: '/v1/commitments/{commitmentId}/occurrences/{dueOn}:rest', desc: 'Take today off a daily item on purpose. Two a month; holds the run.' },
          { method: 'POST', path: '/v1/commitments/{commitmentId}/occurrences/{dueOn}:unrest', desc: 'Give the rest day back.' },
        ]}
      />
      <p>
        <code>index</code> is the item’s position in the commitment’s <code>items</code>, not in the day’s sorted list.
      </p>

      <Callout title="Esy counts; you read" tone="note">
        Runs, points, levels, badges and perfect days come back computed. Don’t recompute them in a client: read{' '}
        <code>score</code>, <code>streak</code> and <code>history</code> from today.
      </Callout>
    </DocsPageShell>
  );
}
