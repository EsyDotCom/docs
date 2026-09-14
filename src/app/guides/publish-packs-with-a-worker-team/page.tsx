import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, PageHeader, StepList, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Publish packs with a worker team',
  description:
    'Build a crew of workers that plan themed packs, generate every asset, compose a cover, and publish the finished pack to your own site — the setup behind clip.art/packs.',
};

const outletCreate = `POST /v1/outlets
{
  "name": "clip.art packs",
  "slug": "clip-art-packs",
  "siteUrl": "https://clip.art",
  "sectionPath": "/packs",
  "acceptedKinds": [],
  "revalidateUrl": "https://clip.art/api/ingest/packs"
}

// 201 — revalidateSecret is revealed EXACTLY ONCE. Store it now.
{
  "id": "outlet-553694cb",
  "slug": "clip-art-packs",
  "revalidateSecret": "whsec_..."
}`;

const teamCreate = `POST /v1/teams
{
  "workspaceId": "9a1b6d4c-...",
  "name": "ClipArt Pack Team",
  "produces": "Themed clip-art packs, shipped to clip.art/packs",
  "outletId": "outlet-553694cb"
}

// 201
{ "id": "team-41861124" }`;

const workerCreate = `POST /v1/workers
{
  "workspaceId": "9a1b6d4c-...",
  "name": "Axle",
  "title": "Automobile clipart producer",
  "specialty": "Cars, trucks, motorcycles, garages and everything automotive",
  "teamId": "team-41861124",
  "allowedTemplateIds": [
    "plan-clipart-pack",
    "generate-clip-art-diffmatte",
    "generate-pack-cover",
    "map-clip-art-to-print-on-demand"
  ],
  "job": {
    "publishPolicy": "classified",
    "failureThreshold": 0.2,
    "contentTypes": [
      {
        "key": "cars-classic",
        "planTemplate": "plan-clipart-pack",
        "targetTemplate": "generate-clip-art-diffmatte",
        "artifactType": "clip-art",
        "count": 25,
        "budgetUsd": 1.60,
        "itemFields": ["prompt", "style"],
        "requiredFields": ["prompt"],
        "styleWhitelist": ["3d", "clay", "kawaii", "chibi", "sticker", "emoji"],
        "intakeBase": { "quality": "low", "aspectRatio": "1:1" },
        "planIntakeExtra": {
          "audience": "car enthusiasts and auto shops",
          "packGoal": "classic and vintage car graphics",
          "style": "3d"
        },
        "publishPolicy": { "mode": "auto" }
      }
    ],
    "messaging": {
      "cadence": "every-shift",
      "requirements": [
        "how many images you created, and their categories",
        "for each pack: its title and the address it published to",
        "any pack that did NOT publish, and why it was staged instead"
      ]
    }
  }
}`;

const scheduleCreate = `POST /v1/schedules
{
  "workspaceId": "9a1b6d4c-...",
  "name": "Axle daily shift",
  "cron": "0 15 * * *",
  "workerId": "worker-f6b2a87e"
}

// Test without waiting for the cron:
POST /v1/workers/worker-f6b2a87e/run`;

const ingestPayload = `POST https://your-site.com/api/ingest/packs
webhook-signature: v1,<base64 HMAC over the exact request bytes>

{
  "pack": {
    "esyOrderId": "order-5cda28c2",
    "planArtifactId": "artifact-28f2a14b",
    "title": "25 Vintage Garage Clipart",
    "slug": "25-vintage-garage-clipart",
    "shortDescription": "...",
    "longDescription": "...",
    "category": "vehicles",
    "additionalCategories": ["retro", "workshop"],
    "tags": ["garage", "vintage", "automotive"],
    "packFacts": { "subjects": 6, "poses": 5, "props": 6, "scenes": 4 },
    "cover": { "url": "https://images.../cover.webp", "alt": "..." },
    "media": [ { "url": "https://images.../mockup-mug.webp" } ],
    "items": [ { "title": "Weathered pickup", "url": "https://images.../a.webp" } ]
  }
}`;

const verify = `# Did the shift complete healthy?
GET /v1/workers/{workerId}/shifts?limit=1

# What did each step actually cost?
GET /v1/costs?groupBy=operation&workspaceId={ws}&workflowId=generate-clip-art-diffmatte

# Did anything file into the outlet?
GET /v1/outlets/{outletId}/items

# Is anything waiting on a human?
GET /v1/queue?workspaceId={ws}`;

