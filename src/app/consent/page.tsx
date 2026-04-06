"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, Plus, FileText, Activity, User } from "lucide-react"
import { getIdentity } from "@/lib/crypto/storage"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { DashboardHeader } from "@/components/DashboardHeader"

export default function ConsentPage() {
    const { t } = useTranslation();
    const [identity, setIdentity] = useState<any>(null)
    const [ieoDomain, setIeoDomain] = useState("")
    const [intents, setIntents] = useState<string[]>(['SUBMIT_RECORD'])
    const [categories, setCategories] = useState<string[]>(['BSP-CV'])
    const [isIssuing, setIsIssuing] = useState(false)

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

    const handleIssueConsent = async () => {
        setIsIssuing(true)
        if (!identity) {
            alert(t('consent.error_no_id'))
            setIsIssuing(false)
            return
        }

        try {
            const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

            if (isDemo) {
                await new Promise(r => setTimeout(r, 1500))
                alert(t('consent.success'))
            } else {
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

    if (!identity) return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>

    const domainInitial = identity.domain?.charAt(0).toUpperCase() || '?'
    const activeTab = 'consents'

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: User, href: '/dashboard' },
        { id: 'consents', label: t('dashboard.cards.consent_title'), icon: FileText, href: '/consent' },
        { id: 'biorecords', label: t('dashboard.cards.biorecords_title'), icon: Activity },
        { id: 'guardians', label: t('dashboard.cards.guardians_title'), icon: ShieldCheck, href: '/guardians' },
    ]

    return (
        <div className="w-full">
            <DashboardHeader domain={identity.domain} initial={domainInitial} />
            <div style={{ display: 'flex', flex: 1, paddingTop: '64px' }}>
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
                </main>
            </div>
        </div>
    )
}
