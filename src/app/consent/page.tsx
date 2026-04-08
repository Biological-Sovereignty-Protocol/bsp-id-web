"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, Plus, FileText, Activity, User, X, Clock, Tag } from "lucide-react"
import { getIdentity } from "@/lib/crypto/storage"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { DashboardHeader } from "@/components/DashboardHeader"

const intentLabels: Record<string, Record<string, string>> = {
    en: {
        SUBMIT_RECORD: 'Submit exams & data',
        READ_RECORDS: 'Read your records',
        ANALYZE_VITALITY: 'Analyze vitality',
        REQUEST_SCORE: 'Request health score',
        EXPORT_DATA: 'Export data',
        SYNC_PROTOCOL: 'Sync between platforms',
    },
    pt: {
        SUBMIT_RECORD: 'Enviar exames e dados',
        READ_RECORDS: 'Ler seus registros',
        ANALYZE_VITALITY: 'Analisar vitalidade',
        REQUEST_SCORE: 'Solicitar score de saúde',
        EXPORT_DATA: 'Exportar dados',
        SYNC_PROTOCOL: 'Sincronizar entre plataformas',
    },
    es: {
        SUBMIT_RECORD: 'Enviar exámenes y datos',
        READ_RECORDS: 'Leer tus registros',
        ANALYZE_VITALITY: 'Analizar vitalidad',
        REQUEST_SCORE: 'Solicitar score de salud',
        EXPORT_DATA: 'Exportar datos',
        SYNC_PROTOCOL: 'Sincronizar entre plataformas',
    }
}

