"use client"

import { useState } from "react"
import { X, Download, Eye, EyeOff, ShieldCheck, AlertTriangle } from "lucide-react"
import { exportKeyToFile, triggerFileDownload } from "@/lib/crypto/keyexport"

interface ExportKeyModalProps {
    domain: string
    privateKeyHex: string
    onClose: () => void
}

export default function ExportKeyModal({ domain, privateKeyHex, onClose }: ExportKeyModalProps) {
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [done, setDone] = useState(false)

    const strength = password.length === 0 ? 0
        : password.length < 8 ? 1
        : password.length < 12 ? 2
        : password.length < 16 ? 3
        : 4

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"]
    const strengthColor = ["", "bg-red-500", "bg-amber-400", "bg-blue-400", "bg-emerald-500"]

    async function handleExport() {
        setError(null)
        if (password !== confirm) {
            setError("Passwords do not match")
            return
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }
        setLoading(true)
        try {
            const content = await exportKeyToFile(privateKeyHex, domain, password)
            triggerFileDownload(content, `${domain}.bspkey`)
            setDone(true)
        } catch (e: any) {
            setError(e.message || "Export failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Export key backup">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close"
                className="absolute inset-0 bg-black/60 backdrop-blur-sm border-0 p-0 cursor-pointer"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-surface-border)] rounded-3xl shadow-2xl p-8">
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                    <X size={20} />
                </button>

                {done ? (
                    <div className="text-center space-y-4 py-4">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto">
                            <ShieldCheck size={32} className="text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-black text-[var(--color-text)]">Backup saved</h2>
                        <p className="text-[var(--color-text-muted)]">
                            <code className="text-xs font-mono bg-[var(--color-bg)] px-2 py-1 rounded">{domain}.bspkey</code> downloaded.<br />
                            Store it somewhere safe. Without this file and your password, key recovery is only possible through your guardians.
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-[var(--color-primary)] text-black font-bold rounded-2xl hover:opacity-90 transition-opacity mt-2"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center text-rose-500">
                                <Download size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-[var(--color-text)]">Export Key Backup</h2>
                                <p className="text-xs text-[var(--color-text-muted)] font-mono">{domain}</p>
                            </div>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6 flex gap-3">
                            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                                Your private key will be encrypted with AES-256-GCM before download. Without your password, this file is useless to anyone.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Password */}
                            <div>
                                <label htmlFor="export-key-password" className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">
                                    Encryption password
                                </label>
                                <div className="relative">
                                    <input
                                        id="export-key-password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Choose a strong password"
                                        autoComplete="new-password"
                                        className="w-full bg-[var(--color-bg)] border border-[var(--color-surface-border)] rounded-2xl px-4 py-3 pr-12 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {/* Strength bar */}
                                {password.length > 0 && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex gap-1 flex-1">
                                            {[1, 2, 3, 4].map(i => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : "bg-[var(--color-surface-border)]"}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-[var(--color-text-muted)]">{strengthLabel[strength]}</span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm */}
                            <div>
                                <label htmlFor="export-key-confirm" className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <input
                                        id="export-key-confirm"
                                        type={showConfirm ? "text" : "password"}
                                        value={confirm}
                                        onChange={e => setConfirm(e.target.value)}
                                        placeholder="Repeat the password"
                                        autoComplete="new-password"
                                        className="w-full bg-[var(--color-bg)] border border-[var(--color-surface-border)] rounded-2xl px-4 py-3 pr-12 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(v => !v)}
                                        aria-label={showConfirm ? "Hide password" : "Show password"}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                                    >
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p className="text-xs text-red-500 font-medium">{error}</p>
                            )}

                            <button
                                onClick={handleExport}
                                disabled={loading || !password || !confirm}
                                className="w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                    <Download size={16} />
                                )}
                                {loading ? "Encrypting…" : "Download Encrypted Backup"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
