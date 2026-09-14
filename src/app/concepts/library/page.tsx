import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, CodeBlock, EndpointList, PageHeader, StepList, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'The Library — standards, directions & axes',
  description:
    'Where creative intent is authored once, versioned, and pointed at: prompts, classifiers, standards, directions and axes. Editing publishes a version; promoting changes what runs.',
};

const planes = `ENGINE    code        what the platform can do          changes by deploy
LIBRARY   authored    what we have decided to make      changes by promotion
LEDGER    derived     what has actually been made       changes by itself`;

const standardPayload = `{
  "family": "coloring-page",
  "rules": [
    "Black outlines only, no fills, no grey, white background",
    "Every region sealed — no gaps a colour could leak through",
    "Nothing inside the outer quarter inch"
  ],
  "forbid": ["shading", "gradients", "photographic texture"],
  "notes": "Printed at Letter; a home printer clips the margin."
}`;

const directionPayload = `{
  "family": "coloring-page",
  "premise": "A {subject} in its real habitat, drawn so a child can name three things in it",
  "seriesRule": "One species per page, never two",
  "audience": "Parents buying for 6-10 year olds",
  "packGoal": "A printable pack a parent can hand over on a rainy afternoon",
  "subjectTreatment": "Whole animal, side or three-quarter, doing something",
  "detailLevel": "medium",
  "composition": "Subject fills the frame; implied ground, not edge to edge",
  "textStance": "titles-only",
  "avoid": ["cartoon eyes", "speech bubbles"],
  "standardRef": { "slug": "coloring-page-house-rules", "alias": "live" }
}`;

const axesPayload = `{
  "family": "coloring-page",
  "axes": [
    { "key": "subject", "label": "Species",
      "values": ["triceratops", "stegosaurus", "brachiosaurus"],
      "weights": { "triceratops": 2 } },
    { "key": "pose", "label": "Pose",
      "values": ["walking", "drinking", "peeking", "resting"] },
    { "key": "setting", "label": "Setting",
      "values": ["riverbank", "forest", "volcanic plain"] }
  ],
  "rules": [
    { "kind": "uniquePair", "axes": ["subject", "pose"] },
    { "kind": "maxRepeat", "axis": "subject", "max": 3 }
  ]
}`;

const compiled = `compile_direction(direction, standard) ->
{
  "theme":       "Triceratops in its real habitat, drawn so a child can name three things in it",
  "styleNotes":  "clean medium-weight outlines with a few interior lines — satisfying for ages 6-10, never fussy; …",
  "brandNotes":  "Black outlines only, no fills, no grey, white background. Every region sealed …",
  "avoidList":   "cartoon eyes, speech bubbles"
}`;

