import Link from 'next/link';

import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

type FooterLink = {
  href: string;
  text: string;
};

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="footer-column">
      <h4>{title}</h4>
      <div className="footer-links">
        {links.map((link, index) => (
          <a key={`${link.href}-${index}`} href={link.href} className="footer-link">
            {link.text}
          </a>
        ))}
      </div>
    </div>
  );
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

function SubstackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24l9.56-5.39 9.52 5.39V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-shell">
      <div className="docs-shell-inner">
        <Sidebar />

        <main className="docs-main">
          {children}

          <footer className="footer footer--light">
            <div className="footer-content">
              <div className="footer-brand">
                <Link href="/" aria-label="Esy docs home" className="footer-logo">
                  <BrandMark />
                </Link>
                <p className="footer-desc">
                  Agentic workflow templates that automate research, verify citations, and deliver publishable
                  artifacts.
                  <br />
                  <strong>Automate &amp; audit.</strong>
                </p>
                <div className="footer-socials">
                  <a
                    href="https://synthesize.esy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label="Esy on Substack"
                  >
                    <SubstackIcon />
                  </a>
                  <a
                    href="https://www.youtube.com/@EsyDotCom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label="Esy on YouTube"
                  >
                    <YouTubeIcon />
                  </a>
                </div>
              </div>

              <FooterColumn
                title="Explore"
                links={[
                  { href: 'https://esy.com/templates/', text: 'Templates' },
                  { href: 'https://esy.com/agents/', text: 'Agents' },
                  { href: 'https://esy.com/glossary/', text: 'Glossary' },
                ]}
              />

              <FooterColumn
                title="Resources"
                links={[
                  { href: 'https://esy.com/research/', text: 'Research' },
                  { href: 'https://esy.com/courses/', text: 'Courses' },
                  { href: '/api', text: 'API' },
                  { href: '/guides', text: 'Guides' },
                ]}
              />

              <FooterColumn
                title="Company"
                links={[
                  { href: 'https://esy.com/about/', text: 'About' },
                  { href: 'https://esy.com/privacy/', text: 'Privacy' },
                  { href: 'https://esy.com/terms/', text: 'Terms' },
                ]}
              />
            </div>

            <div className="footer-bottom">
              <p>&copy; 2024-2026 ESY, LLC. All rights reserved.</p>
            </div>
          </footer>
        </main>
      </div>

      <ThemeToggle />
    </div>
  );
}
