'use client';

import { usePathname } from 'next/navigation';

/**
 * The docs chrome (sidebar, footer, theme toggle) around every page, except
 * the homepage (Folio, shipped from /prototypes/home) and /prototypes: those
 * bring their own chrome, so they render bare. The pieces arrive already
 * rendered from the server layout; this only decides whether to place them.
 */
export function DocsFrame({
  chrome,
  footer,
  themeToggle,
  children,
}: {
  chrome: React.ReactNode;
  footer: React.ReactNode;
  themeToggle: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === '/' || pathname?.startsWith('/prototypes')) return <>{children}</>;

  return (
    <div className="docs-shell">
      <div className="docs-shell-inner">
        {chrome}
        <main className="docs-main">
          {children}
          {footer}
        </main>
      </div>
      {themeToggle}
    </div>
  );
}
