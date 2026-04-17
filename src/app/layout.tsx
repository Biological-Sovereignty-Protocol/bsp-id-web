import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "BSP Identity | Biological Sovereignty Protocol",
  description: "Create and manage your sovereign biological identity on Aptos.",
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

          <Header />
          <main className="flex-1 w-full pt-[64px]">
            {children}
          </main>

          <Footer />

        </ThemeProvider>
      </body>
    </html>
  );
}
