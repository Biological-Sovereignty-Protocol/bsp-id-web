import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "BSP Identity | Biological Sovereignty Protocol",
  description: "Crie e gerencie sua identidade biológica de forma soberana e permanente no Arweave.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen flex flex-col items-center justify-between p-6">
        <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center">
          {children}
        </main>

        <footer className="w-full text-center py-6 text-[var(--color-text-muted)] text-sm space-y-2 mt-12 border-t border-[var(--color-surface)]">
          <p>Registro permanente e gratuito — infraestrutura absorvida pelo Instituto Ambrósio</p>
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
      </body>
    </html>
  );
}
