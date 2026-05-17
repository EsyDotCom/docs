'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppWindow,
  ArrowUpRight,
  Book,
  ChevronDown,
  ChevronRight,
  Compass,
  Cpu,
  FileText,
  Globe,
  History,
  Home,
  Image as ImageIcon,
  Layers,
  Menu,
  Palette,
  Play,
  Plug,
  Rocket,
  Search,
  Users,
  Wallet,
  Workflow,
  X,
} from 'lucide-react';

import { navigation, type NavIcon, type NavItem, type NavSection } from '@/lib/navigation';

const iconMap: Record<NavIcon, React.ReactNode> = {
  home: <Home size={14} />,
  rocket: <Rocket size={14} />,
  layers: <Layers size={14} />,
  workflow: <Workflow size={14} />,
  play: <Play size={14} />,
  image: <ImageIcon size={14} />,
  wallet: <Wallet size={14} />,
  book: <Book size={14} />,
  history: <History size={14} />,
  compass: <Compass size={14} />,
  cpu: <Cpu size={14} />,
  users: <Users size={14} />,
  'file-text': <FileText size={14} />,
  palette: <Palette size={14} />,
  'app-window': <AppWindow size={14} />,
  globe: <Globe size={14} />,
  plug: <Plug size={14} />,
};

function normalizePath(p: string | null): string {
  if (!p) return '/';
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
}

function BrandMark() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
      }}
      aria-label="Esy docs"
    >
      <span
        aria-hidden="true"
        style={{
          fontFamily: 'var(--font-black-ops-one), Impact, sans-serif',
          fontSize: '1.35rem',
          letterSpacing: '0.03em',
          lineHeight: 1,
          color: 'var(--color-text)',
          userSelect: 'none',
        }}
      >
        <span style={{ color: 'var(--color-accent)' }}>e</span>sy
      </span>
      <span
        aria-hidden="true"
        style={{
          padding: '4px 8px',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-control)',
          background: 'var(--color-bg-elevated)',
          color: 'var(--color-text-muted)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
      >
        Docs
      </span>
    </span>
  );
}

function NavItemRow({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const [hovered, setHovered] = useState(false);

  const inner = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '6px 10px',
        marginLeft: 8,
        borderRadius: 8,
        border: `1px solid ${isActive ? 'var(--color-accent-border)' : 'transparent'}`,
        background: isActive
          ? 'var(--color-accent-muted)'
          : hovered
            ? 'var(--color-bg-elevated)'
            : 'transparent',
        transition: 'all 0.15s ease',
        position: 'relative',
      }}
    >
      {isActive && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: -8,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 2,
            height: 20,
            background: 'var(--color-accent)',
            borderRadius: '0 2px 2px 0',
          }}
        />
      )}

      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isActive ? 'var(--color-accent-muted)' : 'var(--color-bg-alt)',
          color: isActive ? 'var(--color-accent)' : 'var(--color-text-subtle)',
          flexShrink: 0,
          transition: 'all 0.15s ease',
        }}
      >
        {item.icon ? iconMap[item.icon] : null}
      </span>

      <span
        style={{
          fontSize: 13,
          fontWeight: isActive ? 600 : 500,
          color: isActive
            ? 'var(--color-text)'
            : hovered
              ? 'var(--color-text-muted)'
              : 'var(--color-text-subtle)',
          letterSpacing: '-0.01em',
          flex: 1,
          transition: 'color 0.15s ease',
        }}
      >
        {item.title}
      </span>

      {item.external && (
        <ArrowUpRight
          size={12}
          style={{
            color: 'var(--color-text-faint)',
            flexShrink: 0,
          }}
        />
      )}

      {item.isNew && (
        <span
          style={{
            padding: '2px 5px',
            background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)',
            color: '#FFFFFF',
            borderRadius: 4,
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}
        >
          New
        </span>
      )}
    </div>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={item.title}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={isActive ? 'page' : undefined}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      {inner}
    </Link>
  );
}

function NavSectionBlock({ section, currentPath }: { section: NavSection; currentPath: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ marginBottom: 18 }}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          width: '100%',
          padding: '6px 12px',
          background: 'transparent',
          border: 'none',
          color: hovered ? 'var(--color-text-muted)' : 'var(--color-text-subtle)',
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          cursor: 'pointer',
          transition: 'color 0.15s ease',
          fontFamily: 'inherit',
        }}
      >
        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {section.title}
      </button>

      {isOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            marginTop: 4,
          }}
        >
          {section.items.map((item) => (
            <NavItemRow
              key={item.href}
              item={item}
              isActive={!item.external && normalizePath(item.href) === currentPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const pathname = usePathname();
  const currentPath = normalizePath(pathname);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Close the mobile sidebar when the route changes. Navigation has no
    // direct user-event hook, so a sync effect is the right primitive here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="docs-mobile-toggle"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <div
        onClick={() => setIsMobileOpen(false)}
        className={`docs-mobile-overlay${isMobileOpen ? ' is-open' : ''}`}
        aria-hidden="true"
      />

      <aside className={`docs-sidebar${isMobileOpen ? ' is-open' : ''}`} aria-label="Documentation navigation">
        {/* Brand block */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 18px',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <Link href="/" aria-label="Esy docs home" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            <BrandMark />
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close navigation"
            style={{
              padding: 8,
              borderRadius: 6,
              background: 'var(--color-bg-elevated)',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              display: isMobileOpen ? 'inline-flex' : 'none',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Search trigger */}
        <div
          style={{
            padding: '12px 14px',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search docs"
            style={{
              width: '100%',
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 12px 8px 36px',
              background: 'var(--color-bg-alt)',
              border: '1px solid var(--color-border)',
              borderRadius: 6,
              fontSize: 13,
              fontFamily: 'inherit',
              color: 'var(--color-text-subtle)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-hover)';
              e.currentTarget.style.background = 'var(--color-bg-elevated)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.background = 'var(--color-bg-alt)';
            }}
          >
            <Search
              size={13}
              style={{
                position: 'absolute',
                left: 12,
                color: 'var(--color-text-subtle)',
              }}
            />
            <span style={{ flex: 1 }}>Search…</span>
            <kbd
              style={{
                padding: '2px 6px',
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: 4,
                fontSize: 10,
                color: 'var(--color-text-subtle)',
                fontFamily: 'inherit',
                lineHeight: 1,
              }}
            >
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Sections */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px 6px',
          }}
        >
          {navigation.map((section) => (
            <NavSectionBlock key={section.title} section={section} currentPath={currentPath} />
          ))}
        </nav>

        {/* CTA */}
        <div
          style={{
            padding: 14,
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <a
            href="https://app.esy.com/signup"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              width: '100%',
              padding: '10px 14px',
              background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)',
              color: '#FFFFFF',
              borderRadius: 8,
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '-0.005em',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-cta)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 18px var(--color-accent-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-cta)';
            }}
          >
            Try Esy free →
          </a>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
