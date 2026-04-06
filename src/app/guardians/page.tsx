"use client"

import { useState, useEffect } from "react"
import { Users, AlertCircle, Share2, ShieldCheck, UserPlus, FileText, Activity, User } from "lucide-react"
import { useTranslation } from "react-i18next"
import { getIdentity } from "@/lib/crypto/storage"
import Link from "next/link"
import { DashboardHeader } from "@/components/DashboardHeader"

export default function GuardiansPage() {
    const { t } = useTranslation();
    const [identity, setIdentity] = useState<any>(null)
    const [step] = useState<'intro'>('intro')

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

    if (!identity) return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>

    const domainInitial = identity.domain?.charAt(0).toUpperCase() || '?'
    const activeTab = 'guardians'

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
                                    <Users className="w-6 h-6" />
                                </div>
                                <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary), #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('guardians.title')}</h1>
                            </div>
                            <p className="text-[var(--color-text-muted)]">{t('guardians.subtitle')}</p>
                        </div>

                        {/* Guardian slots */}
                        <div className="grid gap-4">
                            {[1, 2, 3].map((num) => (
                                <div key={num} className="flex items-center gap-4 p-5 transition-all"
                                    style={{ background: 'var(--color-surface)', borderRadius: 16, border: '1px solid var(--color-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                                >
                                    <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                                        <UserPlus className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[var(--color-text)]">{t('guardians.guardian_num', { num })}</p>
                                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t('guardians.not_configured')}</p>
                                    </div>
                                    <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
                                        {t('guardians.empty')}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 space-y-6" style={{ background: 'var(--color-surface)', borderRadius: 16, border: '1px solid var(--color-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>

                            <div className="flex gap-4 p-4 text-sm" style={{ background: 'rgba(249,115,22,0.06)', borderRadius: 12, border: '1px solid rgba(249,115,22,0.15)', color: 'var(--color-text)' }}>
                                <AlertCircle className="w-6 h-6 shrink-0" style={{ color: '#f97316' }} />
                                <div className="space-y-1">
                                    <p>{t('guardians.warning_1')}</p>
                                    <p>{t('guardians.warning_2')}</p>
                                    <p>{t('guardians.warning_3')}</p>
                                </div>
                            </div>

                            <button
                                className="w-full flex items-center justify-center gap-2 text-white py-4 font-medium hover:opacity-90 transition-all focus:outline-none mt-6"
                                style={{ borderRadius: 12, background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)' }}
                            >
                                <Share2 className="w-5 h-5" /> {t('guardians.btn_setup')}
                            </button>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}
