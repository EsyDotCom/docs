import Link from 'next/link';
import { DocsPageShell } from '@/components/DocsPageShell';
import { Callout, CodeBlock, PageHeader, Table } from '@/components/Primitives';

export const metadata = {
  title: 'Classification',
  description:
    'An artifact is more than one thing at once. A Workflow Template declares the axes it classifies on, each with its own Classifier; a run answers every axis; and whether an unmatched answer holds the artifact is declared, not decided by the label.',
};

// A template declares one entry per axis. Each names the classifier it chooses
// from; the primary axis's answer is the artifact's canonical label.
const templateDeclaration = `{
  "classifiers": [
    {
      "axis": "subject",
      "classifierRef": { "slug": "clipart-subjects", "alias": "live" },
      "primary": true
    },
    {
      "axis": "audience",
      "classifierRef": { "slug": "pack-audiences", "alias": "live" },
      "holdWhenUnmatched": false
    }
  ]
}`;

// One answer per axis, plus the canonical label for readers that predate axes.
const artifactShape = `{
  "classification": {
    "category": "car",
    "axes": {
      "subject":  "car",
      "audience": "small online shops packs"
    }
  }
}`;

// A pinned axis is supplied before the run and never inferred; the rest are
// classified normally.
const pinnedAxis = `intake
   ├── categories           "car, flower, school, …"   ← resolved from the classifier
   └── audienceCategories   "small online shops packs" ← PINNED by the caller

classification.axes
   ├── subject    "car"                        ← chosen by the classifier
   └── audience   "small online shops packs"   ← the pin, unchanged`;

