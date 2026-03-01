import Link from "next/link";
import { ArrowRight, KeyRound } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full max-w-lg mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl tracking-tight text-[var(--color-primary)]">BSP Identity</h1>
        <p className="text-lg text-[var(--color-text-muted)] leading-relaxed">
          Onde a sua soberania biológica começa.<br />Sem contas, sem senhas, sem banco de dados central.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Link
          href="/create"
          className="group relative flex items-center justify-between p-8 rounded-[var(--radius-card)] bg-[var(--color-surface)] hover:bg-[var(--color-surface)]/80 border border-transparent hover:border-[var(--color-primary)]/50 transition-all duration-300"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-display text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">Criar meu BEO</h2>
            <p className="text-[var(--color-text-muted)] text-sm">Registre sua identidade permanente no Arweave.</p>
          </div>
          <ArrowRight className="w-6 h-6 text-[var(--color-primary)] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/dashboard"
          className="group relative flex items-center justify-between p-8 rounded-[var(--radius-card)] bg-transparent border border-[var(--color-surface)] hover:border-[var(--color-primary)]/50 transition-all duration-300"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-display text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">Acessar meu BEO</h2>
            <p className="text-[var(--color-text-muted)] text-sm">Abra seu painel com sua chave de soberania.</p>
          </div>
          <KeyRound className="w-6 h-6 text-[var(--color-primary)] opacity-50 group-hover:opacity-100 transition-all" />
        </Link>
      </div>

      <div className="pt-12 text-center text-sm">
        <Link href="/institution" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors underline underline-offset-4">
          Para Instituições e Laboratórios
        </Link>
      </div>
    </div>
  );
}
