"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
            <div className="max-w-md text-center px-6">
                <h1 className="text-6xl font-extrabold mb-4" style={{ color: 'var(--color-danger)' }}>⚠️</h1>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Something went wrong</h2>
                <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
                    An unexpected error occurred. Please try again.
                </p>
                <button
                    onClick={() => reset()}
                    className="px-6 py-3 rounded-lg font-semibold transition-colors"
                    style={{ background: 'var(--color-primary)', color: '#fff' }}
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
