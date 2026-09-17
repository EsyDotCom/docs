import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Table, Takeaways } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Collections',
  description:
    'Artifacts made of other artifacts — a clip art pack, a story book. Esy owns the whole: members with ids that never change, work that lands on them by id, one cover, one delivery, one cost.',
};

// The shape, drawn once. Endpoints are deliberately not written as METHOD paths
// here: the docs build checks every documented endpoint against the live API,
// and these ship with the packs API reference.
const shape = `collection  pack-7f3a91c2 · "Beach Bears" · kind pack · format clipart
├─ spec          brief, style kit (slug + the version used), render settings
├─ cover         artifact
├─ delivery      unpublished | published | partial | failed
├─ etag          "42"  — changes whenever the collection or a member changes
└─ items
   ├─ pitem-91c2  "Bear with a water gun"   accepted  → current + print
   │   └─ attempts   order-…/run-…  failed  $0.11
   │                 order-…/run-…  completed  $0.11
   ├─ pitem-4b07  "Bear on a surfboard"     review    → current artifact
   └─ pitem-c3e1  "Bear on a surfboard" B&W companionOf pitem-4b07`;

const lifecycle = `collection   planning → ready → working → review → complete
             + attention (something failed or a budget stopped)
             + failed (planning failed) · archived

item         pending → working → review → accepted
             + failed · removed (restorable) · locked (planned, not unlocked)`;

const event = `{
  "type": "pack.updated",
  "resource": { "type": "pack", "id": "pack-7f3a91c2", "version": 43 },
  "clientRef": "cp_2f1a…",
  "occurredAt": "2026-09-17T14:03:11Z"
}`;

