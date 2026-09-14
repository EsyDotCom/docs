import Link from 'next/link';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, PageHeader, Table } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Chunked planning',
  description:
    'How big-list planning scales: one declared step expands into bounded chunk calls over disjoint slices, and results concatenate in order.',
};

export default function Page() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Contract rules"
        title="Chunked planning"
        lead="A planner asked for 80 fully-specified items in one model call will eventually truncate, time out, or lose everything to one network blip. Steps that produce big lists declare a repeat contract instead: bounded calls, disjoint slices, deterministic merge."
      />

      <h2 id="the-contract">The contract</h2>
      <Table
        head={['Property', 'Meaning']}
        rows={[
          [<code key="c">maxPerChunk</code>, 'The ceiling per call. The step expands into ceil(count ÷ maxPerChunk) calls — a 6-item pack is one call, 80 items is two, 200 is five.'],
          [<code key="m">mergeKey</code>, 'The array the chunks produce; results concatenate in chunk order, so output ordering is deterministic.'],
          ['slices', 'The plan&rsquo;s motif list is partitioned round-robin across chunks. Each call owns a disjoint slice and an explicit item range — siblings cannot overlap and never read each other&rsquo;s output.'],
        ]}
      />

      <h2 id="why-not-bigger-caps">Why not just raise the caps?</h2>
      <p>
        When one workload trips two unrelated ceilings — output tokens <em>and</em> wall-clock —
        the architecture is past its scale, and raising limits just moves the cliff. Chunking
        keeps every call inside proven limits at any pack size, and a failed chunk retries at
        chunk size instead of losing the whole plan.
      </p>
      <Callout title="Where you see it">
        The <code>repeat</code> declaration on a step in any contract page — e.g.{' '}
        <Link href="https://esy.com/workflows/plan-clipart-pack/contract">plan-clipart-pack</Link>&rsquo;s manifest
        step, badged <em>chunked</em> in the step topology.
      </Callout>
    </DocsPageShell>
  );
}