export default function LibraryPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · The Library"
        title="The Library"
        lead={
          <>
            The Library is where creative intent is written down once and pointed at from everywhere else — the house
            rules a family of work obeys, the brief for a series, the variety a pack is scheduled over, the prompts a
            template reads, the vocabularies a classifier chooses from. Editing one publishes a version and changes
            nothing that runs. Promoting one changes what every worker pointing at it does on its next shift.
          </>
        }
      />

      <h2>Three planes</h2>
      <p>
        This is the whole mental model. Everything in the platform sits in exactly one of them, and the planes change
        for different reasons and at different speeds.
      </p>
      <CodeBlock title="engine, library, ledger" language="ascii">
        {planes}
      </CodeBlock>
      <Table
        head={['Plane', 'Holds', 'Examples', 'How it changes']}
        rows={[
          ['Engine', 'What the platform can do at all', 'Templates, steps, tools, models, gates', 'A deploy, and for templates a publish'],
          ['Library', 'What we have decided to make, in our words', 'Standards, directions, axes, prompts, classifiers', 'You author a version; a promotion makes it live'],
          ['Ledger', 'What has actually been made', 'Coverage per family, cost, quality audits, build records', 'It writes itself; never edited'],
        ]}
      />
      <Callout title="Why the split earns its keep">
        <p>
          Before it, a series brief lived in a Python literal inside a seeding script. Changing “what dinosaur packs
          are for” meant editing code, opening a pull request, deploying, and then hoping every place that repeated
          the same sentences had been updated too. Intent and code changed at the same speed, which meant neither was
          reviewable on its own terms.
        </p>
      </Callout>

      <h2>The five kinds</h2>
      <p>
        They share one spine — versions, a live pointer, a promotion history — because that is the guarantee every
        authored thing needs, and one mechanism is easier to trust than five. What differs is the shape of one JSON
        payload, declared in a single file.
      </p>
      <Table
        head={['Kind', 'Answers', 'Read by']}
        rows={[
          [
            <strong key="s">Standard</strong>,
            'What every piece of this family obeys, regardless of series. The house rules.',
            'Compiled into a planner’s brand notes; referenced by directions',
          ],
          [
            <strong key="d">Direction</strong>,
            'What this series is: premise, audience, what buyers make with it, how subjects are treated, how detailed, how composed, what to avoid.',
            'Compiled into the planner’s intake fields',
          ],
          [
            <strong key="a">Axes</strong>,
            'The variety space a pack is scheduled over: the dimensions, their values, demand weights, and the rules the allocator must honour.',
            'The allocator, which assigns each page a combination before any prose is written',
          ],
          [
            <strong key="p">Prompt</strong>,
            'The system text a step gives a model — who the model is while it runs.',
            'Resolved into the step before the run starts',
          ],
          [
            <strong key="c">Classifier</strong>,
            'A named list of labels a workflow may choose from, and whether that list is public.',
            'Bound into the template’s classify steps',
          ],
        ]}
      />

      <h2>The spine: version, promote, resolve</h2>
      <StepList
        items={[
          {
            name: 'An item is an identity',
            desc: 'A name, a slug, a kind, and a workspace. It holds no content of its own — content lives in versions, so the item can be pointed at for years while what it says changes.',
          },
          {
            name: 'Editing publishes a version',
            desc: 'Versions are append-only and numbered. Publishing is always safe: nothing that runs changes, because nothing follows “latest”.',
          },
          {
            name: 'Promoting moves the live pointer',
            desc: 'An alias — normally “live” — points at one version. Moving it is the act that changes production, so it is the act that takes an admin and is recorded with who did it and why.',
          },
          {
            name: 'A reference resolves at run start',
            desc: 'Steps and specs carry a reference — by id or slug, following an alias or pinned to a version. It resolves in preflight, before any provider is paid, so a misconfigured run fails at zero cost instead of at step four.',
          },
          {
            name: 'The run records what it used',
            desc: 'The resolved version number goes into the run’s record. Two packs made a month apart can be compared honestly because each says which version of the brief it followed.',
          },
        ]}
      />
      <Callout title="The property this buys you">
        <p>
          <strong>Publishing is free; promoting is the decision.</strong> That is why the editor has no confirmation
          dialogs and the promote button does. You can write five revisions of a direction at midnight and none of
          them touch tomorrow’s shift until you say so.
        </p>
      </Callout>

      <h3>Deleting</h3>
      <p>
        Deleting an item archives it: it leaves the Library, every version and promotion it ever had stays readable —
        so anything already made with it can still be explained — and anything still pointing at it stops resolving on
        its next run. That last part is deliberate. A reference to a deleted brief should fail loudly at preflight,
        not quietly fall back to something else.
      </p>

      <h2>Writing a standard</h2>
      <p>
        Rules are imperative, checkable, and about the artefact rather than the process. If a rule cannot be checked by
        looking at the finished piece, it belongs in a direction, not a standard.
      </p>
      <CodeBlock title="standard payload" language="json">
        {standardPayload}
      </CodeBlock>

      <h2>Writing a direction</h2>
      <p>
        A direction is fields, not prose. You write the premise, the audience, the treatment; the compiler writes the
        sentences. That inversion is the point: it means the wording lives in exactly one place, and changing how
        briefs read is a code change with a version bump rather than a hundred edits.
      </p>
      <CodeBlock title="direction payload" language="json">
        {directionPayload}
      </CodeBlock>
      <p>
        <code>{'{subject}'}</code> in the premise is filled by the allocator’s assignment for each page.{' '}
        <code>standardRef</code> is how a direction inherits the house rules, so the rules are stated once and every
        series that follows them says so explicitly.
      </p>

      <h3>What the compiler produces</h3>
      <p>
        The compiler is pure and deterministic — no database, no clock, no randomness — and it emits exactly the
        intake fields a planner declares, omitting anything absent so an explicit override still wins.
      </p>
      <CodeBlock title="direction + standard, compiled" language="json">
        {compiled}
      </CodeBlock>
      <Table
        head={['Compiler rule', 'Why']}
        rows={[
          ['Deterministic: same payloads, same bytes', 'A plan can name the compiler version and the payload digests and be reproduced later.'],
          ['Versioned: COMPILER_VERSION on every plan', 'Bumped whenever the same inputs produce different output — and only then. That is what lets two packs a month apart be compared honestly.'],
          ['Declared fields only', 'A planner receives the fields it asked for, never a grab bag. Absent optionals are omitted, not emitted empty.'],
          ['Prose is derived, never authored', 'The sentences exist in one function. If the wording is wrong, fix it there and bump the version.'],
          ['Budgeted', 'A direction must not crowd out the research and style text already in the planner’s turn, so compiled prose has generous ceilings.'],
        ]}
      />

      <h2>Writing an axes set, and what the allocator does with it</h2>
      <p>
        Packs converge after a few runs because the planner chooses what to vary, from the same brief every time, and
        a language model samples the middle of its distribution. Axes take that choice away from the model: every page
        is assigned a combination before the manifest is written, and the model writes prose for an assignment it was
        handed.
      </p>
      <CodeBlock title="axes payload" language="json">
        {axesPayload}
      </CodeBlock>
      <Table
        head={['Allocator property', 'What it means for a pack']}
        rows={[
          ['Deterministic, seeded by the plan run id', 'The same plan re-assembles to the same assignments, so a build record reproduces.'],
          ['Least-used first', 'Values are ordered by how often the family has already used them, then by demand weight. The pack’s own usage counts as it goes.'],
          ['Combine before repeating', 'A 3-value axis and a 5-value axis give 15 distinct pages before any pair repeats — the unit of uniqueness is the whole combination, not one axis.'],
          ['Rules are enforced, not hoped for', 'uniquePair, exhaustFirst and maxRepeat are honoured by advancing an axis; a page that cannot satisfy them is still assigned and the violation is recorded. Prose rules pass through to the planner.'],
        ]}
      />

      <h3>The coverage ledger</h3>
      <p>
        Coverage is derived, never edited. Each pack plan stores what it used and which variety space it was scheduled
        over; the ledger sums those. There is no table to keep in sync with deletions or failed plans — the artifact is
        the record. The family key is the workspace plus the axes set, so two workers sharing one axes set share one
        ledger, and two different sets never pollute each other’s counts.
      </p>
      <p>
        That is what makes “47 dog packs exist and not one used pose = peeking” a question you can answer, and what the
        allocator reads to stop the next pack rhyming with the last.
      </p>

      <h2>Pointing work at the Library</h2>
      <Table
        head={['Reference', 'Where it sits', 'Resolved']}
        rows={[
          [<code key="sp">systemPromptRef</code>, 'On a template step, beside or instead of inlined system text', 'Run preflight. The reference wins when both are present, which is what made the migration safe: add refs, keep the text, delete the ref if anything is wrong.'],
          [<code key="cr">classifier refs</code>, 'On the template’s classify steps, per axis', 'Run preflight, with a contract check that the labels match what the step expects'],
          [<code key="dr">standardRef</code>, 'Inside a direction’s payload', 'At compile time, so a series inherits the house rules'],
          [<code key="ar">axesRef</code>, 'Recorded on the plan artifact’s provenance', 'At planning time, and it is the family key the coverage ledger groups by'],
        ]}
      />
      <Callout title="What is wired today, honestly">
        <p>
          Prompts and classifiers resolve into live runs now. The direction compiler, the allocator and the coverage
          ledger are built, tested and documented here, but the pack planner does not read them yet — wiring them into
          the shift path is the next step. Until it lands, a worker still carries its brief in its job spec, and this
          page describes where that brief is moving.
        </p>
      </Callout>

      <h2>Anti-drift rules</h2>
      <ol>
        <li>
          <strong>Intent goes in the Library, never in a script.</strong> If you are about to paste a paragraph of
          creative direction into a seeding script or a template literal, it belongs in a direction.
        </li>
        <li>
          <strong>Prose is derived.</strong> Do not hand-write the sentences a planner reads. Write the fields; if the
          sentences are wrong, fix the compiler and bump its version.
        </li>
        <li>
          <strong>Promote deliberately, and say why.</strong> The note on a promotion is the only place the reason
          survives.
        </li>
        <li>
          <strong>Never edit a version in place.</strong> There is no such operation, and asking for one is a sign the
          thing you want is a new version.
        </li>
        <li>
          <strong>Archive rather than delete-and-recreate.</strong> Recreating loses the history that explains
          everything made before.
        </li>
      </ol>

      <h2>API</h2>
      <p>
        One collection per kind, so a request to one cannot create another: <code>/v1/prompts</code>,{' '}
        <code>/v1/classifiers</code>, <code>/v1/standards</code>, <code>/v1/directions</code>, <code>/v1/axes</code>.
        The paths below stand for all five.
      </p>
      <EndpointList
        items={[
          { method: 'GET', path: '/v1/{kind}', desc: 'List a workspace’s items. Archived are hidden unless asked for; include=live carries each item’s live payload in the same request.' },
          { method: 'POST', path: '/v1/{kind}', desc: 'Create an item with its first version.' },
          { method: 'GET', path: '/v1/{kind}/{itemId}', desc: 'The item with every version and which aliases point where.' },
          { method: 'PATCH', path: '/v1/{kind}/{itemId}', desc: 'Identity only — name, description, archived, facets. Content is never patched.' },
          { method: 'POST', path: '/v1/{kind}/{itemId}/versions', desc: 'Publish a new version. Safe by construction unless it also asks to promote.' },
          { method: 'POST', path: '/v1/{kind}/{itemId}/aliases', desc: 'Promote: point an alias at a version. Admin only; recorded with a note.' },
          { method: 'GET', path: '/v1/{kind}/{itemId}/moves', desc: 'The promotion history: who moved what, from which version to which, and why.' },
          { method: 'GET', path: '/v1/{kind}/resolve', desc: 'Turn a reference into the concrete payload a run will use, plus the version number the run must record.' },
        ]}
      />
    </DocsPageShell>
  );
}
