/**
 * Sidebar information architecture for docs.esy.com.
 * Sections render top-down in the order listed here. Items support
 * an optional `icon` (from the lucide icon map in Sidebar.tsx),
 * an `isNew` flag, an `external` flag, and a `description` for
 * search / hub rendering.
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
  | 'plug';

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: NavIcon;
  isNew?: boolean;
  external?: boolean;
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
        description: 'What docs.esy.com covers and how the API is structured.',
        icon: 'home',
      },
    ],
  },
  {
    title: 'Concepts',
    items: [
      {
        title: 'Workflow schemas',
        href: '/concepts/workflow-schemas',
        description: 'The platform contract every Workflow Template must satisfy.',
        icon: 'layers',
        isNew: true,
      },
      {
        title: 'Workflow templates',
        href: '/concepts/workflow-templates',
        description: 'Reusable, versioned blueprints that produce a class of artifacts.',
        icon: 'workflow',
      },
      {
        title: 'Workflow specifications',
        href: '/concepts/workflow-specifications',
        description: 'Per-run populated instances of a Template. The deterministic blueprint production reads.',
        icon: 'file-text',
        isNew: true,
      },
      {
        title: 'Runs',
        href: '/concepts/runs',
        description: 'One execution of a workflow template, with cost and step telemetry.',
        icon: 'play',
      },
      {
        title: 'Artifacts',
        href: '/concepts/artifacts',
        description: 'The output of a run — files, metadata, and provenance.',
        icon: 'image',
      },
      {
        title: 'Sub-workflows',
        href: '/concepts/sub-workflows',
        description: 'How a workflow composes another workflow as a child run, with linked artifacts and rolled-up cost.',
        icon: 'workflow',
        isNew: true,
      },
      {
        title: 'Costs',
        href: '/concepts/costs',
        description: 'How cost is tracked across steps, runs, workflows, and projects.',
        icon: 'wallet',
      },
      {
        title: 'Budgets',
        href: '/concepts/budgets',
        description: 'Spend limits at organization, project, or workflow scope, enforced before a run executes.',
        icon: 'wallet',
        isNew: true,
      },
    ],
  },
  {
    title: 'Reference',
    items: [
      {
        title: 'API',
        href: '/api',
        description: 'Endpoints, request shapes, and response schemas.',
        icon: 'plug',
      },
      {
        title: 'Changelog',
        href: '/changelog',
        description: 'API and platform changes over time.',
        icon: 'history',
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
    ],
  },
  {
    title: 'Resources',
    items: [
      {
        title: 'Open the app',
        href: 'https://app.esy.com',
        description: 'Manage projects, runs, and costs in the Esy dashboard.',
        icon: 'app-window',
        external: true,
      },
      {
        title: 'Esy on the web',
        href: 'https://esy.com',
        description: 'Marketing site, essays, templates, and glossary.',
        icon: 'globe',
        external: true,
      },
    ],
  },
];

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
