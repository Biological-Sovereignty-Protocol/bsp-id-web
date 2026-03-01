"use client"

import { useState } from "react"
import { ShieldCheck, Plus } from "lucide-react"
import { getIdentity } from "@/lib/crypto/storage"

export default function ConsentPage() {
    const [ieoDomain, setIeoDomain] = useState("")
    const [intents, setIntents] = useState<string[]>(['SUBMIT_RECORD'])
    const [categories, setCategories] = useState<string[]>(['BSP-CV'])
    const [isIssuing, setIsIssuing] = useState(false)

    const handleIssueConsent = async () => {
        setIsIssuing(true)
        const identity = await getIdentity()
        if (!identity) {
            alert("Identidade não encontrada. Acesse /dashboard.")
            setIsIssuing(false)
            return
        }

        try {
            const payload = {
                beoId: identity.domain, // assuming beoId is domain for simplicty in UI demo
                ieoId: ieoDomain,
                intentTypes: intents,
                dataCategories: categories,
                expiresAt: Date.now() + 86400000 * 30 // 30 dias genérico para a interface
            }

            await fetch('/api/relay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contract: 'AccessControl',
                    function: 'issueConsent',
                    payload,
                    signature: 'dummy_sig', // would sign securely here
                    publicKey: identity.publicKeyHex
                })
            })

            alert("Consentimento emitido on-chain via Relayer!")
            setIeoDomain("")
        } catch (e) {
            alert("Erro ao emitir consentimento.")
        }
        setIsIssuing(false)
    }

    return (
        <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="space-y-2">
                <h1 className="text-3xl text-[var(--color-primary)] flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8" /> Emitir Consentimento
                </h1>
                <p className="text-[var(--color-text-muted)]">Autorize laboratórios e clínicas a interagir com seu BEO.</p>
            </div>

            <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] space-y-6">
                <div className="space-y-3">
                    <label className="text-sm font-medium text-[var(--color-text-muted)]">Instituição Autorizada (Domínio IEO)</label>
                    <input
                        type="text"
                        value={ieoDomain}
                        onChange={(e) => setIeoDomain(e.target.value.toLowerCase())}
                        placeholder="ex: fleury.bsp"
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-surface)] rounded p-3 outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium text-[var(--color-text-muted)]">Intenções Permitidas</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['SUBMIT_RECORD', 'READ_RECORDS', 'ANALYZE_VITALITY', 'REQUEST_DATA'].map(intent => (
                            <label key={intent} className="flex items-center gap-2 text-sm cursor-pointer p-3 border border-[var(--color-bg)] bg-[var(--color-bg)] rounded hover:border-[var(--color-primary)]/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={intents.includes(intent)}
                                    onChange={(e) => {
                                        if (e.target.checked) setIntents([...intents, intent])
                                        else setIntents(intents.filter(i => i !== intent))
                                    }}
                                    className="accent-[var(--color-primary)] w-4 h-4 cursor-pointer"
                                />
                                {intent}
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleIssueConsent}
                    disabled={isIssuing || !ieoDomain}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-black py-4 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all focus:outline-none mt-6"
                >
                    {isIssuing ? "Assinando e Registrando..." : <><Plus className="w-5 h-5" /> Autorizar Instituição</>}
                </button>
            </div>

        </div>
    )
}
