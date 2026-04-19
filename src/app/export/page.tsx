"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Download, FileJson, FileSpreadsheet, CheckCircle2, ShieldAlert, Database } from "lucide-react";
import { getIdentity } from "@/lib/crypto/storage";
import { apiGet } from "@/lib/api";
import "@/lib/i18n/config";

type Format = "json" | "csv";

const DEMO_BIORECORDS = [
    { id: "rec_01", category: "blood", biomarker: "Vitamin D", value: "32 ng/mL", source: "LabCorp", date: "2026-02-14", txHash: "0xdemo01" },
    { id: "rec_02", category: "blood", biomarker: "HbA1c", value: "5.1%", source: "Quest", date: "2026-01-22", txHash: "0xdemo02" },
    { id: "rec_03", category: "hormone", biomarker: "Testosterone (Total)", value: "645 ng/dL", source: "LabCorp", date: "2026-03-01", txHash: "0xdemo03" },
    { id: "rec_04", category: "metabolic", biomarker: "Fasting Glucose", value: "88 mg/dL", source: "Quest", date: "2026-03-01", txHash: "0xdemo04" },
    { id: "rec_05", category: "inflammation", biomarker: "hs-CRP", value: "0.3 mg/L", source: "LabCorp", date: "2026-02-14", txHash: "0xdemo05" },
];

function downloadFile(content: string, filename: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function toCSV(records: any[]): string {
    if (!records || records.length === 0) return "";
    const headers = Object.keys(records[0]);
    const rows = records.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(","));
    return [headers.join(","), ...rows].join("\n");
}

export default function ExportPage() {
    const { t } = useTranslation();
    const [identity, setIdentity] = useState<{ domain: string; privateKeyHex: string; publicKeyHex: string } | null>(null);
    const [loadingIdentity, setLoadingIdentity] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [exportedAt, setExportedAt] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [format, setFormat] = useState<Format>("json");

    useEffect(() => {
        (async () => {
            try {
                const id = await getIdentity();
                setIdentity(id);
            } finally {
                setLoadingIdentity(false);
            }
        })();
    }, []);

    const handleExport = async () => {
        if (!identity) return;
        setIsExporting(true);
        setError(null);
        try {
            const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
            let records: any[] = [];
            let metadata: Record<string, any> = {
                beo: identity.domain,
                publicKey: identity.publicKeyHex,
                exportedAt: new Date().toISOString(),
                protocol: "BSP v1.0",
                format,
            };

            if (isDemo) {
                await new Promise((r) => setTimeout(r, 800));
                records = DEMO_BIORECORDS;
            } else {
                const data: any = await apiGet(`/api/exchange/export?domain=${encodeURIComponent(identity.domain)}`);
                records = data?.records || [];
                metadata = { ...metadata, ...(data?.metadata || {}) };
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const safeDomain = identity.domain.replace(/\./g, "-");

            if (format === "json") {
                const payload = { metadata, records };
                downloadFile(JSON.stringify(payload, null, 2), `bsp-export-${safeDomain}-${timestamp}.json`, "application/json");
            } else {
                downloadFile(toCSV(records), `bsp-export-${safeDomain}-${timestamp}.csv`, "text/csv");
            }

            setExportedAt(metadata.exportedAt);
        } catch (e: any) {
            setError(e?.message || t("export.error_generic"));
        } finally {
            setIsExporting(false);
        }
    };

    if (loadingIdentity) {
        return (
            <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
                <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }} />
            </div>
        );
    }

    if (!identity) {
        return (
            <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-6" style={{ background: "var(--color-bg)" }}>
                <div className="max-w-md text-center space-y-4">
                    <ShieldAlert className="w-12 h-12 mx-auto" style={{ color: "var(--color-text-muted)" }} />
                    <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>{t("export.no_identity_title")}</h1>
                    <p style={{ color: "var(--color-text-muted)" }}>{t("export.no_identity_desc")}</p>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl text-white font-medium" style={{ background: "var(--color-primary)" }}>
                        <ArrowLeft className="w-4 h-4" />
                        {t("export.back_to_dashboard")}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[calc(100vh-64px)]" style={{ background: "var(--color-bg)" }}>
            <div className="max-w-2xl mx-auto px-6 md:px-8 py-12 md:py-16">
                <div className="mb-10">
                    <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition" style={{ color: "var(--color-text-muted)" }}>
                        <ArrowLeft className="w-4 h-4" />
                        {t("export.back_to_dashboard")}
                    </Link>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl" style={{ background: "var(--color-primary-soft)", border: "1px solid rgba(0,118,255,0.2)" }}>
                            <Database className="w-6 h-6" style={{ color: "var(--color-primary)" }} />
                        </div>
                        <p className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: "var(--color-primary)" }}>{t("export.badge")}</p>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.1]" style={{ color: "var(--color-text)" }}>{t("export.title")}</h1>
                    <p className="mt-3 text-base" style={{ color: "var(--color-text-muted)" }}>{t("export.subtitle")}</p>
                </div>

                <div className="space-y-6 rounded-2xl p-6 md:p-8 border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                    <div>
                        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-text)" }}>{t("export.section_title")}</h2>
                        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{t("export.section_desc")}</p>
                    </div>

                    <div className="p-4 rounded-xl border" style={{ background: "var(--color-bg)", borderColor: "var(--color-border)" }}>
                        <div className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>{t("export.your_beo")}</div>
                        <div className="font-mono text-sm" style={{ color: "var(--color-text)" }}>{identity.domain}</div>
                    </div>

                    <div>
                        <div className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "var(--color-text-muted)" }}>{t("export.format_label")}</div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setFormat("json")}
                                className="p-4 rounded-xl border text-left transition-all hover:-translate-y-0.5"
                                style={{
                                    background: format === "json" ? "var(--color-primary-soft)" : "var(--color-bg)",
                                    borderColor: format === "json" ? "var(--color-primary)" : "var(--color-border)",
                                }}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <FileJson className="w-5 h-5" style={{ color: format === "json" ? "var(--color-primary)" : "var(--color-text-muted)" }} />
                                    <span className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>JSON</span>
                                </div>
                                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{t("export.format_json_desc")}</p>
                            </button>
                            <button
                                onClick={() => setFormat("csv")}
                                className="p-4 rounded-xl border text-left transition-all hover:-translate-y-0.5"
                                style={{
                                    background: format === "csv" ? "var(--color-primary-soft)" : "var(--color-bg)",
                                    borderColor: format === "csv" ? "var(--color-primary)" : "var(--color-border)",
                                }}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <FileSpreadsheet className="w-5 h-5" style={{ color: format === "csv" ? "var(--color-primary)" : "var(--color-text-muted)" }} />
                                    <span className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>CSV</span>
                                </div>
                                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{t("export.format_csv_desc")}</p>
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}>
                            {error}
                        </div>
                    )}

                    {exportedAt && !error && (
                        <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }}>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{t("export.success", { timestamp: new Date(exportedAt).toLocaleString() })}</span>
                        </div>
                    )}

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-white font-medium transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, #4f46e5 100%)", boxShadow: "0 8px 32px rgba(0,118,255,0.25)" }}
                    >
                        <Download className="w-5 h-5" />
                        {isExporting ? t("export.exporting") : t("export.download_btn")}
                    </button>
                </div>

                <div className="mt-6 text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    <p>{t("export.compliance_note")}</p>
                </div>
            </div>
        </div>
    );
}
