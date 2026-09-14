import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Source policies',
  description:
    'A run that prints a checkable fact may only learn from sources approved for that subject. A Source describes one place; a Source policy says which of them one subject may use, what it covers, and where it stops.',
};

const sourceExample = `POST /v1/sources
{
  "workspaceId": "…",
  "name": "Bible Gateway",
  "slug": "bible-gateway",
  "payload": {
    "url": "https://www.biblegateway.com/",
    "publisher": "Bible Gateway",
    "work": "Multiple translations, addressable by book, chapter and verse",
    "tier": "primary",
    "authoritativeFor": ["scripture-quotation", "verse-reference", "person", "place"],
    "reviewedOn": "2026-09-12"
  }
}`;

const policyExample = `POST /v1/source-policies
{
  "workspaceId": "…",
  "name": "Scripture",
  "slug": "scripture",
  "payload": {
    "subject": "scripture",
    "scope": "Scripture quoted and located by book, chapter and verse, plus the people and places a passage names. NOT what a passage means, when it was written, or who wrote it.",
    "members": ["bible-gateway", "bible-hub"],
    "claims": ["scripture-quotation", "verse-reference", "person", "place"],
    "collectingLevel": "study",
    "citationHint": "book chapter:verse, e.g. John 3:16",
    "maxSubjectsPerSweep": 8
  }
}`;

const provenanceExample = `run.library_refs.sources[0]
{
  "stepId": "step-1b",
  "field": "sourceSet",
  "slug": "scripture",
  "version": 3,
  "alias": "live",
  "subject": "scripture",
  "members": [
    { "slug": "bible-gateway", "version": 2 },
    { "slug": "bible-hub", "version": 1 }
  ],
  "domainCount": 2,
  "source": "subject"
}`;

export default function SourcePoliciesConceptPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Source policies"
        title="Source policies"
        lead={
          <>
            When a run prints something a reader could check — a verse, a length, a launch date — it
            may only learn from sources approved for that subject. A <strong>Source</strong> describes
            one place, once. A <strong>Source policy</strong> is one subject&apos;s standing decision:
            which of those sources it may use, what the subject covers, and where it stops. Both are{' '}
            <a href="/concepts/artifacts">Library</a> resources, so both are authored, versioned
            and promoted like any other.
          </>
        }
      />

      <h2>Why two resources and not one list</h2>
      <p>
        The obvious design is one approved list per subject, with its sites written inside it. It
        fails in a boring way: the same site appears in several lists and the copies drift. One names
        the translation and another does not; one was reviewed this year and another was written in a
        hurry and forgotten.
      </p>
      <p>
        So a source describes itself once and policies point at it by name. Editing a source reaches
        every subject that uses it, and there is exactly one place a domain is written down — derived
        from the URL in the record that owns it, never typed, because retrieval filters on that exact
        string and a typo would silently empty the allowlist.
      </p>

      <Callout title="Peers, not parent and child">
        A policy names several sources and a source is named by several policies, so neither owns the
        other. They sit side by side at <code>/v1/sources</code> and <code>/v1/source-policies</code>.
        Nesting one inside the other would claim an ownership that does not exist, and would need a
        second path the moment two policies shared a source.
      </Callout>

      <h2>A source</h2>
      <p>
        One place, with the details that make a quotation checkable. The edition matters more than it
        looks: a verse reference against an unnamed translation is not something a reader can confirm.
      </p>
      <CodeBlock title="One approved source" language="json">
        {sourceExample}
      </CodeBlock>
      <Table
        head={['Field', 'What it is for']}
        rows={[
          [<code key="a">domain</code>, 'Derived from the URL, never accepted. Retrieval filters on it.'],
          [<code key="b">work</code>, 'The edition or translation, which is what makes a quote confirmable.'],
          [<code key="c">tier</code>, 'How directly it knows. Primary means the record IS the thing.'],
          [<code key="d">authoritativeFor</code>, 'Claim types it can settle. Recorded today, enforced later.'],
          [<code key="e">reviewedOn</code>, 'When a person last looked. A list with no dates rots invisibly.'],
        ]}
      />

      <h2>A source policy</h2>
      <p>
        The shape libraries have used for a century: a scope, the sources the subject may be gathered
        from, and how hard to try. The half of the scope that earns its place is the half saying where
        the subject <em>stops</em>.
      </p>
      <CodeBlock title="One subject's standing decision" language="json">
        {policyExample}
      </CodeBlock>

      <h2>The subject is the slug</h2>
      <p>
        A policy&apos;s slug <em>is</em> the subject a run asks for. Asking which sources cover
        scripture is therefore a lookup by name: no mapping table to maintain, and no way for two
        policies to claim one subject and leave the tie to whichever was published first.
      </p>
      <p>
        A run names its subject with <code>researchSubject</code> in its intake. Preflight resolves
        that to the policy, resolves every member source, and composes the approved domains the
        retrieval step will filter against — before a provider is paid.
      </p>
      <Table
        head={['Situation', 'What happens', 'Why']}
        rows={[
          ['The subject names a policy', 'Its members become the approved domains, in order', 'Order is priority: retrieval asks the first and stops when it has enough'],
          ['The subject names no policy', 'The run fails in preflight, at zero spend', 'Researching the wrong sources quietly is worse than stopping'],
          ['A member does not resolve', 'The run fails and names the member', 'Dropping it would leave a corpus narrower than the policy says'],
          ['No subject is named', 'The run fails unless the template has its own default', 'A template serving many subjects has no honest default'],
        ]}
      />

      <Callout title="No source is approved for everything">
        Scripture settles what a verse says and settles nothing about what it means or when it was
        written — that is interpretation and scholarship, and needs different sources. This is why a
        policy records the claim types it covers, and why approval is never a property of a site on
        its own. The checker today asks only whether a printed value appears in the passage it cites;
        checking the value against the claim type is the next rung, and the records already carry what
        it needs.
      </Callout>

      <h2>What a run records</h2>
      <p>
        Every run keeps the policy version it used <em>and</em> the version of each member, so a
        citation read back months later resolves to what that run actually had rather than to whatever
        the policy says now.
      </p>
      <CodeBlock title="Provenance on the run" language="json">
        {provenanceExample}
      </CodeBlock>
      <p>
        The retrieved passages are stored on the artifact with the time each was read. That pairing is
        deliberate. A page changes, and a citation naming only the page cannot be checked against what
        we saw; the text and the timestamp together are the evidence, and either on its own is an
        argument.
      </p>

      <h2>Editing the approved sources</h2>
      <p>
        Both resources follow the Library lifecycle: publishing adds a version, and promoting moves
        the <code>live</code> alias that resolution follows. So a version nobody promoted is invisible
        to every run, which is the usual reason an edit appears to do nothing.
      </p>
      <p>
        Retire a source by archiving it rather than deleting it, because a finished run&apos;s
        provenance still names it. Archiving a source that a live policy still lists will fail that
        policy&apos;s runs loudly, which is intended: remove it from the policy first.
      </p>
    </DocsPageShell>
  );
}
