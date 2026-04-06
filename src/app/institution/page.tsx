"use client"

import { useState } from "react"
import { Building2, ArrowRight, FlaskConical, HeartPulse, Watch, Microscope } from "lucide-react"
import { useTranslation } from "react-i18next"

const typeIcons: Record<string, React.ReactNode> = {
    LABORATORY: <FlaskConical className="w-5 h-5" />,
    HOSPITAL: <HeartPulse className="w-5 h-5" />,
    WEARABLE: <Watch className="w-5 h-5" />,
    RESEARCH: <Microscope className="w-5 h-5" />,
}

export default function InstitutionPage() {
    const { t } = useTranslation();
    const [ieoType, setIeoType] = useState('LABORATORY')
    const [domain, setDomain] = useState('')
    const [name, setName] = useState('')

    const handleRegister = async () => {
        alert(t('institution.alert_sim', { domain, type: ieoType, name }))
    }

    return (
        <div className="w-full min-h-[calc(100vh-64px)] flex flex-col lg:flex-row">

            {/* LEFT — Visual */}
            <div className="relative lg:w-[45%] lg:flex-none min-h-[30vh] lg:min-h-[calc(100vh-64px)] overflow-hidden order-1">
                <img src="/hero-image.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,30,80,0.75), rgba(0,50,120,0.5))' }} />
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to right, transparent 60%, var(--color-bg) 100%)' }} />
                <div className="absolute inset-0 lg:hidden"
                    style={{ background: 'linear-gradient(to bottom, transparent 60%, var(--color-bg) 100%)' }} />
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <Building2 style={{ width: 28, height: 28, color: '#fff' }} />
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, textAlign: 'center' }}>{t('split.institution_title')}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: '0.5rem', textAlign: 'center', maxWidth: '320px' }}>{t('split.institution_subtitle')}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center z-10">
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40">
                        {t('landing.protocol_name')}
                    </p>
                </div>
            </div>

            {/* RIGHT — Content */}
            <div className="flex-1 order-2 overflow-y-auto flex flex-col justify-center" style={{ background: 'var(--color-bg)' }}>
                <div style={{ maxWidth: '520px', margin: '0 auto', padding: '3rem 2rem' }}>

                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        <div className="space-y-2">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary), #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('institution.title')}</h1>
                            </div>
                            <p className="text-[var(--color-text-muted)]">{t('institution.subtitle')}</p>
                        </div>

                        {/* Feature grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {(['LABORATORY', 'HOSPITAL', 'WEARABLE', 'RESEARCH'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setIeoType(type)}
                                    className="flex flex-col items-center gap-2 p-5 text-center transition-all cursor-pointer"
                                    style={{
                                        borderRadius: 16,
                                        background: ieoType === type ? 'var(--color-primary-soft)' : 'var(--color-surface)',
                                        border: `1px solid ${ieoType === type ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                        color: ieoType === type ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        boxShadow: ieoType === type ? '0 4px 12px rgba(0,118,255,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
                                    }}
                                >
                                    {typeIcons[type]}
                                    <span className="text-xs font-medium">{t(`institution.types.${type.toLowerCase()}`)}</span>
                                </button>
                            ))}
                        </div>

                        <div className="p-6 space-y-6" style={{ background: 'var(--color-surface)', borderRadius: 16, border: '1px solid var(--color-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-[var(--color-text-muted)]">{t('institution.label_name')}</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t('institution.placeholder_name')}
                                    className="w-full bg-[var(--color-bg)] outline-none transition-all text-sm text-[var(--color-text)]"
                                    style={{ borderRadius: 12, padding: '14px 16px', border: '1px solid var(--color-border)' }}
                                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-primary-soft)' }}
                                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
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
                                        className="w-full bg-[var(--color-bg)] outline-none transition-all text-sm text-[var(--color-text)]"
                                        style={{ borderRadius: 12, padding: '14px 16px', border: '1px solid var(--color-border)' }}
                                        onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-primary-soft)' }}
                                        onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
                                    />
                                    <span className="absolute right-4 text-sm text-[var(--color-text-muted)]">{t('create.domain_suffix')}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleRegister}
                                disabled={!domain || !name}
                                className="w-full flex items-center justify-center gap-2 text-white py-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all focus:outline-none mt-6"
                                style={{ borderRadius: 12, background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)' }}
                            >
                                {t('institution.btn_register')} <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}
