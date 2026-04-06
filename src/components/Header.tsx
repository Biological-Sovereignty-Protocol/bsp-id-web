"use client";

import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "@/lib/i18n/config";

export function Header() {
    const { theme, setTheme } = useTheme();
    const { i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true) }, []);
    if (!mounted) return null;

    const isDark = theme === "dark";

    return (
        <header style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
            background: isDark ? 'rgba(2,13,34,0.85)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
        }}>
            <div style={{
                maxWidth: '1400px', margin: '0 auto',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                height: '64px', padding: '0 24px'
            }}>
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                        src={isDark ? "/bsp-logo-light.png" : "/bsp-logo-dark.png"}
                        alt="Biological Sovereignty Protocol"
                        width={200} height={48}
                        style={{ height: '48px', width: 'auto' }} priority />
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Language Selector — globe + select + chevron (identical to BSP website) */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        background: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                        borderRadius: '8px', padding: '5px 10px',
                        transition: 'border-color 0.2s', cursor: 'pointer'
                    }}>
                        {/* Globe icon */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#94a3b8' : '#64748b'}
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                            <path d="M2 12h20" />
                        </svg>
                        <select
                            value={i18n.language.substring(0, 2)}
                            onChange={e => i18n.changeLanguage(e.target.value)}
                            style={{
                                appearance: 'none', background: 'transparent', border: 'none',
                                color: isDark ? '#94a3b8' : '#64748b',
                                fontSize: '13px', fontWeight: 500, fontFamily: 'inherit',
                                cursor: 'pointer', outline: 'none', width: '30px'
                            }}>
                            <option value="en">EN</option>
                            <option value="pt">PT</option>
                            <option value="es">ES</option>
                        </select>
                        {/* Chevron */}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#94a3b8' : '#64748b'}
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, pointerEvents: 'none' }}>
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>

                    {/* Theme Toggle — VitePress-style toggle switch */}
                    <button
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                        aria-label="Toggle Theme"
                        style={{
                            position: 'relative', display: 'flex', alignItems: 'center',
                            width: '40px', height: '22px',
                            borderRadius: '11px', border: 'none', cursor: 'pointer',
                            background: isDark ? '#3b82f6' : '#cbd5e1',
                            transition: 'background 0.3s', padding: 0
                        }}>
                        {/* Knob */}
                        <span style={{
                            position: 'absolute',
                            top: '2px',
                            left: isDark ? '20px' : '2px',
                            width: '18px', height: '18px',
                            borderRadius: '50%',
                            background: '#fff',
                            transition: 'left 0.3s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }}>
                            {isDark ? (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            ) : (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </svg>
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}
