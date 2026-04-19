export default function Loading() {
    return (
        <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 rounded-full animate-spin"
                    style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
                />
                <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
            </div>
        </div>
    );
}
