"use client";

import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { Sun, Moon, Languages } from "lucide-react";
import { useEffect, useState } from "react";
import "@/lib/i18n/config";

export function Header() {
    const { theme, setTheme } = useTheme();
    const { i18n, t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <header className="w-full max-w-4xl flex justify-between items-center py-4 px-6 fixed top-0 bg-[var(--color-bg)] z-50">
            <div className="flex items-center gap-2">
                <span className="font-bold text-[var(--color-primary)]">BSP.ID</span>
            </div>

            <div className="flex items-center gap-4">
                {/* Language Selector */}
                <div className="flex items-center gap-2 text-sm">
                    <Languages size={18} className="text-[var(--color-text-muted)]" />
                    <button
                        onClick={() => changeLanguage('en')}
                        className={`hover:text-[var(--color-primary)] ${i18n.language.startsWith('en') ? 'text-[var(--color-primary)]' : ''}`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => changeLanguage('pt')}
                        className={`hover:text-[var(--color-primary)] ${i18n.language.startsWith('pt') ? 'text-[var(--color-primary)]' : ''}`}
                    >
                        PT
                    </button>
                    <button
                        onClick={() => changeLanguage('es')}
                        className={`hover:text-[var(--color-primary)] ${i18n.language.startsWith('es') ? 'text-[var(--color-primary)]' : ''}`}
                    >
                        ES
                    </button>
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-full hover:bg-[var(--color-surface)] transition-colors"
                    aria-label="Toggle Theme"
                >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
}
