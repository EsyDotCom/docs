'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function collectHeadings(): Heading[] {
  if (typeof document === 'undefined') return [];
  const root = document.querySelector('.docs-page-content');
  if (!root) return [];

  const nodes = Array.from(root.querySelectorAll('h2, h3')) as HTMLHeadingElement[];
  const seen = new Set<string>();

  return nodes
    .map((node) => {
      const level = node.tagName === 'H2' ? 2 : 3;
      const text = node.textContent?.trim() ?? '';
      if (!text) return null;

      let id = node.id;
      if (!id) {
        id = slugify(text);
        if (seen.has(id)) {
          let n = 2;
          while (seen.has(`${id}-${n}`)) n += 1;
          id = `${id}-${n}`;
        }
        node.id = id;
      }
      seen.add(id);
      return { id, text, level: level as 2 | 3 };
    })
    .filter((h): h is Heading => h !== null);
}

export function TableOfContents() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Re-collect on route change. Using requestAnimationFrame ensures the new
  // route's DOM has painted before we query it.
  useEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      if (cancelled) return;
      const found = collectHeadings();
      setHeadings(found);
      setActiveId(found[0]?.id ?? null);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [pathname]);

  // Observe scroll position to highlight the current section.
  useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
        if (visible.length > 0) {
          setActiveId((visible[0].target as HTMLElement).id);
        }
      },
      {
        rootMargin: '-80px 0% -65% 0%',
        threshold: [0, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  const onLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  }, []);

  if (headings.length < 2) return null;

  return (
    <aside
      aria-label="On this page"
      className="docs-toc"
      style={{
        width: 200,
        flexShrink: 0,
        position: 'sticky',
        top: 24,
        alignSelf: 'flex-start',
        maxHeight: 'calc(100vh - 48px)',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-subtle)',
          marginBottom: 12,
        }}
      >
        On this page
      </div>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          borderLeft: '1px solid var(--color-border)',
        }}
      >
        {headings.map((h) => {
          const isActive = h.id === activeId;
          return (
            <li key={h.id} style={{ margin: 0 }}>
              <a
                href={`#${h.id}`}
                onClick={(e) => onLinkClick(e, h.id)}
                style={{
                  display: 'block',
                  padding: '5px 0 5px 12px',
                  marginLeft: -1,
                  borderLeft: `2px solid ${isActive ? 'var(--color-accent)' : 'transparent'}`,
                  fontSize: 12.5,
                  lineHeight: 1.45,
                  color: isActive ? 'var(--color-text)' : 'var(--color-text-subtle)',
                  fontWeight: isActive ? 500 : 400,
                  paddingLeft: h.level === 3 ? 24 : 12,
                  textDecoration: 'none',
                  transition: 'color 0.15s ease, border-color 0.15s ease',
                }}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default TableOfContents;
