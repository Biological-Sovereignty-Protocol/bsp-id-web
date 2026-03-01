"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { generateBSPKeyPair, BSPKeyPair } from "@/lib/crypto/keys"
import { storeIdentity } from "@/lib/crypto/storage"
import { ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react"

type Step = 'domain' | 'key' | 'guardian' | 'register' | 'success'

export default function CreateBEOFlow() {
    const [step, setStep] = useState<Step>('domain')
    const [domain, setDomain] = useState('')
    const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null)

    const [keyPair, setKeyPair] = useState<BSPKeyPair | null>(null)
    const [isRegistering, setIsRegistering] = useState(false)

    // Simulated checks for testnet UI scaffolding
    const checkDomain = async (name: string) => {
        setDomain(name)
        if (name.length > 2) {
            // simulate network request to DomainRegistry
            setTimeout(() => setDomainAvailable(name !== 'ambrosio'), 500)
        } else {
            setDomainAvailable(null)
        }
    }

    const handleGenerateKey = async () => {
        // Generate the Ed25519 identity entirely locally
        const pair = await generateBSPKeyPair()
        setKeyPair(pair)
        setStep('key')
    }

    const handleRegister = async () => {
        if (!keyPair || !domain) return

        setIsRegistering(true)
        setStep('register')

        // 1. Simulates relaying intent to API
        try {
            const payload = {
                domain: `${domain}.bsp`,
                publicKey: keyPair.publicKeyHex,
                recovery: {}
            }

            const res = await fetch('/api/relay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contract: 'BEORegistry',
                    function: 'createBEO',
                    payload,
                    signature: 'dummy_sig', // would use signBSPTransaction here
                    publicKey: keyPair.publicKeyHex
                })
            })

            if (!res.ok) throw new Error('Falha no registro Arweave')

            // 2. Safely store the private key in IndexedDB for the Dashboard
            await storeIdentity(`${domain}.bsp`, keyPair.privateKeyHex, keyPair.publicKeyHex)

            setStep('success')
        } catch (e) {
            alert("Erro ao bater no relayer. Certifique-se de que o Arweave Wallet está configurado.")
            setStep('guardian')
            setIsRegistering(false)
        }
    }

    return (
        <div className="w-full max-w-lg mx-auto min-h-[400px]">
            <AnimatePresence mode="wait">

                {/* STEP 1: DOMAIN */}
                {step === 'domain' && (
                    <motion.div key="domain" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl text-[var(--color-primary)]">Criar meu BEO</h1>
                            <p className="text-[var(--color-text-muted)]">Escolha seu domínio biológico único.</p>
                        </div>

                        <div className="relative flex items-center">
                            <input
                                autoFocus
                                type="text"
                                value={domain}
                                onChange={(e) => checkDomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                placeholder="seunome"
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-surface)] rounded-[var(--radius-card)] px-6 py-4 text-xl outline-none focus:border-[var(--color-primary)] transition-colors"
                                autoComplete="off"
                                spellCheck="false"
                            />
                            <span className="absolute right-6 text-xl text-[var(--color-text-muted)]">.bsp</span>
                        </div>

                        <div className="h-6 text-sm">
                            {domainAvailable === true && <span className="text-emerald-500 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Domínio disponível</span>}
                            {domainAvailable === false && <span className="text-red-500">Já registrado</span>}
                        </div>

                        <button
                            onClick={handleGenerateKey}
                            disabled={!domainAvailable}
                            className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-black py-4 rounded-[var(--radius-card)] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all focus:outline-none"
                        >
                            Continuar <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* STEP 2: KEY & SEED PHRASE */}
                {step === 'key' && keyPair && (
                    <motion.div key="key" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl text-[var(--color-primary)]">Sua Chave de Soberania</h1>
                            <p className="text-[var(--color-text-muted)]">O Instituto Ambrósio não tem cópia dessas 24 palavras. Elas são a única forma de recuperar seu BEO se você perder este dispositivo. Não tire print.</p>
                        </div>

                        <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] grid grid-cols-3 gap-3 font-mono text-sm border border-[var(--color-primary)]/20">
                            {keyPair.seedPhrase.map((word, i) => (
                                <div key={i} className="flex gap-2 text-[var(--color-text-muted)]">
                                    <span className="opacity-50 select-none w-4 text-right">{i + 1}.</span>
                                    <span className="text-[var(--color-text)] select-all">{word}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setStep('guardian')}
                            className="w-full flex items-center justify-center gap-2 bg-[var(--color-text)] text-black py-4 rounded-[var(--radius-card)] font-medium hover:bg-opacity-90 transition-all focus:outline-none"
                        >
                            Eu guardei essas 24 palavras com segurança
                        </button>
                    </motion.div>
                )}

                {/* STEP 3: GUARDIANS */}
                {step === 'guardian' && (
                    <motion.div key="guardian" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        <div className="space-y-2">
                            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-4 text-[var(--color-primary)]">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl text-[var(--color-primary)]">Proteção Adicional</h1>
                            <p className="text-[var(--color-text-muted)] leading-relaxed">
                                Você pode fragmentar sua chave para 3 guardiões confiáveis agora usando Shamir Secret Sharing, ou pular esta etapa e confiar apenas na sua seed phrase.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 pt-4">
                            <button
                                onClick={handleRegister}
                                className="w-full flex items-center justify-center gap-2 border border-[var(--color-surface)] text-[var(--color-text-muted)] py-4 rounded-[var(--radius-card)] font-medium hover:border-[var(--color-primary)]/50 hover:text-[var(--color-text)] transition-all focus:outline-none"
                            >
                                Pular — Configurar Guardiões Depois
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 4: REGISTERING / SUCCESS */}
                {(step === 'register' || step === 'success') && (
                    <motion.div key="register" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center space-y-6 py-12">

                        {step === 'register' ? (
                            <>
                                <div className="w-16 h-16 border-4 border-[var(--color-surface)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl text-[var(--color-text)]">Registrando no Arweave</h2>
                                    <p className="text-[var(--color-text-muted)]">O Instituto está pagando a taxa de transação.<br />Por favor, aguarde...</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl text-emerald-500">Soberania Garantida</h2>
                                    <p className="text-[var(--color-text-muted)]">Seu BEO <strong>{domain}.bsp</strong> é agora permanente de você.</p>
                                </div>
                                <a href="/dashboard" className="mt-8 px-8 py-3 bg-[var(--color-surface)] hover:bg-[var(--color-primary)] hover:text-black rounded-full transition-colors">
                                    Acessar Painel
                                </a>
                            </>
                        )}

                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    )
}
