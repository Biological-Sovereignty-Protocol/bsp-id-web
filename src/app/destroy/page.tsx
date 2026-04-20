"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight, ArrowLeft, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getIdentity, clearIdentity } from "@/lib/crypto/storage";
import { signBSPTransaction } from "@/lib/crypto/keys";
import { apiPost } from "@/lib/api";
import "@/lib/i18n/config";

type Step = "understand" | "confirm" | "execute" | "done";

export default function DestroyPage() {
    const { t } = useTranslation();
    const [step, setStep] = useState<Step>("understand");
    const [identity, setIdentity] = useState<{ domain: string; privateKeyHex: string; publicKeyHex: string } | null>(null);
    const [loadingIdentity, setLoadingIdentity] = useState(true);
    const [confirmText, setConfirmText] = useState("");
    const [ack1, setAck1] = useState(false);
    const [ack2, setAck2] = useState(false);
    const [ack3, setAck3] = useState(false);
    const [isDestroying, setIsDestroying] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const handleDestroy = async () => {
        if (!identity) return;
        setIsDestroying(true);
        setError(null);
        try {
            const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
            if (isDemo) {
                await new Promise((r) => setTimeout(r, 1500));
                await clearIdentity();
                setStep("done");
            } else {
                const { CryptoUtils } = await import("@biological-sovereignty-protocol/sdk");
                const nonce = CryptoUtils.generateNonce();
                const timestamp = new Date().toISOString();
                const payload = {
                    function: "destroyBEO",
                    domain: identity.domain,
                    publicKey: identity.publicKeyHex,
                    nonce,
                    timestamp,
                };
                const signature = signBSPTransaction(payload, identity.privateKeyHex);
                await apiPost("/api/beo/destroy", {
                    domain: identity.domain,
                    publicKey: identity.publicKeyHex,
                    signature,
                    nonce,
                    timestamp,
                });
                await clearIdentity();
                setStep("done");
            }
        } catch (e: any) {
            setError(e?.message || t("destroy.error_generic"));
            setIsDestroying(false);
        }
    };

    const canConfirm = ack1 && ack2 && ack3;
    const canExecute = confirmText === "DESTROY";

    if (loadingIdentity) {
        return (
            <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
                <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }} />
            </div>
        );
    }

    if (!identity && step !== "done") {
        return (
            <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-6" style={{ background: "var(--color-bg)" }}>
                <div className="max-w-md text-center space-y-4">
                    <ShieldAlert className="w-12 h-12 mx-auto" style={{ color: "var(--color-text-muted)" }} />
                    <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>{t("destroy.no_identity_title")}</h1>
                    <p style={{ color: "var(--color-text-muted)" }}>{t("destroy.no_identity_desc")}</p>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl text-white font-medium" style={{ background: "var(--color-primary)" }}>
                        <ArrowLeft className="w-4 h-4" />
                        {t("destroy.back_to_dashboard")}
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
                        {t("destroy.back_to_dashboard")}
                    </Link>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                            <Flame className="w-6 h-6" style={{ color: "#ef4444" }} />
                        </div>
                        <p className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: "#ef4444" }}>{t("destroy.badge")}</p>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.1]" style={{ color: "var(--color-text)" }}>{t("destroy.title")}</h1>
                    <p className="mt-3 text-base" style={{ color: "var(--color-text-muted)" }}>{t("destroy.subtitle")}</p>
                </div>

                <div className="flex items-center gap-2 mb-8">
                    {(["understand", "confirm", "execute"] as const).map((s, i) => {
                        const activeIndex = ["understand", "confirm", "execute", "done"].indexOf(step);
                        const isActive = i <= activeIndex;
                        return <div key={s} className="flex-1 h-1 rounded-full transition-all" style={{ background: isActive ? "#ef4444" : "var(--color-border)" }} />;
                    })}
                </div>

                {step === "understand" && (
                    <div className="space-y-6 rounded-2xl p-6 md:p-8 border" style={{ background: "var(--color-surface)", borderColor: "rgba(239,68,68,0.25)" }}>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: "#ef4444" }} />
                            <div>
                                <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-text)" }}>{t("destroy.warning_title")}</h2>
                                <p style={{ color: "var(--color-text-muted)" }}>{t("destroy.warning_desc")}</p>
                            </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" checked={ack1} onChange={(e) => setAck1(e.target.checked)} className="mt-1 w-4 h-4" style={{ accentColor: "#ef4444" }} />
                                <span className="text-sm" style={{ color: "var(--color-text)" }}>{t("destroy.ack_1")}</span>
                            </label>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" checked={ack2} onChange={(e) => setAck2(e.target.checked)} className="mt-1 w-4 h-4" style={{ accentColor: "#ef4444" }} />
                                <span className="text-sm" style={{ color: "var(--color-text)" }}>{t("destroy.ack_2")}</span>
                            </label>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" checked={ack3} onChange={(e) => setAck3(e.target.checked)} className="mt-1 w-4 h-4" style={{ accentColor: "#ef4444" }} />
                                <span className="text-sm" style={{ color: "var(--color-text)" }}>{t("destroy.ack_3")}</span>
                            </label>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <Link href="/dashboard" className="px-5 py-2.5 rounded-xl text-sm font-medium border transition hover:opacity-80" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                                {t("destroy.cancel")}
                            </Link>
                            <button disabled={!canConfirm} onClick={() => setStep("confirm")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: "#ef4444" }}>
                                {t("destroy.continue")}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {step === "confirm" && (
                    <div className="space-y-6 rounded-2xl p-6 md:p-8 border" style={{ background: "var(--color-surface)", borderColor: "rgba(239,68,68,0.25)" }}>
                        <div>
                            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-text)" }}>{t("destroy.confirm_title")}</h2>
                            <p style={{ color: "var(--color-text-muted)" }}>{t("destroy.confirm_desc")}</p>
                        </div>
                        <div className="p-4 rounded-xl border" style={{ background: "var(--color-bg)", borderColor: "var(--color-border)" }}>
                            <div className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>{t("destroy.your_beo")}</div>
                            <div className="font-mono text-sm" style={{ color: "var(--color-text)" }}>{identity?.domain}</div>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <button onClick={() => setStep("understand")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition hover:opacity-80" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                                <ArrowLeft className="w-4 h-4" />
                                {t("destroy.back")}
                            </button>
                            <button onClick={() => setStep("execute")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition" style={{ background: "#ef4444" }}>
                                {t("destroy.continue")}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {step === "execute" && (
                    <div className="space-y-6 rounded-2xl p-6 md:p-8 border" style={{ background: "var(--color-surface)", borderColor: "rgba(239,68,68,0.5)" }}>
                        <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#ef4444" }} />
                            <p className="text-sm font-medium" style={{ color: "#ef4444" }}>{t("destroy.final_warning")}</p>
                        </div>
                        <div>
                            <label htmlFor="destroy-confirm-input" className="block text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>{t("destroy.type_destroy")}</label>
                            <input id="destroy-confirm-input" type="text" inputMode="text" autoCapitalize="characters" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DESTROY" disabled={isDestroying} className="w-full px-4 py-3 rounded-xl border font-mono text-base disabled:opacity-50" style={{ background: "var(--color-bg)", borderColor: canExecute ? "#ef4444" : "var(--color-border)", color: "var(--color-text)" }} />
                        </div>
                        {error && (
                            <div className="p-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}>{error}</div>
                        )}
                        <div className="flex items-center justify-between pt-2">
                            <button onClick={() => setStep("confirm")} disabled={isDestroying} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition hover:opacity-80 disabled:opacity-50" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                                <ArrowLeft className="w-4 h-4" />
                                {t("destroy.back")}
                            </button>
                            <button onClick={handleDestroy} disabled={!canExecute || isDestroying} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: "#ef4444" }}>
                                <Flame className="w-4 h-4" />
                                {isDestroying ? t("destroy.destroying") : t("destroy.execute")}
                            </button>
                        </div>
                    </div>
                )}

                {step === "done" && (
                    <div className="text-center space-y-6 rounded-2xl p-8 md:p-12 border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                        <div className="inline-flex p-4 rounded-full" style={{ background: "rgba(16,185,129,0.1)" }}>
                            <CheckCircle2 className="w-10 h-10" style={{ color: "#10b981" }} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text)" }}>{t("destroy.success_title")}</h2>
                            <p style={{ color: "var(--color-text-muted)" }}>{t("destroy.success_desc")}</p>
                        </div>
                        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition" style={{ background: "var(--color-primary)" }}>
                            {t("destroy.go_home")}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
