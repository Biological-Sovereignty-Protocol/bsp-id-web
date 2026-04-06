"use client"

import { useEffect, useState } from "react"
import { getIdentity } from "@/lib/crypto/storage"
import { getBEO } from "@/lib/arweave/beo"
import { motion } from "framer-motion"
import { Activity, Key, LogOut, ShieldCheck, FileText, User } from "lucide-react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import ExportKeyModal from "@/components/ExportKeyModal"

export default function Dashboard() {
    const { t } = useTranslation();
    const [identity, setIdentity] = useState<any>(null)
    const [onchainData, setOnchainData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [showExportModal, setShowExportModal] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
    const [seedInput, setSeedInput] = useState("")

    useEffect(() => {
        async function load() {
            const local = await getIdentity()
            if (!local) {
                setLoading(false)
                return
            }
            setIdentity(local)

            if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
                setOnchainData({
                    domain: local.domain,
                    status: 'active',
                    createdAt: local.savedAt || new Date().toISOString(),
                    consents: 2,
                    biorecords: 5,
                    guardians: { total: 3, active: 0 }
                })
                setLoading(false)
                return
            }

            try {
                const arweaveData = await getBEO(local.domain)
                setOnchainData(arweaveData)
            } catch (e) {
                console.error("Failed to load on-chain BEO data")
            }
            setLoading(false)
        }
        load()
    }, [])

    if (loading) {
        return <div className="animate-pulse flex items-center justify-center min-h-[400px] text-[var(--color-text-muted)]">
            {t('dashboard.loading')}
        </div>
    }

    /* ─── NOT AUTHENTICATED — Split Login Page ─── */
    if (!identity) {
        return (
            <div className="w-full min-h-[calc(100vh-64px)] flex flex-col lg:flex-row">
                {/* LEFT — Visual */}
                <div className="relative lg:w-[45%] lg:flex-none min-h-[30vh] lg:min-h-[calc(100vh-64px)] overflow-hidden order-1">
                    <img src="/hero-image.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,30,80,0.75), rgba(0,50,120,0.5))' }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.2 }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', marginBottom: '16px' }}>
                            <Key size={32} color="#fff" />
                        </div>
                        <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>Access your BEO</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px', fontSize: '0.9rem' }}>Your sovereign biological identity</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 lg:hidden" style={{ background: 'linear-gradient(to top, var(--color-bg), transparent)' }} />
                </div>

                {/* RIGHT — Login Form */}
                <div className="flex-1 flex flex-col justify-center order-2" style={{ background: 'var(--color-bg)' }}>
                    <div style={{ maxWidth: '440px', margin: '0 auto', padding: '3rem 2rem' }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <h1 className="text-3xl font-bold mb-3" style={{ background: 'linear-gradient(135deg, var(--color-primary), #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {t('dashboard.require_sovereignty')}
                            </h1>
                            <p className="text-[var(--color-text-muted)] mb-8 leading-relaxed">
                                {t('dashboard.no_key')}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mb-10">
                                <Link
                                    href="/create"
                                    className="flex-1 text-center px-6 py-3.5 text-white font-medium rounded-xl hover:opacity-90 transition-all"
                                    style={{ background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)' }}
                                >
                                    {t('landing.cta_create')}
                                </Link>
                                <Link
                                    href="/recover"
                                    className="flex-1 text-center px-6 py-3.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] font-medium rounded-xl transition-colors"
                                    style={{ border: '1px solid var(--color-border)' }}
                                >
                                    {t('recover.title')}
                                </Link>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                                <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest">or</span>
                                <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                            </div>

                            {/* Seed Phrase Input */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    Seed phrase
                                </label>
                                <textarea
                                    value={seedInput}
                                    onChange={e => setSeedInput(e.target.value)}
                                    placeholder="Enter your 24-word recovery phrase..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                                    style={{
                                        background: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        color: 'var(--color-text)',
                                    }}
                                />
                                <Link
                                    href={`/recover${seedInput.trim() ? `?seed=${encodeURIComponent(seedInput.trim())}` : ''}`}
                                    className="mt-3 w-full block text-center px-6 py-3 text-sm font-medium rounded-xl transition-all"
                                    style={{
                                        background: seedInput.trim() ? 'var(--color-primary)' : 'var(--color-surface)',
                                        color: seedInput.trim() ? '#fff' : 'var(--color-text-muted)',
                                        border: seedInput.trim() ? 'none' : '1px solid var(--color-border)',
                                        opacity: seedInput.trim() ? 1 : 0.6,
                                        pointerEvents: seedInput.trim() ? 'auto' : 'none',
                                    }}
                                >
                                    Access
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        )
    }

    /* ─── AUTHENTICATED — Dashboard with Sidebar ─── */
    const domainInitial = identity.domain ? identity.domain.charAt(0).toUpperCase() : '?'

    const stats = onchainData ? [
        { label: 'Consents', value: onchainData.consents || 0, icon: FileText, color: 'var(--color-primary)' },
        { label: 'BioRecords', value: onchainData.biorecords || 0, icon: Activity, color: '#10b981' },
        { label: 'Guardians', value: `${onchainData.guardians?.active || 0}/${onchainData.guardians?.total || 3}`, icon: ShieldCheck, color: '#8b5cf6' },
    ] : []

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'consents', label: t('dashboard.cards.consent_title'), icon: FileText, href: '/consent' },
        { id: 'biorecords', label: t('dashboard.cards.biorecords_title'), icon: Activity },
        { id: 'guardians', label: t('dashboard.cards.guardians_title'), icon: ShieldCheck, href: '/guardians' },
    ]

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            {showExportModal && identity && (
                <ExportKeyModal domain={identity.domain} privateKeyHex={identity.privateKeyHex} onClose={() => setShowExportModal(false)} />
            )}

            <div style={{ display: 'flex', flex: 1 }}>
                {/* SIDEBAR */}
                <aside style={{
                    width: '260px', flexShrink: 0, background: 'var(--color-surface)',
                    borderRight: '1px solid var(--color-border)', padding: '2rem 0',
                    display: 'flex', flexDirection: 'column', alignSelf: 'stretch', minHeight: 'calc(100vh - 64px)'
                }} className="hidden lg:flex">
                    {/* Profile */}
                    <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)',
                                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.1rem', fontWeight: 700
                            }}>{domainInitial}</div>
                            <div style={{ minWidth: 0 }}>
                                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{identity.domain}</p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{identity.publicKeyHex.slice(0, 8)}...{identity.publicKeyHex.slice(-6)}</p>
                            </div>
                        </div>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px',
                            padding: '3px 10px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 600,
                            background: 'rgba(16,185,129,0.1)', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em'
                        }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                            {t('dashboard.onchain_active')}
                        </span>
                    </div>

                    {/* Nav */}
                    <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
                        {menuItems.map(item => {
                            const Icon = item.icon
                            const isActive = activeTab === item.id
                            const content = (
                                <div key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                                        borderRadius: '10px', cursor: 'pointer', marginBottom: '4px',
                                        background: isActive ? 'var(--color-primary-soft)' : 'transparent',
                                        color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        fontWeight: isActive ? 600 : 400, fontSize: '0.85rem', transition: 'all 0.15s'
                                    }}>
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </div>
                            )
                            return item.href ? <Link key={item.id} href={item.href} style={{ textDecoration: 'none' }}>{content}</Link> : content
                        })}
                    </nav>

                    {/* Bottom actions */}
                    <div style={{ padding: '0 0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                        <div onClick={() => setShowExportModal(true)} style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                            borderRadius: '10px', cursor: 'pointer', color: '#f43f5e',
                            fontSize: '0.85rem', transition: 'all 0.15s'
                        }}>
                            <Key size={18} />
                            <span>{t('dashboard.cards.export_title')}</span>
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main style={{ flex: 1, padding: '2rem 2.5rem', maxWidth: '900px' }}>
                    {/* Greeting */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                            Welcome back
                        </h1>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                            Your biological sovereignty dashboard
                        </p>
                    </div>

                    {/* Stats Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        {stats.map((stat, i) => {
                            const Icon = stat.icon
                            return (
                                <div key={i} style={{
                                    padding: '1.25rem', borderRadius: '16px',
                                    background: 'var(--color-surface)', border: '1px solid var(--color-border)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div style={{ padding: '8px', borderRadius: '10px', background: `${stat.color}15`, color: stat.color }}>
                                            <Icon size={18} />
                                        </div>
                                        <span style={{ fontSize: '1.8rem', fontWeight: 300, color: 'var(--color-text)' }}>{stat.value}</span>
                                    </div>
                                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{stat.label}</p>
                                </div>
                            )
                        })}
                    </div>

                    {/* Quick Actions */}
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Actions</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                        <Link href="/consent" style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem',
                            borderRadius: '14px', background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                            textDecoration: 'none', color: 'var(--color-text)', transition: 'all 0.2s'
                        }}>
                            <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                                <FileText size={18} />
                            </div>
                            <div>
                                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t('dashboard.cards.consent_title')}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{t('dashboard.cards.consent_desc')}</p>
                            </div>
                        </Link>
                        <Link href="/guardians" style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem',
                            borderRadius: '14px', background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                            textDecoration: 'none', color: 'var(--color-text)', transition: 'all 0.2s'
                        }}>
                            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(139,92,246,0.08)', color: '#8b5cf6' }}>
                                <ShieldCheck size={18} />
                            </div>
                            <div>
                                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t('dashboard.cards.guardians_title')}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{t('dashboard.cards.guardians_desc')}</p>
                            </div>
                        </Link>
                    </div>

                    {/* Identity Details */}
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Identity Details</h3>
                    <div style={{
                        padding: '1.5rem', borderRadius: '16px',
                        background: 'var(--color-surface)', border: '1px solid var(--color-border)'
                    }}>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Domain</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>{identity.domain}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Public Key</span>
                                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{identity.publicKeyHex.slice(0, 20)}...{identity.publicKeyHex.slice(-10)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Status</span>
                                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#10b981' }}>{t('dashboard.onchain_active')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Storage</span>
                                <span style={{ fontSize: '0.82rem', color: 'var(--color-text)' }}>Arweave (Permanent)</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1rem', marginTop: '2.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent Activity</h3>
                    <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                        {[
                            { action: 'BEO Created', time: 'Just now', icon: '🔑', color: 'var(--color-primary)' },
                            { action: 'Identity verified on Arweave', time: '2 min ago', icon: '✓', color: '#10b981' },
                            { action: 'Seed phrase backed up', time: '5 min ago', icon: '🛡️', color: '#8b5cf6' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none' }}>
                                <div style={{ width: 36, height: 36, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', background: `${item.color}15` }}>{item.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text)' }}>{item.action}</p>
                                    <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Security Score */}
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1rem', marginTop: '2.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Security Score</h3>
                    <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>40%</span>
                            <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: 'rgba(245,158,11,0.1)' }}>Needs Improvement</span>
                        </div>
                        <div style={{ height: '6px', borderRadius: '3px', background: 'var(--color-border)', overflow: 'hidden', marginBottom: '16px' }}>
                            <div style={{ height: '100%', width: '40%', borderRadius: '3px', background: 'linear-gradient(90deg, var(--color-primary), #f59e0b)' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>✓ BEO created</span>
                                <span style={{ color: '#10b981', fontWeight: 500 }}>+20%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>✓ Seed phrase saved</span>
                                <span style={{ color: '#10b981', fontWeight: 500 }}>+20%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>○ Setup guardians (0/3)</span>
                                <span style={{ color: 'var(--color-text-muted)' }}>+30%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>○ Issue first consent</span>
                                <span style={{ color: 'var(--color-text-muted)' }}>+30%</span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile nav (hidden on desktop) */}
                    <div className="lg:hidden" style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Link href="/consent" style={{ flex: 1, minWidth: '140px', textAlign: 'center', padding: '12px', borderRadius: '12px', background: 'var(--color-primary)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
                            {t('dashboard.cards.consent_title')}
                        </Link>
                        <Link href="/guardians" style={{ flex: 1, minWidth: '140px', textAlign: 'center', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border)', color: 'var(--color-text)', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
                            {t('dashboard.cards.guardians_title')}
                        </Link>
                        <div onClick={() => setShowExportModal(true)} style={{ flex: 1, minWidth: '140px', textAlign: 'center', padding: '12px', borderRadius: '12px', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                            {t('dashboard.cards.export_title')}
                        </div>
                    </div>
                </main>
            </div>
        </motion.div>
    )
}
