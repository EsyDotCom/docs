/**
 * Sidebar information architecture for docs.esy.com.
 *
 * Sections render top-down in the order listed here, and this array is the
 * single source for the sidebar, breadcrumbs, prev/next, and search — so the
 * order below *is* the reading order. It is arranged as an external developer
 * actually moves: get a key and make a run, understand the nouns, then look
 * things up. Reference material never comes before the thing it references.
 *
 * Items support an optional `icon` (from the lucide map in Sidebar.tsx), a
 * `since` date (drives an auto-expiring "New" badge), an `external` flag, a
 * `description` for search/hub rendering, and an `opener` — the section art in
 * public/brand/docs, which is a transparent cutout so it works on both themes.
 */

export type NavIcon =
  | 'home'
  | 'rocket'
  | 'layers'
  | 'workflow'
  | 'play'
  | 'image'
  | 'wallet'
  | 'book'
  | 'history'
  | 'compass'
  | 'cpu'
  | 'users'
  | 'file-text'
  | 'palette'
  | 'app-window'
  | 'globe'
  | 'plug'
  | 'key'
  | 'radio'
  | 'alert'
  | 'terminal'
  | 'shield';

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: NavIcon;
  /**
   * ISO date (YYYY-MM-DD) the item was added. Drives the "New" badge, which
   * auto-expires after NEW_BADGE_DAYS — so badges don't linger for weeks.
   */
  since?: string;
  external?: boolean;
  /** Basename in public/brand/docs (no extension). Transparent, theme-safe. */
  opener?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: 'Get started',
    items: [
      {
        title: 'Overview',
        href: '/',
        description: 'What Esy does, and how to find your way around these docs.',
        icon: 'home',
      },
      {
        title: 'Quickstart',
        href: '/quickstart',
        description: 'Make your first run with curl and get a finished artifact back.',
        icon: 'rocket',
        opener: 'handoff',
        since: '2026-09-12',
      },
      {
        title: 'How Esy works',
        href: '/how-esy-works',
        description: 'The whole system on one page: workspace, workflow, run, artifact.',
        icon: 'compass',
        opener: 'template',
        since: '2026-09-12',
      },
      {
        title: 'Authentication',
        href: '/authentication',
        description: 'API keys, bearer tokens, and how a key is scoped to a workspace.',
        icon: 'key',
        opener: 'keys',
        since: '2026-09-12',
      },
      {
        title: 'Errors',
        href: '/errors',
        description: 'Every error the API returns, what causes it, and how to fix it.',
        icon: 'alert',
        opener: 'errors',
        since: '2026-09-12',
      },
      {
        title: 'Glossary',
        href: '/glossary',
        description: 'Every term in one place, each defined in a sentence.',
        icon: 'book',
        since: '2026-09-12',
      },
    ],
  },
  {
    title: 'Core concepts',
    items: [
      {
        title: 'Workflows',
        href: '/concepts/workflows',
        description: 'The versioned template a run executes — intake, steps, providers, gates.',
        icon: 'workflow',
        opener: 'template',
      },
      {
        title: 'Intake',
        href: '/concepts/intake',
        description: 'The inputs a workflow accepts, and why intake asks for outcomes, not mechanisms.',
        icon: 'file-text',
        opener: 'handoff',
        since: '2026-09-12',
      },
      {
        title: 'Runs and steps',
        href: '/concepts/runs',
        description: 'One execution of a workflow: the status lifecycle, step telemetry, and costs.',
        icon: 'play',
        opener: 'pipeline',
      },
      {
        title: 'Gates and review',
        href: '/concepts/gates-and-review',
        description: 'How work is judged: quality gates, the review queue, and typed holds.',
        icon: 'shield',
        opener: 'review',
        since: '2026-09-12',
      },
      {
        title: 'Artifacts',
        href: '/concepts/artifacts',
        description: 'The output of a run — files, QA record, cost ledger, and provenance.',
        icon: 'image',
        opener: 'artifact',
      },
      {
        title: 'Versioning',
        href: '/concepts/versioning',
        description: 'Immutable versions, a movable live pointer, and the frozen spec a run pins.',
        icon: 'history',
        opener: 'versions',
      },
      {
        title: 'Costs and budgets',
        href: '/concepts/costs',
        description: 'What a run costs, the three cost states, and how budgets refuse work.',
        icon: 'wallet',
        opener: 'meter',
      },
      {
        title: 'Source policies',
        href: '/concepts/source-policies',
        description: 'Which approved sources a subject may be researched from, and where each one stops.',
        icon: 'book',
      },
      {
        title: 'Sub-workflows',
        href: '/concepts/sub-workflows',
        description: 'A step that runs another workflow, with linked artifacts and rolled-up cost.',
        icon: 'layers',
        opener: 'subflow',
      },
      {
        title: 'Generation Orders',
        href: '/concepts/orders',
        description: 'One template fanned into N child runs with variation and a budget cap.',
        icon: 'layers',
        opener: 'fanout',
      },
      {
        title: 'The Library',
        href: '/concepts/library',
        description:
          'Standards, directions and axes: where creative intent is authored once, versioned, and pointed at. Editing publishes; promoting changes what runs.',
        icon: 'book',
        since: '2026-09-11',
      },
      {
        title: 'Experiments & benchmarks',
        href: '/concepts/experiments',
        description:
          'How Esy decides with measurement: a frozen design, arms, a versioned case set, trials that are ordinary runs, scores in their own table, and a report you can hand to someone.',
        icon: 'compass',
        since: '2026-09-11',
      },
    ],
  },
  {
    title: 'API reference',
    items: [
      {
        title: 'Conventions',
        href: '/api',
        description: 'Base URL, versioning, camelCase, ids, pagination, and idempotency.',
        icon: 'plug',
      },
      {
        title: 'Runs',
        href: '/api/runs',
        description: 'Create, read, cancel, and finalize runs.',
        icon: 'play',
        since: '2026-09-12',
      },
      {
        title: 'Artifacts',
        href: '/api/artifacts',
        description: 'List and read artifacts, their families, and their comments.',
        icon: 'image',
        since: '2026-09-12',
      },
      {
        title: 'Workflows and catalog',
        href: '/api/workflows',
        description: 'Browse published templates, read a contract, estimate and dry-run.',
        icon: 'workflow',
        since: '2026-09-12',
      },
      {
        title: 'Orders',
        href: '/api/orders',
        description: 'Plan a batch, start it, retry failures, and accept a short settle.',
        icon: 'layers',
        since: '2026-09-12',
      },
      {
        title: 'Review queue',
        href: '/api/review-queue',
        description: 'Read what is waiting on a human and post a decision.',
        icon: 'shield',
        since: '2026-09-12',
      },
      {
        title: 'Costs and budgets',
        href: '/api/costs',
        description: 'Query spend, manage budgets, and read refusals.',
        icon: 'wallet',
        since: '2026-09-12',
      },
      {
        title: 'Run events (SSE)',
        href: '/api/run-events',
        description: 'Live run updates over Server-Sent Events — snapshot, events, reconnect ladder.',
        icon: 'radio',
      },
      {
        title: 'Webhooks',
        href: '/api/webhooks',
        description: 'Verify a signed delivery from an outlet or publication.',
        icon: 'plug',
        since: '2026-09-12',
      },
      {
        title: 'API keys',
        href: '/api/api-keys',
        description: 'Create, scope, and revoke machine credentials.',
        icon: 'key',
      },
    ],
  },
  {
    title: 'Automation',
    items: [
      {
        title: 'Workers',
        href: '/concepts/workers',
        description: 'Durable principals that run bounded shifts on a schedule and report back.',
        icon: 'users',
        opener: 'shift',
      },
      {
        title: 'Assigned work',
        href: '/concepts/assigned-work',
        description: 'Goals and tasks, assignable to you or a worker — measurable and tracked.',
        icon: 'compass',
      },
      {
        title: 'Workers API',
        href: '/api/workers',
        description: 'Hire and steer workers: run-now, shift records, and schedules.',
        icon: 'users',
      },
      {
        title: 'Planning API',
        href: '/api/planning',
        description: 'Goals, tasks, and Inbox messages — the assignable planning plane.',
        icon: 'compass',
      },
    ],
  },
  {
    title: 'Publishing',
    items: [
      {
        title: 'Outlets',
        href: '/concepts/outlets',
        description: 'The destination channel run-produced artifacts ship to.',
        icon: 'globe',
        opener: 'docks',
      },
      {
        title: 'Publications',
        href: '/concepts/publications',
        description: 'Headless destinations that own published documents and categories.',
        icon: 'globe',
      },
      {
        title: 'Outlets API',
        href: '/api/outlets',
        description: 'Publish and unpublish artifacts, read the consumer feed, receive webhooks.',
        icon: 'globe',
      },
      {
        title: 'Publications API',
        href: '/api/publications',
        description: 'Public reads plus authoring endpoints for publications and categories.',
        icon: 'globe',
      },
      {
        title: 'Beehiiv (newsletters)',
        href: '/integrations/beehiiv',
        description: 'Turn published articles into email-safe drafts you send from Beehiiv.',
        icon: 'plug',
      },
    ],
  },
  {
    title: 'Image quality contracts',
    items: [
      {
        title: 'Text policies',
        href: '/contracts/text-policies',
        description: 'none / exact / freeform — what text is allowed and what the gate verifies.',
      },
      {
        title: 'Element types & render modes',
        href: '/contracts/element-types-and-render-modes',
        description: 'Cutouts vs full-bleed tiles, and why patterns never get background removal.',
      },
      {
        title: 'Quality tiers',
        href: '/contracts/quality-tiers',
        description: 'What each tier is validated for; quality is added after acceptance.',
      },
      {
        title: 'Chunked planning',
        href: '/contracts/chunked-planning',
        description: 'How big-list planning scales: bounded calls, disjoint slices, deterministic merge.',
      },
    ],
  },
  {
    title: 'Guides',
    items: [
      {
        title: 'All guides',
        href: '/guides',
        description: 'Walkthroughs for common Esy workflows.',
        icon: 'compass',
      },
      {
        title: 'Generate clip art',
        href: '/guides/generate-clip-art-asset',
        description: 'Run the clip-art workflow end-to-end.',
        icon: 'image',
      },
      {
        title: 'Compose with artifact inputs',
        href: '/guides/compose-with-artifact-inputs',
        description: 'Let a workflow accept an existing artifact as input — supply one or generate it.',
        icon: 'workflow',
      },
      {
        title: 'Publish packs with a worker team',
        href: '/guides/publish-packs-with-a-worker-team',
        description: 'A crew that plans a themed pack daily, generates it, and publishes to your site.',
        icon: 'users',
      },
      {
        title: 'Connect a consumer site',
        href: '/guides/connect-a-consumer-site',
        description: 'Render a public publication and verify Esy’s revalidation webhooks with HMAC.',
        icon: 'plug',
      },
      {
        title: 'Send articles to Beehiiv',
        href: '/guides/send-articles-to-beehiiv',
        description: 'Connect a publication to Beehiiv and turn any article into a reviewed email draft.',
        icon: 'globe',
      },
    ],
  },
  {
    title: 'Resources',
    items: [
      {
        title: 'Changelog',
        href: '/changelog',
        description: 'API and platform changes over time.',
        icon: 'history',
      },
      {
        title: 'Open the app',
        href: 'https://os.esy.com',
        description: 'Manage projects, runs, and costs in the Esy dashboard.',
        icon: 'app-window',
        external: true,
      },
      {
        title: 'Esy on the web',
        href: 'https://esy.com',
        description: 'The Esy home page.',
        icon: 'globe',
        external: true,
      },
    ],
  },
];

