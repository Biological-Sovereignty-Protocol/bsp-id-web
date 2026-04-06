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

          <footer style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>© 2026 Ambrósio Institute</span>
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
