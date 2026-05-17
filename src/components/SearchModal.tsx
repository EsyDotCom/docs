'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, Search } from 'lucide-react';

import { allNavItems, navigation, type NavItem } from '@/lib/navigation';

type Indexed = NavItem & { section: string };

function buildIndex(): Indexed[] {
  return navigation.flatMap((section) =>
    section.items.map((item) => ({ ...item, section: section.title })),
  );
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);

  const index = useMemo(() => buildIndex(), []);

  const popular = useMemo(
    () => index.filter((item) => !item.external).slice(0, 5),
    [index],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        (item.description ?? '').toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q) ||
        item.href.toLowerCase().includes(q)
      );
    });
  }, [query, index]);

  const display = query ? results : popular;

  useEffect(() => {
    if (!isOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, Math.max(0, display.length - 1)));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => Math.max(0, s - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = display[selected];
        if (!item) return;
        if (item.external) {
          window.open(item.href, '_blank', 'noopener,noreferrer');
        } else {
          router.push(item.href);
        }
        onClose();
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, display, selected, router]);

  /* eslint-disable react-hooks/set-state-in-effect -- Modal reset on
     close and selected-index reset on query change are intentional
     state syncs with no clean derived-state alternative. */
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelected(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelected(0);
  }, [query]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(6, 21, 39, 0.6)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 1000,
          animation: 'docsSearchFadeIn 0.18s ease',
        }}
      />

      <div
        role="dialog"
        aria-label="Search documentation"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: '12%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: 580,
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1001,
          overflow: 'hidden',
          animation: 'docsSearchSlideDown 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <Search size={18} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search docs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 15,
              color: 'var(--color-text)',
              fontFamily: 'inherit',
              letterSpacing: '-0.01em',
            }}
          />
          <kbd
            style={{
              padding: '3px 6px',
              background: 'var(--color-bg-alt)',
              border: '1px solid var(--color-border)',
              borderRadius: 4,
              fontSize: 11,
              color: 'var(--color-text-subtle)',
              fontFamily: 'inherit',
              lineHeight: 1,
            }}
          >
            esc
          </kbd>
        </div>

        <div style={{ maxHeight: 360, overflowY: 'auto' }}>
          {query && results.length === 0 ? (
            <div
              style={{
                padding: '40px 24px',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
              }}
            >
              <Search
                size={36}
                style={{
                  margin: '0 auto 10px',
                  color: 'var(--color-text-subtle)',
                  opacity: 0.6,
                  display: 'block',
                }}
              />
              <div style={{ fontSize: 14, marginBottom: 4 }}>
                No results for &ldquo;{query}&rdquo;
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
                Try a different term — workflow, run, artifact, cost…
              </div>
            </div>
          ) : (
            <>
              {!query && (
                <div
                  style={{
                    padding: '12px 18px 6px',
                    fontSize: 11,
                    color: 'var(--color-text-subtle)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                  }}
                >
                  Popular
                </div>
              )}
              <div style={{ padding: '4px 8px 8px' }}>
                {display.map((item, i) => (
                  <SearchRow
                    key={item.href}
                    item={item}
                    isSelected={i === selected}
                    onClick={onClose}
                    onMouseEnter={() => setSelected(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            borderTop: '1px solid var(--color-border)',
            fontSize: 11,
            color: 'var(--color-text-subtle)',
            background: 'var(--color-bg-alt)',
          }}
        >
          <div style={{ display: 'flex', gap: 14 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <KbdMini>↑↓</KbdMini>
              navigate
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <KbdMini>↵</KbdMini>
              select
            </span>
          </div>
          <span style={{ color: 'var(--color-text-faint)' }}>{allNavItems.length} pages</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes docsSearchFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes docsSearchSlideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -8px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </>
  );
}

function SearchRow({
  item,
  isSelected,
  onClick,
  onMouseEnter,
}: {
  item: Indexed;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}) {
  const router = useRouter();

  function activate() {
    if (item.external) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(item.href);
    }
    onClick();
  }

  return (
    <button
      type="button"
      onClick={activate}
      onMouseEnter={onMouseEnter}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        borderRadius: 8,
        background: isSelected ? 'var(--color-bg-alt)' : 'transparent',
        border: `1px solid ${isSelected ? 'var(--color-border)' : 'transparent'}`,
        marginBottom: 2,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 0.12s ease, border-color 0.12s ease',
        fontFamily: 'inherit',
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: 'var(--color-accent-muted)',
          color: 'var(--color-accent)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <BookOpen size={14} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: 'block',
            fontSize: 13.5,
            fontWeight: 500,
            color: 'var(--color-text)',
            letterSpacing: '-0.01em',
          }}
        >
          {item.title}
        </span>
        <span
          style={{
            display: 'block',
            fontSize: 12,
            color: 'var(--color-text-subtle)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginTop: 1,
          }}
        >
          {item.section}
          {item.description ? ` · ${item.description}` : ''}
        </span>
      </span>
      <ArrowRight
        size={14}
        style={{
          color: 'var(--color-text-subtle)',
          flexShrink: 0,
          opacity: isSelected ? 1 : 0,
          transition: 'opacity 0.12s ease',
        }}
      />
    </button>
  );
}

function KbdMini({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      style={{
        padding: '2px 5px',
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 3,
        fontSize: 10,
        color: 'var(--color-text-subtle)',
        fontFamily: 'inherit',
        lineHeight: 1,
      }}
    >
      {children}
    </kbd>
  );
}

export default SearchModal;
