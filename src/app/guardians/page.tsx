"use client"

import { useState } from "react"
import { Users, AlertCircle, Share2 } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function GuardiansPage() {
    const { t } = useTranslation();
    const [step] = useState<'intro'>('intro')

    return (
        <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="space-y-2">
                <h1 className="text-3xl text-[var(--color-primary)] flex items-center gap-3 font-bold">
                    <Users className="w-8 h-8" /> {t('guardians.title')}
                </h1>
                <p className="text-[var(--color-text-muted)]">{t('guardians.subtitle')}</p>
            </div>

            <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] space-y-6 shadow-sm">

                <div className="flex gap-4 p-4 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg border border-orange-500/20 text-sm">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <div className="space-y-1">
                        <p>{t('guardians.warning_1')}</p>
                        <p>{t('guardians.warning_2')}</p>
                        <p>{t('guardians.warning_3')}</p>
                    </div>
                </div>

                <button
                    className="w-full flex items-center justify-center gap-2 bg-[var(--color-text)] text-[var(--color-bg)] py-4 rounded-lg font-medium hover:bg-opacity-90 transition-all focus:outline-none mt-6"
                >
                    <Share2 className="w-5 h-5" /> {t('guardians.btn_setup')}
                </button>
            </div>

        </div>
    )
}
