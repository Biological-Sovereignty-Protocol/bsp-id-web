import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "404 - Page Not Found | BSP Identity",
    description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
    return (
        <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center"
            style={{ background: 'var(--color-bg)' }}>
            <div className="max-w-2xl mx-auto px-6 text-center">
                <div className="mb-8">
                    <h1 className="text-8xl md:text-9xl font-extrabold tracking-tight mb-4"
                        style={{ color: 'var(--color-primary)' }}>
                        404
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4"
                        style={{ color: 'var(--color-text)' }}>
                        Page Not Found
                    </h2>
                    <p className="text-lg mb-8" style={{ color: 'var(--color-text-muted)' }}>
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 rounded-lg font-semibold transition-colors"
                        style={{ background: 'var(--color-primary)', color: '#fff' }}
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-block px-6 py-3 rounded-lg font-semibold transition-colors border"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    >
                        Dashboard
                    </Link>
                </div>

                <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Need help?{' '}
                        <a
                            href="https://github.com/Biological-Sovereignty-Protocol"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            Contact us on GitHub
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
