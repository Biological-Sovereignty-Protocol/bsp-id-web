"use client"

import { useState } from "react"
import { Users, AlertCircle, Share2, Shield, UserCheck, UserPlus } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function GuardiansPage() {
    const { t } = useTranslation();
    const [step] = useState<'intro'>('intro')

    return (
        <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

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
                            <p className="text-sm font-medium text-[var(--color-text)]">Guardian {num}</p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Not configured</p>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
                            Empty
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
    )
}
