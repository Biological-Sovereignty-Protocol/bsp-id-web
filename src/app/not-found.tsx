"use client";

import Link from "next/link";
import { Home, LayoutDashboard } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n/config";

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-6"
            style={{ background: "var(--color-bg)" }}>
            <div className="max-w-md text-center space-y-6">
                <div>
                    <p className="text-[11px] font-bold tracking-[0.25em] uppercase mb-2"
                        style={{ color: "var(--color-primary)" }}>
                        BSP Identity
                    </p>
                    <h1 className="text-7xl font-extrabold tracking-tight leading-none"
                        style={{
                            background: "linear-gradient(135deg, var(--color-primary) 0%, #4f46e5 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}>
                        404
                    </h1>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
                        {t("notFound.title")}
                    </h2>
                    <p style={{ color: "var(--color-text-muted)" }}>
                        {t("notFound.subtitle")}
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link href="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium transition hover:-translate-y-0.5 hover:shadow-xl"
                        style={{
                            background: "linear-gradient(135deg, var(--color-primary) 0%, #4f46e5 100%)",
                            boxShadow: "0 8px 32px rgba(0,118,255,0.25)",
                        }}>
                        <Home className="w-4 h-4" />
                        {t("notFound.go_home")}
                    </Link>
                    <Link href="/dashboard"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium border transition hover:opacity-80"
                        style={{
                            borderColor: "var(--color-border)",
                            color: "var(--color-text)",
                            background: "var(--color-surface)",
                        }}>
                        <LayoutDashboard className="w-4 h-4" />
                        {t("notFound.go_dashboard")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
