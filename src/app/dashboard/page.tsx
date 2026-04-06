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
    const [seedInput, setSeedInput] = useState("")

    useEffect(() => {
        async function load() {
            const local = await getIdentity()
            if (!local) {
                setLoading(false)
                return
            }
            setIdentity(local)

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

    /* ─── AUTHENTICATED — Dashboard ─── */
    const domainInitial = identity.domain ? identity.domain.charAt(0).toUpperCase() : '?'

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            {showExportModal && identity && (
                <ExportKeyModal
                    domain={identity.domain}
                    privateKeyHex={identity.privateKeyHex}
                    onClose={() => setShowExportModal(false)}
                />
            )}

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
                {/* HEADER ROW */}
                <div className="flex items-center gap-4 pb-8 mb-8" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)',
                            color: '#fff',
                            fontSize: '1.25rem',
                            fontWeight: 700,
                        }}
                    >
                        {domainInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-display font-semibold truncate" style={{ background: 'linear-gradient(135deg, var(--color-primary), #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {identity.domain}
                        </h1>
                        <p className="text-sm text-[var(--color-text-muted)] mt-0.5 font-mono truncate">
                            {identity.publicKeyHex.slice(0, 16)}...{identity.publicKeyHex.slice(-16)}
                        </p>
                    </div>
                    <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 text-xs font-semibold tracking-wide rounded-full uppercase flex-shrink-0">
                        {t('dashboard.onchain_active')}
                    </span>
                </div>

                {/* DASHBOARD GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <Link
                        href="/consent"
                        className="group p-6 rounded-2xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)' }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                                <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-2xl font-light text-[var(--color-text)]">0</span>
                        </div>
                        <h3 className="text-lg font-medium text-[var(--color-text)]">{t('dashboard.cards.consent_title')}</h3>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">{t('dashboard.cards.consent_desc')}</p>
                    </Link>

                    <div
                        className="group p-6 rounded-2xl transition-all duration-200"
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                                <Activity className="w-5 h-5" />
                            </div>
                            <span className="text-2xl font-light text-[var(--color-text)]">?</span>
                        </div>
                        <h3 className="text-lg font-medium text-[var(--color-text)]">{t('dashboard.cards.biorecords_title')}</h3>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">{t('dashboard.cards.biorecords_desc')}</p>
                    </div>

                    <Link
                        href="/guardians"
                        className="group p-6 rounded-2xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)' }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-mono mt-1 text-[var(--color-text-muted)]">0/3</span>
                        </div>
                        <h3 className="text-lg font-medium text-[var(--color-text)]">{t('dashboard.cards.guardians_title')}</h3>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">{t('dashboard.cards.guardians_desc')}</p>
                    </Link>

                    <div
                        onClick={() => setShowExportModal(true)}
                        className="group p-6 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f43f5e' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)' }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl" style={{ background: 'rgba(244,63,94,0.08)', color: '#f43f5e' }}>
                                <Key className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-lg font-medium text-[var(--color-text)] group-hover:text-rose-500 transition-colors">{t('dashboard.cards.export_title')}</h3>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">{t('dashboard.cards.export_desc')}</p>
                    </div>

                </div>
            </div>
        </motion.div>
    )
}
