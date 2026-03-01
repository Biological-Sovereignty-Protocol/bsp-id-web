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
      <body className="antialiased min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col items-center justify-between transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Header />
          <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center p-6 pt-24">
            {children}
          </main>

          <footer className="w-full max-w-4xl text-center py-6 text-[var(--color-text-muted)] text-sm space-y-2 mt-12 border-t border-[var(--color-surface)]">
            <p>Permanent & Sovereign Identity — Infrastructure by Ambrosio Institute</p>
            <p>
              <a
                href="https://github.com/Biological-Sovereignty-Protocol/bsp-id-web"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                Open source · bsp-id-web
              </a>
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
