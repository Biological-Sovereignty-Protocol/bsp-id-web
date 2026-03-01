"use client"

import { useState } from "react"
import { Building2, ArrowRight } from "lucide-react"

export default function InstitutionPage() {
    const [ieoType, setIeoType] = useState('LABORATORY')
    const [domain, setDomain] = useState('')
    const [name, setName] = useState('')

    const handleRegister = async () => {
        // Scaffold UI for creating IEO
        alert(`Simulando criação de IEO: ${domain}.bsp\nTipo: ${ieoType}\nNome Legal: ${name}\n\nA Chave Ed25519 Institucional seria baixada em seguida!`)
    }

    return (
        <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="space-y-2">
                <h1 className="text-3xl text-[var(--color-primary)] flex items-center gap-3">
                    <Building2 className="w-8 h-8" /> Registro de Instituição (IEO)
                </h1>
                <p className="text-[var(--color-text-muted)]">Crie uma chave criptográfica institucional para interagir com a rede BSP.</p>
            </div>

            <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] space-y-6">

                <div className="space-y-3">
                    <label className="text-sm font-medium text-[var(--color-text-muted)]">Tipo de Instituição</label>
                    <select
                        value={ieoType}
                        onChange={(e) => setIeoType(e.target.value)}
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-surface)] rounded p-3 outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
                    >
                        <option value="LABORATORY">Laboratório de Análises Clínicas</option>
                        <option value="HOSPITAL">Hospital ou Clínica Médica</option>
                        <option value="WEARABLE">Dispositivo / HealthTech (Wearables)</option>
                        <option value="RESEARCH">Centro de Pesquisa Científica</option>
                    </select>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium text-[var(--color-text-muted)]">Nome Legal (Exibido publicamente)</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Laboratório Fleury S.A"
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-surface)] rounded p-3 outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium text-[var(--color-text-muted)]">Domínio Institucional Desejado</label>
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                            placeholder="fleury"
                            className="w-full bg-[var(--color-bg)] border border-[var(--color-surface)] rounded p-3 outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
                        />
                        <span className="absolute right-3 text-sm text-[var(--color-text-muted)]">.bsp</span>
                    </div>
                </div>

                <button
                    onClick={handleRegister}
                    disabled={!domain || !name}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-black py-4 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all focus:outline-none mt-6"
                >
                    Gerar Chaves e Registrar IEO <ArrowRight className="w-5 h-5" />
                </button>
            </div>

        </div>
    )
}
