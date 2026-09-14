import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, PageHeader, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Element types & render modes',
  description:
    'Why isolated elements ship transparent, seamless patterns ship full-bleed, and background removal is a policy — not a preference.',
};

export default function Page() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Contract rules"
        title="Element types & render modes"
        lead="Every pack item declares what kind of element it is. That intent decides its render mode — transparent cutout or full-bleed tile — and whether background removal is ever allowed to run."
      />

      <h2 id="the-types">The types</h2>
      <Table
        head={['Element type', 'What it is', 'Render mode']}
        rows={[
          ['subject / pose / prop', 'An isolated element with unambiguous figure and ground.', 'Transparent PNG — background removal applies.'],
          ['border / corner', 'Frame elements, usually line art.', 'Transparent PNG — background removal applies.'],
          ['scene', 'A framed vignette with real figure/ground (a desk, a window view).', 'Transparent PNG — cuts out cleanly.'],
          [<code key="p">pattern</code>, 'A seamless repeating tile — 100% ground by design.', <strong key="pb">Full-bleed, opaque. Background removal never runs.</strong>],
        ]}
      />

      <h2 id="the-category-error">The category error</h2>
      <p>
        Background removal answers one question: which pixels are the subject, which are the
        background? A seamless pattern has no subject — the pattern <em>is</em> the ground.
        Forced to answer anyway, any removal model picks something arbitrary and erases the
        product. This is deterministic, not bad luck: a better model just carves a cleaner hole.
      </p>
      <Callout title="Policy, not convention">
        The platform forces background removal off for pattern items regardless of any caller
        flag. Two independent integrations shipped the same mistake before this was policy —
        which is the proof it can&rsquo;t live as a convention.
      </Callout>

      <h2 id="transparency-is-a-property">Transparency is a property, not a feature</h2>
      <p>
        A pattern tile is <em>supposed</em> to be edge-to-edge opaque — that is what makes it
        tileable. Transparency isn&rsquo;t something it is missing; it is something it must not
        have. Deliverables declare their render mode so storefronts label formats honestly.
      </p>
    </DocsPageShell>
  );
}
