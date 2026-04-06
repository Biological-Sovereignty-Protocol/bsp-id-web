"use client"

import { useState } from "react"
import { Users, AlertCircle, Share2, Shield, ShieldCheck, UserCheck, UserPlus } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function GuardiansPage() {
    const { t } = useTranslation();
    const [step] = useState<'intro'>('intro')

    return (
        <div className="w-full min-h-[calc(100vh-64px)] flex flex-col lg:flex-row">
            {/* LEFT — Visual */}
            <div className="relative lg:w-[45%] lg:flex-none min-h-[30vh] lg:min-h-[calc(100vh-64px)] overflow-hidden order-1">
                <img src="/hero-image.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,30,80,0.75), rgba(0,50,120,0.5))' }} />
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.2 }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', marginBottom: '16px' }}>
                        <ShieldCheck size={32} color="#fff" />
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' }}>{t('split.guardians_title')}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px', fontSize: '0.9rem', textAlign: 'center' }}>{t('split.guardians_subtitle')}</p>
                </div>
                <div className="lg:hidden" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '64px', background: 'linear-gradient(to top, var(--color-bg), transparent)' }} />
            </div>

            {/* RIGHT — Content */}
            <div className="flex-1 order-2 overflow-y-auto" style={{ background: 'var(--color-bg)' }}>
                <div style={{ maxWidth: '520px', margin: '0 auto', padding: '3rem 2rem' }}>
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

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
                                        <p className="text-sm font-medium text-[var(--color-text)]">{t('guardians.guardian_num', { num })}</p>
                                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t('guardians.not_configured')}</p>
                                    </div>
                                    <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
                                        {t('guardians.empty')}
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
                </div>
            </div>
        </div>
    )
}
