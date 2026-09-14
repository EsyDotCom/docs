'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { getAdjacentPages } from '@/lib/docs-navigation';

export function PrevNext() {
  const pathname = usePathname() ?? '/';
  const { prev, next } = getAdjacentPages(pathname);

  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Pagination"
      style={{
        marginTop: 48,
        paddingTop: 24,
        borderTop: '1px solid var(--color-border)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
      }}
    >
      {prev ? (
        <PrevNextCard direction="prev" title={prev.title} href={prev.href} />
      ) : (
        <span />
      )}
      {next ? (
        <PrevNextCard direction="next" title={next.title} href={next.href} />
      ) : (
        <span />
      )}
    </nav>
  );
}

function PrevNextCard({
  direction,
  title,
  href,
}: {
  direction: 'prev' | 'next';
  title: string;
  href: string;
}) {
  const isNext = direction === 'next';
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isNext ? 'flex-end' : 'flex-start',
        gap: 12,
        padding: '14px 16px',
        background: 'var(--color-bg-alt)',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        textDecoration: 'none',
        transition: 'border-color 0.15s ease, background-color 0.15s ease, transform 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-accent-border)';
        e.currentTarget.style.background = 'var(--color-bg-elevated)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.background = 'var(--color-bg-alt)';
      }}
    >
      {!isNext && <ArrowLeft size={14} style={{ color: 'var(--color-text-subtle)' }} />}
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: isNext ? 'right' : 'left' }}>
        <span
          style={{
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-subtle)',
            fontWeight: 700,
          }}
        >
          {isNext ? 'Next' : 'Previous'}
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{title}</span>
      </span>
      {isNext && <ArrowRight size={14} style={{ color: 'var(--color-text-subtle)' }} />}
    </Link>
  );
}

export default PrevNext;
