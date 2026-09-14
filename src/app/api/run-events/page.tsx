import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, EndpointList, PageHeader, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Run Events (SSE)',
  description:
    'Live run updates over Server-Sent Events — snapshot on connect, lifecycle and step events, and the recommended reconnect ladder with polling fallback.',
};

const subscribeExample = `curl -N https://api.esy.com/v1/runs/run-807ee354/events \\
  -H "Authorization: Bearer $ESY_API_KEY"`;

const browserExample = `// Browsers: EventSource can't send headers — auth rides the session cookie.
const stream = new EventSource(
  "https://api.esy.com/v1/runs/" + runId + "/events",
  { withCredentials: true },
);

stream.addEventListener("snapshot", (e) => render(JSON.parse(e.data)));
for (const name of ["run.started", "step.started", "step.phase",
                    "step.completed", "run.completed", "run.failed"]) {
  stream.addEventListener(name, (e) => apply(JSON.parse(e.data)));
}
// IMPORTANT: ignore event names you don't recognize — the contract is additive.`;

const envelopeExample = `event: step.completed
data: {
  "type": "step.completed",
  "runId": "run-807ee354",
  "ts": "2026-07-04T19:08:12.412Z",
  "status": "running",
  "templateId": "generate-clip-art-asset-v2",
  "currentStepIndex": 1,
  "stepCount": 3,
  "step": {
    "index": 0, "name": "Render image", "kind": "image",
    "status": "completed", "provider": "openai", "model": "gpt-image-2",
    "durationMs": 14210
  }
}`;

export default function RunEventsPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Reference · Run Events"
        title="Run Events (SSE)"
        lead={
          <>
            Watch runs progress and finish <strong>without polling</strong>: two Server-Sent
            Events streams deliver a snapshot on connect, then lifecycle and step events as they
            happen. Plain HTTP — no WebSockets, no client library, the browser&apos;s native{' '}
            <code>EventSource</code> works as-is.
          </>
        }
      />

      <h2>Endpoints</h2>
      <EndpointList
        items={[
          {
            method: 'GET',
            path: '/v1/runs/{runId}/events',
            desc: 'One run, every event (lifecycle + steps + sub-step phases). Sends a full-run snapshot on connect and closes itself shortly after the terminal event.',
          },
          {
            method: 'GET',
            path: '/v1/runs/events?workspaceId=&projectId=',
            desc: 'Firehose of your runs — lifecycle events only (created/started/artifact/terminal). Compact snapshot of non-terminal runs on connect; stays open until you close it.',
          },
        ]}
      />
      <p>
        Auth is the same as every other endpoint: <code>Authorization: Bearer</code> with an API
        key, or the session cookie from a browser. Ownership rules mirror the REST reads —
        workspace-bound keys only see their workspace.
      </p>
      <CodeBlock title="Subscribe from a backend" language="bash">
        {subscribeExample}
      </CodeBlock>
      <CodeBlock title="Subscribe from a browser" language="js">
        {browserExample}
      </CodeBlock>

      <h2>The contract</h2>
      <Table
        head={['Rule', 'What it means for your client']}
        rows={[
          [
            'Snapshot first',
            'The first event is `snapshot` — the authoritative current state. Replace your local state with it wholesale; every later event is an incremental hint.',
          ],
          [
            'Events are state hints',
            'Each event carries enough to render (status, step info, timing). There is no Last-Event-ID resume: on reconnect you simply get a fresh snapshot. Refetch the run if you need detail an event doesn’t carry (e.g. the priced cost ledger).',
          ],
          [
            'Additive evolution',
            'New event names and fields will appear over time. Ignore anything you don’t recognize — never treat an unknown event as an error.',
          ],
          [
            'Heartbeats',
            'Comment lines (`: hb`) arrive every ~20s. No traffic for more than ~40s means the connection is dead — reconnect.',
          ],
          [
            'Terminal close',
            'artifact.created always precedes run.completed / run.review / run.failed, and the terminal event carries artifactId — safe to close on the terminal event.',
          ],
        ]}
      />

      <h2>Event names</h2>
      <Table
        head={['Event', 'Fires when', 'On the firehose?']}
        rows={[
          [<code key="1">run.created</code>, 'run accepted (pending)', 'yes'],
          [<code key="1q">run.queued</code>, 'waiting for an execution slot', 'yes'],
          [<code key="2">run.started</code>, 'execution begins', 'yes'],
          [
            <code key="3">step.started / step.completed / step.failed</code>,
            'each workflow step boundary',
            'no (single-run stream only)',
          ],
          [
            <code key="4">step.phase</code>,
            'sub-step checkpoints inside long provider calls (e.g. callingProvider, parsingOutput)',
            'no',
          ],
          [<code key="5">artifact.created</code>, 'the artifact is persisted', 'yes'],
          [
            <code key="6">run.completed / run.review / run.failed</code>,
            'terminal state',
            'yes',
          ],
          [
            <code key="7">run.cancelled</code>,
            'you cancelled the run — terminal',
            'yes',
          ],
          [
            <code key="8">run.rejected / run.changes_requested</code>,
            'a reviewer decided a run that was in review — terminal',
            'yes',
          ],
        ]}
      />
      <CodeBlock title="An event on the wire" language="text">
        {envelopeExample}
      </CodeBlock>

      <h2>Recommended client ladder</h2>
      <p>
        This is the pattern os.esy.com ships — copy it rather than reinventing it. The worst case
        at every rung is plain polling, never a broken UI:
      </p>
      <ol>
        <li>
          <strong>Paint fast, then stream.</strong> Fire a normal <code>GET /v1/runs/{'{id}'}</code>{' '}
          immediately (renders in one round-trip) while the SSE handshake runs in parallel; let the
          snapshot replace state when it arrives.
        </li>
        <li>
          <strong>On stream error</strong>, close the socket, make one authenticated GET through
          your regular HTTP client — it refreshes an expired session (EventSource can&apos;t) and
          resyncs state — then reconnect with 1s → 8s backoff.
        </li>
        <li>
          <strong>After ~4 consecutive failures</strong>, fall back to polling the GET every ~2s
          and quietly retry the stream every ~30s.
        </li>
        <li>
          <strong>On a terminal event</strong>, do one final GET (the priced cost ledger and
          server-computed timings land there), then close.
        </li>
      </ol>

      <Callout title="Not the same as AI Gateway streaming">
        <p>
          <code>/v1/ai/completions</code> also streams — but that stream is the <em>tokens of one
          completion</em>. Run Events streams the <em>lifecycle of workflow runs</em>. If you are
          watching a generation finish, you want Run Events.
        </p>
      </Callout>
    </DocsPageShell>
  );
}
