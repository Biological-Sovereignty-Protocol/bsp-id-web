"use client"

import { useState, useEffect } from "react"
import { Users, AlertCircle, Share2, ShieldCheck, UserPlus, FileText, Activity, User, X, Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { getIdentity } from "@/lib/crypto/storage"
import Link from "next/link"
import { DashboardHeader } from "@/components/DashboardHeader"

type GuardianStatus = 'pending' | 'active' | 'empty'

interface Guardian {
    id: string
    name: string
    contact: string
    status: GuardianStatus
    addedAt: string
}

const statusConfig: Record<GuardianStatus, { bg: string; color: string; labelKey: string }> = {
    pending: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', labelKey: 'guardians.status_pending' },
    active: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', labelKey: 'guardians.status_active' },
    empty: { bg: 'rgba(156,163,175,0.1)', color: '#9ca3af', labelKey: 'guardians.status_empty' },
}

export default function GuardiansPage() {
    const { t } = useTranslation();
    const [identity, setIdentity] = useState<any>(null)
    const [guardians, setGuardians] = useState<Guardian[]>([
        { id: 'g1', name: 'Guardian 1', contact: 'g1@email.com', status: 'pending', addedAt: '2026-04-06' },
        { id: 'g2', name: 'Guardian 2', contact: '+55 11 99999-9999', status: 'pending', addedAt: '2026-04-06' },
        { id: 'g3', name: '', contact: '', status: 'empty', addedAt: '' },
    ])
    const [showForm, setShowForm] = useState(false)
    const [formName, setFormName] = useState('')
    const [formContact, setFormContact] = useState('')

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
        { id: 'biorecords', label: t('dashboard.cards.biorecords_title'), icon: Activity, href: '/biorecords' },
        { id: 'guardians', label: t('dashboard.cards.guardians_title'), icon: ShieldCheck, href: '/guardians' },
    ]

    const configuredCount = guardians.filter(g => g.status !== 'empty').length
    const totalSlots = 3
    const progressPct = Math.round((configuredCount / totalSlots) * 100)

    const handleAddGuardian = () => {
        if (!formName.trim() || !formContact.trim()) return
        const emptySlot = guardians.find(g => g.status === 'empty')
        if (!emptySlot) return

        setGuardians(prev => prev.map(g =>
            g.id === emptySlot.id
                ? { ...g, name: formName.trim(), contact: formContact.trim(), status: 'pending' as GuardianStatus, addedAt: new Date().toISOString().split('T')[0] }
                : g
        ))
        setFormName('')
        setFormContact('')
        setShowForm(false)
    }

    const handleRemoveGuardian = (id: string) => {
        setGuardians(prev => prev.map(g =>
            g.id === id
                ? { ...g, name: '', contact: '', status: 'empty' as GuardianStatus, addedAt: '' }
                : g
        ))
    }

    const hasEmptySlot = guardians.some(g => g.status === 'empty')

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
                                    <Users className="w-6 h-6" />
                                </div>
                                <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary), #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('guardians.title')}</h1>
                            </div>
                            <p className="text-[var(--color-text-muted)]">{t('guardians.subtitle')}</p>
                        </div>

                        {/* Progress Indicator */}
                        <div className="p-5" style={{ background: 'var(--color-surface)', borderRadius: 16, border: '1px solid var(--color-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                                    {t('guardians.progress', { configured: configuredCount, total: totalSlots })}
                                </span>
                                <span className="text-xs font-semibold" style={{ color: configuredCount === totalSlots ? '#10b981' : '#f59e0b' }}>
                                    {progressPct}%
                                </span>
                            </div>
                            <div style={{ height: 6, borderRadius: 3, background: 'var(--color-border)', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', width: `${progressPct}%`, borderRadius: 3,
                                    background: configuredCount === totalSlots
                                        ? 'linear-gradient(90deg, #10b981, #34d399)'
                                        : 'linear-gradient(90deg, var(--color-primary), #f59e0b)',
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                        </div>

                        {/* Guardian slots */}
                        <div className="grid gap-4">
                            {guardians.map((guardian) => {
                                const cfg = statusConfig[guardian.status]
                                return (
                                    <div key={guardian.id} className="flex items-center gap-4 p-5 transition-all"
                                        style={{ background: 'var(--color-surface)', borderRadius: 16, border: '1px solid var(--color-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                                    >
                                        <div className="flex items-center justify-center shrink-0" style={{
                                            width: 44, height: 44, borderRadius: '50%',
                                            background: guardian.status === 'empty' ? 'rgba(156,163,175,0.1)' : 'var(--color-primary-soft)',
                                            color: guardian.status === 'empty' ? '#9ca3af' : 'var(--color-primary)'
                                        }}>
                                            {guardian.status === 'empty' ? <UserPlus className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[var(--color-text)]">
                                                {guardian.status === 'empty' ? t('guardians.empty_slot') : guardian.name}
                                            </p>
                                            {guardian.status !== 'empty' && (
                                                <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">{guardian.contact}</p>
                                            )}
                                            {guardian.status === 'empty' && (
                                                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t('guardians.not_configured')}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
                                                {t(cfg.labelKey)}
                                            </span>
                                            {guardian.status !== 'empty' && (
                                                <button
                                                    onClick={() => handleRemoveGuardian(guardian.id)}
                                                    className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(239,68,68,0.1)]"
                                                    title={t('guardians.btn_remove')}
                                                >
                                                    <X size={16} style={{ color: '#ef4444' }} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Add Guardian Form */}
                        {showForm && (
                            <div className="p-6 space-y-4" style={{ background: 'var(--color-surface)', borderRadius: 16, border: '1px solid var(--color-primary)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                                <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{t('guardians.add_title')}</h3>
                                <div className="grid gap-3">
                                    <input
                                        type="text"
                                        value={formName}
                                        onChange={e => setFormName(e.target.value)}
                                        placeholder={t('guardians.placeholder_name')}
                                        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                    />
                                    <input
                                        type="text"
                                        value={formContact}
                                        onChange={e => setFormContact(e.target.value)}
                                        placeholder={t('guardians.placeholder_contact')}
                                        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddGuardian}
                                        disabled={!formName.trim() || !formContact.trim()}
                                        className="flex-1 flex items-center justify-center gap-2 text-white py-3 font-medium hover:opacity-90 transition-all focus:outline-none disabled:opacity-40"
                                        style={{ borderRadius: 12, background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)' }}
                                    >
                                        <Plus size={16} /> {t('guardians.btn_add')}
                                    </button>
                                    <button
                                        onClick={() => { setShowForm(false); setFormName(''); setFormContact('') }}
                                        className="px-6 py-3 font-medium transition-all focus:outline-none text-sm"
                                        style={{ borderRadius: 12, border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                                    >
                                        {t('guardians.btn_cancel')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Add Guardian Button */}
                        {!showForm && hasEmptySlot && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="w-full flex items-center justify-center gap-2 py-4 font-medium hover:opacity-90 transition-all focus:outline-none text-sm"
                                style={{ borderRadius: 12, border: '2px dashed var(--color-border)', color: 'var(--color-primary)', background: 'transparent' }}
                            >
                                <Plus size={18} /> {t('guardians.btn_add_guardian')}
                            </button>
                        )}

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
