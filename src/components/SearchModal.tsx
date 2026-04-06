"use client";

import { Search, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface SearchItem {
    label: string;
    href: string;
    icon: string;
    description?: string;
    disabled?: boolean;
}

interface SearchModalProps {
    open: boolean;
    onClose: () => void;
    isDark: boolean;
    items: SearchItem[];
}

export function SearchModal({ open, onClose, isDark, items }: SearchModalProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [visible, setVisible] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const filtered = query
        ? items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
        : items;

    // Animate in
    useEffect(() => {
        if (open) {
            setVisible(false);
            setQuery("");
            setSelectedIndex(0);
            const t = setTimeout(() => setVisible(true), 10);
            return () => clearTimeout(t);
        }
    }, [open]);

    // Focus input
    useEffect(() => {
        if (open && visible) {
            inputRef.current?.focus();
        }
    }, [open, visible]);

    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Scroll selected item into view
    useEffect(() => {
        if (listRef.current) {
            const items = listRef.current.querySelectorAll<HTMLElement>("[data-search-item]");
            items[selectedIndex]?.scrollIntoView({ block: "nearest" });
        }
    }, [selectedIndex]);

    const handleNavigate = useCallback((item: SearchItem) => {
        if (item.disabled) return;
        onClose();
        router.push(item.href);
    }, [onClose, router]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        const navigable = filtered.filter(i => !i.disabled);
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const item = filtered[selectedIndex];
            if (item && !item.disabled) handleNavigate(item);
        } else if (e.key === "Escape") {
            onClose();
        }
    }, [filtered, selectedIndex, handleNavigate, onClose]);

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed", inset: 0, zIndex: 100,
                    background: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(6px)",
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.15s ease",
                }}
            />

            {/* Modal */}
            <div
                style={{
                    position: "fixed",
                    top: visible ? "18%" : "15%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 101,
                    width: "calc(100% - 32px)",
                    maxWidth: "520px",
                    borderRadius: "var(--radius-card)",
                    overflow: "hidden",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border-strong)",
                    boxShadow: isDark
                        ? "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(79,143,255,0.08)"
                        : "0 24px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,87,255,0.06)",
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.15s ease, top 0.15s ease",
                }}
                onKeyDown={handleKeyDown}
            >
                {/* Input row */}
                <div style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "14px 16px",
                    borderBottom: "1px solid var(--color-border)",
                }}>
                    <Search size={16} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder={t("dashboard_header.search", { defaultValue: "Search pages..." })}
                        style={{
                            flex: 1,
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "var(--color-text)",
                            fontSize: "0.9rem",
                            fontFamily: "inherit",
                        }}
                    />
                    <kbd style={{
                        fontSize: "0.62rem",
                        padding: "2px 6px",
                        borderRadius: "5px",
                        background: "var(--color-surface-2)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-subtle)",
                        whiteSpace: "nowrap",
                        fontFamily: "var(--font-mono)",
                    }}>ESC</kbd>
                </div>

                {/* Results */}
                <div ref={listRef} style={{ maxHeight: "320px", overflowY: "auto" }}>
                    {filtered.length === 0 ? (
                        <div style={{
                            padding: "32px 16px",
                            textAlign: "center",
                            color: "var(--color-text-subtle)",
                            fontSize: "0.85rem",
                        }}>
                            <Search size={20} style={{ opacity: 0.3, marginBottom: "8px" }} />
                            <p style={{ margin: 0 }}>No results for &ldquo;{query}&rdquo;</p>
                        </div>
                    ) : (
                        filtered.map((item, i) => (
                            <button
                                key={i}
                                data-search-item
                                onClick={() => handleNavigate(item)}
                                disabled={item.disabled}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "11px 16px",
                                    background: i === selectedIndex && !item.disabled
                                        ? "var(--color-primary-soft)"
                                        : "transparent",
                                    border: "none",
                                    borderBottom: "1px solid var(--color-border)",
                                    cursor: item.disabled ? "not-allowed" : "pointer",
                                    textAlign: "left",
                                    transition: "background 0.1s",
                                    opacity: item.disabled ? 0.4 : 1,
                                }}
                                onMouseEnter={() => !item.disabled && setSelectedIndex(i)}
                            >
                                <span style={{
                                    width: "32px", height: "32px",
                                    borderRadius: "8px",
                                    background: "var(--color-surface-2)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "1rem", flexShrink: 0,
                                }}>{item.icon}</span>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        margin: 0,
                                        fontSize: "0.85rem",
                                        fontWeight: 500,
                                        color: "var(--color-text)",
                                    }}>{item.label}</p>
                                    {item.description && (
                                        <p style={{
                                            margin: "1px 0 0",
                                            fontSize: "0.72rem",
                                            color: "var(--color-text-subtle)",
                                        }}>{item.description}</p>
                                    )}
                                    {item.disabled && (
                                        <p style={{
                                            margin: "1px 0 0",
                                            fontSize: "0.68rem",
                                            color: "var(--color-text-subtle)",
                                        }}>Coming soon</p>
                                    )}
                                </div>

                                {i === selectedIndex && !item.disabled && (
                                    <ArrowRight size={14} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                                )}
                            </button>
                        ))
                    )}
                </div>

                {/* Footer hint */}
                <div style={{
                    padding: "8px 16px",
                    borderTop: "1px solid var(--color-border)",
                    display: "flex", alignItems: "center", gap: "12px",
                }}>
                    <span style={{ fontSize: "0.68rem", color: "var(--color-text-subtle)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <kbd style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", padding: "1px 4px", borderRadius: "3px", background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>↑↓</kbd>
                        navigate
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "var(--color-text-subtle)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <kbd style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", padding: "1px 4px", borderRadius: "3px", background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>↵</kbd>
                        open
                    </span>
                </div>
            </div>
        </>
    );
}
