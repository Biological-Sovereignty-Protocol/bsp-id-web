import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://id.biologicalsovereigntyprotocol.com";
const SITE_NAME = "BSP Identity";
const SITE_TITLE = "BSP Identity | Biological Sovereignty Protocol";
const SITE_DESCRIPTION = "Create and manage your sovereign biological identity on Aptos. Your biology. Your key. Permanent and cryptographically sovereign.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | BSP Identity",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "BSP",
    "Biological Sovereignty Protocol",
    "BEO",
    "Aptos",
    "sovereign identity",
    "cryptographic erasure",
    "biological data",
    "health data sovereignty",
    "Ed25519",
    "biomarkers",
  ],
  authors: [{ name: "Ambrósio Institute" }],
  creator: "Ambrósio Institute",
  publisher: "Ambrósio Institute",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/bsp-og-image.png",
        width: 1200,
        height: 630,
        alt: "BSP Identity — Biological Sovereignty Protocol",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/bsp-og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0076ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? 'en'} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col transition-colors duration-300"
        style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only fixed top-2 left-2 z-50 bg-white text-black px-4 py-2 rounded shadow"
        >
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>

          <Header />
          <main id="main" className="flex-1 w-full pt-[64px]">
            {children}
          </main>

          <Footer />
          <ServiceWorkerRegister />

        </ThemeProvider>
      </body>
    </html>
  );
}
