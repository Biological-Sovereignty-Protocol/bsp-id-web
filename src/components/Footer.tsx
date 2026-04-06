"use client";

import { useTheme } from "next-themes";

export function Footer() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <footer style={{ background: 'var(--color-bg-soft, var(--color-surface))', borderTop: '1px solid var(--color-border)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem 0' }}>

        {/* Main: brand + 4 cols */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr)', gap: '2rem', paddingBottom: '2rem' }}>

          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <img src={isDark ? "/bsp-logo-light.png" : "/bsp-logo-dark.png"} alt="BSP" style={{ height: '44px', width: 'auto', maxWidth: '160px', objectFit: 'contain', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.55, marginBottom: '1.5rem', maxWidth: '200px' }}>Permanent sovereignty over your biology.</p>
            <a href="https://github.com/Biological-Sovereignty-Protocol" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>

          {/* Learn */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text)', marginBottom: '1rem' }}>Learn</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <li><a href="https://biologicalsovereigntyprotocol.com/what-is-bsp" target="_blank" rel="noopener" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>What is BSP?</a></li>
              <li><a href="https://biologicalsovereigntyprotocol.com/whitepaper" target="_blank" rel="noopener" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>Whitepaper</a></li>
              <li><a href="https://biologicalsovereigntyprotocol.com/compare" target="_blank" rel="noopener" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>BSP vs FHIR vs HL7</a></li>
              <li><a href="https://biologicalsovereigntyprotocol.com/glossary" target="_blank" rel="noopener" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>Glossary</a></li>
              <li><a href="https://biologicalsovereigntyprotocol.com/getting-started/faq" target="_blank" rel="noopener" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>FAQ</a></li>
            </ul>
          </div>

          {/* Protocol */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text)', marginBottom: '1rem' }}>Protocol</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <li><a href="https://biologicalsovereigntyprotocol.com/specification/overview" target="_blank" rel="noopener" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>Specification Overview</a></li>
              <li><a href="https://biologicalsovereigntyprotocol.com/specification/beo" target="_blank" rel="noopener" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>BEO Schema</a></li>
              <li><a href="https://biologicalsovereigntyprotocol.com/specification/exchange" target="_blank" rel="noopener" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>Exchange Protocol</a></li>
              <li><a href="https://biologicalsovereigntyprotocol.com/specification/governance" target="_blank" rel="noopener" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>Governance</a></li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text)', marginBottom: '1rem' }}>Developers</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <li><a href="https://biologicalsovereigntyprotocol.com/getting-started/quickstart" target="_blank" rel="noopener" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>Quickstart</a></li>
              <li><a href="https://biologicalsovereigntyprotocol.com/developers/sdk-reference" target="_blank" rel="noopener" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>SDK Reference</a></li>
              <li><a href="https://biologicalsovereigntyprotocol.com/developers/tutorials" target="_blank" rel="noopener" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>Tutorials</a></li>
              <li><a href="https://biologicalsovereigntyprotocol.com/developers/examples" target="_blank" rel="noopener" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>JSON Examples</a></li>
              <li><a href="https://biologicalsovereigntyprotocol.com/integrations" target="_blank" rel="noopener" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>Integrations</a></li>
            </ul>
          </div>

          {/* BSP ID */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text)', marginBottom: '1rem' }}>BSP ID</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <li><a href="/create" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>Create BEO</a></li>
              <li><a href="/dashboard" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>Dashboard</a></li>
              <li><a href="/consent" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>Consent</a></li>
              <li><a href="/recover" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>Recovery</a></li>
              <li><a href="/institution" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}>For Institutions</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--color-border)', padding: '1.25rem 0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>&copy; 2026 Ambr&oacute;sio Institute</span>
            <span style={{ color: 'var(--color-border)', fontSize: '0.9rem' }}>&middot;</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)' }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}><circle cx="12" cy="12" r="10"/></svg>
              Open Standard
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', background: 'rgba(0,118,255,0.08)', color: 'var(--color-primary)', border: '1px solid rgba(0,118,255,0.2)' }}>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
