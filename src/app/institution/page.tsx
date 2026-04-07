"use client"

import { useEffect, useState } from "react"
import { Building2, ArrowRight, FlaskConical, HeartPulse, Watch, Microscope, BarChart3, FileCheck, Shield, Settings, Clock, CheckCircle2, AlertCircle, ChevronRight, Activity, ShieldCheck, FileText, User, Key } from "lucide-react"
import { useTranslation } from "react-i18next"
import { DashboardHeader } from "@/components/DashboardHeader"
import { getIdentity } from "@/lib/crypto/storage"

const typeIcons: Record<string, React.ReactNode> = {
    LABORATORY: <FlaskConical className="w-5 h-5" />,
    HOSPITAL: <HeartPulse className="w-5 h-5" />,
    WEARABLE: <Watch className="w-5 h-5" />,
    RESEARCH: <Microscope className="w-5 h-5" />,
}

const certificationColors: Record<string, { bg: string; text: string; border: string }> = {
    BASIC: { bg: 'rgba(100,116,139,0.1)', text: '#64748b', border: 'rgba(100,116,139,0.3)' },
    STANDARD: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
    ADVANCED: { bg: 'rgba(16,185,129,0.1)', text: '#10b981', border: 'rgba(16,185,129,0.3)' },
    SOVEREIGN: { bg: 'rgba(168,85,247,0.1)', text: '#a855f7', border: 'rgba(168,85,247,0.3)' },
}

type SidebarTab = 'overview' | 'submissions' | 'consents' | 'certification' | 'settings'

const mockInstitution = {
    domain: 'fleury.bsp',
    name: 'Laboratório Fleury',
    type: 'LABORATORY',
    certification: 'ADVANCED',
    status: 'ACTIVE',
    registeredAt: '2026-03-15',
    stats: {
        biorecords_submitted: 1247,
        active_consents: 89,
        compliance_rate: 0.97,
        last_submission: '2026-04-06 14:30'
    }
}

const mockSubmissions = [
    { id: 's001', beo: 'andre.bsp', category: 'BSP-LA', biomarker: 'Hemoglobin', value: '14.2 g/dL', date: '2026-04-06', status: 'confirmed' },
    { id: 's002', beo: 'maria.bsp', category: 'BSP-GL', biomarker: 'Glucose', value: '95 mg/dL', date: '2026-04-06', status: 'confirmed' },
    { id: 's003', beo: 'joao.bsp', category: 'BSP-HM', biomarker: 'WBC', value: '6.8 K/uL', date: '2026-04-05', status: 'pending' },
    { id: 's004', beo: 'carla.bsp', category: 'BSP-LP', biomarker: 'LDL Cholesterol', value: '112 mg/dL', date: '2026-04-05', status: 'confirmed' },
    { id: 's005', beo: 'pedro.bsp', category: 'BSP-TH', biomarker: 'TSH', value: '2.1 mIU/L', date: '2026-04-04', status: 'confirmed' },
    { id: 's006', beo: 'lucia.bsp', category: 'BSP-VT', biomarker: 'Vitamin D', value: '38 ng/mL', date: '2026-04-04', status: 'pending' },
]

const mockConsents = [
    { beo: 'andre.bsp', categories: ['BSP-LA', 'BSP-GL', 'BSP-HM'], grantedAt: '2026-03-20', expires: '2027-03-20', status: 'active' },
    { beo: 'maria.bsp', categories: ['BSP-GL', 'BSP-LP'], grantedAt: '2026-03-22', expires: '2027-03-22', status: 'active' },
    { beo: 'joao.bsp', categories: ['BSP-HM'], grantedAt: '2026-04-01', expires: '2027-04-01', status: 'active' },
    { beo: 'carla.bsp', categories: ['BSP-LP', 'BSP-TH'], grantedAt: '2026-03-18', expires: '2026-06-18', status: 'active' },
    { beo: 'pedro.bsp', categories: ['BSP-TH', 'BSP-VT'], grantedAt: '2026-02-10', expires: '2026-08-10', status: 'active' },
]

const authorizedCategories = ['BSP-LA', 'BSP-GL', 'BSP-HM', 'BSP-LP', 'BSP-TH', 'BSP-VT', 'BSP-RN', 'BSP-IM']

function timeAgo(dateStr: string): string {
    const now = new Date('2026-04-06T16:30:00')
    const then = new Date(dateStr.replace(' ', 'T'))
    const diffMs = now.getTime() - then.getTime()
    const diffH = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffH < 1) return `${Math.floor(diffMs / (1000 * 60))}m ago`
    if (diffH < 24) return `${diffH}h ago`
    const diffD = Math.floor(diffH / 24)
    return `${diffD}d ago`
}

