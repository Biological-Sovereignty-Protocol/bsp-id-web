"use client"

import { useState } from "react"
import { ShieldCheck, Plus } from "lucide-react"
import { getIdentity } from "@/lib/crypto/storage"
import { useTranslation } from "react-i18next"

export default function ConsentPage() {
    const { t } = useTranslation();
    const [ieoDomain, setIeoDomain] = useState("")
    const [intents, setIntents] = useState<string[]>(['SUBMIT_RECORD'])
    const [categories, setCategories] = useState<string[]>(['BSP-CV'])
    const [isIssuing, setIsIssuing] = useState(false)

    const handleIssueConsent = async () => {
        setIsIssuing(true)
        const identity = await getIdentity()
        if (!identity) {
            alert(t('consent.error_no_id'))
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

            alert(t('consent.success'))
            setIeoDomain("")
        } catch (e) {
            alert(t('consent.error'))
        }
        setIsIssuing(false)
    }

    return (
        <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="space-y-2">
                <h1 className="text-3xl text-[var(--color-primary)] flex items-center gap-3 font-bold">
                    <ShieldCheck className="w-8 h-8" /> {t('consent.title')}
                </h1>
                <p className="text-[var(--color-text-muted)]">{t('consent.subtitle')}</p>
            </div>

            <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] space-y-6 shadow-sm">
                <div className="space-y-3">
                    <label className="text-sm font-medium text-[var(--color-text-muted)]">{t('consent.label_institution')}</label>
                    <input
                        type="text"
                        value={ieoDomain}
                        onChange={(e) => setIeoDomain(e.target.value.toLowerCase())}
                        placeholder="ex: fleury.bsp"
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-surface)] rounded-lg p-3 outline-none focus:border-[var(--color-primary)] transition-colors text-sm text-[var(--color-text)]"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium text-[var(--color-text-muted)]">{t('consent.label_intents')}</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['SUBMIT_RECORD', 'READ_RECORDS', 'ANALYZE_VITALITY', 'REQUEST_SCORE', 'EXPORT_DATA', 'SYNC_PROTOCOL'].map(intent => (
                            <label key={intent} className="flex items-center gap-2 text-sm cursor-pointer p-3 border border-[var(--color-bg)] bg-[var(--color-bg)] rounded-lg hover:border-[var(--color-primary)]/50 transition-colors text-[var(--color-text)]">
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
                    className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-black py-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all focus:outline-none mt-6"
                >
                    {isIssuing ? t('consent.btn_signing') : <><Plus className="w-5 h-5" /> {t('consent.btn_authorize')}</>}
                </button>
            </div>

        </div>
    )
}
