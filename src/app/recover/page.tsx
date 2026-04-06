"use client"

import { useState } from "react"
import { ShieldCheck, ArrowRight, RefreshCw, KeyRound } from "lucide-react"
import { recoverBSPKeyPair } from "@/lib/crypto/keys"
import { storeIdentity } from "@/lib/crypto/storage"
import { useTranslation } from "react-i18next"

export default function RecoverPage() {
    const { t } = useTranslation();
    const [method, setMethod] = useState<'seed' | 'guardians'>('seed')
    const [domain, setDomain] = useState("")
    const [seedInput, setSeedInput] = useState("")
    const [isRecovering, setIsRecovering] = useState(false)

    const handleSeedRecovery = async () => {
        setIsRecovering(true)
        try {
            if (!domain) throw new Error(t('errors.missing_domain', 'Informe seu dominio BEO'))

            const words = seedInput.trim().split(/\s+/)
            if (words.length !== 24) throw new Error(t('errors.invalid_seed', 'A Seed Phrase deve conter exatamente 24 palavras.'))

            const keyPair = await recoverBSPKeyPair(words)

            await storeIdentity(`${domain}.bsp`, keyPair.privateKeyHex, keyPair.publicKeyHex)

            alert(t('recover.success'))
            window.location.href = '/dashboard'

        } catch (e: any) {
            alert(e.message || t('recover.error', 'Erro na recuperacao'))
        }
        setIsRecovering(false)
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
                        <RefreshCw size={32} color="#fff" />
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' }}>{t('split.recover_title')}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px', fontSize: '0.9rem', textAlign: 'center' }}>{t('split.recover_subtitle')}</p>
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
                                    <RefreshCw className="w-6 h-6" />
                                </div>
                                <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary), #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('recover.title')}</h1>
                            </div>
                            <p className="text-[var(--color-text-muted)]">{t('recover.subtitle')}</p>
                        </div>

                        <div className="flex p-1 text-sm" style={{ background: 'var(--color-surface)', borderRadius: 14, border: '1px solid var(--color-border)' }}>
                            <button
                                onClick={() => setMethod('seed')}
                                className="flex-1 py-3 text-center transition-all font-medium"
                                style={{
                                    borderRadius: 10,
                                    background: method === 'seed' ? 'var(--color-bg)' : 'transparent',
                                    color: method === 'seed' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                    boxShadow: method === 'seed' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                                }}
                            >
                                {t('recover.tab_seed')}
                            </button>
                            <button
                                onClick={() => setMethod('guardians')}
                                className="flex-1 py-3 text-center transition-all font-medium"
                                style={{
                                    borderRadius: 10,
                                    background: method === 'guardians' ? 'var(--color-bg)' : 'transparent',
                                    color: method === 'guardians' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                    boxShadow: method === 'guardians' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                                }}
                            >
                                {t('recover.tab_guardians')}
                            </button>
                        </div>

                        {method === 'seed' ? (
                            <div className="p-6 space-y-6" style={{ background: 'var(--color-surface)', borderRadius: 16, border: '1px solid var(--color-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-[var(--color-text-muted)]">{t('recover.label_domain')}</label>
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={domain}
                                            onChange={(e) => setDomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                            placeholder={t('create.placeholder_domain')}
                                            className="w-full bg-[var(--color-bg)] outline-none transition-all text-sm text-[var(--color-text)]"
                                            style={{ borderRadius: 12, padding: '14px 16px', border: '1px solid var(--color-border)' }}
                                            onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-primary-soft)' }}
                                            onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
                                        />
                                        <span className="absolute right-4 text-sm text-[var(--color-text-muted)]">{t('create.domain_suffix')}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-[var(--color-text-muted)]">{t('recover.label_seed')}</label>
                                    <textarea
                                        rows={4}
                                        value={seedInput}
                                        onChange={(e) => setSeedInput(e.target.value.toLowerCase())}
                                        placeholder="word1 word2 word3..."
                                        className="w-full font-mono bg-[var(--color-bg)] outline-none transition-all text-sm resize-none text-[var(--color-text)]"
                                        style={{ borderRadius: 12, padding: '14px 16px', border: '1px solid var(--color-border)' }}
                                        onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-primary-soft)' }}
                                        onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
                                    />
                                </div>
                                <button
                                    onClick={handleSeedRecovery}
                                    disabled={isRecovering || !seedInput || !domain}
                                    className="w-full flex items-center justify-center gap-2 text-white py-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all focus:outline-none"
                                    style={{ borderRadius: 12, background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)' }}
                                >
                                    {isRecovering ? t('recover.recovering') : t('recover.btn_restore')}
                                </button>
                            </div>
                        ) : (
                            <div className="p-6 space-y-6 text-center py-12" style={{ background: 'var(--color-surface)', borderRadius: 16, border: '1px solid rgba(249,115,22,0.15)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                                <div className="flex items-center justify-center mx-auto" style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(249,115,22,0.08)', color: '#f97316' }}>
                                    <ShieldCheck className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl text-[var(--color-text)] font-semibold">{t('recover.social_title')}</h3>
                                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed max-w-sm mx-auto">
                                    {t('recover.social_desc')}
                                </p>
                                <button className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-3 font-medium transition-all mt-4"
                                    style={{ borderRadius: 12, background: 'transparent', border: '1px solid rgba(249,115,22,0.4)', color: '#f97316' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(249,115,22,0.06)' }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                                >
                                    {t('recover.btn_social')}
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
