"use client"

import { useEffect, useState } from "react"
import { getIdentity } from "@/lib/crypto/storage"
import { getBEO } from "@/lib/arweave/beo"
import { motion } from "framer-motion"
import { Activity, Key, LogOut, ShieldCheck, FileText, User } from "lucide-react"

export default function Dashboard() {
    const [identity, setIdentity] = useState<any>(null)
    const [onchainData, setOnchainData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

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
        return <div className="animate-pulse flex items-center justify-center min-h-[400px]">Carregando identidade...</div>
    }

    if (!identity) {
        return (
            <div className="text-center space-y-6">
                <h1 className="text-3xl text-[var(--color-primary)]">Soberania Requerida</h1>
                <p className="text-[var(--color-text-muted)]">Nenhuma chave biológica encontrada neste dispositivo.</p>
                <div className="flex justify-center gap-4">
                    <a href="/create" className="px-6 py-3 bg-[var(--color-surface)] text-[var(--color-text)] rounded-[var(--radius-card)]">Criar BEO</a>
                    <a href="/recover" className="px-6 py-3 border border-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] rounded-[var(--radius-card)]">Recuperar BEO</a>
                </div>
            </div>
        )
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-8">

            {/* HEADER ROW */}
            <div className="flex items-center justify-between pb-6 border-b border-[var(--color-surface)]">
                <div>
                    <h1 className="text-3xl font-display text-[var(--color-text)]">{identity.domain}</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1 font-mono">
                        {identity.publicKeyHex.slice(0, 16)}...{identity.publicKeyHex.slice(-16)}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-semibold tracking-wide rounded-full uppercase">On-chain Active</span>
                </div>
            </div>

            {/* DASHBOARD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <a href="/consent" className="group bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] hover:border-[var(--color-primary)] border border-transparent transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[var(--color-bg)] rounded-full group-hover:text-[var(--color-primary)] transition-colors"><FileText className="w-5 h-5" /></div>
                        <span className="text-2xl font-light">0</span>
                    </div>
                    <h3 className="text-lg font-medium">Consentimentos</h3>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Gerencie quem pode ler e enviar seus dados biológicos.</p>
                </a>

                <div className="group bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] border border-transparent">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[var(--color-bg)] rounded-full text-blue-400"><Activity className="w-5 h-5" /></div>
                        <span className="text-2xl font-light">?</span>
                    </div>
                    <h3 className="text-lg font-medium">BioRecords</h3>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Histórico de biomarcadores (Requer decodificação).</p>
                </div>

                <a href="/guardians" className="group bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] hover:border-[var(--color-primary)] border border-transparent transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[var(--color-bg)] rounded-full group-hover:text-[var(--color-primary)] transition-colors"><ShieldCheck className="w-5 h-5" /></div>
                        <span className="text-sm font-mono mt-1 text-[var(--color-text-muted)]">0/3</span>
                    </div>
                    <h3 className="text-lg font-medium">Guardiões</h3>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Fragmentos Shamir para recuperação social descentralizada.</p>
                </a>

                <div className="group bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] border border-transparent">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[var(--color-bg)] rounded-full text-red-400"><Key className="w-5 h-5" /></div>
                    </div>
                    <h3 className="text-lg font-medium">Exportar Chave</h3>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Exportar a sua chave Ed25519 armazenada neste navegador.</p>
                </div>

            </div>

        </motion.div>
    )
}
