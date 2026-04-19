import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | BSP Identity",
    description: "Privacy Policy for the Biological Sovereignty Protocol Identity service.",
};

export default function PrivacyPage() {
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
                        Privacy Policy
                    </h1>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm"
                        style={{ color: 'var(--color-text-muted)' }}>
                        <span><strong>Last updated:</strong> March 2026</span>
                        <span><strong>Published by:</strong> Ambrósio Institute</span>
                    </div>
                </header>

                <div className="space-y-10 text-base leading-relaxed"
                    style={{ color: 'var(--color-text)' }}>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Overview</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            The Biological Sovereignty Protocol (BSP) is an open standard. This Privacy Policy applies to the BSP Identity service
                            and its documentation.
                        </p>
                        <p className="mt-3" style={{ color: 'var(--color-text-muted)' }}>
                            BSP does not operate a centralized data platform. Biological data submitted through the protocol is stored directly on
                            the Aptos network — not on servers controlled by the Ambrósio Institute.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            <strong>Usage analytics:</strong> We may collect anonymized usage data (page views, geographic region, browser type) to
                            improve the service. No personally identifiable information is collected.
                        </p>
                        <p className="mt-3" style={{ color: 'var(--color-text-muted)' }}>
                            <strong>Contact:</strong> If you contact us via GitHub Issues or email, we retain that correspondence to respond and
                            improve the protocol.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">What We Do Not Do</h2>
                        <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--color-text-muted)' }}>
                            <li>We do not sell, share, or monetize any user data.</li>
                            <li>We do not track individuals across websites.</li>
                            <li>We do not collect health or biological data through this interface.</li>
                            <li>We do not store your private key on our servers.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Aptos and On-Chain Data</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            Data stored on the Aptos network via BSP smart contracts is persistent by design to ensure long-term data integrity. All
                            BioRecords are encrypted with the BEO holder&apos;s Ed25519 public key. Only the holder&apos;s private key can decrypt
                            the data. The existence of transactions on-chain is publicly visible, but the content is cryptographically unreadable
                            without the holder&apos;s key.
                        </p>
                        <p className="mt-3" style={{ color: 'var(--color-text-muted)' }}>
                            Before submitting any data through a BSP-compatible application, ensure you understand how the Aptos network operates
                            and how BSP&apos;s cryptographic controls protect your data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Right to Erasure (Cryptographic Erasure)</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            BSP implements <strong>Sovereign Cryptographic Erasure</strong> to comply with GDPR Article 17 (Right to Erasure) and
                            LGPD Article 18 (Right to Deletion).
                        </p>
                        <h3 className="text-lg font-semibold mt-6 mb-3">How it works</h3>
                        <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--color-text-muted)' }}>
                            <li>All BioRecords are encrypted with the holder&apos;s public key before being stored on Aptos.</li>
                            <li>If the holder destroys their private key, all associated data becomes permanently inaccessible and functionally erased.</li>
                            <li>No institution, platform, or the Ambrósio Institute can recover the data without the key.</li>
                            <li>This provides a stronger guarantee than traditional deletion, where copies may persist in backups or third-party systems.</li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-6 mb-3">Your rights as a data subject</h3>
                        <ol className="list-decimal pl-6 space-y-2" style={{ color: 'var(--color-text-muted)' }}>
                            <li><strong>Key Destruction</strong> — permanently destroy your private key, making all your data irrecoverable.</li>
                            <li><strong>Key Rotation</strong> — generate a new key pair, re-encrypt your data, invalidate the old key.</li>
                            <li><strong>Consent Revocation</strong> — revoke all access tokens immediately.</li>
                            <li><strong>Selective Erasure</strong> — revoke specific consent tokens granted to specific institutions.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Data Retention and Immutability</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            BioRecords on Aptos are immutable to preserve data integrity and create a trustworthy audit trail. This immutability
                            protects you — it means no institution can silently alter your biological records.
                        </p>
                        <p className="mt-3" style={{ color: 'var(--color-text-muted)' }}>
                            However, immutability does not mean you lose control. Through cryptographic erasure, you can make your data permanently
                            unreadable at any time. The encrypted data may persist on the network, but without your key it is indistinguishable
                            from random noise and cannot be associated with or used to identify you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Key Holder Controls</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            As a BEO holder, you have full sovereignty over your biological data:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-3" style={{ color: 'var(--color-text-muted)' }}>
                            <li><strong>View</strong> all institutions that have been granted access to your data.</li>
                            <li><strong>Revoke</strong> any consent token at any time, immediately cutting off access.</li>
                            <li><strong>Export</strong> your data in BSP-standard format.</li>
                            <li><strong>Erase</strong> your data by destroying your private key (irreversible).</li>
                            <li><strong>Rotate</strong> your key pair to re-secure your data with new cryptographic credentials.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Contact</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            Questions about this policy:{' '}
                            <a
                                href="https://github.com/Biological-Sovereignty-Protocol"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'var(--color-primary)' }}
                                className="underline hover:opacity-80"
                            >
                                github.com/Biological-Sovereignty-Protocol
                            </a>
                        </p>
                    </section>
                </div>
            </article>
        </div>
    );
}
