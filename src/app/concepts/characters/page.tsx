import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, Diagram, DiagramDefs, PageHeader, Table, Takeaways } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Characters',
  description:
    'Avatars a project uses again and again, invented or real. Versions that never change, a real person’s consent as its own record, and a gate every run passes before it makes anything.',
};

const scope = `{
  "version": 1,
  "uses": ["organic"],                 // organic | ads
  "media": ["image", "video"],         // image | video | audio
  "channels": ["instagram", "web"],    // or ["any"]
  "territories": ["US"],               // ISO 3166 alpha-2, or ["WORLDWIDE"]
  "advertisers": [],                   // empty: your own work and your clients'
  "productLines": []
}`;

const check = `{
  "ok": false,
  "version": 3,
  "reasons": ["out_of_scope"],
  "message": "The permission on file doesn't cover this use.",
  "consentIds": [],
  "disclosure": null
}`;

export default function CharactersPage() {
  return (
    <DocsPageShell>
      <DiagramDefs />
      <PageHeader
        eyebrow="Concepts · Characters"
        title="Characters"
        lead={
          <>
            A character is a face a project uses again and again: a presenter for a dentist&rsquo;s explainer
            videos, a bakery&rsquo;s mascot, a founder who appears in every ad without filming every week. Some
            are invented. Some are real people who agreed to be made into an avatar. Esy keeps one record for
            each, makes sure it looks the same every time, and will not make anything with a real person&rsquo;s
            likeness unless their permission covers it.
          </>
        }
      />

      <Callout title="On screen, Avatars">
        <p>
          The API and this page say <strong>character</strong>; the studio calls them avatars. They are the same
          thing.
        </p>
      </Callout>

      <h2>Two kinds</h2>
      <p>Every character is one of two kinds, and the kind is the one thing that changes the rules.</p>

      <Table
        head={['', 'synthetic', 'likeness']}
        rows={[
          ['Depicts', 'Nobody real', 'A real, identifiable person'],
          ['Before making anything', 'Nothing', 'An active consent that covers the use'],
          ['In ads', 'A synthetic-performer disclosure', 'Consent law applies; platforms label AI'],
          ['Can be withdrawn by', '—', 'The person, at any time'],
        ]}
      />
      <p>
        A character prompted with a real person&rsquo;s name or photo is a likeness character. Esy treats
        &ldquo;made to look like someone&rdquo; as depicting them.
      </p>

      <h2>The parts</h2>
      <Diagram
        title="A character, its versions, and the permission behind them"
        minWidth={820}
        caption={
          <>
            The reference set is a <Link href="/concepts/collections">collection</Link>. Versions freeze it.
            A run pins one version and records the consents that allowed it.
          </>
        }
      >
        <svg viewBox="0 0 860 300" role="img" aria-label="A character's references are frozen into versions; a likeness version depicts a subject whose consents allow runs; runs pin a version">
          <text x="8" y="16" className="dg-hdr">CHARACTER · A COLLECTION OF REFERENCES</text>
          <rect x="20" y="30" width="230" height="58" rx="7" className="dg-node dg-accent" />
          <text x="135" y="54" className="dg-label-sm" textAnchor="middle">Dr. Maya · char-7f3a91c2</text>
          <text x="135" y="72" className="dg-sub" textAnchor="middle">portrait · turnaround · expressions</text>

          <path d="M135 92 L135 124" className="dg-edge" />
          <text x="145" y="112" className="dg-cap">freeze</text>

          <rect x="20" y="128" width="70" height="44" rx="6" className="dg-node" />
          <text x="55" y="155" className="dg-sub" textAnchor="middle">v1 · retired</text>
          <rect x="100" y="128" width="70" height="44" rx="6" className="dg-node" />
          <text x="135" y="155" className="dg-sub" textAnchor="middle">v2</text>
          <rect x="180" y="128" width="70" height="44" rx="6" className="dg-node dg-accent" />
          <text x="215" y="155" className="dg-sub" textAnchor="middle">v3</text>

          <path d="M215 176 L215 226" className="dg-edge dg-dash" />
          <rect x="140" y="230" width="150" height="40" rx="6" className="dg-node" />
          <text x="215" y="248" className="dg-sub" textAnchor="middle">run-0c7d9e21</text>
          <text x="215" y="262" className="dg-sub" textAnchor="middle">pins v3</text>

          <text x="420" y="16" className="dg-hdr">THE PERSON · OWNERS AND ADMINS ONLY</text>
          <rect x="430" y="30" width="200" height="58" rx="7" className="dg-node" />
          <text x="530" y="54" className="dg-label-sm" textAnchor="middle">Subject</text>
          <text x="530" y="72" className="dg-sub" textAnchor="middle">Maya Patel · adult · not political</text>
          <path d="M254 150 L426 70" className="dg-edge dg-dash" />
          <text x="300" y="100" className="dg-cap">depicts</text>

          <path d="M530 92 L530 124" className="dg-edge" />
          <rect x="430" y="128" width="200" height="58" rx="7" className="dg-node dg-accent" />
          <text x="530" y="152" className="dg-label-sm" textAnchor="middle">Likeness consent · active</text>
          <text x="530" y="170" className="dg-sub" textAnchor="middle">face · organic · US · to 2027-10-01</text>
          <path d="M430 186 L294 240" className="dg-edge dg-accent" />
          <text x="330" y="205" className="dg-cap">allowed</text>

          <rect x="660" y="128" width="180" height="58" rx="7" className="dg-node dg-ghost" />
          <text x="750" y="152" className="dg-label-sm" textAnchor="middle">History</text>
          <text x="750" y="170" className="dg-sub" textAnchor="middle">recorded · activated · …</text>
          <path d="M634 157 L656 157" className="dg-edge" />
        </svg>
      </Diagram>

      <Table
        head={['Part', 'What it is']}
        rows={[
          [<strong key="c">Character</strong>, 'The avatar a project uses. Its references (pictures, a voice sample) are members of a collection, redone one at a time.'],
          [<strong key="v">Version</strong>, 'One frozen state: the references by artifact id, the persona, and who it depicts. Never edited; retired instead.'],
          [<strong key="s">Subject</strong>, 'The real person a likeness character depicts. Not necessarily an Esy user.'],
          [<strong key="k">Likeness consent</strong>, 'The person’s permission: face and/or voice, for which uses, where, from when to when, with the evidence.'],
          [<strong key="b">Provider binding</strong>, 'A provider’s copy of a version (an avatar or a voice at a video or voice provider), with that provider’s own consent status.'],
        ]}
      />

      <h2>Versions keep the face the same</h2>
      <p>
        Editing a character&rsquo;s references or persona changes its <em>draft</em>. Nothing reaches work until
        someone freezes a new version. A campaign approved with version 3 keeps getting version 3 even after
        version 4 exists; &ldquo;latest&rdquo; is resolved once, when a run is made, and recorded on the run.
        Retiring a version stops new work on it; everything it already made stays valid.
      </p>

      <h2>Consent is its own record</h2>
      <p>
        A likeness character needs the depicted person&rsquo;s permission, and that permission has terms. The
        scope is structured so Esy can check every run against it, not just store it:
      </p>
      <CodeBlock title="a consent's scope" language="json">
        {scope}
      </CodeBlock>
      <Table
        head={['Rule', 'Why']}
        rows={[
          ['Face and voice are separate permissions, and a consent covers at least one.', 'Providers treat them separately; so do the laws on digital replicas.'],
          ['Every consent ends, at most 10 years after it starts.', 'Nothing is forever; the term the NO FAKES Act proposes for a living adult.'],
          ['Once active, its terms can’t change. A broader use needs a new consent.', 'California and New York void replica clauses without a reasonably specific description of uses.'],
          ['Revoked is final, and revoking never needs an up-to-date etag.', 'The person’s withdrawal wins over any edit in flight.'],
          ['Training on the likeness is a separate permission, off unless granted.', 'The SAG-AFTRA commercials contract requires separate consent.'],
          ['Subjects are adults who are not political candidates or officials.', 'Platforms and providers bar minors’ likenesses and political impersonation; the database refuses both.'],
        ]}
      />
      <p>
        A consent is recorded as <code>pending</code> and does nothing until someone activates it. It can be
        suspended and resumed. Its history (recorded, activated, suspended, resumed, revoked) is append-only.
        Erasing a person blanks what identifies them, revokes every consent and retires every version that
        depicts them; the consent records stay, as the proof that past work was permitted.
      </p>

      <h2>The gate</h2>
      <p>
        One check decides whether a character can be used, and every run that features one passes it{' '}
        <strong>twice</strong>: when the run is made (a failure is a 422 naming why, before anything is priced)
        and again just before it starts, so a consent withdrawn while a run waited in the queue still stops it.
        You can ask the same question in advance for a planned use:
      </p>
      <CodeBlock title="POST /v1/characters/{characterId}:check  ·  can Dr. Maya appear in paid TikTok ads?" language="json">
        {check}
      </CodeBlock>
      <Table
        head={['Reason', 'Meaning']}
        rows={[
          [<code key="1">no_version</code>, 'Nothing frozen yet, or every version retired.'],
          [<code key="2">consent_missing</code>, 'No consent covers this (the face, or the voice).'],
          [<code key="3">consent_pending · consent_suspended · consent_revoked</code>, 'There is one, but it isn’t active.'],
          [<code key="4">consent_not_started · consent_expired</code>, 'There is one, outside its dates.'],
          [<code key="5">out_of_scope</code>, 'There is one, but it doesn’t cover this use, channel, territory or advertiser.'],
          [<code key="6">provider_consent_pending · …_rejected · …_missing</code>, 'The provider hasn’t accepted the person’s consent for its copy.'],
          [<code key="7">subject_erased · character_archived · character_scope</code>, 'The person was erased, the avatar archived, or the run is in another workspace.'],
        ]}
      />
      <p>
        A run asks for a character with <code>characterId</code> in its intake, and optionally{' '}
        <code>characterVersion</code> to pin one. What the template makes decides what the gate checks: pictures
        and video need the face, audio needs the voice. Orders that feature a character run in standard mode
        only, so every child passes the gate.
      </p>

      <h2>Disclosure and provenance</h2>
      <p>
        Every run with a character records the version and the consents that allowed it. That is the record a
        disclosure or a provenance manifest points to. The check returns the label to show: for a synthetic
        performer in an ad, wording that meets New York&rsquo;s synthetic-performer law and California&rsquo;s.
        Platform AI flags and signed C2PA manifests on rendered files come with publishing.
      </p>

      <Callout title="Kept by the database">
        <p>
          The rules that protect real people aren&rsquo;t left to careful code. The database refuses edits to a
          frozen version, to an active consent&rsquo;s terms, and to consent history; refuses a minor or a
          political figure; refuses a consent longer than 10 years; and refuses any link between workspaces.
        </p>
      </Callout>

      <p>
        The endpoints are in the <Link href="/api/characters">Characters API</Link>. A character belongs to a
        project, so it belongs to that project&rsquo;s <Link href="/concepts/clients">client</Link> too.
      </p>

      <Takeaways
        items={[
          <>A character is synthetic or depicts a real person, and that decides the rules.</>,
          <>Versions never change; runs pin one.</>,
          <>A real person’s consent is a record with terms, checked on every run, twice.</>,
          <>Withdrawal is immediate for anything not yet started, and final.</>,
        ]}
      />
    </DocsPageShell>
  );
}
