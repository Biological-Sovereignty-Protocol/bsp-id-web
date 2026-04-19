import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Use | BSP Identity",
    description: "Terms of Use for the Biological Sovereignty Protocol Identity service.",
};

export default function TermsPage() {
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
                        Terms of Use
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
                        <h2 className="text-2xl font-bold mb-4">Acceptance</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            By accessing the BSP Identity service, you agree to these terms. If you do not agree, do not use the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Open Standard</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            The Biological Sovereignty Protocol specification is published under the <strong>Apache 2.0 License</strong>. You are
                            free to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-3" style={{ color: 'var(--color-text-muted)' }}>
                            <li>Read, implement, and build upon the specification.</li>
                            <li>Create software, products, or services that implement BSP.</li>
                            <li>Fork, modify, and redistribute the specification with attribution.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Service Content</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            The documentation and interface on this service is provided for informational and operational purposes. The Ambrósio
                            Institute makes no warranties about the accuracy or completeness of the content and may update it at any time without
                            notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">No Warranty</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            The BSP specification and all associated software are provided <strong>&quot;as is&quot;</strong>, without warranty of
                            any kind. The Ambrósio Institute is not liable for any damages arising from the use of this specification or software.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
                        <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--color-text-muted)' }}>
                            <li>The BSP specification is open source (Apache 2.0 License).</li>
                            <li>The BSP name, logo, and branding are trademarks of the Ambrósio Institute.</li>
                            <li>
                                Third-party implementations may not use the BSP trademark to imply official endorsement without written permission.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Data Sovereignty and Cryptographic Erasure</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            BSP is built on the principle that the individual holds absolute sovereignty over their biological data.
                        </p>
                        <p className="mt-3" style={{ color: 'var(--color-text-muted)' }}>
                            <strong>Immutability and erasure:</strong> BioRecords stored on Aptos are immutable to ensure data integrity. This
                            immutability protects the individual — no institution can alter biological records without consent. The individual
                            retains the right to render all their data permanently inaccessible through <strong>Sovereign Cryptographic
                            Erasure</strong> — destroying their Ed25519 private key makes all associated data unreadable and functionally erased.
                        </p>
                        <p className="mt-3" style={{ color: 'var(--color-text-muted)' }}>
                            <strong>No data hostage:</strong> The Ambrósio Institute cannot access, recover, or reconstruct any BEO holder&apos;s
                            data without their private key. If a user destroys their key, the data is irrecoverable by any party, including the
                            Institute.
                        </p>
                        <p className="mt-3" style={{ color: 'var(--color-text-muted)' }}>
                            <strong>Compliance:</strong> This cryptographic erasure mechanism satisfies the requirements of GDPR Article 17
                            (Right to Erasure) and LGPD Article 18 (Right to Deletion). Rendering data permanently inaccessible and unusable is
                            functionally equivalent to deletion under both frameworks.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            These terms are governed by the laws of Brazil.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Contact</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
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
