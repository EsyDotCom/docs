import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, PageHeader, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Text policies',
  description:
    'The per-item text contract on image workflows: none, exact, or freeform — chosen by the planner, verified by a vision gate.',
};

export default function Page() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Contract rules"
        title="Text policies"
        lead="Rendered text is the #1 quality complaint on AI-generated art — but the failure isn't text, it's garble. Every image item carries a textPolicy that says what text is allowed and exactly what the vision gate verifies."
      />

      <h2 id="the-three-policies">The three policies</h2>
      <Table
        head={['Policy', 'Prompt behavior', 'Gate behavior']}
        rows={[
          [<code key="n">none</code>, 'The compiled prompt carries a hard "no text, no letters, no numbers" clause.', 'Rejects any legible text. Default for plain subjects and props — buyers overlay their own words.'],
          [<code key="e">exact</code>, 'The prompt states the exact copy in quotes; the item declares it as expectedText.', 'OCR must match expectedText — case, surrounding whitespace, and trailing punctuation are forgiven; misspellings and wrong words are not.'],
          [<code key="f">freeform</code>, 'Text is allowed; its content is unspecified.', 'Verifies legibility and spelling only: real, coherent, correctly spelled language passes — a scoreboard’s "7" is fine; gibberish or alien glyphs never ship.'],
        ]}
      />

      <h2 id="why-freeform-exists">Why freeform exists</h2>
      <p>
        A binary text model (planned-exactly or forbidden) rejects charm along with garble: a
        pizzeria sign, a scoreboard digit, ambient shop lettering. Those are context, and often a
        plus. What must never ship is <em>garbled</em> text. <code>freeform</code> keeps the charm
        and still catches the garble, because the gate&rsquo;s question changes from &ldquo;is there
        text?&rdquo; to &ldquo;is every piece of text readable and correctly spelled?&rdquo;
      </p>

      <Callout title="Who chooses the policy">
        The pack planner assigns a policy per item as part of the manifest contract — it is not a
        caller preference. Single-asset runs may pass it directly; when absent, it derives from the
        legacy binary flag so existing integrations keep their exact behavior.
      </Callout>

      <h2 id="where-it-appears">Where it appears</h2>
      <p>
        Intake fields named <code>textPolicy</code> on the clip-art generation templates, and the
        required <code>textPolicy</code> on every pack-manifest item. See any contract page, e.g.{' '}
        <Link href="https://esy.com/workflows/generate-clip-art-asset-v2/contract">generate-clip-art-asset-v2</Link>.
      </p>
    </DocsPageShell>
  );
}