export default function ClassificationPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Concepts · Classification"
        title="Classification"
        lead={
          <>
            An <Link href="/concepts/artifacts">Artifact</Link> is more than one thing at once. A photograph of a
            car made for small online shops is <em>a car</em> and <em>for small online shops</em> — those are not
            alternatives. A <Link href="/concepts/workflow-templates">Workflow Template</Link> declares the{' '}
            <strong>axes</strong> it classifies on, each with its own <strong>Classifier</strong>, and a{' '}
            <Link href="/concepts/runs">Run</Link> answers every one.
          </>
        }
      />

      <h2>Why axes</h2>
      <p>
        A classification scheme with one slot forces a choice between questions that are not in competition. Given
        a single <code>category</code> field, an operator who needs to record an audience records it{' '}
        <em>instead of</em> the subject — and the subject is then lost, permanently, for every artifact made that
        way.
      </p>
      <p>
        This is not hypothetical. Before axes, one Esy catalogue held 871 distinct category values across 10,686
        artifacts, and <strong>87% of them matched none of the curated sets</strong> — because a second vocabulary
        had been fed through the only slot available.
      </p>

      <Callout title="An axis is a question; a classifier is the list of allowed answers.">
        <code>subject</code> and <code>audience</code> are axes. The set of subjects an artifact may be filed under
        is a Classifier. The single value chosen for one axis on one artifact is a <em>category</em>.
      </Callout>

      <h2>Declaring axes on a template</h2>
      <p>
        A template lists one entry per axis. Each names the Classifier it chooses from — by reference, never by
        copy, so publishing a new version of that Classifier reaches every template pointing at it.
      </p>

      <CodeBlock title="template.classifiers" language="json">
        {templateDeclaration}
      </CodeBlock>

      <Table
        head={['Field', 'Meaning']}
        rows={[
          [<code key="a">axis</code>, 'The question this entry answers. Free-form; the name appears in the artifact.'],
          [
            <code key="b">classifierRef</code>,
            <>
              A pointer to a Classifier — <code>itemId</code> or <code>slug</code>, plus <code>alias</code> to
              follow a moving pointer or <code>version</code> to pin one.
            </>,
          ],
          [
            <code key="c">primary</code>,
            <>
              This axis&rsquo;s answer is the artifact&rsquo;s canonical label. Defaults to the first entry. See{' '}
              <em>What <code>category</code> means</em> below.
            </>,
          ],
          [
            <code key="d">holdWhenUnmatched</code>,
            <>
              Whether an unmatched answer sends the artifact to review. Defaults to <code>true</code>.
            </>,
          ],
        ]}
      />

      <h2>What a run records</h2>
      <p>
        Each axis gets its candidate list resolved into the run&rsquo;s intake before any step executes, and each
        answer is written back under its axis name.
      </p>

      <CodeBlock title="artifact.content.classification" language="json">
        {artifactShape}
      </CodeBlock>

      <h3>
        What <code>category</code> means
      </h3>
      <p>
        <code>category</code> holds the primary axis&rsquo;s answer. It exists so that readers written before axes
        keep working, and so Esy&rsquo;s own surfaces have one label to show.
      </p>
      <Callout title="category is not a routing instruction.">
        Esy records what an artifact <em>is</em>. Where a client shelves it — what URL it lives at, which pages
        list it, how its taxonomy is organised — is the client&rsquo;s decision, made from the axes it reads back.
        Nothing in Esy knows about paths.
      </Callout>

      <h2>Pinning an axis</h2>
      <p>
        Some answers are known before anything is made. A pack produced for teachers is for teachers from the
        moment it is planned, and inferring that from the finished image is strictly worse than recording the value
        already in hand.
      </p>
      <p>
        A caller supplies the answer, and that axis is not classified. Whatever is already in the intake for an
        axis wins; the remaining axes are classified normally.
      </p>

      <CodeBlock title="one axis pinned, one classified" language="tree">
        {pinnedAxis}
      </CodeBlock>

      <p>
        A pin is recorded in run provenance as a pin. &ldquo;This axis was decided upstream&rdquo; and &ldquo;this
        template classifies on nothing&rdquo; are different facts, and a run should be able to tell you which
        happened.
      </p>

      <h2>When nothing fits</h2>
      <p>
        <code>uncategorized</code> is a real answer, not a failure. It is deliberately excluded from every
        Classifier so that &ldquo;none of these&rdquo; stays distinguishable from a genuine choice.
      </p>
      <p>
        For a composite artifact it is often the <em>only</em> honest answer. A pack cover is a composition of a
        pack&rsquo;s elements — for a woodland set the elements are <code>mushroom</code>, <code>tree</code>,{' '}
        <code>rock</code>, and the cover is none of them. Such a template declares no subject axis at all: it is
        never asked, so there is nothing to be unmatched.
      </p>

      <Callout title="A classifier labels honestly and never decides consequences.">
        Whether an unmatched answer holds an artifact for review is declared by the template through{' '}
        <code>holdWhenUnmatched</code>. The label reports; the policy decides. An artifact can be honestly
        uncategorized and still publish.
      </Callout>

      <h2>Authoring classifiers</h2>
      <p>
        Classifiers are authored once and referenced, never copied into the templates that use them. Each edit
        publishes a new immutable version; a movable <code>live</code> pointer selects which one runs. Promoting a
        version reaches every template that follows the pointer, on its next run — the same discipline{' '}
        <Link href="/concepts/workflow-versioning">Workflow versioning</Link> applies to templates.
      </p>
      <p>
        A client that consumes Esy artifacts can maintain its own Classifiers through the API and read the axes
        back to build whatever taxonomy it wants. Esy stores the vocabulary and records the answers; arranging them
        is the consumer&rsquo;s work.
      </p>

      <Table
        head={['Endpoint', 'Purpose']}
        rows={[
          [<code key="a">GET /v1/classifiers</code>, 'List classifiers. Add ?include=live for each one’s current labels.'],
          [<code key="b">POST /v1/classifiers</code>, 'Create a classifier and publish its first version.'],
          [
            <code key="c">POST /v1/classifiers/{'{id}'}/versions</code>,
            'Publish a new version. Nothing that runs changes until it is made live.',
          ],
          [
            <code key="d">POST /v1/classifiers/{'{id}'}/aliases</code>,
            'Move the live pointer to a version. This is the act that changes what runs.',
          ],
          [
            <code key="e">GET /v1/classifiers/resolve</code>,
            'Resolve a reference to concrete labels and the version number a run must record.',
          ],
        ]}
      />

      <h2>Adding an axis to an existing template</h2>
      <p>
        Additive. A template that declares no axes behaves exactly as it always did, and existing artifacts keep
        the <code>category</code> they were classified with — their <code>axes</code> is absent because nothing was
        asked of them, and inferring one would assert a classification no run ever made.
      </p>
      <p>
        The primary axis writes its candidate list to the same intake key a single-axis template always used, so
        adding a <em>second</em> axis leaves the first one&rsquo;s behavior untouched.
      </p>
    </DocsPageShell>
  );
}
