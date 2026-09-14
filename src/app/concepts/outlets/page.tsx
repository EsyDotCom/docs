import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Outlets',
  description:
    'Channels for publishing artifacts of any kind from os.esy.com — your site mirrors publish/unpublish state via a signed webhook.',
};

const outletShape = `{
  "name": "clip.art/flowers",
  "slug": "clip-art-flowers",
  "siteUrl": "https://clip.art",
  "sectionPath": "/flowers",
  "description": "The flowers section of the clip.art catalog",
  "projectId": null,
  "acceptedKinds": ["clip-art", "coloring-page"],
  "revalidateUrl": "https://clip.art/api/ingest/esy",
  "lastDeliveryStatus": "ok"
}`;

const webhookPayloads = `{ "outlet": "clip-art-catalog", "action": "publish",
  "artifactIds": ["artifact-9f1e2d3c", "artifact-8a7b6c5d"] }

{ "outlet": "clip-art-catalog", "action": "unpublish",
  "artifactIds": ["artifact-9f1e2d3c"] }`;

export default function OutletsPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Outlets"
        title="Outlets"
        opener="docks"
        lead={
          <>
            An outlet is the channel <strong>artifacts</strong> ship to — a factory outlet and a media outlet at
            once. Artifacts of any kind, published from os.esy.com (by you, or by a worker whose job says so),
            with unpublishing a single flip at the platform. Outlets are their own plane: hand-authored documents
            publish through <a href="/concepts/publications">Publications</a> instead — same pattern,
            separate systems.
          </>
        }
      />

      <h2>The outlet record</h2>
      <CodeBlock title="an outlet" language="json">
        {outletShape}
      </CodeBlock>
      <p>
        An outlet is <strong>URL-defined</strong>: <code>siteUrl</code> + <code>sectionPath</code>.{' '}
        <code>clip.art/free</code> and <code>clip.art/flowers</code> are different outlets; another site is
        another outlet. Beyond the address, an outlet owns the artifact kinds it accepts (empty = any kind), an
        optional project scope (a project-bound outlet is invisible to other projects’ workers), the consumer’s
        revalidation webhook with an encrypted reveal-once secret, and delivery health.
      </p>

      <h2>One site, many sections — many sites, one account</h2>
      <p>
        The URL-defined model is how the system scales. A catalog site fans out into as many section outlets as
        its taxonomy needs, each with its own kind gate; other sites — including esy.com itself — are simply
        more outlets on the same account:
      </p>
      <Table
        head={['Outlet', 'sectionPath', 'acceptedKinds', 'What ships there']}
        rows={[
          ['clip.art/free', <code key="a">/free</code>, 'clip-art, coloring-page', 'the general catalog (the fallback channel)'],
          ['clip.art/flowers', <code key="b">/flowers</code>, 'clip-art', 'category routing catches flowers-classified artifacts'],
          ['clip.art/coloring-pages', <code key="c">/coloring-pages</code>, 'coloring-page', 'kind-gated: only coloring pages pass'],
          ['clip.art/worksheets', <code key="d">/worksheets</code>, 'worksheet', 'worksheets get their own channel when their URL taxonomy lands'],
          ['esy.com/…', <code key="e">/…</code>, 'any', 'esy.com surfaces consume artifact outlets too — see below'],
        ]}
      />
      <p>
        Nothing about this list lives in any consumer’s configuration: adding clip.art/school is one create in
        os.esy.com, discovered by the site on its next ping. The routing ladder (below) spreads a single
        worker’s shift across all of them — kind gates and section matches decide, not per-site plumbing.
      </p>

      <Callout title="esy.com consumes both planes">
        esy.com already renders hand-authored documents through <strong>Publications</strong> (/research,
        /learn — compose’s plane). As artifacts start publishing to esy.com/* surfaces, the same domain also
        consumes <strong>Outlets</strong>. The two planes coexist on one site and never merge: documents keep
        their editorial machinery, artifacts keep theirs, and each surface reads from the plane it belongs to.
      </Callout>

      <h2>Outlet vs Publication</h2>
      <Table
        head={['', 'Outlet (artifacts)', 'Publication (documents)']}
        rows={[
          ['The content', 'run-produced artifacts of any kind (images, research, …)', 'hand-authored articles (compose)'],
          ['Filing + state', <span key="oi"><code>outlet items</code>: artifact ↔ outlet, published | unpublished</span>, 'the document’s publication + draft/published status'],
          [
            'The gate',
            'finished + classified (title + category) + kind accepted (empty acceptedKinds = any kind)',
            'title, slug, description, category, video',
          ],
          ['Who publishes', 'you — or a worker whose job says so (its report accounts for it)', 'you, per item'],
          ['Where it lives', <code key="o">/v1/outlets</code>, <code key="p">/v1/publications</code>],
        ]}
      />

      <h2>How your site follows</h2>
      <CodeBlock title="the outlet webhook (Bearer secret + HMAC signature)" language="json">
        {webhookPayloads}
      </CodeBlock>
      <p>
        Publish and unpublish fire one signed webhook per act; delivery is best-effort with health recorded on
        the outlet, and your site’s periodic re-pull is the backstop. Thin sites render straight from the read
        API (the esy.com pattern); catalog sites with local search and related-item machinery mirror the outlet’s
        published items into their own rows (the clip.art pattern — an <em>ingest</em>).
      </p>
      <p>
        <strong>The secret belongs to the endpoint, not the channel.</strong> Outlets pointing at the same{' '}
        <code>revalidateUrl</code> share one webhook secret — creating a sibling adopts it, rotating any of them
        rotates the endpoint (all together). Your site holds exactly one secret no matter how many outlets ship
        to it, and discovers <em>which</em> outlets those are from the platform roster (
        <code>GET /v1/outlets</code>, filtered by its own domain) rather than configuring channel lists.
      </p>

      <Callout title="Which consumption pattern?">
        Render-time reads are the default: fetch the outlet’s published items, cache, revalidate on webhook —
        zero infrastructure. Build an ingest only when your pages need local rows (full-text search, related
        items, sitemaps at catalog scale).
      </Callout>

      <h2>Workers publish to outlets — the framework</h2>
      <p>
        The job’s <code>publishPolicy</code> decides <em>if</em> a shift publishes (<code>&quot;classified&quot;</code> —
        what passed the classifier; <code>&quot;none&quot;</code> — nothing, the default). <em>Where</em> each artifact
        ships follows one law: <strong>goals decide what gets made; designations and sections decide where it
        ships.</strong>
      </p>
      <ol>
        <li>
          <strong>A designated team’s outlet takes everything — the fence.</strong> A team with an outlet is a
          publishing contract for the whole crew: nothing overrides it — not a member’s Solo outlet, not a
          matching sibling section. “This team publishes only to X” is provable by one query.
        </li>
        <li>
          <strong>Otherwise, sections sort.</strong> An artifact routes to the same-site outlet whose{' '}
          <code>sectionPath</code> matches its classification category (<code>/flowers</code> catches{' '}
          <code>flowers</code>) — permanent site taxonomy, opt-in by construction.
        </li>
        <li>
          <strong>The rest lands on the worker’s Solo outlet</strong> — its own channel, active while solo
          (dormant on a team, never erased). No home channel → the artifact stays unpublished, never a wrong
          page.
        </li>
      </ol>
      <p>
        Every published item records <em>why</em> it landed where it did (<code>routedVia</code>:{' '}
        <code>team:…</code> | <code>section:…</code> | <code>solo</code> | <code>manual</code> |{' '}
        <code>subscription</code>), and every assignment change is on the record — designations are audit-grade.
      </p>

      <h2>Syndication — one artifact, many outlets</h2>
      <p>
        An outlet with <code>syndicate</code> on <strong>carries every published artifact of its accepted
        kinds</strong>, wherever it was published — the wire-service model: the crew files to its designated
        desk, subscribing channels pick the piece up off the wire. Carrying is the outlet’s own act, so team
        fences stay whole. An artifact’s presence in each outlet is its own record, so{' '}
        <strong>unpublish is per-outlet</strong>: hiding a piece on esy.com/clipart leaves clip.art untouched,
        and a syndicating outlet never re-carries what you’ve hidden.
      </p>
      <p>
        Publishing happens in one act per outlet, stamped <code>publishedBy: worker-…</code>, and the report
        accounts per channel: “Published 76/80 — clip.art/flowers: 16, clip.art catalog: 60.” See{' '}
        <a href="/concepts/workers">Workers</a> and{' '}
        <a href="/concepts/assigned-work">Assigned work</a>.
      </p>
    </DocsPageShell>
  );
}