export default function CollectionsPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Collections"
        title="Collections"
        lead={
          <>
            Some things Esy makes are made of other things: a clip art pack is a set of pieces with a cover, a
            story book is a run of pages. A collection is that whole, owned by Esy. Its members keep their ids
            through every re-roll, every piece of work lands on a member by id, and the cover, publishing and
            cost are read from the whole — never from whichever order happened to run last.
          </>
        }
      />

      <Callout title="In rollout">
        <p>
          This page describes the model being built now, packs first. The packs API reference ships on this site
          with the endpoints. Until then packs are still placed as{' '}
          <Link href="/concepts/orders">Generation Orders</Link>, as in{' '}
          <Link href="/guides/publish-packs-with-a-worker-team">Publish packs with a worker team</Link>, and
          existing integrations keep working unchanged while clients move over.
        </p>
      </Callout>

      <h2>Collection, order, or artifact?</h2>
      <p>These three are easy to confuse, and the difference decides how you read everything else.</p>
      <Table
        head={['', 'What it is', 'Lives', 'Example']}
        rows={[
          [<strong key="a">Artifact</strong>, 'One made thing', 'Forever', 'A bear sticker'],
          [<strong key="o">Order</strong>, 'One batch of work Esy executes', 'Until it settles', '“Draw these 12 prompts”'],
          [
            <strong key="c">Collection</strong>,
            'One named thing made of many artifacts, redone piece by piece over many orders',
            'Forever',
            'The “Beach Bears” pack',
          ]
        ]}
      />
      <p>
        If it has its own title or cover, its members can be redone one at a time, and it outlives the order that
        started it, it is a collection. An order is never a collection: a pack with one re-roll already spans two
        orders.
      </p>

      <h2>What a collection holds</h2>
      <CodeBlock title="a pack, drawn as a tree" language="ascii">
        {shape}
      </CodeBlock>
      <Table
        head={['Part', 'What it is for']}
        rows={[
          [<code key="k">kind</code>, 'What sort of collection: pack today, story-book next. Each kind has its own route and its own words.'],
          [<code key="s">spec</code>, 'The kind’s settings, checked against the kind’s schema. Library references are stored with the version they resolved to, so editing a style kit later never changes how an existing pack was made.'],
          [<code key="i">items</code>, 'The members. Each has an id that never changes — renaming, re-rolling or reordering keeps it.'],
          [<code key="at">attempts</code>, 'Every time Esy tried to make a member: the order and run, the outcome, and what it cost.'],
          [<code key="e">etag</code>, 'A version tag. Edits send it back; if someone changed the collection in between, the edit is refused with 409 and the current collection, instead of silently overwriting their change.'],
          [<code key="cr">clientRef</code>, 'Your own id for it, unique per workspace. Creating with the same clientRef twice returns the one collection.'],
          [<code key="an">annotations</code>, 'Small key-values of yours that Esy stores and returns but never interprets.'],
        ]}
      />

      <h2>Lifecycle</h2>
      <CodeBlock title="statuses shared by every kind" language="ascii">
        {lifecycle}
      </CodeBlock>
      <p>
        Publishing is tracked apart from status, in <code>delivery</code>, so a complete collection can be
        published, taken down, and published again without its status moving.
      </p>

      <h2>Working on a collection</h2>
      <p>
        You read and edit a collection like any resource. Anything that does work or spends money is a named
        action on it, written <code>{'{collection}:verb'}</code>, so a rename and a render never look alike in
        your logs or your bill.
      </p>
      <Table
        head={['Action', 'What happens']}
        rows={[
          [<code key="r">:render</code>, 'Esy makes every pending member, or only the ones you list (a re-roll). It places the orders itself and tags each job with its member.'],
          [<code key="ac">items/…:accept · :reject</code>, 'Keep a member’s result, or send it back to pending.'],
          [<code key="mc">:makeCover · :makeSheet</code>, 'Build the cover or a contact sheet from accepted members.'],
          [<code key="ep">:exportPrint</code>, 'Make print-size renditions of accepted members.'],
          [<code key="pb">:publish · :unpublish</code>, 'Deliver the whole collection to its outlet, or take it down.'],
          [<code key="ar">:archive</code>, 'Hide it from lists. Nothing is deleted.'],
        ]}
      />
      <p>
        Every action takes a <code>requestId</code>: send the same one again after a timeout and you get the first
        result back, not a second render and a second bill. Every action that starts work returns what it started
        — the orders, the members covered, the attempt ids and the budget cap — so you can charge, and refund a
        failed attempt, exactly once.
      </p>

      <h2>Knowing when something changed</h2>
      <p>
        Esy calls you rather than making you poll. Events are thin: they say which collection changed and its new
        version, and you read the collection for the rest. A late event for a version you have already seen is
        safe to ignore.
      </p>
      <CodeBlock title="an event" language="json">
        {event}
      </CodeBlock>
      <p>
        Deliveries are signed exactly like every other Esy webhook — see{' '}
        <Link href="/api/webhooks">Webhooks</Link> — and may arrive more than once, so dedupe on{' '}
        <code>webhook-id</code>. To catch anything a long outage missed, list with <code>updatedAfter</code> every
        few minutes rather than every few seconds.
      </p>

      <h2>What stays with your app</h2>
      <p>
        Esy owns the collection; your app asks for work and shows what Esy returns. What stays yours is what is
        genuinely your business: your customers, prices, credits and checkout. For free previews the line is the
        same — you decide how many a customer gets, and Esy counts previews against the customer reference you
        send, so a new pack or a retry cannot reset the count.
      </p>

      <h2>Kinds</h2>
      <Table
        head={['Kind', 'Members', 'Status']}
        rows={[
          [<code key="p">pack</code>, 'Pieces — clip art, coloring pages or illustrations — plus a cover', 'First, in rollout'],
          [<code key="b">story-book</code>, 'Pages, drawing on a pack for its characters', 'Next'],
        ]}
      />

      <Takeaways
        items={[
          <>A collection is one named thing made of many artifacts; an order is one batch of work toward it.</>,
          <>Members keep their ids through every re-roll, and results land on them by id.</>,
          <>Work is a named action with a requestId; edits carry the etag.</>,
          <>Esy tells you something changed; you read the collection to see what.</>,
        ]}
      />
    </DocsPageShell>
  );
}
