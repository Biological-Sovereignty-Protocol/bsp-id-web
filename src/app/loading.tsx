export default function Loading() {
    return (
        <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center"
            style={{ background: 'var(--color-bg)' }}>
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mb-4"
                    style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}>
                </div>
                <p className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                    Loading...
                </p>
                <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
                    Connecting to Aptos network
                </p>
            </div>
        </div>
    );
}
