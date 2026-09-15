import { DocsPageShell } from '@/components/docs/DocsPageShell';
import { PageHeader } from '@/components/docs/Primitives';

export const metadata = {
  title: 'Changelog',
  description:
    'Public API and platform changes as Esy formalizes runtime contracts. Breaking changes will land under a new versioned path.',
};

/**
 * Newest first. Each entry describes what shipped, not the order it was
 * drafted in: where several changes landed the same day and later ones
 * replaced earlier ones, the entry states the model that survived.
 */
const entries = [
  {
    date: '2026-09-15',
    tag: 'platform',
    title: 'Film cuts: chosen takes joined into one video',
    items: [
      'A new in-house tool, esy/video-join, joins video clips into one MP4: each clip trimmed to the seconds you keep, fitted to one frame size and frame rate (letterboxed, never stretched), in the order given. It runs on the worker with its bundled ffmpeg, so there is no provider spend — the only cost is one storage write.',
      'It runs through a new workflow, build-film-cut. The verb is build, not generate: nothing is invented — the clips are supplied, the join is deterministic, and the product has exact structure, a segment list saying where every shot sits in the film and which part of which clip it is.',
      'The result is a video artifact of type film-cut, documented on the Artifacts page. Its checks are exact: every clip asked for is in the cut, and the encoded file — measured, not summed — runs as long as the kept seconds add up to. A film that comes out shorter is held for review rather than shipped.',
      'Films are silent. Sound belongs to the whole film and is designed in a later step, never stitched from each clip’s own.',
      'build-film-cut is internal for now; clip.art’s One-Minute Short is its first caller. Clip URLs must come from platform storage or a configured trusted origin, like every tool that fetches from intake.',
    ],
  },
  {
    date: '2026-09-13',
    tag: 'docs',
    title: 'The docs, rewritten against the running API',
    items: [
      'The docs live at docs.esy.com again, as their own site. They had been part of esy.com/docs since June; every esy.com/docs address now redirects to the same path here.',
      'New Get started path: Quickstart (real requests, real responses), How Esy works, Authentication, Errors, and a Glossary that maps every term to the name the code uses.',
      'Concepts reorganised into a reading order and merged where pages overlapped: Workflows (was Workflow schemas + Workflow templates + Template naming), Runs and steps (absorbs Runtime steps), Versioning (was Workflow versioning + Workflow specifications), Costs and budgets, and new Intake and Gates and review pages. Old URLs redirect.',
      'API reference pages for Runs, Artifacts, Workflows and catalog, Orders, Review queue, Costs and budgets, and Webhooks.',
      'Corrections. The API says workspace, not organization. There are three cost states — estimated, provider_reported, reconciled — not four. There is no Workflow Specification resource; a run pins workflowVersion and specVersionHash. Runs have nine statuses, not five. Dry-run and estimate take a draft definition, not a templateId. Budgets have no scope field.',
      'Every endpoint the docs mention is now checked against api.esy.com/openapi.json (npm run check:docs-endpoints), and search matches section headings, not only page titles.',
    ],
  },
  {
    date: '2026-09-12',
    tag: 'platform',
    title: 'Source policies: a subject picks the sources it may be researched from',
    items: [
      'Two new Library resources. /v1/sources holds one approved source per item — its domain derived from the URL, the edition that makes a quote checkable, and what it is good for. /v1/source-policies holds one subject’s standing decision: which of those sources, what the subject covers, and where it stops.',
      'They are peers, not a nesting: a policy names several sources and a source is named by several policies, so neither owns the other.',
      'A policy’s slug IS its subject, so a run names researchSubject and preflight resolves it by name — no mapping table, and no way for two policies to claim one subject.',
      'A subject with no policy, or a member that will not resolve, fails the run in preflight at zero spend. Researching the wrong sources quietly is worse than stopping.',
      'Provenance keeps the policy version and every member version, and each retrieved passage is stamped with when it was read, so a citation read back months later resolves to what that run actually had.',
    ],
  },
  {
    date: '2026-08-02',
    tag: 'docs',
    title: 'Guide: publish packs with a worker team',
    items: [
      'A five-step walkthrough — outlet, team, workers, schedule, receive the pack — with the checks that prove it worked and a troubleshooting section for when nothing appears on your site.',
    ],
  },
  {
    date: '2026-07-21',
    tag: 'docs',
    title: 'Image quality contracts',
    items: [
      'Five rule pages the workflow contract chips link to: text policies (none / exact / freeform), element types and render modes, quality tiers, gates and checks, and chunked planning.',
      'Gates and checks has since merged into Gates and review.',
    ],
  },
  {
    date: '2026-07-11',
    tag: 'docs',
    title: 'Run events, runtime steps, and template naming',
    items: [
      'Run events (SSE) reference: snapshot on connect, the event names, heartbeats, and a reconnect ladder with a polling fallback.',
      'The runtime step contract: step kinds, dotted input references, model binding by role, structured output, and the sizing limits — maxTokens, timeouts, estimates.',
      'Workflow ids follow a verb-noun convention with a registry of verbs: generate invents, build computes, compose writes from sources.',
    ],
  },
  {
    date: '2026-07-07',
    tag: 'platform',
    title: 'Teams, specialties, and publish routing',
    items: [
      'Outlets are URL-defined (siteUrl + sectionPath): clip.art/free and clip.art/flowers are different outlets. Consumers discover theirs from GET /v1/outlets rather than holding a channel list in config.',
      'Webhook secrets belong to the endpoint, not the channel: outlets sharing a revalidate URL share one secret, so a consumer holds exactly one no matter how many outlets ship to it.',
      'Teams group workers into crews, each worker at most one team, each with a title. A team names what it produces, and members inherit that as their specialty unless they state a narrower one. A worker cannot run a shift without a specialty.',
      'Routing, as it stands: goals decide WHAT gets made; teams, sections, and Solo outlets decide WHERE it ships. A team with a designated outlet fences everything its crew publishes to that outlet; otherwise a same-site section matching the artifact’s category takes it; otherwise the worker’s Solo outlet. Goals no longer carry outlets, and job.publishTo is retired.',
      'Every published item records why it landed where it did (routedVia: team | section | solo | manual | subscription), and an outlet can syndicate every published artifact of the kinds it accepts.',
      'Earlier the same day, routing went through a goal-outlet-first ladder and then a four-rung ladder ending at the team’s outlet. Both were replaced by the model above before the day ended; if you read about either elsewhere, it is out of date.',
    ],
  },
  {
    date: '2026-07-06',
    tag: 'platform',
    title: 'The manufacturing tier: Workers, Assigned work, Orders, and Outlets',
    items: [
      'Workers: durable principals that run bounded shifts on schedules, produce against a standing job, and report to your Inbox in their own voice (with stop-condition escalation).',
      'Assigned work: goals and tasks carry an assignee — yours or a worker’s. Worker goals require measurable targets, progress by live catalog census, and achieve themselves; scheduled tasks are day directives workers check off with a completion note.',
      'Generation Orders documented: one template fanned into N child runs with variation, per-child dedupe keys, and a hard budget cap — two-phase (planned → start).',
      'Outlets (new, separate from Publications): channels for publishing artifacts of any kind from os.esy.com. Publish and unpublish are platform acts fired to your site as signed webhooks.',
      'New references: Workers API, Planning API (goals, tasks, messages), and the expanded Outlets API.',
    ],
  },
  {
    date: '2026-06-04',
    tag: 'platform',
    title: 'Workflow publishing — visibility ladder + admin-gated authoring',
    items: [
      'Introduced template visibility (draft → internal → public) as the single control over where a template is listed, decoupled from lifecycle status.',
      'Publish-time validation (executability + estimability) now runs when a template is promoted to a listed rung, not on a status flag.',
      'Gated workflow create/update behind admin; admin-published templates are system-owned and the public catalog lists only public, system-owned templates.',
    ],
  },
  {
    date: '2026-05-16',
    tag: 'docs',
    title: 'Public reference layer',
    items: [
      'Launched docs.esy.com with the Esy brand system aligned to esy.com and os.esy.com.',
      'Added concept pages for Workflow templates, Runs, Artifacts, and Costs.',
      'Documented the generate-clip-art-asset workflow end-to-end with step-level telemetry.',
      'Introduced the provider cost ledger with estimated, provider-reported, and reconciled states.',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <DocsPageShell>
      <PageHeader
        eyebrow="Resources · Changelog"
        title="Changelog"
        lead={
          <>
            Public API and platform changes are tracked here as Esy formalizes runtime contracts. Breaking
            changes will move to a new versioned path; non-breaking additions ship continuously.
          </>
        }
      />

      <div style={{ marginTop: 16 }}>
        {entries.map((entry) => (
          <article key={`${entry.date}-${entry.title}`} className="changelogEntry">
            <div>
              <div className="changelogDate">{entry.date}</div>
              <span className="changelogTag">{entry.tag}</span>
            </div>
            <div>
              <h3>{entry.title}</h3>
              <ul>
                {entry.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </DocsPageShell>
  );
}
