"use client";

import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { Sun, Moon, Bell, Search, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { clearIdentity } from "@/lib/crypto/storage";
import "@/lib/i18n/config";

interface DashboardHeaderProps {
    domain?: string;
    initial?: string;
}

export function DashboardHeader({ domain, initial }: DashboardHeaderProps) {
    const { theme, setTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifs, setShowNotifs] = useState(false);

    useEffect(() => { setMounted(true) }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setShowSearch(prev => !prev)
            }
            if (e.key === 'Escape') setShowSearch(false)
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, []);
    if (!mounted) return null;

    const isDark = theme === "dark";

    const searchItems = [
        { label: t('dashboard.cards.consent_title'), href: '/consent', icon: '📋' },
        { label: t('dashboard.cards.biorecords_title'), href: '#', icon: '📊' },
        { label: t('dashboard.cards.guardians_title'), href: '/guardians', icon: '🛡️' },
        { label: t('dashboard.cards.export_title'), href: '#', icon: '🔑' },
        { label: t('recover.title'), href: '/recover', icon: '🔄' },
        { label: 'Overview', href: '/dashboard', icon: '🏠' },
    ]

    const filtered = searchQuery
        ? searchItems.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : searchItems

    const notifications = [
        { text: 'BEO created successfully', time: 'Just now', read: false },
        { text: 'Identity verified on Arweave', time: '2 min ago', read: false },
        { text: 'Seed phrase backed up', time: '5 min ago', read: true },
    ]

    const handleLogout = async () => {
        await clearIdentity();
        window.location.href = '/';
    };

    return (
        <>
        <header style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
            height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px',
            background: isDark ? 'rgba(8,11,18,0.9)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
        }}>
            {/* Left — Logo + breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                        src={isDark ? "/bsp-logo-light.png" : "/bsp-logo-dark.png"}
                        alt="BSP" width={220} height={48}
                        style={{ height: '48px', width: 'auto' }} priority />
                </Link>
                {domain && (
                    <>
                        <span style={{ color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)', fontSize: '1.2rem' }}>/</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>{domain}</span>
                    </>
                )}
            </div>

            {/* Right — Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Search */}
                <button onClick={() => setShowSearch(true)} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px',
                    borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer',
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                    color: isDark ? '#64748b' : '#94a3b8'
                }}>
                    <Search size={14} />
                    <span>{t('dashboard_header.search')}</span>
                    <kbd style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>⌘K</kbd>
                </button>

                {/* Notifications */}
                <div style={{ position: 'relative' }}>
                    <button onClick={() => setShowNotifs(!showNotifs)} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', position: 'relative',
                        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                        color: isDark ? '#94a3b8' : '#64748b'
                    }}>
                        <Bell size={14} />
                        {notifications.some(n => !n.read) && <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', border: '2px solid var(--color-bg)' }} />}
                    </button>

                    {showNotifs && (
                        <>
                            <div onClick={() => setShowNotifs(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                            <div style={{
                                position: 'absolute', right: 0, top: '40px', zIndex: 50,
                                width: '300px', borderRadius: '12px', overflow: 'hidden',
                                background: isDark ? '#111520' : '#fff',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                                boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                            }}>
                                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}`, fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text)' }}>
                                    Notifications
                                </div>
                                {notifications.map((n, i) => (
                                    <div key={i} style={{
                                        padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start',
                                        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc'}`,
                                        background: n.read ? 'transparent' : (isDark ? 'rgba(59,130,246,0.04)' : 'rgba(59,130,246,0.02)')
                                    }}>
                                        {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', marginTop: '6px', flexShrink: 0 }} />}
                                        <div>
                                            <p style={{ fontSize: '0.82rem', color: 'var(--color-text)', fontWeight: n.read ? 400 : 500, margin: 0 }}>{n.text}</p>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px', marginBottom: 0 }}>{n.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Language */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                    borderRadius: '8px', padding: '4px 8px'
                }}>
                    <select
                        value={i18n.language.substring(0, 2)}
                        onChange={e => i18n.changeLanguage(e.target.value)}
                        style={{ appearance: 'none', background: 'transparent', border: 'none', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', outline: 'none', width: '26px' }}>
                        <option value="en">EN</option>
                        <option value="pt">PT</option>
                        <option value="es">ES</option>
                    </select>
                </div>

                {/* Theme */}
                <button onClick={() => setTheme(isDark ? "light" : "dark")}
                    style={{
                        position: 'relative', display: 'flex', alignItems: 'center',
                        width: '36px', height: '20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                        background: isDark ? '#3b82f6' : '#cbd5e1', transition: 'background 0.3s', padding: 0
                    }}>
                    <span style={{
                        position: 'absolute', top: '2px', left: isDark ? '18px' : '2px',
                        width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                        transition: 'left 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}>
                        {isDark ? <Moon size={8} strokeWidth={2.5} color="#3b82f6" /> : <Sun size={8} strokeWidth={2.5} color="#f59e0b" />}
                    </span>
                </button>

                {/* Avatar + Dropdown Menu */}
                {initial && (
                    <div style={{ position: 'relative', marginLeft: '4px' }}>
                        <button onClick={() => setShowMenu(!showMenu)} style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)',
                            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 700, border: 'none', cursor: 'pointer'
                        }}>{initial}</button>

                        {showMenu && (
                            <>
                                <div onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                                <div style={{
                                    position: 'absolute', right: 0, top: '40px', zIndex: 50,
                                    width: '200px', borderRadius: '12px', overflow: 'hidden',
                                    background: isDark ? '#111520' : '#fff',
                                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                                }}>
                                    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>{domain}</p>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px', marginBottom: 0 }}>BSP Identity</p>
                                    </div>
                                    <button disabled style={{
                                        width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px',
                                        background: 'transparent', border: 'none',
                                        color: isDark ? '#475569' : '#94a3b8', fontSize: '0.82rem', fontWeight: 500, textAlign: 'left',
                                        cursor: 'not-allowed', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}`
                                    }}>
                                        Settings <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>(coming soon)</span>
                                    </button>
                                    <button onClick={handleLogout} style={{
                                        width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px',
                                        background: 'transparent', border: 'none', cursor: 'pointer',
                                        color: '#f43f5e', fontSize: '0.82rem', fontWeight: 500, textAlign: 'left'
                                    }}>
                                        <LogOut size={14} />
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>

            {showSearch && (
                <>
                    <div onClick={() => setShowSearch(false)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
                    <div style={{
                        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
                        zIndex: 101, width: '100%', maxWidth: '480px',
                        borderRadius: '16px', overflow: 'hidden',
                        background: isDark ? '#111520' : '#fff',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
                            <Search size={16} style={{ color: isDark ? '#64748b' : '#94a3b8', flexShrink: 0 }} />
                            <input
                                autoFocus
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder={t('dashboard_header.search')}
                                style={{
                                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                    color: 'var(--color-text)', fontSize: '0.9rem', fontFamily: 'inherit'
                                }}
                            />
                            <kbd style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, color: isDark ? '#64748b' : '#94a3b8' }}>ESC</kbd>
                        </div>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {filtered.map((item, i) => (
                                <a key={i} href={item.href} onClick={() => setShowSearch(false)} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                                    textDecoration: 'none', color: 'var(--color-text)',
                                    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc'}`,
                                    transition: 'background 0.1s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.label}</span>
                                </a>
                            ))}
                            {filtered.length === 0 && (
                                <p style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>No results</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
