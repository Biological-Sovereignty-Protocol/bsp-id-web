"use client"

import { useState, useEffect } from "react"
import { FileText, Activity, Key, Check, X, Clock, Shield } from "lucide-react"
import { getIdentity } from "@/lib/crypto/storage"
import { signBSPTransaction } from "@/lib/crypto/keys"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { DashboardHeader } from "@/components/DashboardHeader"

const mockProposals = [
    { id: 'prop_001', type: 'suspendIEO', target: 'labclin.bsp', proposer: 'admin1', status: 'pending', votes: 1, required: 2, createdAt: '2026-04-06', description: 'Suspend LabClin for compliance violation' },
    { id: 'prop_002', type: 'changeCertLevel', target: 'fleury.bsp', proposer: 'admin2', status: 'approved', votes: 2, required: 2, createdAt: '2026-04-05', description: 'Upgrade Fleury to ADVANCED certification' },
    { id: 'prop_003', type: 'addIEOType', target: 'PHARMACY', proposer: 'admin1', status: 'pending', votes: 0, required: 2, createdAt: '2026-04-04', description: 'Add PHARMACY as valid IEO type' },
]

const typeBadgeColors: Record<string, { bg: string; color: string }> = {
    suspendIEO: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
    changeCertLevel: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
    addIEOType: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e' },
}

const statusColors: Record<string, { bg: string; color: string }> = {
    pending: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
    approved: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e' },
    rejected: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
}

