import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, EndpointList, PageHeader, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Clients API',
  description:
    'Create and manage the businesses a workspace works for, their contacts and status history, and which projects belong to them.',
};

const createExample = `POST /v1/workspaces/{workspaceId}/clients
{
  "name": "Northside Dental",
  "status": "active",
  "billing": { "model": "retainer", "amountCents": 300000, "period": "quarter", "renewsOn": "2027-04-01" },
  "requestId": "c7e1a9b2-new-client"
}

201 Created · ETag: "1"
{
  "id": "6b1f…", "workspaceId": "220c…",
  "name": "Northside Dental", "slug": "northside-dental", "status": "active",
  "billing": { "version": 1, "model": "retainer", "amountCents": 300000, "currency": "usd",
               "period": "quarter", "scope": [], "renewsOn": "2027-04-01" },
  "renewsOn": "2027-04-01",
  "etag": "\\"1\\"",
  "projects": [],
  "rollup": { "periodStart": "2026-10-01", "costUsd": 0.0, "waitingOnYou": 0, "made": 0, "expectedFeeCents": 100000 }
}`;

const patchExample = `PATCH /v1/clients/{clientId}
If-Match: "1"
{ "status": "paused", "statusNote": "Paused over the holidays" }

200 OK · ETag: "2"

// someone changed it first
409 Conflict
{ "detail": { "code": "etag_mismatch", "current": { "…": "the client as it is now" } } }`;

const linkExample = `PATCH /v1/workspaces/{workspaceId}/projects/{projectId}
{ "clientId": "6b1f…" }     // null moves it back to Your brands

GET /v1/workspaces/{workspaceId}/projects?clientId=none   // Your brands`;

export default function ClientsApiPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Reference · Clients API"
        title="Clients API"
        lead={
          <>
            The businesses a workspace works for. Members read; owners and admins write. Money &mdash; billing
            terms, cost to serve, expected fees &mdash; is returned to owners and admins only, and is{' '}
            <code>null</code> for everyone else. See <Link href="/concepts/clients">Clients</Link> for the model.
          </>
        }
      />

      <h2>Clients</h2>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/workspaces/{workspaceId}/clients', desc: 'List clients with this month’s roll-ups. Filter with status; includeArchived to see archived ones.' },
          { method: 'POST', path: '/v1/workspaces/{workspaceId}/clients', desc: 'Add a client. Takes a requestId: a retry returns the first answer. Owners and admins.' },
          { method: 'GET', path: '/v1/clients/{clientId}', desc: 'One client, its projects and roll-ups. Returns an ETag.' },
          { method: 'PATCH', path: '/v1/clients/{clientId}', desc: 'Change name, slug, status, billing or notes. Needs the etag (body or If-Match).' },
          { method: 'DELETE', path: '/v1/clients/{clientId}', desc: 'Archive. A client with history is never deleted.' },
          { method: 'GET', path: '/v1/clients/{clientId}/events', desc: 'Its status history, newest first.' },
        ]}
      />
      <CodeBlock title="create, with a safe retry" language="json">
        {createExample}
      </CodeBlock>
      <CodeBlock title="edit, with the etag" language="json">
        {patchExample}
      </CodeBlock>

      <h2>Contacts</h2>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/clients/{clientId}/contacts', desc: 'The people at a client.' },
          { method: 'POST', path: '/v1/clients/{clientId}/contacts', desc: 'Add a contact. Emails are unique per client, ignoring case (409 on a duplicate).' },
          { method: 'PATCH', path: '/v1/clients/{clientId}/contacts/{contactId}', desc: 'Change a contact, including whether they approve work.' },
          { method: 'DELETE', path: '/v1/clients/{clientId}/contacts/{contactId}', desc: 'Remove a contact outright: personal data, not history.' },
        ]}
      />

      <h2>Projects</h2>
      <p>
        A project belongs to at most one client, in the same workspace. Only owners and admins can change it; a
        client from another workspace is refused with <code>422 client_not_found</code>.
      </p>
      <CodeBlock title="linking a project" language="http">
        {linkExample}
      </CodeBlock>

      <h2>Errors</h2>
      <Table
        head={['Status', 'Code', 'When']}
        rows={[
          ['403', <code key="a">admin_required</code>, 'A member tried to change something.'],
          ['409', <code key="b">client_conflict</code>, 'A live client already has that slug or Stripe customer.'],
          ['409', <code key="g">contact_exists</code>, 'A contact with that email is already on this client.'],
          ['409', <code key="c">etag_mismatch</code>, 'The client changed since you read it; the body has the current one.'],
          ['409', <code key="d">request_id_reused</code>, 'The same requestId with a different body.'],
          ['422', <code key="e">client_not_found</code>, 'Linking a project to a client outside its workspace.'],
          ['428', <code key="f">etag_required</code>, 'An edit without an etag.'],
        ]}
      />

      <Callout title="Statuses">
        <code>lead</code>, <code>active</code>, <code>paused</code>, <code>past</code>. Leads and past clients
        stay out of totals.
      </Callout>
    </DocsPageShell>
  );
}
