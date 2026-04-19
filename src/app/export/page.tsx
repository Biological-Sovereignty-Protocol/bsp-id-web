import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Export Data | BSP Identity",
    description: "Export your biological data in BSP-standard format for portability and compliance.",
};

export default function ExportPage() {
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
                        Export Your Data
                    </h1>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm"
                        style={{ color: 'var(--color-text-muted)' }}>
                        <span><strong>Format:</strong> BSP-standard JSON</span>
                        <span><strong>Rights:</strong> GDPR Art. 20, LGPD Art. 18</span>
                    </div>
                </header>

                <div className="space-y-10 text-base leading-relaxed"
                    style={{ color: 'var(--color-text)' }}>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Data Portability</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            Export your BioRecords in machine-readable, structured format.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-3" style={{ color: 'var(--color-text-muted)' }}>
                            <li>Keep a local backup of your biological data</li>
                            <li>Transfer your data to another BSP-compatible platform</li>
                            <li>Review all records associated with your BEO</li>
                            <li>Fulfill regulatory audit or compliance requests</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Export Your Data</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            Connect your wallet to decrypt and download your BioRecords.
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
                </div>
            </article>
        </div>
    );
}
