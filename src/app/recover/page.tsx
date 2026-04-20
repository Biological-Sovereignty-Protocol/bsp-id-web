"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, RefreshCw, FileText, Activity, User } from "lucide-react"
import { recoverBSPKeyPair } from "@/lib/crypto/keys"
import { storeIdentity, getIdentity } from "@/lib/crypto/storage"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { DashboardHeader } from "@/components/DashboardHeader"

export default function RecoverPage() {
    const { t } = useTranslation();
    const [identity, setIdentity] = useState<any>(null)
    const [method, setMethod] = useState<'seed' | 'guardians'>('seed')
    const [domain, setDomain] = useState("")
    const [seedInput, setSeedInput] = useState("")
    const [isRecovering, setIsRecovering] = useState(false)

    useEffect(() => {
        getIdentity().then(id => {
            if (id) setIdentity(id)
            else window.location.href = '/dashboard'
        })
    }, [])

    useEffect(() => {
        if (identity) {
            const h = document.querySelector('header');
            if (h) h.style.display = 'none';
        }
        return () => {
            const h = document.querySelector('header');
            if (h) h.style.display = '';
        };
    }, [identity]);

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

    if (!identity) return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>

    const domainInitial = identity.domain?.charAt(0).toUpperCase() || '?'
    const activeTab = ''

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: User, href: '/dashboard' },
        { id: 'consents', label: t('dashboard.cards.consent_title'), icon: FileText, href: '/consent' },
        { id: 'biorecords', label: t('dashboard.cards.biorecords_title'), icon: Activity, href: '/biorecords' },
        { id: 'guardians', label: t('dashboard.cards.guardians_title'), icon: ShieldCheck, href: '/guardians' },
    ]

    return (
        <div className="w-full">
            <DashboardHeader domain={identity.domain} initial={domainInitial} />
            <div style={{ display: 'flex', flex: 1,  }}>
                {/* SIDEBAR */}
                <aside style={{
                    width: '260px', flexShrink: 0, background: 'var(--color-surface)',
                    borderRight: '1px solid var(--color-border)', padding: '2rem 0',
                    display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)'
                }} className="hidden lg:flex">
                    {/* Profile section */}
                    <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700 }}>{domainInitial}</div>
                            <div style={{ minWidth: 0 }}>
                                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{identity.domain}</p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{identity.publicKeyHex?.slice(0, 8)}...{identity.publicKeyHex?.slice(-6)}</p>
                            </div>
                        </div>
                    </div>
                    {/* Nav */}
                    <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
                        {menuItems.map(item => {
                            const Icon = item.icon
                            const isActive = item.id === activeTab
                            const el = (
                                <div key={item.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                                    borderRadius: '10px', cursor: 'pointer', marginBottom: '4px',
                                    background: isActive ? 'var(--color-primary-soft)' : 'transparent',
                                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                    fontWeight: isActive ? 600 : 400, fontSize: '0.85rem'
                                }}>
                                    <Icon size={18} /><span>{item.label}</span>
                                </div>
                            )
                            return item.href ? <Link key={item.id} href={item.href} style={{ textDecoration: 'none' }}>{el}</Link> : el
                        })}
                    </nav>
                </aside>

                {/* MAIN CONTENT */}
                <main style={{ flex: 1, padding: '2rem 2.5rem', maxWidth: '900px' }}>
                    <div className="space-y-8">

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
                                    <label htmlFor="recover-domain-input" className="text-sm font-medium text-[var(--color-text-muted)]">{t('recover.label_domain')}</label>
                                    <div className="relative flex items-center">
                                        <input
                                            id="recover-domain-input"
                                            type="text"
                                            inputMode="text"
                                            autoCapitalize="none"
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
                                    <label htmlFor="recover-seed-input" className="text-sm font-medium text-[var(--color-text-muted)]">{t('recover.label_seed')}</label>
                                    <textarea
                                        id="recover-seed-input"
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
                </main>
            </div>
        </div>
    )
}
