"use client"

import { useState } from "react"
import { Users, AlertCircle, Copy, Share2 } from "lucide-react"

export default function GuardiansPage() {
    const [step] = useState<'intro'>('intro')

    return (
        <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="space-y-2">
                <h1 className="text-3xl text-[var(--color-primary)] flex items-center gap-3">
                    <Users className="w-8 h-8" /> Recuperação Social
                </h1>
                <p className="text-[var(--color-text-muted)]">Fragmentação da sua chave (Shamir) para 3 guardiões confiáveis.</p>
            </div>

            <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] space-y-6">

                <div className="flex gap-4 p-4 bg-orange-500/10 text-orange-400 rounded border border-orange-500/20 text-sm">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <p>
                        1. Você precisará dos telefones ou emails de 3 pessoas de extrema confiança.<br />
                        2. Nem a Ambrósio nem os Guardiões terão sua chave inteira.<br />
                        3. Se você perder sua Seed Phrase, precisará de 2 de 3 guardiões para recuperar seu BEO.
                    </p>
                </div>

                <button
                    className="w-full flex items-center justify-center gap-2 bg-[var(--color-text)] text-black py-4 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all focus:outline-none mt-6"
                >
                    <Share2 className="w-5 h-5" /> Configurar Guardiões Agora
                </button>
            </div>

        </div>
    )
}
