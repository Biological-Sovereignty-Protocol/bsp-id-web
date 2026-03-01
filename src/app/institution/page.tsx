"use client"

import { useState } from "react"
import { Building2, ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function InstitutionPage() {
    const { t } = useTranslation();
    const [ieoType, setIeoType] = useState('LABORATORY')
    const [domain, setDomain] = useState('')
    const [name, setName] = useState('')

    const handleRegister = async () => {
        // Scaffold UI for creating IEO
        alert(t('institution.alert_sim', { domain, type: ieoType, name }))
    }

    return (
        <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="space-y-2">
                <h1 className="text-3xl text-[var(--color-primary)] flex items-center gap-3 font-bold">
                    <Building2 className="w-8 h-8" /> {t('institution.title')}
                </h1>
                <p className="text-[var(--color-text-muted)]">{t('institution.subtitle')}</p>
            </div>

            <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] space-y-6 shadow-sm">

                <div className="space-y-3">
                    <label className="text-sm font-medium text-[var(--color-text-muted)]">{t('institution.label_type')}</label>
                    <select
                        value={ieoType}
                        onChange={(e) => setIeoType(e.target.value)}
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-surface)] rounded-lg p-3 outline-none focus:border-[var(--color-primary)] transition-colors text-sm text-[var(--color-text)]"
                    >
                        <option value="LABORATORY">{t('institution.types.laboratory')}</option>
                        <option value="HOSPITAL">{t('institution.types.hospital')}</option>
                        <option value="WEARABLE">{t('institution.types.wearable')}</option>
                        <option value="RESEARCH">{t('institution.types.research')}</option>
                    </select>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium text-[var(--color-text-muted)]">{t('institution.label_name')}</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('institution.placeholder_name')}
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-surface)] rounded-lg p-3 outline-none focus:border-[var(--color-primary)] transition-colors text-sm text-[var(--color-text)]"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium text-[var(--color-text-muted)]">{t('institution.label_domain')}</label>
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                            placeholder={t('institution.placeholder_domain')}
                            className="w-full bg-[var(--color-bg)] border border-[var(--color-surface)] rounded-lg p-3 outline-none focus:border-[var(--color-primary)] transition-colors text-sm text-[var(--color-text)]"
                        />
                        <span className="absolute right-3 text-sm text-[var(--color-text-muted)]">{t('create.domain_suffix')}</span>
                    </div>
                </div>

                <button
                    onClick={handleRegister}
                    disabled={!domain || !name}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-black py-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all focus:outline-none mt-6"
                >
                    {t('institution.btn_register')} <ArrowRight className="w-5 h-5" />
                </button>
            </div>

        </div>
    )
}