export default function GovernancePage() {
    const { t } = useTranslation()
    const [identity, setIdentity] = useState<any>(null)
    const [activeTab, setActiveTab] = useState('proposals')
    const [proposals, setProposals] = useState(mockProposals)

    useEffect(() => {
        getIdentity().then(id => {
            if (id) setIdentity(id)
            else window.location.href = '/dashboard'
        })
    }, [])

    // Load real proposals from IEORegistry contract via API
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') return
        const registryUrl = process.env.NEXT_PUBLIC_BSP_REGISTRY_URL || ''
        if (!registryUrl) return

        async function loadProposals() {
            try {
                const res = await fetch(`${registryUrl}/api/ieos?status=ACTIVE`)
                if (!res.ok) return
                // Proposals come from the governance state — for now use mock
                // Full integration requires reading IEORegistry governance.proposals state
            } catch { /* fallback to mock */ }
        }
        loadProposals()
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

    const menuItems = [
        { id: 'proposals', label: t('governance.active_proposals'), icon: FileText },
        { id: 'history', label: t('governance.history'), icon: Activity },
        { id: 'keyholders', label: t('governance.keyholders'), icon: Key },
    ]

    const filteredProposals = activeTab === 'history'
        ? proposals.filter(p => p.status !== 'pending')
        : proposals.filter(p => p.status === 'pending')

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
                            return (
                                <div key={item.id} onClick={() => setActiveTab(item.id)} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                                    borderRadius: '10px', cursor: 'pointer', marginBottom: '4px',
                                    background: isActive ? 'var(--color-primary-soft)' : 'transparent',
                                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                    fontWeight: isActive ? 600 : 400, fontSize: '0.85rem'
                                }}>
                                    <Icon size={18} /><span>{item.label}</span>
                                </div>
                            )
                        })}
                        <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '1rem', paddingTop: '1rem' }}>
                            <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                                <Shield size={18} /><span>Back to Dashboard</span>
                            </Link>
                        </div>
                    </nav>
                </aside>

                {/* MAIN CONTENT */}
                <main style={{ flex: 1, padding: '2rem 2.5rem', maxWidth: '900px' }}>
                    <div className="space-y-8">

                        <div className="space-y-2">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary), #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('governance.title')}</h1>
                            </div>
                            <p className="text-[var(--color-text-muted)]">Multisig governance for the Ambrosio Institute</p>
                        </div>

                        {/* Keyholders Tab */}
                        {activeTab === 'keyholders' && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('governance.keyholders')}</h2>
                                {['admin1 (Andre Ambrosio)', 'admin2 (Institute Board)'].map((kh, i) => (
                                    <div key={i} style={{
                                        padding: '1rem 1.25rem', borderRadius: 14,
                                        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                                        display: 'flex', alignItems: 'center', gap: '12px'
                                    }}>
                                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                                            {kh.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>{kh}</p>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>Keyholder {i + 1} of 2</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Proposals / History Tab */}
                        {(activeTab === 'proposals' || activeTab === 'history') && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-[var(--color-text)]">
                                        {activeTab === 'proposals' ? t('governance.active_proposals') : t('governance.history')}
                                    </h2>
                                    {activeTab === 'proposals' && (
                                        <button type="button" style={{
                                            padding: '8px 16px', borderRadius: '10px',
                                            background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)',
                                            color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer'
                                        }}>
                                            {t('governance.propose')}
                                        </button>
                                    )}
                                </div>

                                {filteredProposals.length === 0 && (
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', padding: '2rem', textAlign: 'center' }}>
                                        {activeTab === 'history' ? 'No past proposals yet.' : 'No active proposals.'}
                                    </p>
                                )}

                                <div className="grid gap-3">
                                    {filteredProposals.map(proposal => {
                                        const typeStyle = typeBadgeColors[proposal.type] || typeBadgeColors.addIEOType
                                        const sColor = statusColors[proposal.status] || statusColors.pending
                                        return (
                                            <div key={proposal.id} style={{
                                                padding: '1.25rem', borderRadius: 14,
                                                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                                            }}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: 20, background: typeStyle.bg, color: typeStyle.color, fontWeight: 600, fontFamily: 'monospace' }}>
                                                            {proposal.type}
                                                        </span>
                                                        <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: 20, background: sColor.bg, color: sColor.color, fontWeight: 600 }}>
                                                            {t(`governance.${proposal.status}`)}
                                                        </span>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{proposal.target}</span>
                                                    </div>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Clock size={12} /> {proposal.createdAt}
                                                    </span>
                                                </div>

                                                <p style={{ fontSize: '0.88rem', color: 'var(--color-text)', marginBottom: '12px', fontWeight: 500 }}>
                                                    {proposal.description}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                                                        {t('governance.votes')}: <strong style={{ color: 'var(--color-text)' }}>{proposal.votes}/{proposal.required}</strong>
                                                    </span>

                                                    {proposal.status === 'pending' && (
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button type="button" onClick={async () => {
                                                                if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') { alert('Vote: Approve (demo)'); return }
                                                                try {
                                                                    const { CryptoUtils } = await import('@biological-sovereignty-protocol/sdk')
                                                                    const nonce = CryptoUtils.generateNonce()
                                                                    const timestamp = new Date().toISOString()
                                                                    const payload = { function: 'approveAction', proposalId: proposal.id, nonce, timestamp }
                                                                    const signature = signBSPTransaction(payload, identity.privateKeyHex)
                                                                    const { apiPost } = await import('@/lib/api')
                                                                    await apiPost('/api/ieo/approve', { proposalId: proposal.id, signature, nonce, timestamp })
                                                                    alert('Approved!')
                                                                } catch (e: any) { alert(e.message) }
                                                            }} style={{
                                                                display: 'flex', alignItems: 'center', gap: '4px',
                                                                padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600,
                                                                background: 'rgba(34,197,94,0.1)', color: '#22c55e',
                                                                border: '1px solid rgba(34,197,94,0.2)', cursor: 'pointer'
                                                            }}>
                                                                <Check size={14} /> {t('governance.approve')}
                                                            </button>
                                                            <button type="button" onClick={() => alert('Reject requires a new counter-proposal (BSP governance has no reject — only propose alternatives)')} style={{
                                                                display: 'flex', alignItems: 'center', gap: '4px',
                                                                padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600,
                                                                background: 'rgba(239,68,68,0.08)', color: '#ef4444',
                                                                border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer'
                                                            }}>
                                                                <X size={14} /> {t('governance.reject')}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    )
}
