"use client"

import { useState } from "react"
import { ShieldCheck, Plus, FileText } from "lucide-react"
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
            const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

            if (isDemo) {
                // Demo mode: simulate consent
                await new Promise(r => setTimeout(r, 1500))
                alert(t('consent.success'))
            } else {
                // Production: call relay API
                const payload = {
                    beoId: identity.domain,
                    ieoId: ieoDomain,
                    intentTypes: intents,
                    dataCategories: categories,
                    expiresAt: Date.now() + 86400000 * 30
                }

                await fetch('/api/relay', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contract: 'AccessControl',
                        function: 'issueConsent',
                        payload,
                        signature: 'dummy_sig',
                        publicKey: identity.publicKeyHex
                    })
                })

                alert(t('consent.success'))
            }
            setIeoDomain("")
        } catch (e) {
            alert(t('consent.error'))
        }
        setIsIssuing(false)
    }

    return (
        <div className="w-full min-h-[calc(100vh-64px)] flex flex-col lg:flex-row">
            {/* LEFT — Visual */}
            <div className="relative lg:w-[45%] lg:flex-none min-h-[30vh] lg:min-h-[calc(100vh-64px)] overflow-hidden order-1">
                <img src="/hero-image.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,30,80,0.75), rgba(0,50,120,0.5))' }} />
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.2 }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', marginBottom: '16px' }}>
                        <FileText size={32} color="#fff" />
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' }}>Issue Consent</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px', fontSize: '0.9rem', textAlign: 'center' }}>Authorize access to your data</p>
                </div>
                <div className="lg:hidden" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '64px', background: 'linear-gradient(to top, var(--color-bg), transparent)' }} />
            </div>

            {/* RIGHT — Content */}
            <div className="flex-1 order-2 overflow-y-auto" style={{ background: 'var(--color-bg)' }}>
                <div style={{ maxWidth: '520px', margin: '0 auto', padding: '3rem 2rem' }}>
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        <div className="space-y-2">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary), #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('consent.title')}</h1>
                            </div>
                            <p className="text-[var(--color-text-muted)]">{t('consent.subtitle')}</p>
                        </div>

                        <div className="p-6 space-y-6" style={{ background: 'var(--color-surface)', borderRadius: 16, border: '1px solid var(--color-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-[var(--color-text-muted)]">{t('consent.label_institution')}</label>
                                <input
                                    type="text"
                                    value={ieoDomain}
                                    onChange={(e) => setIeoDomain(e.target.value.toLowerCase())}
                                    placeholder="ex: fleury.bsp"
                                    className="w-full bg-[var(--color-bg)] outline-none transition-all text-sm text-[var(--color-text)]"
                                    style={{ borderRadius: 12, padding: '14px 16px', border: '1px solid var(--color-border)' }}
                                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-primary-soft)' }}
                                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-[var(--color-text-muted)]">{t('consent.label_intents')}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['SUBMIT_RECORD', 'READ_RECORDS', 'ANALYZE_VITALITY', 'REQUEST_SCORE', 'EXPORT_DATA', 'SYNC_PROTOCOL'].map(intent => {
                                        const isChecked = intents.includes(intent);
                                        return (
                                            <label key={intent} className="flex items-center gap-2 text-sm cursor-pointer transition-all text-[var(--color-text)]"
                                                style={{
                                                    padding: '12px 14px',
                                                    borderRadius: 12,
                                                    background: isChecked ? 'var(--color-primary-soft)' : 'var(--color-bg)',
                                                    border: `1px solid ${isChecked ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setIntents([...intents, intent])
                                                        else setIntents(intents.filter(i => i !== intent))
                                                    }}
                                                    className="accent-[var(--color-primary)] w-4 h-4 cursor-pointer"
                                                />
                                                {intent}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={handleIssueConsent}
                                disabled={isIssuing || !ieoDomain}
                                className="w-full flex items-center justify-center gap-2 text-white py-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all focus:outline-none mt-6"
                                style={{ borderRadius: 12, background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)' }}
                            >
                                {isIssuing ? t('consent.btn_signing') : <><Plus className="w-5 h-5" /> {t('consent.btn_authorize')}</>}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
