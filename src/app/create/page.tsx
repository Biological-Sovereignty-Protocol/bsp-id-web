"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { generateBSPKeyPair, BSPKeyPair } from "@/lib/crypto/keys"
import { storeIdentity } from "@/lib/crypto/storage"
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldAlert, Plus } from "lucide-react";
import { useTranslation, Trans } from "react-i18next"

type Step = 'domain' | 'key' | 'guardian' | 'register' | 'success'

const steps: Step[] = ['domain', 'key', 'guardian', 'register']

export default function CreateBEOFlow() {
    const { t } = useTranslation();
    const [step, setStep] = useState<Step>('domain')
    const [domain, setDomain] = useState('')
    const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null)

    const [keyPair, setKeyPair] = useState<BSPKeyPair | null>(null)
    const [isRegistering, setIsRegistering] = useState(false)

    const checkDomain = async (name: string) => {
        setDomain(name)
        if (name.length > 2) {
            setTimeout(() => setDomainAvailable(name !== 'ambrosio'), 500)
        } else {
            setDomainAvailable(null)
        }
    }

    const handleGenerateKey = async () => {
        const pair = await generateBSPKeyPair()
        setKeyPair(pair)
        setStep('key')
    }

    const handleRegister = async () => {
        if (!keyPair || !domain) return

        setIsRegistering(true)
        setStep('register')

        try {
            const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

            if (isDemo) {
                // Demo mode: simulate registration
                await new Promise(r => setTimeout(r, 2000))
                await storeIdentity(`${domain}.bsp`, keyPair.privateKeyHex, keyPair.publicKeyHex)
                setStep('success')
            } else {
                // Production: call relay API
                const { CryptoUtils } = await import('@biological-sovereignty-protocol/sdk')
                const nonce = CryptoUtils.generateNonce()
                const timestamp = new Date().toISOString()
                const payloadToSign = { function: 'createBEO', domain: `${domain}.bsp`, publicKey: keyPair.publicKeyHex, recovery: null, nonce, timestamp }
                const signature = (await import('@/lib/crypto/keys')).signBSPTransaction(payloadToSign, keyPair.privateKeyHex)

                const { apiPost } = await import('@/lib/api')
                await apiPost('/api/relayer/beo', {
                    domain: `${domain}.bsp`,
                    publicKey: keyPair.publicKeyHex,
                    recovery: null,
                    signature,
                    nonce,
                    timestamp,
                })

                await storeIdentity(`${domain}.bsp`, keyPair.privateKeyHex, keyPair.publicKeyHex)
                setStep('success')
            }
        } catch (e) {
            alert(t('errors.relay_failed', 'Error connecting to the BSP registry. Please check your internet connection and try again.'))
            setStep('guardian')
            setIsRegistering(false)
        }
    }

    const currentStepIndex = steps.indexOf(step)

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
                        <Plus style={{ width: 28, height: 28, color: '#fff' }} />
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, textAlign: 'center' }}>{t('split.create_title')}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: '0.5rem', textAlign: 'center', maxWidth: '320px' }}>{t('split.create_subtitle')}</p>
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

                    {/* Step indicators */}
                    {step !== 'success' && step !== 'register' && (
                        <div className="flex items-center justify-center gap-3 mb-10">
                            {['1', '2', '3'].map((num, i) => (
                                <div key={num} className="flex items-center gap-3">
                                    <div
                                        className="flex items-center justify-center text-sm font-semibold transition-all"
                                        style={{
                                            width: 36, height: 36, borderRadius: '50%',
                                            background: i <= currentStepIndex ? 'var(--color-primary)' : 'var(--color-surface)',
                                            color: i <= currentStepIndex ? '#fff' : 'var(--color-text-muted)',
                                            border: i <= currentStepIndex ? 'none' : '2px solid var(--color-border)',
                                        }}
                                    >
                                        {i < currentStepIndex ? <CheckCircle2 className="w-4 h-4" /> : num}
                                    </div>
                                    {i < 2 && (
                                        <div style={{
                                            width: 40, height: 2,
                                            background: i < currentStepIndex ? 'var(--color-primary)' : 'var(--color-border)',
                                            borderRadius: 1,
                                        }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <AnimatePresence mode="wait">

                        {/* STEP 1: DOMAIN */}
                        {step === 'domain' && (
                            <motion.div key="domain" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary), #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('create.title')}</h1>
                                    <p className="text-[var(--color-text-muted)]">{t('create.subtitle')}</p>
                                </div>

                                <div className="relative flex items-center">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={domain}
                                        onChange={(e) => checkDomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                        placeholder={t('create.placeholder_domain')}
                                        style={{ borderRadius: 12 }}
                                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] px-6 py-4 text-xl outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_var(--color-primary-soft)] transition-all text-[var(--color-text)]"
                                        autoComplete="off"
                                        spellCheck="false"
                                    />
                                    <span className="absolute right-6 text-xl text-[var(--color-text-muted)]">{t('create.domain_suffix')}</span>
                                </div>

                                <div className="h-6 text-sm">
                                    {domainAvailable === true && <span className="text-emerald-500 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {t('create.domain_available')}</span>}
                                    {domainAvailable === false && <span className="text-red-500">{t('create.domain_unavailable')}</span>}
                                </div>

                                <button
                                    onClick={handleGenerateKey}
                                    disabled={!domainAvailable}
                                    className="w-full flex items-center justify-center gap-2 text-white py-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all focus:outline-none"
                                    style={{ borderRadius: 12, background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)' }}
                                >
                                    {t('create.btn_next')} <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 2: KEY & SEED PHRASE */}
                        {step === 'key' && keyPair && (
                            <motion.div key="key" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary), #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('create.key_title')}</h1>
                                    <p className="text-[var(--color-text-muted)]">{t('create.key_desc')}</p>
                                </div>

                                <div className="p-6 grid grid-cols-3 gap-3 font-mono text-sm shadow-sm" style={{ background: 'var(--color-surface)', borderRadius: 16, border: '1px solid var(--color-primary)', borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)' }}>
                                    {keyPair.seedPhrase.map((word, i) => (
                                        <div key={i} className="flex gap-2 text-[var(--color-text-muted)]">
                                            <span className="opacity-50 select-none w-4 text-right">{i + 1}.</span>
                                            <span className="text-[var(--color-text)] select-all">{word}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setStep('guardian')}
                                    className="w-full flex items-center justify-center gap-2 text-white py-4 font-medium hover:opacity-90 transition-all focus:outline-none"
                                    style={{ borderRadius: 12, background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)' }}
                                >
                                    {t('create.key_confirm')}
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 3: GUARDIANS */}
                        {step === 'guardian' && (
                            <motion.div key="guardian" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center mb-4" style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                                        <ShieldAlert className="w-6 h-6" />
                                    </div>
                                    <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary), #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('create.guardian_title')}</h1>
                                    <p className="text-[var(--color-text-muted)] leading-relaxed">
                                        {t('create.guardian_desc')}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-4 pt-4">
                                    <button
                                        onClick={handleRegister}
                                        className="w-full flex items-center justify-center gap-2 border text-[var(--color-text)] py-4 font-medium hover:border-[var(--color-primary)] transition-all focus:outline-none"
                                        style={{ borderRadius: 12, borderColor: 'var(--color-border)' }}
                                    >
                                        {t('create.guardian_skip')}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: REGISTERING / SUCCESS */}
                        {(step === 'register' || step === 'success') && (
                            <motion.div key="register" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center space-y-6 py-12">

                                {step === 'register' ? (
                                    <>
                                        <div className="w-16 h-16 rounded-full animate-spin" style={{ border: '4px solid var(--color-surface)', borderTopColor: 'var(--color-primary)' }}></div>
                                        <div className="space-y-2">
                                            <h2 className="text-2xl text-[var(--color-text)]">{t('create.registering_title')}</h2>
                                            <p className="text-[var(--color-text-muted)]">
                                                <Trans i18nKey="create.registering_desc">
                                                    The Institute is paying the transaction fee.<br />Please wait...
                                                </Trans>
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-10 h-10" />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-3xl text-emerald-500 font-bold">{t('create.success_title')}</h2>
                                            <p className="text-[var(--color-text-muted)]">
                                                <Trans i18nKey="create.success_desc" values={{ domain }}>
                                                    Your BEO <strong>{domain}.bsp</strong> is now permanently yours.
                                                </Trans>
                                            </p>
                                        </div>
                                        <Link href="/dashboard" className="mt-8 px-8 py-3 text-white rounded-full transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)' }}>
                                            {t('create.btn_dashboard')}
                                        </Link>
                                    </>
                                )}

                            </motion.div>
                        )}

                    </AnimatePresence>

                </div>
            </div>
        </div>
    )
}