export default function ConsentPage() {
    const { t, i18n } = useTranslation();
    const [identity, setIdentity] = useState<any>(null)
    const [ieoDomain, setIeoDomain] = useState("")
    const [intents, setIntents] = useState<string[]>(['SUBMIT_RECORD'])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [expiresAt, setExpiresAt] = useState('')
    const [isIssuing, setIsIssuing] = useState(false)
    const [activeConsents, setActiveConsents] = useState([
        { id: 'ct_001', ieo: 'fleury.bsp', intents: ['SUBMIT_RECORD', 'READ_RECORDS'], categories: ['BSP-LA', 'BSP-HM'], expiresAt: '2026-07-01T00:00', status: 'active', grantedAt: '2026-04-06' },
        { id: 'ct_002', ieo: 'dasa.bsp', intents: ['READ_RECORDS'], categories: ['BSP-GL'], expiresAt: '2026-05-15T00:00', status: 'active', grantedAt: '2026-04-01' },
    ])

    const bioCategories = [
        { code: 'BSP-LA', label: 'Laboratory Analysis' },
        { code: 'BSP-GL', label: 'Glucose & Metabolism' },
        { code: 'BSP-HM', label: 'Hematology' },
        { code: 'BSP-CL', label: 'Clinical Chemistry' },
        { code: 'BSP-HR', label: 'Hormones' },
        { code: 'BSP-IM', label: 'Immunology' },
        { code: 'BSP-GN', label: 'Genomics' },
        { code: 'BSP-WR', label: 'Wearable Data' },
        { code: 'BSP-VT', label: 'Vitals' },
    ]

    const lang = i18n.language?.substring(0, 2) || 'en'
    const labels = intentLabels[lang] || intentLabels.en

    useEffect(() => {
        getIdentity().then(id => {
            if (id) setIdentity(id)
            else window.location.href = '/dashboard'
        })
    }, [])

    useEffect(() => {
        if (identity) {
            const h = document.querySelector('header');
            if (h) h.style.display = 'none';
        }
        return () => {
            const h = document.querySelector('header');
            if (h) h.style.display = '';
        };
    }, [identity]);

    const handleIssueConsent = async () => {
        setIsIssuing(true)
        if (!identity) {
            alert(t('consent.error_no_id'))
            setIsIssuing(false)
            return
        }

        try {
            const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

            if (isDemo) {
                await new Promise(r => setTimeout(r, 1500))
                const newConsent = {
                    id: `ct_${String(activeConsents.length + 1).padStart(3, '0')}`,
                    ieo: ieoDomain,
                    intents: [...intents],
                    categories: [...selectedCategories],
                    expiresAt: expiresAt || '',
                    status: 'active' as const,
                    grantedAt: new Date().toISOString().split('T')[0],
                }
                setActiveConsents(prev => [newConsent, ...prev])
                alert(t('consent.success'))
            } else {
                const payload = {
                    beoId: identity.domain,
                    ieoId: ieoDomain,
                    intentTypes: intents,
                    dataCategories: selectedCategories,
                    expiresAt: expiresAt ? new Date(expiresAt).getTime() : Date.now() + 86400000 * 30
                }

                const { CryptoUtils } = await import('@biological-sovereignty-protocol/sdk')
                const { signBSPTransaction } = await import('@/lib/crypto/keys')
                const { apiPost } = await import('@/lib/api')
                const nonce = CryptoUtils.generateNonce()
                const timestamp = new Date().toISOString()
                const scope = { intents, categories: selectedCategories }
                const beoId = identity.beoId || 'pending'
                const payloadToSign = { function: 'grantConsent', beoId, ieoId: ieoDomain, scope, expiresInDays: expiresAt ? Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000) : null, nonce, timestamp }
                const signature = signBSPTransaction(payloadToSign, identity.privateKeyHex)

                await apiPost('/api/relayer/consent', {
                    beoId, ieoId: ieoDomain, scope, expiresInDays: payloadToSign.expiresInDays, signature, nonce, timestamp,
                })

                alert(t('consent.success'))
            }
            setIeoDomain("")
            setSelectedCategories([])
            setExpiresAt('')
        } catch (e) {
            alert(t('consent.error'))
        }
        setIsIssuing(false)
    }

    if (!identity) return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>

    const domainInitial = identity.domain?.charAt(0).toUpperCase() || '?'
    const activeTab = 'consents'

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: User, href: '/dashboard' },
        { id: 'consents', label: t('dashboard.cards.consent_title'), icon: FileText, href: '/consent' },
        { id: 'biorecords', label: t('dashboard.cards.biorecords_title'), icon: Activity, href: '/biorecords' },
        { id: 'guardians', label: t('dashboard.cards.guardians_title'), icon: ShieldCheck, href: '/guardians' },
    ]

    return (
        <div className="w-full">
            <DashboardHeader domain={identity.domain} initial={domainInitial} />
            <div style={{ display: 'flex', flex: 1 }}>
                {/* SIDEBAR */}
                <aside style={{
                    width: '260px', flexShrink: 0, background: 'var(--color-surface)',
                    borderRight: '1px solid var(--color-border)', padding: '2rem 0',
                    display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)'
                }} className="hidden lg:flex">
                    {/* Profile section */}
                    <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700 }}>{domainInitial}</div>
                            <div style={{ minWidth: 0 }}>
                                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{identity.domain}</p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{identity.publicKeyHex?.slice(0, 8)}...{identity.publicKeyHex?.slice(-6)}</p>
                            </div>
                        </div>
                    </div>
                    {/* Nav */}
                    <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
                        {menuItems.map(item => {
                            const Icon = item.icon
                            const isActive = item.id === activeTab
                            const el = (
                                <div key={item.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                                    borderRadius: '10px', cursor: 'pointer', marginBottom: '4px',
                                    background: isActive ? 'var(--color-primary-soft)' : 'transparent',
                                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                    fontWeight: isActive ? 600 : 400, fontSize: '0.85rem'
                                }}>
                                    <Icon size={18} /><span>{item.label}</span>
                                </div>
                            )
                            return item.href ? <Link key={item.id} href={item.href} style={{ textDecoration: 'none' }}>{el}</Link> : el
                        })}
                    </nav>
                </aside>

                {/* MAIN CONTENT */}
                <main style={{ flex: 1, padding: '2rem 2.5rem', maxWidth: '900px' }}>
                    <div className="space-y-8">

                        <div className="space-y-2">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary), #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('consent.title')}</h1>
                            </div>
                            <p className="text-[var(--color-text-muted)]">{t('consent.subtitle')}</p>
                        </div>

                        <div className="p-6 space-y-6" style={{ background: 'var(--color-surface)', borderRadius: 16, border: '1px solid var(--color-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-[var(--color-text-muted)]">{t('consent.label_institution')}</label>
                                <input
                                    type="text"
                                    value={ieoDomain}
                                    onChange={(e) => setIeoDomain(e.target.value.toLowerCase())}
                                    placeholder="ex: fleury.bsp"
                                    className="w-full bg-[var(--color-bg)] outline-none transition-all text-sm text-[var(--color-text)]"
                                    style={{ borderRadius: 12, padding: '14px 16px', border: '1px solid var(--color-border)' }}
                                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-primary-soft)' }}
                                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-[var(--color-text-muted)]">{t('consent.label_intents')}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['SUBMIT_RECORD', 'READ_RECORDS', 'ANALYZE_VITALITY', 'REQUEST_SCORE', 'EXPORT_DATA', 'SYNC_PROTOCOL'].map(intent => {
                                        const isChecked = intents.includes(intent);
                                        return (
                                            <label key={intent} className="flex items-center gap-2 text-sm cursor-pointer transition-all text-[var(--color-text)]"
                                                style={{
                                                    padding: '12px 14px',
                                                    borderRadius: 12,
                                                    background: isChecked ? 'var(--color-primary-soft)' : 'var(--color-bg)',
                                                    border: `1px solid ${isChecked ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setIntents([...intents, intent])
                                                        else setIntents(intents.filter(i => i !== intent))
                                                    }}
                                                    className="accent-[var(--color-primary)] w-4 h-4 cursor-pointer"
                                                />
                                                {labels[intent] || intent}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Categories Multi-Select */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-[var(--color-text-muted)]">{t('consent.label_categories') || 'Authorized Data Categories'}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {bioCategories.map(cat => {
                                        const isChecked = selectedCategories.includes(cat.code);
                                        return (
                                            <label key={cat.code} className="flex items-center gap-2 text-sm cursor-pointer transition-all text-[var(--color-text)]"
                                                style={{
                                                    padding: '12px 14px',
                                                    borderRadius: 12,
                                                    background: isChecked ? 'var(--color-primary-soft)' : 'var(--color-bg)',
                                                    border: `1px solid ${isChecked ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedCategories([...selectedCategories, cat.code])
                                                        else setSelectedCategories(selectedCategories.filter(c => c !== cat.code))
                                                    }}
                                                    className="accent-[var(--color-primary)] w-4 h-4 cursor-pointer"
                                                />
                                                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.6 }}>{cat.code}</span> {cat.label}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Expiration Date Picker */}
                            <div style={{ marginTop: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 500 }}>
                                    {t('consent.label_expires') || 'Consent Expiration'}
                                </label>
                                <input
                                    type="datetime-local"
                                    value={expiresAt}
                                    onChange={e => setExpiresAt(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.85rem', outline: 'none' }}
                                />
                                {!expiresAt && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>{t('consent.no_expiry') || 'No expiration (permanent)'}</p>}
                            </div>

                            <button
                                onClick={handleIssueConsent}
                                disabled={isIssuing || !ieoDomain}
                                className="w-full flex items-center justify-center gap-2 text-white py-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all focus:outline-none mt-6"
                                style={{ borderRadius: 12, background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)' }}
                            >
                                {isIssuing ? t('consent.btn_signing') : <><Plus className="w-5 h-5" /> {t('consent.btn_authorize')}</>}
                            </button>
                        </div>

                        {/* Active Consents List */}
                        {activeConsents.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                                    <Clock size={18} className="text-[var(--color-primary)]" />
                                    {t('consent.label_active_consents') || 'Active Consents'}
                                </h2>
                                <div className="grid gap-3">
                                    {activeConsents.map(consent => {
                                        const isExpired = consent.expiresAt && new Date(consent.expiresAt) < new Date()
                                        const statusLabel = consent.status === 'revoked'
                                            ? (t('consent.status_revoked') || 'Revoked')
                                            : isExpired
                                                ? (t('consent.status_expired') || 'Expired')
                                                : (t('consent.status_active') || 'Active')
                                        const statusColor = consent.status === 'revoked' ? '#ef4444' : isExpired ? '#f59e0b' : '#22c55e'

                                        return (
                                            <div key={consent.id} className="p-4" style={{
                                                background: 'var(--color-surface)', borderRadius: 14,
                                                border: '1px solid var(--color-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                                opacity: consent.status === 'revoked' ? 0.5 : 1,
                                            }}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>{consent.ieo}</span>
                                                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 20, background: `${statusColor}15`, color: statusColor, fontWeight: 600 }}>
                                                            {statusLabel}
                                                        </span>
                                                    </div>
                                                    {consent.status === 'active' && !isExpired && (
                                                        <button
                                                            onClick={() => {
                                                                setActiveConsents(prev => prev.map(c =>
                                                                    c.id === consent.id ? { ...c, status: 'revoked' } : c
                                                                ))
                                                                alert(t('consent.revoked_success') || 'Consent revoked successfully')
                                                            }}
                                                            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg hover:opacity-80 transition-all"
                                                            style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                                                        >
                                                            <X size={14} /> {t('consent.btn_revoke') || 'Revoke'}
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    {consent.intents.map(i => (
                                                        <span key={i} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 8, background: 'var(--color-primary-soft)', color: 'var(--color-primary)', fontWeight: 500 }}>
                                                            {labels[i] || i}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    {consent.categories.map(c => (
                                                        <span key={c} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 8, background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontFamily: 'monospace', border: '1px solid var(--color-border)' }}>
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                                                    <span>Granted: {consent.grantedAt}</span>
                                                    {consent.expiresAt && <span>Expires: {consent.expiresAt.split('T')[0]}</span>}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Custom Intent Management */}
                        <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1rem' }}>{t('consent.manage_intents')}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{t('consent.manage_intents_desc')}</p>

                            {/* Current intents list */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
                                {['SUBMIT_RECORD', 'READ_RECORDS', 'ANALYZE_VITALITY', 'REQUEST_SCORE', 'EXPORT_DATA', 'SYNC_PROTOCOL'].map(intent => (
                                    <span key={intent} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 500,
                                        background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                                        border: '1px solid rgba(0,87,255,0.15)'
                                    }}>
                                        {intentLabels[i18n.language?.substring(0,2) || 'en']?.[intent] || intent}
                                        <button onClick={() => alert(t('consent.intent_removed'))} style={{
                                            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)',
                                            fontSize: '1rem', lineHeight: 1, padding: 0
                                        }}>x</button>
                                    </span>
                                ))}
                            </div>

                            {/* Add new intent */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    placeholder={t('consent.new_intent_placeholder')}
                                    style={{
                                        flex: 1, padding: '10px 14px', borderRadius: '10px',
                                        border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                                        color: 'var(--color-text)', fontSize: '0.82rem', outline: 'none'
                                    }}
                                />
                                <button onClick={() => alert(t('consent.intent_added'))} style={{
                                    padding: '10px 16px', borderRadius: '10px',
                                    background: 'var(--color-primary)', color: '#fff',
                                    border: 'none', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer'
                                }}>{t('consent.add_intent')}</button>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}
