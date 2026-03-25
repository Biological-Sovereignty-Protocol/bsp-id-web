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

    useEffect(() => {
        async function load() {
            // 1. Fetch from Local IndexedDB
            const local = await getIdentity()
            if (!local) {
                setLoading(false)
                return
            }
            setIdentity(local)

            // 2. Fetch from Arweave (BEORegistry)
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

    if (!identity) {
        return (
            <div className="text-center space-y-6">
                <h1 className="text-3xl text-[var(--color-primary)] font-bold">{t('dashboard.require_sovereignty')}</h1>
                <p className="text-[var(--color-text-muted)]">{t('dashboard.no_key')}</p>
                <div className="flex justify-center gap-4">
                    <Link href="/create" className="px-6 py-3 bg-[var(--color-surface)] text-[var(--color-text)] rounded-[var(--radius-card)] hover:bg-[var(--color-primary)] hover:text-black transition-colors">
                        {t('landing.cta_create')}
                    </Link>
                    <Link href="/recover" className="px-6 py-3 border border-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] rounded-[var(--radius-card)] transition-colors">
                        {t('recover.title')}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-8">
            {showExportModal && identity && (
                <ExportKeyModal
                    domain={identity.domain}
                    privateKeyHex={identity.privateKeyHex}
                    onClose={() => setShowExportModal(false)}
                />
            )}

            {/* HEADER ROW */}
            <div className="flex items-center justify-between pb-6 border-b border-[var(--color-surface)]">
                <div>
                    <h1 className="text-3xl font-display text-[var(--color-text)] font-semibold">{identity.domain}</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1 font-mono">
                        {identity.publicKeyHex.slice(0, 16)}...{identity.publicKeyHex.slice(-16)}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-semibold tracking-wide rounded-full uppercase">
                        {t('dashboard.onchain_active')}
                    </span>
                </div>
            </div>

            {/* DASHBOARD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <Link href="/consent" className="group bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] hover:border-[var(--color-primary)] border border-transparent transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[var(--color-bg)] rounded-full group-hover:text-[var(--color-primary)] transition-colors"><FileText className="w-5 h-5" /></div>
                        <span className="text-2xl font-light text-[var(--color-text)]">0</span>
                    </div>
                    <h3 className="text-lg font-medium text-[var(--color-text)]">{t('dashboard.cards.consent_title')}</h3>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">{t('dashboard.cards.consent_desc')}</p>
                </Link>

                <div className="group bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] border border-transparent shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[var(--color-bg)] rounded-full text-blue-400"><Activity className="w-5 h-5" /></div>
                        <span className="text-2xl font-light text-[var(--color-text)]">?</span>
                    </div>
                    <h3 className="text-lg font-medium text-[var(--color-text)]">{t('dashboard.cards.biorecords_title')}</h3>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">{t('dashboard.cards.biorecords_desc')}</p>
                </div>

                <Link href="/guardians" className="group bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] hover:border-[var(--color-primary)] border border-transparent transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[var(--color-bg)] rounded-full group-hover:text-[var(--color-primary)] transition-colors"><ShieldCheck className="w-5 h-5" /></div>
                        <span className="text-sm font-mono mt-1 text-[var(--color-text-muted)]">0/3</span>
                    </div>
                    <h3 className="text-lg font-medium text-[var(--color-text)]">{t('dashboard.cards.guardians_title')}</h3>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">{t('dashboard.cards.guardians_desc')}</p>
                </Link>

                <div
                    onClick={() => setShowExportModal(true)}
                    className="group bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] hover:border-rose-500 border border-transparent transition-all shadow-sm cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[var(--color-bg)] rounded-full text-red-400 group-hover:text-rose-500 transition-colors"><Key className="w-5 h-5" /></div>
                    </div>
                    <h3 className="text-lg font-medium text-[var(--color-text)] group-hover:text-rose-500 transition-colors">{t('dashboard.cards.export_title')}</h3>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">{t('dashboard.cards.export_desc')}</p>
                </div>

            </div>

        </motion.div>
    )
}
