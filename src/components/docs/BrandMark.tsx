/**
 * The "esy DOCS" wordmark. One component, used by both the sidebar and the
 * page chrome — it was previously duplicated verbatim in each and had already
 * started to drift (one copy set userSelect, the other did not).
 */
export function BrandMark() {
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
