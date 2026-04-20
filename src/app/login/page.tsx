"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { KeyRound, Shield, ArrowRight, Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"

function generateNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export default function LoginPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [domain, setDomain] = useState("")
  const [nonce, setNonce] = useState("")
  const [signature, setSignature] = useState("")
  const [step, setStep] = useState<"form" | "sign" | "loading">("form")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setNonce(generateNonce())
  }, [])

  const timestampSecs = Math.floor(Date.now() / 1000)

  const messageToSign = domain
    ? `bsp-login:${domain}:${nonce}:${timestampSecs}`
    : ""

  const handleConnectWallet = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!domain.trim()) {
      setError("Enter your BSP Domain first.")
      return
    }
    setStep("sign")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!signature.trim()) {
      setError("Paste your signature before submitting.")
      return
    }

    setStep("loading")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          signature: signature.trim(),
          nonce,
          timestamp_secs: timestampSecs,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Authentication failed.")
        setStep("sign")
        return
      }

      const next = searchParams.get("next") ?? "/dashboard"
      router.push(next)
    } catch {
      setError("Network error. Check your connection and try again.")
      setStep("sign")
    }
  }

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16"
      style={{ background: "var(--color-bg)" }}>
      <div className="w-full max-w-[440px] space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl border"
              style={{ background: "var(--color-primary-soft)", borderColor: "rgba(0,118,255,0.15)" }}>
              <Shield className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>
                BSP Identity Login
              </h1>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Sign in with your biological sovereignty key
              </p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border p-6 space-y-5"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>

          {/* Step 1 — Domain */}
          <form onSubmit={handleConnectWallet} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--color-text-muted)" }}>
                BSP Domain
              </label>
              <input
                type="text"
                placeholder="alice.bsp"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value)
                  if (step === "sign") setStep("form")
                  setError(null)
                }}
                disabled={step === "loading"}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-[var(--color-primary)]"
                style={{
                  background: "var(--color-bg)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            {step === "form" && (
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, var(--color-primary) 0%, #4f46e5 100%)",
                  boxShadow: "0 6px 24px rgba(0,118,255,0.2)",
                }}>
                <KeyRound className="w-4 h-4" />
                Connect Wallet
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Step 2 — Sign */}
          {step !== "form" && (
            <form onSubmit={handleSubmit} className="space-y-4 border-t pt-5"
              style={{ borderColor: "var(--color-border)" }}>

              {/* Nonce display */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-text-muted)" }}>
                  Message to Sign
                </label>
                <div className="px-4 py-3 rounded-xl border font-mono text-xs break-all select-all"
                  style={{
                    background: "var(--color-bg)",
                    borderColor: "rgba(0,118,255,0.2)",
                    color: "var(--color-text-muted)",
                  }}>
                  {messageToSign}
                </div>
                <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                  Sign this message with your Ed25519 private key (bs58-encoded output).
                </p>
              </div>

              {/* Signature input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-text-muted)" }}>
                  Signature (bs58)
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste your base58-encoded signature here…"
                  value={signature}
                  onChange={(e) => { setSignature(e.target.value); setError(null) }}
                  disabled={step === "loading"}
                  className="w-full px-4 py-3 rounded-xl border text-xs font-mono outline-none transition-all focus:border-[var(--color-primary)] resize-none"
                  style={{
                    background: "var(--color-bg)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={step === "loading"}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, var(--color-primary) 0%, #4f46e5 100%)",
                  boxShadow: "0 6px 24px rgba(0,118,255,0.2)",
                }}>
                {step === "loading" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
                ) : (
                  <><Shield className="w-4 h-4" /> Sign In</>
                )}
              </button>
            </form>
          )}

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm border"
              style={{
                background: "rgba(239,68,68,0.08)",
                borderColor: "rgba(239,68,68,0.2)",
                color: "#ef4444",
              }}>
              {error}
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
          No password. No email. Your key is your identity.
        </p>
      </div>
    </div>
  )
}
