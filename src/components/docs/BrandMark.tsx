/**
 * The product lockup — wordmark · hairline · tag — matching the top of the
 * os.esy.com side rail exactly, because these are the docs for that product.
 * Source of truth: client/app.esy.com src/components/layout/side-rail.tsx.
 *
 * Colours come from theme tokens (accent, text, border-strong, text-subtle),
 * so the lockup follows the docs' light and dark themes the same way the
 * dashboard's follows its own. Used by the sidebar and the footer.
 */
export function BrandMark() {
  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
      aria-label="Esy OS docs"
    >
      <span
        aria-hidden="true"
        style={{
          fontFamily: 'var(--font-black-ops-one), sans-serif',
          fontSize: '1.6rem',
          letterSpacing: '0.03em',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        <span style={{ color: 'var(--color-accent)' }}>e</span>
        <span style={{ color: 'var(--color-text)' }}>sy</span>
      </span>
      <span
        aria-hidden="true"
        style={{ width: 1, height: 16, background: 'var(--color-border-strong)' }}
      />
      <span
        aria-hidden="true"
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          lineHeight: 1,
          color: 'var(--color-text-subtle)',
        }}
      >
        OS
      </span>
    </span>
  );
}