/**
 * "New" badge standard.
 *
 * A nav item shows NEW for exactly ONE WEEK after its `since` date, then the
 * badge auto-expires. The window is strict: an item whose `since` is 7+ days
 * old is no longer new (see `isItemNew`).
 *
 * Rationale: the badge exists to catch a returning reader up on what changed
 * since their last visit — it must mean *genuinely recent*. A week is the right
 * horizon: long enough that a weekly visitor sees each addition at least once,
 * short enough that nothing week-old still claims to be new. (It was 21 days,
 * which left a month-old page badged.)
 *
 * `since` is the date the page went live. Set it when adding an item; never
 * bump it to re-badge an old page — that is what a changelog entry is for.
 */
export const NEW_BADGE_DAYS = 7;

/**
 * Whether an item should show the "New" badge: it has a `since` date in the past
 * and within the freshness window (strictly less than NEW_BADGE_DAYS old). Time-
 * based so badges retire on their own instead of lingering until someone
 * remembers to delete the flag.
 */
export function isItemNew(item: NavItem, now: Date = new Date()): boolean {
  if (!item.since) return false;
  const since = new Date(item.since);
  if (Number.isNaN(since.getTime())) return false;
  const ageMs = now.getTime() - since.getTime();
  return ageMs >= 0 && ageMs < NEW_BADGE_DAYS * 24 * 60 * 60 * 1000;
}

/** Flat list of every nav item across all sections. */
export const allNavItems: NavItem[] = navigation.flatMap((s) => s.items);

/** Look up a nav item by its href (exact match, ignoring trailing slash). */
export function getNavItemByHref(href: string): NavItem | undefined {
  const norm = (h: string) => (h.endsWith('/') && h.length > 1 ? h.slice(0, -1) : h);
  const target = norm(href);
  return allNavItems.find((item) => norm(item.href) === target);
}

/** Internal-only items, used to derive prev/next page navigation. */
export const orderedInternalPages: NavItem[] = allNavItems.filter((item) => !item.external);

/** Get the items immediately before/after a given href in the flat order. */
export function getAdjacentPages(currentHref: string): {
  prev: NavItem | null;
  next: NavItem | null;
} {
  const norm = (h: string) => (h.endsWith('/') && h.length > 1 ? h.slice(0, -1) : h);
  const target = norm(currentHref);
  const i = orderedInternalPages.findIndex((p) => norm(p.href) === target);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? orderedInternalPages[i - 1] : null,
    next: i < orderedInternalPages.length - 1 ? orderedInternalPages[i + 1] : null,
  };
}
