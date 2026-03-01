"use client"

import { useState } from "react"
import { ShieldCheck, ArrowRight, RefreshCw, KeyRound } from "lucide-react"
import { recoverBSPKeyPair } from "@/lib/crypto/keys"
import { storeIdentity } from "@/lib/crypto/storage"
import { useTranslation } from "react-i18next"

export default function RecoverPage() {
    const { t } = useTranslation();
    const [method, setMethod] = useState<'seed' | 'guardians'>('seed')
    const [domain, setDomain] = useState("")
    const [seedInput, setSeedInput] = useState("")
    const [isRecovering, setIsRecovering] = useState(false)

    const handleSeedRecovery = async () => {
        setIsRecovering(true)
        try {
            if (!domain) throw new Error(t('errors.missing_domain', 'Informe seu domínio BEO'))

            const words = seedInput.trim().split(/\s+/)
            if (words.length !== 24) throw new Error(t('errors.invalid_seed', 'A Seed Phrase deve conter exatamente 24 palavras.'))

            // Regenerates the Exact same Ed25519 keypair from the determinist seed
            const keyPair = await recoverBSPKeyPair(words)

            // Simulates fetching BEO to confirm public key matches (not strictly implemented in this stub)
            await storeIdentity(`${domain}.bsp`, keyPair.privateKeyHex, keyPair.publicKeyHex)

            alert(t('recover.success'))
            window.location.href = '/dashboard'

        } catch (e: any) {
            alert(e.message || t('recover.error', 'Erro na recuperação'))
        }
        setIsRecovering(false)
    }

    return (
        <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="space-y-2">
                <h1 className="text-3xl text-[var(--color-primary)] flex items-center gap-3 font-bold">
                    <RefreshCw className="w-8 h-8" /> {t('recover.title')}
                </h1>
                <p className="text-[var(--color-text-muted)]">{t('recover.subtitle')}</p>
            </div>

            <div className="flex bg-[var(--color-surface)] rounded-[var(--radius-card)] p-1 text-sm border border-[var(--color-surface)] shadow-sm">
                <button
                    onClick={() => setMethod('seed')}
                    className={`flex-1 py-3 rounded-lg text-center transition-colors ${method === 'seed' ? 'bg-[var(--color-bg)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
                >
                    {t('recover.tab_seed')}
                </button>
                <button
                    onClick={() => setMethod('guardians')}
                    className={`flex-1 py-3 rounded-lg text-center transition-colors ${method === 'guardians' ? 'bg-[var(--color-bg)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
                >
                    {t('recover.tab_guardians')}
                </button>
            </div>

            {method === 'seed' ? (
                <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] space-y-6 shadow-sm">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">{t('recover.label_domain')}</label>
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                placeholder={t('create.placeholder_domain')}
                                className="w-full bg-[var(--color-bg)] border border-[var(--color-surface)] rounded-lg p-3 outline-none focus:border-[var(--color-primary)] transition-colors text-sm text-[var(--color-text)]"
                            />
                            <span className="absolute right-3 text-sm text-[var(--color-text-muted)]">{t('create.domain_suffix')}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">{t('recover.label_seed')}</label>
                        <textarea
                            rows={4}
                            value={seedInput}
                            onChange={(e) => setSeedInput(e.target.value.toLowerCase())}
                            placeholder="word1 word2 word3..."
                            className="w-full font-mono bg-[var(--color-bg)] border border-[var(--color-surface)] rounded-lg p-4 outline-none focus:border-[var(--color-primary)] transition-colors text-sm resize-none text-[var(--color-text)]"
                        />
                    </div>
                    <button
                        onClick={handleSeedRecovery}
                        disabled={isRecovering || !seedInput || !domain}
                        className="w-full flex items-center justify-center gap-2 bg-[var(--color-text)] text-[var(--color-bg)] py-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all focus:outline-none"
                    >
                        {isRecovering ? t('recover.recovering') : t('recover.btn_restore')}
                    </button>
                </div>
            ) : (
                <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] space-y-6 text-center py-12 border border-orange-500/20 shadow-sm">
                    <ShieldCheck className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-xl text-[var(--color-text)] font-semibold">{t('recover.social_title')}</h3>
                    <p className="text-[var(--color-text-muted)] text-sm leading-relaxed max-w-sm mx-auto">
                        {t('recover.social_desc')}
                    </p>
                    <button className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 bg-transparent border border-orange-500/50 text-orange-500 py-3 rounded-lg font-medium hover:bg-orange-500/10 transition-all mt-4">
                        {t('recover.btn_social')}
                    </button>
                </div>
            )}

        </div>
    )
}
