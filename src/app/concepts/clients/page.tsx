import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, Diagram, DiagramDefs, PageHeader, Table, Takeaways } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Clients',
  description:
    'The businesses a workspace works for. A client groups the projects that are its domains and carries the business: status, billing terms, contacts. Projects with no client are your own brands.',
};

const billing = `{
  "version": 1,
  "model": "retainer",          // retainer | per_job | hourly | none
  "amountCents": 300000,        // integer cents, never floats
  "currency": "usd",
  "period": "quarter",          // retainers only: month | quarter | year
  "scope": [{ "what": "City pages", "count": 12, "per": "month" }],
  "startsOn": "2026-10-01",
  "renewsOn": "2027-04-01"
}`;

const lifecycle = `lead → active ⇄ paused → past
every change is a row in the client's status history, with who and why`;

export default function ClientsPage() {
  return (
    <DocsPageShell>
      <DiagramDefs />
      <PageHeader
        eyebrow="Concepts · Clients"
        title="Clients"
        lead={
          <>
            A workspace is Esy&rsquo;s customer: an agency, a freelancer, a company. A client is <em>their</em>{' '}
            customer: the dental group, the bakery, the law firm they do the work for. A client groups the{' '}
            projects that are its domains and carries the business &mdash; whether it is active, what it pays, and
            who approves the work.
          </>
        }
      />

      <h2>Who is who</h2>
      <Diagram
        title="A workspace, its clients, and its own brands"
        minWidth={760}
        caption={
          <>
            Projects stay the scope that runs, budgets and costs hang off. A client sits above the projects that
            are its domains; a project with no client is one of your own brands.
          </>
        }
      >
        <svg viewBox="0 0 800 250" role="img" aria-label="A workspace with two clients, each owning projects, and two projects of its own with no client">
          <text x="8" y="16" className="dg-hdr">WORKSPACE · ESY&rsquo;S CUSTOMER</text>
          <rect x="300" y="28" width="200" height="44" rx="7" className="dg-node dg-accent" />
          <text x="400" y="55" className="dg-label-sm" textAnchor="middle">Bright Agency</text>

          <path d="M360 76 L170 112" className="dg-edge" />
          <path d="M400 76 L400 112" className="dg-edge" />
          <path d="M440 76 L640 112" className="dg-edge dg-dash" />

          <rect x="70" y="116" width="200" height="44" rx="7" className="dg-node" />
          <text x="170" y="136" className="dg-label-sm" textAnchor="middle">Northside Dental</text>
          <text x="170" y="152" className="dg-sub" textAnchor="middle">client · active · retainer</text>
          <rect x="300" y="116" width="200" height="44" rx="7" className="dg-node" />
          <text x="400" y="136" className="dg-label-sm" textAnchor="middle">Juniper Bakery</text>
          <text x="400" y="152" className="dg-sub" textAnchor="middle">client · lead</text>
          <rect x="560" y="116" width="170" height="44" rx="7" className="dg-node dg-ghost" />
          <text x="645" y="136" className="dg-label-sm" textAnchor="middle">Your brands</text>
          <text x="645" y="152" className="dg-sub" textAnchor="middle">projects with no client</text>

          <path d="M130 164 L110 196" className="dg-edge" />
          <path d="M210 164 L230 196" className="dg-edge" />
          <path d="M610 164 L600 196" className="dg-edge dg-dash" />
          <path d="M680 164 L700 196" className="dg-edge dg-dash" />
          <rect x="40" y="200" width="140" height="32" rx="6" className="dg-node" />
          <text x="110" y="221" className="dg-sub" textAnchor="middle">northsidedental.com</text>
          <rect x="190" y="200" width="120" height="32" rx="6" className="dg-node" />
          <text x="250" y="221" className="dg-sub" textAnchor="middle">northside.kids</text>
          <rect x="545" y="200" width="110" height="32" rx="6" className="dg-node" />
          <text x="600" y="221" className="dg-sub" textAnchor="middle">clip.art</text>
          <rect x="665" y="200" width="110" height="32" rx="6" className="dg-node" />
          <text x="720" y="221" className="dg-sub" textAnchor="middle">seo.page</text>
        </svg>
      </Diagram>

      <Table
        head={['Thing', 'What it is', 'Example']}
        rows={[
          [<strong key="w">Workspace</strong>, 'Esy’s customer. Members, budgets and billing with Esy live here.', 'Bright Agency'],
          [<strong key="c">Client</strong>, 'A business the workspace works for, with a status, terms and contacts.', 'Northside Dental'],
          [<strong key="p">Project</strong>, 'A domain-level scope that runs, budgets and costs belong to. It may belong to a client.', 'northsidedental.com'],
          [<strong key="k">Contact</strong>, 'A person at a client. Not an Esy login unless invited.', 'Dr. Patel, who approves the work'],
        ]}
      />
      <p>
        There is no &ldquo;agency&rdquo; or &ldquo;freelancer&rdquo; kind of workspace, and no kind of client:
        a freelancer is a one-person agency, and the difference between a lead and a client is its status.
      </p>

      <h2>Billing terms</h2>
      <p>
        Terms are a small versioned document on the client. Esy validates every write; the database checks the
        envelope. Money is integer cents with a currency, never a float.
      </p>
      <CodeBlock title="billing" language="json">
        {billing}
      </CodeBlock>
      <p>
        A retainer needs a period; only a retainer has one; anything paid needs an amount. Esy records the terms
        and computes the <em>expected</em> monthly fee from them. It does not send invoices; payments, if you
        attribute them, live in your own Stripe, referenced by <code>stripeCustomerId</code>.
      </p>

      <h2>Status</h2>
      <CodeBlock title="lifecycle" language="ascii">
        {lifecycle}
      </CodeBlock>
      <p>
        Leads and past clients stay out of totals. The history is append-only: a client with history can be
        archived, never deleted.
      </p>

      <h2>What rolls up to a client</h2>
      <Table
        head={['Figure', 'From', 'Who sees it']}
        rows={[
          ['Cost to serve', 'Provider costs of runs in the client’s projects, this month', 'Owners and admins'],
          ['Expected fee', 'The billing terms, per month', 'Owners and admins'],
          ['Waiting on you', 'Runs in review in the client’s projects, last 14 days', 'Members'],
          ['Made', 'Artifacts made in the client’s projects this month', 'Members'],
        ]}
      />

      <Callout title="Safe by construction">
        <p>
          A project can only belong to a client in its own workspace, and a contact can only belong to a client in
          its own workspace. The database enforces both with composite keys, so no bug in a client app can link
          across organizations. Edits carry the etag and creates take a <code>requestId</code>, as everywhere in
          the <Link href="/api">API</Link>.
        </p>
      </Callout>

      <p>
        The endpoints are in the <Link href="/api/clients">Clients API</Link>. Characters (avatars) belong to a
        project, so a client&rsquo;s avatars are its projects&rsquo; avatars: see{' '}
        <Link href="/concepts/characters">Characters</Link>.
      </p>

      <Takeaways
        items={[
          <>A workspace is Esy’s customer; a client is the workspace’s customer.</>,
          <>A client groups projects and carries the business: status, terms, contacts.</>,
          <>A project with no client is one of your own brands.</>,
          <>Tenancy is enforced by the database, not by careful code.</>,
        ]}
      />
    </DocsPageShell>
  );
}
