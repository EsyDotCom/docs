import Link from 'next/link';

function BrandMark({ withSuffix = true }: { withSuffix?: boolean }) {
  return (
    <span className="brand" aria-label="Esy">
      <span className="brandMark" aria-hidden="true">
        <span>e</span>sy
      </span>
      {withSuffix && <span className="brandSuffix" aria-hidden="true">Docs</span>}
    </span>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M4 2.5h5.5V8M9.5 2.5L4 8m-1.5-5v6.5h6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
    <div className="shell">
      <div className="atmosphere" aria-hidden="true" />

      <header className="topbar">
        <Link href="/" aria-label="Esy docs home" style={{ display: 'inline-flex' }}>
          <BrandMark />
        </Link>
        <nav className="topnav" aria-label="Primary documentation navigation">
          <Link href="/concepts/workflows">Concepts</Link>
          <Link href="/api">API</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/changelog">Changelog</Link>
          <span className="topnavExternal">
            <a href="https://app.esy.com" rel="noopener noreferrer" aria-label="Open the Esy app">
              App <ExternalIcon />
            </a>
          </span>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="footer footer--light">
        <div className="footer-content">
          <div className="footer-brand">
            <Link href="/" aria-label="Esy docs home" className="footer-logo">
              <BrandMark />
            </Link>
            <p className="footer-desc">
              Agentic workflow templates that automate research, verify citations, and deliver publishable artifacts.
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
    </div>
  );
}
