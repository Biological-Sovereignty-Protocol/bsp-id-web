'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Application error:', error)
    }, [error])

    return (
        <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center"
            style={{ background: 'var(--color-bg)' }}>
            <div className="max-w-2xl mx-auto px-6 text-center">
                <div className="mb-8">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4"
                        style={{ color: 'var(--color-text)' }}>
                        Something Went Wrong
                    </h1>
                    <p className="text-lg mb-8" style={{ color: 'var(--color-text-muted)' }}>
                        An unexpected error occurred. This has been logged for investigation.
                    </p>
                    {error.digest && (
                        <p className="text-sm font-mono mb-8 p-4 rounded"
                            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)' }}>
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="inline-block px-6 py-3 rounded-lg font-semibold transition-colors"
                        style={{ background: 'var(--color-primary)', color: '#fff' }}
                    >
                        Try Again
                    </button>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 rounded-lg font-semibold transition-colors border"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    >
                        Go Home
                    </a>
                </div>

                <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        If this persists, please{' '}
                        <a
                            href="https://github.com/Biological-Sovereignty-Protocol/issues"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            report the issue
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
