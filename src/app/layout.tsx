import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "BSP Identity | Biological Sovereignty Protocol",
  description: "Create and manage your sovereign biological identity permanently on Arweave.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col transition-colors duration-300"
        style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>

          {/* Header u2014 fixed, 72px tall */}
          <Header />

          {/*
            pt-[72px]: offsets the fixed header for ALL pages.
            Homepage (split layout) compensates on desktop via lg:py-0,
            but mobile stacking still benefits from the offset.
          */}
          <main className="flex-1 w-full pt-16">
            {children}
          </main>

          <footer style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            {/* Main footer columns */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px', fontSize: '13px', color: 'var(--color-text-muted)' }}>

              {/* Brand */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="16" cy="16" r="14" stroke="var(--color-primary)" strokeWidth="2" fill="none" />
                    <path d="M16 6 L16 26 M10 10 Q16 16 10 22 M22 10 Q16 16 22 22" stroke="var(--color-primary)" strokeWidth="1.5" fill="none" />
                  </svg>
                  <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-text)' }}>BSP</span>
                </div>
                <p style={{ lineHeight: 1.5, maxWidth: '220px' }}>Biological Sovereignty Protocol. Your biology, your key, permanent on Arweave.</p>
                <a href="/create" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '4px', padding: '8px 16px', borderRadius: '8px', background: 'var(--color-primary)', color: '#fff', fontWeight: 600, fontSize: '12px', textDecoration: 'none', width: 'fit-content' }}>
                  Create BEO
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>

              {/* Learn */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text)', marginBottom: '4px' }}>Learn</span>
                <a href="https://biologicalsovereigntyprotocol.com/what-is-bsp" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>What is BSP</a>
                <a href="https://biologicalsovereigntyprotocol.com/whitepaper" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Whitepaper</a>
                <a href="https://biologicalsovereigntyprotocol.com/faq" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ</a>
              </div>

              {/* Protocol */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text)', marginBottom: '4px' }}>Protocol</span>
                <a href="https://biologicalsovereigntyprotocol.com/specification" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Specification</a>
                <a href="https://biologicalsovereigntyprotocol.com/beo-schema" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>BEO Schema</a>
                <a href="https://biologicalsovereigntyprotocol.com/exchange" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Exchange</a>
              </div>

              {/* Developers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text)', marginBottom: '4px' }}>Developers</span>
                <a href="https://biologicalsovereigntyprotocol.com/quickstart" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Quickstart</a>
                <a href="https://biologicalsovereigntyprotocol.com/sdk-reference" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>SDK Reference</a>
                <a href="https://biologicalsovereigntyprotocol.com/tutorials" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Tutorials</a>
              </div>

              {/* Community */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text)', marginBottom: '4px' }}>Community</span>
                <a href="https://github.com/Biological-Sovereignty-Protocol" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>GitHub</a>
                <a href="https://biologicalsovereigntyprotocol.com/roadmap" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Roadmap</a>
                <a href="https://biologicalsovereigntyprotocol.com/bips" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>BIPs</a>
              </div>

            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: '1px solid var(--color-border)', maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>&copy; 2026 Ambr&oacute;sio Institute</span>
                <span style={{ color: 'var(--color-border)' }}>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                  Open Standard
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', background: 'rgba(0,118,255,0.08)', color: 'var(--color-primary)', border: '1px solid rgba(0,118,255,0.2)' }}>MIT License</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <a href="https://biologicalsovereigntyprotocol.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Protocol</a>
                <span style={{ color: 'var(--color-border)' }}>·</span>
                <a href="https://id.biologicalsovereigntyprotocol.com" style={{ color: 'inherit', textDecoration: 'none' }}>BSP ID</a>
                <span style={{ color: 'var(--color-border)' }}>·</span>
                <a href="https://github.com/Biological-Sovereignty-Protocol/bsp-id-web" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>GitHub</a>
              </div>
            </div>
          </footer>

        </ThemeProvider>
      </body>
    </html>
  );
}
