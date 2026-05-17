'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

import { navigation } from '@/lib/navigation';

function normalize(p: string): string {
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
}

interface Crumb {
  label: string;
  href?: string;
}

function deriveCrumbs(pathname: string): Crumb[] {
  const norm = normalize(pathname);
  if (norm === '/' || norm === '') {
    return [{ label: 'Overview' }];
  }

  const section = navigation.find((s) =>
    s.items.some((item) => !item.external && normalize(item.href) === norm),
  );
  const item = section?.items.find((i) => normalize(i.href) === norm);

  if (section && item) {
    return [
      { label: 'Docs', href: '/' },
      { label: section.title },
      { label: item.title },
    ];
  }

  // Fall back to deriving from the URL segments when the page isn't
  // registered in navigation.ts (e.g. ad-hoc detail pages).
  const segments = norm.split('/').filter(Boolean);
  return [
    { label: 'Docs', href: '/' },
    ...segments.map((segment, i) => {
      const isLast = i === segments.length - 1;
      const label = segment
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return isLast ? { label } : { label, href: '/' + segments.slice(0, i + 1).join('/') };
    }),
  ];
}

export function Breadcrumbs() {
  const pathname = usePathname() ?? '/';
  const crumbs = deriveCrumbs(pathname);

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
        fontSize: 12,
        color: 'var(--color-text-subtle)',
        marginBottom: 18,
      }}
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        const node = crumb.href ? (
          <Link
            href={crumb.href}
            style={{
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              transition: 'color 0.15s ease',
            }}
          >
            {i === 0 && crumb.href === '/' ? <Home size={11} /> : null}
            {crumb.label}
          </Link>
        ) : (
          <span
            style={{
              color: isLast ? 'var(--color-text)' : 'var(--color-text-subtle)',
              fontWeight: isLast ? 500 : 400,
            }}
            aria-current={isLast ? 'page' : undefined}
          >
            {crumb.label}
          </span>
        );

        return (
          <Fragment key={`${crumb.label}-${i}`}>
            {node}
            {!isLast && (
              <ChevronRight
                size={11}
                style={{ color: 'var(--color-text-faint)' }}
                aria-hidden="true"
              />
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
