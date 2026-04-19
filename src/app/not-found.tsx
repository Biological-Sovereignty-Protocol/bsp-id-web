import Link from "next/link";

export default function NotFound() {
    return (
        <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
            <div className="max-w-md text-center px-6">
                <h1 className="text-6xl font-extrabold mb-4" style={{ color: 'var(--color-primary)' }}>404</h1>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Page Not Found</h2>
                <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 rounded-lg font-semibold transition-colors"
                    style={{ background: 'var(--color-primary)', color: '#fff' }}
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
