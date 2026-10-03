import headingIndex from '@/data/docs-search-index.json';
import { navigation, type NavItem } from '@/lib/docs-navigation';

/**
 * Docs search, shared by the sidebar's search modal and the homepage
 * prototypes, so every search box on the site finds the same things.
 *
 * `headings` comes from src/data/docs-search-index.json, generated in prebuild
 * from every page's section headings. `match` is set when the query hit a
 * heading rather than the page title, so a result can say which section.
 */
export type Indexed = NavItem & { section: string; headings: string[]; match?: string };

const HEADINGS = headingIndex as Record<string, string[]>;

/** Every nav item with its section name and section headings. */
export function buildIndex(): Indexed[] {
  return navigation.flatMap((section) =>
    section.items.map((item) => ({
      ...item,
      section: section.title,
      headings: HEADINGS[item.href] ?? [],
    })),
  );
}

/** Page-level hits first, then pages that only matched on a section heading. */
export function searchDocs(index: Indexed[], query: string): Indexed[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const pageHits: Indexed[] = [];
  const headingHits: Indexed[] = [];
  for (const item of index) {
    const pageMatch =
      item.title.toLowerCase().includes(q) ||
      (item.description ?? '').toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q) ||
      item.href.toLowerCase().includes(q);
    if (pageMatch) {
      pageHits.push(item);
      continue;
    }
    const heading = item.headings.find((h) => h.toLowerCase().includes(q));
    if (heading) headingHits.push({ ...item, match: heading });
  }
  return [...pageHits, ...headingHits];
}
