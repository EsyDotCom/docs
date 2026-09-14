import type { ReactNode } from 'react';

import { Breadcrumbs } from '@/components/docs/Breadcrumbs';
import { PrevNext } from '@/components/docs/PrevNext';
import { TableOfContents } from '@/components/docs/TableOfContents';

/**
 * Reference-page shell. Renders breadcrumbs at top, the page body in the
 * 780px reading column, prev/next pagination at the bottom, and a sticky
 * on-this-page table of contents on the right. Each chrome piece hides
 * itself when there's nothing to show (no adjacent pages, < 2 headings,
 * etc.) so the same shell works for hubs, references, and guides.
 */
export function DocsPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="docs-page">
      <div className="docs-page-content">
        <Breadcrumbs />
        {children}
        <PrevNext />
      </div>
      <TableOfContents />
    </div>
  );
}

export default DocsPageShell;