export default function InstitutionPage() {
    const { t } = useTranslation()
    const [isRegistered, setIsRegistered] = useState(true) // demo mode
    const [activeTab, setActiveTab] = useState<SidebarTab>('overview')
    const [institution, setInstitution] = useState(mockInstitution)

    // Onboarding state
    const [ieoType, setIeoType] = useState('LABORATORY')
    const [domain, setDomain] = useState('')
    const [name, setName] = useState('')

    // Load real IEO data from API when not in demo mode
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') return
        const registryUrl = process.env.NEXT_PUBLIC_BSP_REGISTRY_URL || ''
        if (!registryUrl) return

        async function loadIEO() {
            try {
                const id = await getIdentity()
                if (!id || !(id as any).ieoDomain) return
                const res = await fetch(`${registryUrl}/api/ieos/domain/${encodeURIComponent((id as any).ieoDomain)}`)
                if (!res.ok) return
                const data = await res.json()
                if (data.ieo) {
                    setInstitution({
                        domain: data.ieo.domain,
                        name: data.ieo.display_name,
                        type: data.ieo.ieo_type,
                        certification: data.ieo.certification?.level || 'UNCERTIFIED',
                        status: data.ieo.status,
                        registeredAt: data.ieo.created_at?.split('T')[0] || '',
                        stats: mockInstitution.stats,
                    })
                }
            } catch {
                // fallback to mock
            }
        }
        loadIEO()
    }, [])

    const handleRegister = async () => {
        if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
            alert(t('institution.alert_sim', { domain, type: ieoType, name }))
            return
        }
        // Real registration via relay
        const { CryptoUtils } = await import('@bsp/sdk')
        const { generateBSPKeyPair, signBSPTransaction } = await import('@/lib/crypto/keys')
        const kp = await generateBSPKeyPair()
        const nonce = CryptoUtils.generateNonce()
        const timestamp = new Date().toISOString()
        const payload = { function: 'createIEO', domain: domain + '.bsp', ieoType, displayName: name, publicKey: kp.publicKeyHex, nonce, timestamp }
        const signature = signBSPTransaction(payload, kp.privateKeyHex)

        const res = await fetch('/api/relay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                function: 'createIEO',
                contract: 'IEORegistry',
                payload: { domain: domain + '.bsp', ieoType, displayName: name, publicKey: kp.publicKeyHex, _userSignature: signature, _nonce: nonce, _timestamp: timestamp },
                signature,
                publicKey: kp.publicKeyHex,
            }),
        })
        if (!res.ok) { alert('Registration failed'); return }
        alert(`IEO registered! Store your seed securely:\n\n${kp.seedPhrase.join(' ')}`)
        setIsRegistered(true)
    }

    // Hide global header when in dashboard mode (same as BEO dashboard)
    useEffect(() => {
        if (isRegistered) {
            const h = document.querySelector('header');
            if (h) h.style.display = 'none';
        }
        return () => {
            const h = document.querySelector('header');
            if (h) h.style.display = '';
        };
    }, [isRegistered]);

    if (!isRegistered) {
        return (
            <div className="w-full min-h-[calc(100vh-64px)] flex flex-col lg:flex-row">
                {/* LEFT — Visual */}
                <div className="relative lg:w-[45%] lg:flex-none min-h-[30vh] lg:min-h-[calc(100vh-64px)] overflow-hidden order-1">
                    <img src="/hero-image.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,30,80,0.75), rgba(0,50,120,0.5))' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, var(--color-bg) 100%)' }} />
                    <div className="absolute inset-0 lg:hidden" style={{ background: 'linear-gradient(to bottom, transparent 60%, var(--color-bg) 100%)' }} />
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                            <Building2 style={{ width: 28, height: 28, color: '#fff' }} />
                        </div>
                        <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, textAlign: 'center' }}>{t('split.institution_title')}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: '0.5rem', textAlign: 'center', maxWidth: '320px' }}>{t('split.institution_subtitle')}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-center z-10">
                        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40">{t('landing.protocol_name')}</p>
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

    // === REGISTERED STATE — IEO DASHBOARD (unified with BEO style) ===

    const domainInitial = institution.name ? institution.name.charAt(0).toUpperCase() : '?'

    const menuItems = [
        { id: 'overview' as SidebarTab, label: t('institution.nav_overview'), icon: Building2 },
        { id: 'submissions' as SidebarTab, label: t('institution.recent_submissions'), icon: Activity },
        { id: 'consents' as SidebarTab, label: t('institution.nav_consents'), icon: FileText },
        { id: 'certification' as SidebarTab, label: t('institution.certification_level'), icon: ShieldCheck },
        { id: 'settings' as SidebarTab, label: t('institution.nav_settings'), icon: Settings },
    ]

    const certColor = certificationColors[institution.certification] || certificationColors.BASIC

    return (
        <div className="w-full">
            {/* Dashboard-specific header (same as BEO) */}
            <DashboardHeader
                domain={institution.domain}
                initial={domainInitial}
                customSearchItems={[
                    { label: t('institution.recent_submissions'), href: '/institution', icon: '📊' },
                    { label: t('institution.consents_received') || 'Consents Received', href: '/institution', icon: '📋' },
                    { label: t('institution.certification_level'), href: '/institution', icon: '🏅' },
                    { label: 'Settings', href: '/institution', icon: '⚙️' },
                    { label: 'Overview', href: '/institution', icon: '🏠' },
                ]}
            />

            <div style={{ display: 'flex', flex: 1 }}>
                {/* SIDEBAR — exact same style as BEO dashboard */}
                <aside style={{
                    width: '260px', flexShrink: 0, background: 'var(--color-surface)',
                    borderRight: '1px solid var(--color-border)', padding: '2rem 0',
                    display: 'flex', flexDirection: 'column', alignSelf: 'stretch', minHeight: 'calc(100vh - 64px)'
                }} className="hidden lg:flex">
                    {/* Profile */}
                    <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)',
                                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.1rem', fontWeight: 700
                            }}>{domainInitial}</div>
                            <div style={{ minWidth: 0 }}>
                                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{institution.name}</p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{institution.domain}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                padding: '3px 10px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 600,
                                background: 'rgba(16,185,129,0.1)', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                                {institution.status}
                            </span>
                            <span style={{
                                display: 'inline-flex', padding: '3px 10px', borderRadius: '20px',
                                fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                                background: certColor.bg, color: certColor.text
                            }}>
                                {institution.certification}
                            </span>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
                        {menuItems.map(item => {
                            const Icon = item.icon
                            const isActive = activeTab === item.id
                            return (
                                <div key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                                        borderRadius: '10px', cursor: 'pointer', marginBottom: '4px',
                                        background: isActive ? 'var(--color-primary-soft)' : 'transparent',
                                        color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        fontWeight: isActive ? 600 : 400, fontSize: '0.85rem', transition: 'all 0.15s'
                                    }}>
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </div>
                            )
                        })}
                    </nav>

                    {/* Bottom actions */}
                    <div style={{ padding: '0 0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                        <div onClick={() => setIsRegistered(false)} style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                            borderRadius: '10px', cursor: 'pointer', color: 'var(--color-text-muted)',
                            fontSize: '0.85rem', transition: 'all 0.15s'
                        }}>
                            <Key size={18} />
                            <span>{t('institution.switch_to_register')}</span>
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main style={{ flex: 1, padding: '2rem 2.5rem', maxWidth: '900px' }}>
                    {/* Dashboard title */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>{t('institution.dashboard_title')}</h1>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{institution.name} &middot; {institution.domain}</p>
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            {/* Stats cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard
                                    label={t('institution.stats_submitted')}
                                    value={institution.stats.biorecords_submitted.toLocaleString()}
                                    icon={<FileCheck className="w-5 h-5" />}
                                    color="#3b82f6"
                                />
                                <StatCard
                                    label={t('institution.stats_consents')}
                                    value={institution.stats.active_consents.toString()}
                                    icon={<Shield className="w-5 h-5" />}
                                    color="#10b981"
                                />
                                <StatCard
                                    label={t('institution.stats_compliance')}
                                    value={`${Math.round(institution.stats.compliance_rate * 100)}%`}
                                    icon={<CheckCircle2 className="w-5 h-5" />}
                                    color="#a855f7"
                                />
                                <StatCard
                                    label={t('institution.stats_last_sub')}
                                    value={timeAgo(institution.stats.last_submission)}
                                    icon={<Clock className="w-5 h-5" />}
                                    color="#f59e0b"
                                />
                            </div>

                            {/* Recent submissions */}
                            <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                    <h2 className="text-base font-semibold">{t('institution.recent_submissions')}</h2>
                                    <button onClick={() => setActiveTab('submissions')} className="text-xs font-medium text-[var(--color-primary)] flex items-center gap-1 cursor-pointer hover:opacity-80">
                                        {t('institution.view_all')} <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <SubmissionsTable submissions={mockSubmissions.slice(0, 3)} t={t} />
                                </div>
                            </div>

                            {/* Quick info row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-2xl border p-5" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                    <h3 className="text-sm font-semibold mb-3">{t('institution.certification_level')}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-bold" style={{ color: certColor.text }}>{institution.certification}</span>
                                        <span className="text-xs text-[var(--color-text-muted)]">{t('institution.registered_since')} {institution.registeredAt}</span>
                                    </div>
                                </div>
                                <div className="rounded-2xl border p-5" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                    <h3 className="text-sm font-semibold mb-3">{t('institution.authorized_categories')}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {authorizedCategories.map(cat => (
                                            <span key={cat} className="text-xs font-mono px-2 py-1 rounded-md" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submissions Tab */}
                    {activeTab === 'submissions' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                <div className="p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                    <h2 className="text-base font-semibold">{t('institution.nav_submissions')}</h2>
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{t('institution.submissions_desc')}</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <SubmissionsTable submissions={mockSubmissions} t={t} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Consents Tab */}
                    {activeTab === 'consents' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                <div className="p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                    <h2 className="text-base font-semibold">{t('institution.nav_consents')}</h2>
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{t('institution.consents_desc')}</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider" style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                <th className="px-5 py-3">BEO</th>
                                                <th className="px-5 py-3">{t('institution.col_categories')}</th>
                                                <th className="px-5 py-3">{t('institution.col_granted')}</th>
                                                <th className="px-5 py-3">{t('institution.col_expires')}</th>
                                                <th className="px-5 py-3">{t('institution.col_status')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mockConsents.map((c, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }} className="hover:bg-[var(--color-primary-soft)] transition-colors">
                                                    <td className="px-5 py-3 font-mono text-xs">{c.beo}</td>
                                                    <td className="px-5 py-3">
                                                        <div className="flex flex-wrap gap-1">
                                                            {c.categories.map(cat => (
                                                                <span key={cat} className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>{cat}</span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3 text-xs text-[var(--color-text-muted)]">{c.grantedAt}</td>
                                                    <td className="px-5 py-3 text-xs text-[var(--color-text-muted)]">{c.expires}</td>
                                                    <td className="px-5 py-3">
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                                                            <CheckCircle2 className="w-3 h-3" /> {c.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Certification Tab */}
                    {activeTab === 'certification' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="rounded-2xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                <h2 className="text-base font-semibold mb-4">{t('institution.certification_level')}</h2>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl" style={{ background: certColor.bg }}>
                                        <Shield className="w-8 h-8" style={{ color: certColor.text }} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold" style={{ color: certColor.text }}>{institution.certification}</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">{t('institution.registered_since')} {institution.registeredAt}</p>
                                    </div>
                                </div>

                                {/* Certification levels */}
                                <div className="space-y-3">
                                    {['BASIC', 'STANDARD', 'ADVANCED', 'SOVEREIGN'].map((level) => {
                                        const lc = certificationColors[level]
                                        const isActive = level === institution.certification
                                        const isPast = ['BASIC', 'STANDARD', 'ADVANCED', 'SOVEREIGN'].indexOf(level) <= ['BASIC', 'STANDARD', 'ADVANCED', 'SOVEREIGN'].indexOf(institution.certification)
                                        return (
                                            <div key={level} className="flex items-center gap-3 p-3 rounded-xl transition-all" style={{
                                                border: `1px solid ${isActive ? lc.border : 'var(--color-border)'}`,
                                                background: isActive ? lc.bg : 'transparent',
                                                opacity: isPast ? 1 : 0.4,
                                            }}>
                                                {isPast ? <CheckCircle2 className="w-4 h-4" style={{ color: lc.text }} /> : <AlertCircle className="w-4 h-4 text-[var(--color-text-muted)]" />}
                                                <span className="text-sm font-medium" style={{ color: isPast ? lc.text : 'var(--color-text-muted)' }}>{level}</span>
                                                {isActive && <span className="ml-auto text-[10px] font-bold uppercase tracking-wider" style={{ color: lc.text }}>{t('institution.current_level')}</span>}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="rounded-2xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                <h2 className="text-base font-semibold mb-4">{t('institution.authorized_categories')}</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {authorizedCategories.map(cat => (
                                        <div key={cat} className="flex items-center gap-2 p-3 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span className="text-xs font-mono font-medium">{cat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="rounded-2xl border p-6" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                <h2 className="text-base font-semibold mb-4">{t('institution.nav_settings')}</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{t('institution.label_name')}</label>
                                        <p className="text-sm font-medium mt-1">{institution.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{t('institution.label_domain')}</label>
                                        <p className="text-sm font-mono mt-1">{institution.domain}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{t('institution.setting_type')}</label>
                                        <p className="text-sm font-medium mt-1">{institution.type}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{t('institution.col_status')}</label>
                                        <p className="text-sm font-medium mt-1">
                                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {institution.status}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Data Sovereignty */}
                            <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--color-surface)', border: '1px solid rgba(244,63,94,0.15)' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f43f5e', marginBottom: '1rem' }}>{t('institution.sovereignty_title') || 'Data Sovereignty'}</h3>

                                {/* Lock/Unlock */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>{t('institution.lock_title') || 'Lock Institution'}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{t('institution.lock_desc') || 'Temporarily freeze all operations. No data can be submitted or read.'}</p>
                                    </div>
                                    <button onClick={() => alert('IEO locked')} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #f59e0b', background: 'transparent', color: '#f59e0b', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                                        {t('institution.lock_btn') || 'Lock IEO'}
                                    </button>
                                </div>

                                {/* Rotate Key */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--color-border)' }}>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>{t('institution.rotate_title') || 'Rotate Key'}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{t('institution.rotate_desc') || 'Generate new Ed25519 key pair. Old key becomes invalid.'}</p>
                                    </div>
                                    <button onClick={() => alert('Key rotated')} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--color-primary)', background: 'transparent', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                                        {t('institution.rotate_btn') || 'Rotate'}
                                    </button>
                                </div>

                                {/* Destroy IEO */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem' }}>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>{t('institution.destroy_title') || 'Cryptographic Erasure'}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{t('institution.destroy_desc') || 'Permanently destroy this IEO. All data becomes irrecoverable.'}</p>
                                    </div>
                                    <button onClick={() => { if(confirm('Destroy IEO permanently?')) alert('IEO destroyed') }} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #f43f5e', background: 'transparent', color: '#f43f5e', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                                        {t('institution.destroy_btn') || 'Destroy IEO'}
                                    </button>
                                </div>
                            </div>

                            {/* Institutional Recovery */}
                            <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1rem' }}>{t('institution.recovery_title') || 'Institutional Recovery'}</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{t('institution.recovery_desc') || 'Configure guardians for key recovery. If the institution loses access, 2 of 3 guardians can restore it.'}</p>
                                <button disabled style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.82rem', cursor: 'not-allowed' }}>
                                    {t('institution.setup_recovery') || 'Setup Recovery (Coming Soon)'}
                                </button>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    )
}

// === Sub-components ===

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
    return (
        <div className="rounded-2xl border p-5" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[var(--color-text-muted)]">{label}</span>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: `${color}15`, color }}>
                    {icon}
                </div>
            </div>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    )
}

function SubmissionsTable({ submissions, t }: { submissions: typeof mockSubmissions; t: (key: string) => string }) {
    return (
        <table className="w-full text-sm">
            <thead>
                <tr className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">BEO</th>
                    <th className="px-5 py-3">{t('institution.col_category')}</th>
                    <th className="px-5 py-3">{t('institution.col_biomarker')}</th>
                    <th className="px-5 py-3">{t('institution.col_value')}</th>
                    <th className="px-5 py-3">{t('institution.col_date')}</th>
                    <th className="px-5 py-3">{t('institution.col_status')}</th>
                </tr>
            </thead>
            <tbody>
                {submissions.map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)' }} className="hover:bg-[var(--color-primary-soft)] transition-colors">
                        <td className="px-5 py-3 font-mono text-xs text-[var(--color-text-muted)]">{s.id}</td>
                        <td className="px-5 py-3 font-mono text-xs">{s.beo}</td>
                        <td className="px-5 py-3">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>{s.category}</span>
                        </td>
                        <td className="px-5 py-3 text-xs">{s.biomarker}</td>
                        <td className="px-5 py-3 text-xs font-mono">{s.value}</td>
                        <td className="px-5 py-3 text-xs text-[var(--color-text-muted)]">{s.date}</td>
                        <td className="px-5 py-3">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{
                                background: s.status === 'confirmed' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                color: s.status === 'confirmed' ? '#10b981' : '#f59e0b',
                            }}>
                                {s.status === 'confirmed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                {s.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
