"use client"

import { useState, useEffect } from "react"
import { Activity, ShieldCheck, FileText, User, ExternalLink } from "lucide-react"
import { getIdentity } from "@/lib/crypto/storage"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { DashboardHeader } from "@/components/DashboardHeader"

const categoryColors: Record<string, { bg: string; color: string }> = {
    'BSP-LA': { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
    'BSP-GL': { bg: 'rgba(234,179,8,0.1)', color: '#ca8a04' },
    'BSP-HM': { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
    'BSP-CL': { bg: 'rgba(34,197,94,0.1)', color: '#22c55e' },
    'BSP-HR': { bg: 'rgba(168,85,247,0.1)', color: '#a855f7' },
    'BSP-IM': { bg: 'rgba(14,165,233,0.1)', color: '#0ea5e9' },
    'BSP-GN': { bg: 'rgba(236,72,153,0.1)', color: '#ec4899' },
    'BSP-WR': { bg: 'rgba(249,115,22,0.1)', color: '#f97316' },
    'BSP-VT': { bg: 'rgba(20,184,166,0.1)', color: '#14b8a6' },
}

const records = [
    { id: 'br_001', category: 'BSP-LA', name: 'Hemoglobin', value: '14.2', unit: 'g/dL', source: 'fleury.bsp', date: '2026-04-05', txId: 'demo_tx_001' },
    { id: 'br_002', category: 'BSP-GL', name: 'Fasting Glucose', value: '92', unit: 'mg/dL', source: 'fleury.bsp', date: '2026-04-05', txId: 'demo_tx_002' },
    { id: 'br_003', category: 'BSP-HR', name: 'TSH', value: '2.1', unit: 'mIU/L', source: 'dasa.bsp', date: '2026-04-03', txId: 'demo_tx_003' },
    { id: 'br_004', category: 'BSP-VT', name: 'Heart Rate (avg)', value: '68', unit: 'bpm', source: 'apple-watch.bsp', date: '2026-04-06', txId: 'demo_tx_004' },
    { id: 'br_005', category: 'BSP-CL', name: 'Creatinine', value: '0.9', unit: 'mg/dL', source: 'fleury.bsp', date: '2026-04-01', txId: 'demo_tx_005' },
]

export default function BioRecordsPage() {
    const { t } = useTranslation();
    const [identity, setIdentity] = useState<any>(null)

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
    const activeTab = 'biorecords'

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: User, href: '/dashboard' },
        { id: 'consents', label: t('dashboard.cards.consent_title'), icon: FileText, href: '/consent' },
        { id: 'biorecords', label: t('dashboard.cards.biorecords_title'), icon: Activity, href: '/biorecords' },
        { id: 'guardians', label: t('dashboard.cards.guardians_title'), icon: ShieldCheck, href: '/guardians' },
    ]

    return (
        <div className="w-full">
            <DashboardHeader domain={identity.domain} initial={domainInitial} />
            <div style={{ display: 'flex', flex: 1 }}>
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
                                    <Activity className="w-6 h-6" />
                                </div>
                                <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary), #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('biorecords.title')}</h1>
                            </div>
                            <p className="text-[var(--color-text-muted)]">{t('biorecords.subtitle')}</p>
                        </div>

                        {/* Records List */}
                        <div className="grid gap-3">
                            {records.map(record => {
                                const catStyle = categoryColors[record.category] || { bg: 'var(--color-bg)', color: 'var(--color-text-muted)' }
                                return (
                                    <div key={record.id} className="p-5 transition-all hover:shadow-md" style={{
                                        background: 'var(--color-surface)', borderRadius: 16,
                                        border: '1px solid var(--color-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                                    }}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span style={{
                                                    fontSize: '0.7rem', padding: '4px 10px', borderRadius: 8,
                                                    background: catStyle.bg, color: catStyle.color,
                                                    fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.5px'
                                                }}>
                                                    {record.category}
                                                </span>
                                                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text)' }}>
                                                    {record.name}
                                                </span>
                                            </div>
                                            <a
                                                href={`https://explorer.aptoslabs.com/txn/${record.txId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs hover:opacity-80 transition-all"
                                                style={{ color: 'var(--color-primary)', fontWeight: 500 }}
                                            >
                                                <ExternalLink size={13} /> {t('biorecords.view_tx') || 'View on Aptos'}
                                            </a>
                                        </div>
                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>
                                                {record.value}
                                            </span>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                                {record.unit}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                                            <span>{t('biorecords.col_source') || 'Source'}: <strong style={{ color: 'var(--color-text)' }}>{record.source}</strong></span>
                                            <span>{record.date}</span>
                                            <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', opacity: 0.5 }}>TX: {record.txId}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}
