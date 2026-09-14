import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, PageHeader, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Quality tiers',
  description:
    'What each render-quality tier is validated for, and why quality is added after acceptance — never by re-rendering.',
};

export default function Page() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Contract rules"
        title="Quality tiers"
        lead="Render quality is routed per item, from evidence: each tier is used only where it has been validated, and print quality is added to the image a human approved — never by rolling the dice again."
      />

      <h2 id="routing">Routing</h2>
      <Table
        head={['Tier', 'Validated for', 'Notes']}
        rows={[
          [<code key="l">low</code>, 'Isolated subjects, poses, and props.', 'Benchmark-validated: best long-prompt adherence at the lowest cost for single-figure items.'],
          [<code key="m">medium</code>, 'Patterns, scenes, borders, and every text-bearing item.', 'Low garbles small glyphs and dense compositions; anything carrying text or edge-to-edge detail routes here or above.'],
          [<code key="h">high</code>, 'Reserved for items that demonstrably need it.', 'Escalation, not default.'],
        ]}
      />

      <h2 id="quality-after-acceptance">Quality is added after acceptance</h2>
      <p>
        Drafts render at the cheapest validated tier. Once a human approves an image, the
        upscale-to-print pipeline adds resolution and export normalization <em>to that exact
        image</em>. A re-render is a new sample — a different image that happens to share a
        prompt — so it can never be the path to a &ldquo;sharper version&rdquo; of what was
        approved.
      </p>
      <Callout title="Where it appears">
        The required per-item <code>quality</code> field on pack manifests, and the
        <code> quality</code> intake on the generation templates. The planner assigns it from
        these rules; drivers pass it through.
      </Callout>
    </DocsPageShell>
  );
}