export default function PublishPacksGuidePage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Guide · workers"
        title="Publish packs with a worker team"
        lead={
          <>
            An unattended production line: a crew of workers that each own a subject area, plan a themed pack every
            day, generate every asset, compose a cover, and publish the finished pack to your own site. This is the
            setup behind <code>clip.art/packs</code>, written so you can rebuild it for yourself or a client.
          </>
        }
      />

      <dl className="workflowMeta" aria-label="Setup summary">
        <dt>Primitives</dt>
        <dd>Outlet → Team → Workers → Schedule</dd>
        <dt>Templates</dt>
        <dd>plan-clipart-pack · generate-clip-art-diffmatte · generate-pack-cover</dd>
        <dt>Cadence</dt>
        <dd>One pack per worker per day</dd>
        <dt>Cost</dt>
        <dd>~$0.015 per asset · ~$0.38 per 25-item pack</dd>
      </dl>

      <h2>What one shift does</h2>
      <StepList
        items={[
          {
            name: 'Plan',
            desc: (
              <>
                The worker runs <code>plan-clipart-pack</code> with its specialty, its{' '}
                <a href="/concepts/assigned-work">assigned work</a>, and a snapshot of the recent catalog. Out
                comes a plan artifact: a style recipe and a manifest of items, each with a fully compiled prompt.
                Nothing is generated yet — this is the auditable record of what the worker knew and chose.
              </>
            ),
          },
          {
            name: 'Generate',
            desc: (
              <>
                Each manifest item becomes one child run of the target template, all under a single{' '}
                <a href="/concepts/orders">Generation Order</a>. Failures are per item; the order tracks
                succeeded, failed, held, and skipped counts.
              </>
            ),
          },
          {
            name: 'Mockups',
            desc: 'Product mockups are composed from assets spread across the pack, so the listing shows the goods in use rather than a grid of transparent files.',
          },
          {
            name: 'Cover',
            desc: (
              <>
                The pack&rsquo;s hero assets and the plan&rsquo;s cover concept feed <code>generate-pack-cover</code>.
                The cover is part of the pack&rsquo;s identity — reviewers and buyers meet the pack the same way.
              </>
            ),
          },
          {
            name: 'Publish',
            desc: (
              <>
                On a clean pack whose content type sets <code>{'publishPolicy: { "mode": "auto" }'}</code>, the
                assembled payload is signed and POSTed to your ingest URL. Anything less than clean is staged for
                review instead, with the reason recorded.
              </>
            ),
          },
          {
            name: 'Report',
            desc: 'A first-person report lands in your Inbox with a manifest attached: every image and its URL, the pack’s published address, and the reason for anything that did not ship.',
          },
        ]}
      />

      <h2>Step 1 — Create the outlet</h2>
      <p>
        An <a href="/concepts/outlets">outlet</a> is a channel defined by a URL: a site plus a section. It carries
        the ingest endpoint and the signing secret, and records delivery health so you can see whether your site
        actually accepted the last push.
      </p>
      <CodeBlock title="the publishing channel" language="http">
        {outletCreate}
      </CodeBlock>
      <Callout title="The secret is shown once">
        <code>revalidateSecret</code> is returned only on create and rotate. Deliveries are signed with a Standard
        Webhooks HMAC over the exact request bytes — verify that signature before trusting a payload. See{' '}
        <a href="/guides/connect-a-consumer-site">Connect a consumer site</a> for a worked verification example.
      </Callout>

      <h2>Step 2 — Create the team</h2>
      <p>
        Designating an outlet on the team makes it a <strong>fence</strong>: every member&rsquo;s publishable output
        ships there, and no member-level setting can override it. That is what you want for a crew whose entire
        purpose is one destination.
      </p>
      <CodeBlock title="the crew" language="http">
        {teamCreate}
      </CodeBlock>

      <h2>Step 3 — Create the workers</h2>
      <p>
        Give each worker a narrow subject area. The specialty is not decoration — it is the standing demand signal
        that steers every plan, so &ldquo;automotive&rdquo; and &ldquo;holidays&rdquo; build genuinely different
        catalogs rather than two flavors of one.
      </p>
      <CodeBlock title="one worker" language="http">
        {workerCreate}
      </CodeBlock>

      <Table
        head={['Field', 'Why it matters']}
        rows={[
          [
            <code key="a">allowedTemplateIds</code>,
            'Enforced at run time. A worker cannot execute a template outside this list, whatever its job says.',
          ],
          [
            <code key="b">{'job.publishPolicy: "classified"'}</code>,
            'Without this the worker publishes nothing — the default is "none". The most common reason a correct-looking setup produces nothing on the site.',
          ],
          [
            <code key="c">{'contentTypes[].publishPolicy: { mode: "auto" }'}</code>,
            'A different knob: this is what pushes a finished PACK to your ingest endpoint. "hitl" (the default) stages it for review instead.',
          ],
          [
            <code key="d">styleWhitelist</code>,
            'Both the planner’s menu and the enforcement clamp. Different lists per worker is what stops a catalog looking uniform.',
          ],
          [
            <code key="e">count</code>,
            'Items per shift for this content type. A count of 0 skips it entirely — no plan, no order, no cost — which is how you park a category until you want it.',
          ],
          [
            <code key="f">budgetUsd</code>,
            'Hard cap per content type per shift, enforced against the recorded cost ledger.',
          ],
          [
            <code key="g">itemFields / requiredFields</code>,
            'Which planner fields become each child’s intake, and which are mandatory — an item missing a required field is dropped rather than run.',
          ],
          [
            <code key="h">messaging.requirements</code>,
            'Facts the report must contain. Each entry becomes a “must include” instruction the worker cannot omit.',
          ],
        ]}
      />

      <h2>Step 4 — Put it on a schedule</h2>
      <p>Five-field cron, evaluated in UTC. Stagger the crew so they do not all wake into the same rate limit.</p>
      <CodeBlock title="wake it daily" language="http">
        {scheduleCreate}
      </CodeBlock>

      <h2>Step 5 — Receive the pack</h2>
      <p>
        Your endpoint receives the whole pack in one signed payload. Everything is idempotent on{' '}
        <code>esyOrderId</code>, so a re-push is safe: accept a partial ingest with <code>202</code> and Esy will
        deliver again on the next publish.
      </p>
      <CodeBlock title="what your site receives" language="http">
        {ingestPayload}
      </CodeBlock>

      <h2>Verifying a run</h2>
      <CodeBlock title="four checks" language="http">
        {verify}
      </CodeBlock>

      <h2>When nothing appears on your site</h2>
      <p>Work these in order — real failure modes, most common first.</p>
      <Table
        head={['Symptom', 'Cause and fix']}
        rows={[
          [
            'Shift healthy, nothing published',
            <>
              <code>job.publishPolicy</code> is unset (defaults to <code>none</code>), or the worker has no home
              outlet. No team outlet and no solo outlet means publishing exits silently.
            </>,
          ],
          [
            'Assets published, but no pack',
            <>
              The content type&rsquo;s <code>publishPolicy.mode</code> is <code>hitl</code>. Individual artifacts and
              whole packs ship through different mechanisms.
            </>,
          ],
          [
            'Pack staged, cover blamed',
            <>
              The cover sits in Review because its classifier could not categorize it. The classifier needs a
              candidate vocabulary — make sure the plan&rsquo;s items carry categories, or set{' '}
              <code>intakeBase.categories</code>.
            </>,
          ],
          [
            'Auto-publish declined',
            'The order had failed items. Auto-publish requires a clean pack: retry the failed children, then publish again.',
          ],
          [
            'A step dies on an unknown tool or model',
            'A template is stale in that environment. Templates are versioned data, not code — re-run your template sync after any template change.',
          ],
          [
            'Everything freezes mid-shift',
            'The API restarted. Shifts live in the process, so a deploy ends them; the reaper requeues the orphaned runs. Check whether a deploy landed at that timestamp.',
          ],
        ]}
      />

      <Callout title="Size budget caps from a real shift">
        Caps are enforced against <em>recorded</em> spend. Read one finished shift with{' '}
        <code>groupBy=operation</code> and set the cap from that breakdown — an estimate that disagrees with the
        ledger will trip the cap against the wrong number.
      </Callout>
    </DocsPageShell>
  );
}
