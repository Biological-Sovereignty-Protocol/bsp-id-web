import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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

          {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
            <div style={{ background: 'linear-gradient(90deg, #f59e0b, #d97706)', color: '#fff', textAlign: 'center', padding: '6px 16px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>
              DEMO MODE — Data is stored locally only. No blockchain transactions.
            </div>
          )}

          {/*
            pt-[72px]: offsets the fixed header for ALL pages.
            Homepage (split layout) compensates on desktop via lg:py-0,
            but mobile stacking still benefits from the offset.
          */}
          <main className="flex-1 w-full pt-[64px]">
            {children}
          </main>

          <Footer />

        </ThemeProvider>
      </body>
    </html>
  );
}
