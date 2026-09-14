import Link from 'next/link';
import type { ReactNode } from 'react';

import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { Callout, PageHeader } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Glossary',
  description:
    'Every term in the Esy API defined in a sentence, with the name the code actually uses and a link to the page that goes deeper.',
};

type Term = { term: string; also?: string; def: ReactNode; href?: string };

/**
 * One definition per noun, in the reader's alphabet rather than the system's.
 * `also` carries the name you will meet elsewhere — in the dashboard, in older
 * docs, or in the source — so a reader who arrives with the wrong word still
 * lands in the right place.
 */
const TERMS: Term[] = [
  {
    term: 'Artifact',
    def: (
      <>
        What a run produced, stored durably with its QA record, cost ledger, and a link back to the run
        that made it. Files live in object storage; the artifact is the record around them.
      </>
    ),
    href: '/concepts/artifacts',
  },
  {
    term: 'Artifact class',
    def: (
      <>
        The broad family of an output: <code>visual</code>, <code>research</code>, <code>video</code>, or{' '}
        <code>knowledge</code>. Declared by the workflow, not chosen per run.
      </>
    ),
    href: '/concepts/artifacts',
  },
  {
    term: 'Artifact schema',
    also: 'artifactSchema',
    def: (
      <>
        The output half of a workflow&rsquo;s contract — the artifact class and type it produces, the
        file types, and the metadata it promises to fill in.
      </>
    ),
    href: '/concepts/workflows',
  },
  {
    term: 'Budget',
    def: (
      <>
        A spend limit attached to a workspace, project, or workflow, with a period and an enforcement
        mode. Checked before a run starts, using the estimate.
      </>
    ),
    href: '/concepts/costs',
  },
  {
    term: 'Capability flag',
    def: (
      <>
        A declared fact about a model in the registry — for example{' '}
        <code>supports_native_transparency</code>. The engine reads these to choose a mechanism, so you
        never have to.
      </>
    ),
    href: '/concepts/intake',
  },
  {
    term: 'Cost ledger',
    also: 'provider_cost_ledger',
    def: (
      <>
        One immutable row per provider call, carrying the model, the quantity, the unit price, and which
        of the three cost states it is in.
      </>
    ),
    href: '/concepts/costs',
  },
  {
    term: 'Cost state',
    def: (
      <>
        Where a ledger row is in its life: <code>estimated</code> → <code>provider_reported</code> →{' '}
        <code>reconciled</code>. There are three, not four.
      </>
    ),
    href: '/concepts/costs',
  },
  {
    term: 'Gate',
    def: (
      <>
        A judgement between steps. A quality gate is automatic; an approval gate parks the run in{' '}
        <code>review</code> for a human. A gate never runs work — it declares which step it{' '}
        <code>unlocks</code>.
      </>
    ),
    href: '/concepts/gates-and-review',
  },
  {
    term: 'Generation Order',
    also: 'order',
    def: (
      <>
        One template fanned out into N child runs with a variation spec, a dedupe key, and its own budget
        cap.
      </>
    ),
    href: '/concepts/orders',
  },
  {
    term: 'Intake',
    def: (
      <>
        The inputs you hand a run. Constrained by the workflow&rsquo;s <code>intakeSchema</code>, and
        validated before anything is spent.
      </>
    ),
    href: '/concepts/intake',
  },
  {
    term: 'Intake schema',
    also: 'intakeSchema',
    def: (
      <>
        The input half of a workflow&rsquo;s contract: each field&rsquo;s name, type, whether it is
        required, its default, and its allowed values.
      </>
    ),
    href: '/concepts/intake',
  },
  {
    term: 'Project',
    def: (
      <>
        An optional grouping inside a workspace so runs, artifacts, and costs roll up somewhere
        meaningful. A &ldquo;brand&rdquo; is a project with a brand profile attached.
      </>
    ),
    href: '/how-esy-works',
  },
  {
    term: 'Provider',
    def: (
      <>
        Whoever actually performs a step — OpenAI, Anthropic, fal.ai, or an in-house tool like{' '}
        <code>esy/chroma-key</code>.
      </>
    ),
    href: '/concepts/runs',
  },
  {
    term: 'Provider binding',
    also: 'providers',
    def: (
      <>
        The workflow&rsquo;s map from a role to a concrete model id. Two roles may share one model. A run
        can override a binding for itself.
      </>
    ),
    href: '/concepts/runs',
  },
  {
    term: 'Provenance',
    def: (
      <>
        The record of how an artifact came to exist: the pinned workflow version, the resolved prompt,
        the models used, the mechanism chosen, and which credential started the run.
      </>
    ),
    href: '/concepts/versioning',
  },
  {
    term: 'Review queue',
    def: (
      <>
        Everything waiting on a human decision. It is a view over runs whose status is{' '}
        <code>review</code>, not a separate table.
      </>
    ),
    href: '/concepts/gates-and-review',
  },
  {
    term: 'Role',
    def: (
      <>
        What a step needs, named abstractly — <code>imageGenerator</code>, <code>classifier</code>,{' '}
        <code>textGate</code>. Roles let you change models without editing steps.
      </>
    ),
    href: '/concepts/runs',
  },
  {
    term: 'Run',
    def: <>One execution of one workflow, with per-step telemetry, costs, and a terminal status.</>,
    href: '/concepts/runs',
  },
  {
    term: 'Spec',
    also: 'specVersionHash, the frozen spec',
    def: (
      <>
        The exact workflow definition plus intake a run executed, hashed and pinned at creation. It is
        what makes a run reproducible after the workflow changes.
      </>
    ),
    href: '/concepts/versioning',
  },
  {
    term: 'Step',
    also: 'runtime step',
    def: (
      <>
        One unit of work inside a workflow. Its <code>kind</code> is <code>llm</code>,{' '}
        <code>image</code>, <code>tool</code>, <code>subWorkflow</code>, <code>agent</code>, or{' '}
        <code>code</code>.
      </>
    ),
    href: '/concepts/runs',
  },
  {
    term: 'Sub-workflow',
    def: (
      <>
        A step that runs another workflow as a child run, pinning the child&rsquo;s version and rolling
        its cost up into the parent.
      </>
    ),
    href: '/concepts/sub-workflows',
  },
  {
    term: 'Template',
    also: 'templateId',
    def: (
      <>
        The everyday word for a workflow, and the field name you pass when creating a run. The API object
        is a workflow; <code>templateId</code> is its slug.
      </>
    ),
    href: '/concepts/workflows',
  },
  {
    term: 'Typed hold',
    def: (
      <>
        A review hold that declares exactly which fields a reviewer must supply to release it. Supplying
        more or fewer is refused.
      </>
    ),
    href: '/concepts/gates-and-review',
  },
  {
    term: 'Workflow',
    def: (
      <>
        The versioned definition a run executes: intake schema, runtime steps, provider bindings, gates,
        budget policy, and artifact schema.
      </>
    ),
    href: '/concepts/workflows',
  },
  {
    term: 'Workflow version',
    def: (
      <>
        An immutable snapshot of a workflow definition. Versions are append-only; a movable pointer
        decides which one is live.
      </>
    ),
    href: '/concepts/versioning',
  },
  {
    term: 'Workspace',
    also: 'organization',
    def: (
      <>
        The top-level boundary for billing, membership, and everything inside it. Its <code>kind</code>{' '}
        is <code>organization</code> or <code>personal</code> — an &ldquo;organization&rdquo; is a
        workspace, not a separate object.
      </>
    ),
    href: '/how-esy-works',
  },
];

export default function GlossaryPage() {
  const sorted = [...TERMS].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Get started · Glossary"
        title="Glossary"
        lead={
          <>
            Every term these docs use, defined in a sentence. Where the code or the dashboard uses a
            different word for the same thing, it is listed too — so arriving with the wrong word still
            gets you to the right page.
          </>
        }
      />

      <Callout title="Two words worth settling now" tone="note">
        <p>
          <strong>Workspace</strong>, not organization — an organization is a workspace whose{' '}
          <code>kind</code> is <code>organization</code>. And <strong>workflow</strong>, not template,
          except in the field name <code>templateId</code>, where the API says template and always will.
        </p>
      </Callout>

      <dl className="glossary">
        {sorted.map((t) => (
          <div key={t.term} className="glossaryItem" id={t.term.toLowerCase().replace(/\s+/g, '-')}>
            <dt>
              {t.href ? <Link href={t.href}>{t.term}</Link> : t.term}
              {t.also && <span className="glossaryAlso">also: {t.also}</span>}
            </dt>
            <dd>{t.def}</dd>
          </div>
        ))}
      </dl>
    </DocsPageShell>
  );
}
