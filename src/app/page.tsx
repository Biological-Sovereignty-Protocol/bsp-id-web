"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, KeyRound, Plus, Shield, Lock, Dna, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="w-full min-h-[calc(100vh-72px)] flex flex-col lg:flex-row">

      {/* LEFT — Visual Panel with hero image */}
      <div className="relative lg:w-[50%] lg:flex-none min-h-[40vh] lg:min-h-[calc(100vh-64px)] overflow-hidden order-1">

        {/* Hero background image */}
        <Image src="/hero-image.jpg" alt="BSP Identity" fill className="object-cover" priority />

        {/* Gradient overlays */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,30,80,0.7) 0%, rgba(0,50,120,0.5) 50%, rgba(0,80,180,0.3) 100%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, transparent 60%, var(--color-bg) 100%)' }} />
        <div className="absolute inset-0 lg:hidden"
          style={{ background: 'linear-gradient(to bottom, transparent 60%, var(--color-bg) 100%)' }} />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />


        {/* Bottom tagline */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center z-10">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40">
            Biological Sovereignty Protocol
          </p>
          <p className="text-sm mt-1.5 text-white/70 font-medium">
            Your biology. Your key. Permanent on Arweave.
          </p>
        </div>
      </div>

      {/* RIGHT — Content Panel */}
      <div className="flex-1 flex flex-col justify-center order-2" style={{ background: 'var(--color-bg)' }}>
        <div className="w-full max-w-[480px] mx-auto px-8 md:px-12 py-16 lg:py-0 space-y-8">

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl tracking-tight font-extrabold leading-[1.1]">
              <span style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #4f46e5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {t('landing.title')}
              </span>
            </h1>
            <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {t('landing.subtitle')} {t('landing.subtitle_2')}
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/create"
              className="group flex items-center justify-between p-5 rounded-2xl text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #4f46e5 100%)', boxShadow: '0 8px 32px rgba(0,118,255,0.25)' }}>
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}><Plus className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-base font-bold">{t('landing.cta_create')}</h2>
                  <p className="text-sm mt-0.5 text-white/60">{t('landing.cta_create_desc')}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link href="/dashboard"
              className="group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(0,118,255,0.4)] hover:bg-[var(--color-primary-soft)]"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl border" style={{ background: 'var(--color-primary-soft)', borderColor: 'rgba(0,118,255,0.12)' }}>
                  <Shield className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <h2 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>{t('landing.cta_access')}</h2>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{t('landing.cta_access_desc')}</p>
                </div>
              </div>
              <KeyRound className="w-5 h-5 opacity-20 group-hover:opacity-80 transition-all" style={{ color: 'var(--color-primary)' }} />
            </Link>
          </div>

          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /><span className="font-medium">Protocol v1.0</span></div>
            <div className="w-px h-3" style={{ background: 'var(--color-border)' }} />
            <div className="flex items-center gap-1"><Dna className="w-3 h-3" /><span className="font-medium">210+ Biomarkers</span></div>
            <div className="w-px h-3" style={{ background: 'var(--color-border)' }} />
            <span className="font-medium">MIT License</span>
          </div>

          <Link href="/institution" className="inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-80"
            style={{ color: 'var(--color-text-muted)' }}>
            <Globe className="w-3.5 h-3.5" /><span>{t('landing.footer_link')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
