"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n/config";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const { t } = useTranslation();

    useEffect(() => {
        console.error("[BSP Identity] Unhandled error:", error);
    }, [error]);

    return (
        <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-6"
            style={{ background: "var(--color-bg)" }}>
            <div className="max-w-md text-center space-y-6">
                <div className="inline-flex p-4 rounded-full"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                    <AlertTriangle className="w-10 h-10" style={{ color: "#ef4444" }} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
                        {t("errorBoundary.title")}
                    </h1>
                    <p style={{ color: "var(--color-text-muted)" }}>
                        {t("errorBoundary.subtitle")}
                    </p>
                </div>
                {error?.digest && (
                    <div className="p-3 rounded-xl font-mono text-xs break-all"
                        style={{
                            background: "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-text-muted)",
                        }}>
                        digest: {error.digest}
                    </div>
                )}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                        onClick={() => reset()}
                        type="button"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium transition hover:-translate-y-0.5 hover:shadow-xl"
                        style={{
                            background: "linear-gradient(135deg, var(--color-primary) 0%, #4f46e5 100%)",
                            boxShadow: "0 8px 32px rgba(0,118,255,0.25)",
                        }}>
                        <RotateCcw className="w-4 h-4" />
                        {t("errorBoundary.try_again")}
                    </button>
                    <Link href="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium border transition hover:opacity-80"
                        style={{
                            borderColor: "var(--color-border)",
                            color: "var(--color-text)",
                            background: "var(--color-surface)",
                        }}>
                        <Home className="w-4 h-4" />
                        {t("errorBoundary.go_home")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
