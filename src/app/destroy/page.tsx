import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Destroy Identity | BSP Identity",
    description: "Permanently destroy your sovereign biological identity through cryptographic erasure.",
};

export default function DestroyPage() {
    return (
        <div className="w-full min-h-[calc(100vh-64px)]" style={{ background: 'var(--color-bg)' }}>
            <article className="max-w-3xl mx-auto px-6 md:px-8 py-16 md:py-20">
                <header className="mb-10 pb-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <p className="text-[11px] font-bold tracking-[0.25em] uppercase mb-3"
                        style={{ color: 'var(--color-primary)' }}>
                        Biological Sovereignty Protocol
                    </p>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1]"
                        style={{ color: 'var(--color-text)' }}>
                        Destroy Identity
                    </h1>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm"
                        style={{ color: 'var(--color-text-muted)' }}>
                        <span className="px-2 py-1 rounded text-xs font-semibold"
                            style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
                            Irreversible Action
                        </span>
                    </div>
                </header>

                <div className="space-y-10 text-base leading-relaxed"
                    style={{ color: 'var(--color-text)' }}>

                    <section className="p-6 rounded-lg border-2"
                        style={{ borderColor: 'var(--color-danger)', background: 'var(--color-danger-bg)' }}>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-danger)' }}>
                            ⚠️ Warning: Permanent Action
                        </h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            Destroying your BSP Identity is <strong>irreversible</strong>. This action will permanently delete your private key,
                            making all encrypted BioRecords on the Aptos network <strong>permanently inaccessible</strong>.
                        </p>
                        <p className="mt-3" style={{ color: 'var(--color-text-muted)' }}>
                            No authority — including the Ambrósio Institute, Aptos Foundation, or any institution — can recover your data
                            after key destruction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">What Happens When You Destroy Your Identity</h2>
                        <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--color-text-muted)' }}>
                            <li>Your private Ed25519 key is permanently deleted from all devices.</li>
                            <li>All BioRecords encrypted with your public key become cryptographically unreadable.</li>
                            <li>All consent tokens granted to institutions are immediately revoked.</li>
                            <li>Your BEO (Biological Existence Object) remains on-chain but cannot be accessed.</li>
                            <li>Guardian recovery options are permanently disabled.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Before You Proceed</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            Consider these alternatives:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-3" style={{ color: 'var(--color-text-muted)' }}>
                            <li><strong>Export your data</strong> — download all BioRecords in BSP-standard format.</li>
                            <li><strong>Revoke consent</strong> — remove institution access without deleting your identity.</li>
                            <li><strong>Rotate your key</strong> — generate a new key pair and re-encrypt your data with fresh credentials.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Sovereign Cryptographic Erasure</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            BSP implements the strongest form of data erasure: <strong>cryptographic destruction</strong>. Unlike traditional
                            deletion (which may leave traces in backups or logs), destroying your key makes your data mathematically inaccessible.
                        </p>
                        <p className="mt-3" style={{ color: 'var(--color-text-muted)' }}>
                            This complies with GDPR Article 17 (Right to Erasure) and LGPD Article 18 (Right to Deletion) — and exceeds them
                            by providing a verifiable, tamper-proof mechanism for permanent data erasure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">How to Proceed</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            To destroy your BSP Identity, connect your wallet and use the Destroy function in the dashboard.
                            You will be asked to confirm multiple times before the action is executed.
                        </p>
                        <div className="mt-6">
                            <a
                                href="/dashboard"
                                className="inline-block px-6 py-3 rounded-lg font-semibold transition-colors"
                                style={{ background: 'var(--color-primary)', color: '#fff' }}
                            >
                                Go to Dashboard
                            </a>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Questions?</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            Read the <a href="/privacy" className="underline" style={{ color: 'var(--color-primary)' }}>Privacy Policy</a> or
                            contact us via{' '}
                            <a
                                href="https://github.com/Biological-Sovereignty-Protocol"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'var(--color-primary)' }}
                                className="underline hover:opacity-80"
                            >
                                GitHub
                            </a>.
                        </p>
                    </section>
                </div>
            </article>
        </div>
    );
}
