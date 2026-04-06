"use client";

import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import "@/lib/i18n/config";

const BSP = "https://biologicalsovereigntyprotocol.com";
const GH = "https://github.com/Biological-Sovereignty-Protocol";

/* ── shared inline-style fragments ── */
const colTitle: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "var(--color-text)",
  marginBottom: "1rem",
};
const ul: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.55rem",
};
const link: React.CSSProperties = {
  color: "var(--color-text-muted)",
  textDecoration: "none",
  fontSize: "0.82rem",
};

export function Footer() {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  const onLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <footer style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border)", width: "100%" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 2rem 0" }}>

        {/* ═══ Row 1: CTA + Learn + Protocol + Developers + Use Cases ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(4, 1fr)", gap: "2.5rem", paddingBottom: "3rem" }}>

          {/* Create BEO CTA */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.5rem" }}>{t('footer.cta_title')}</h4>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", lineHeight: 1.55, marginBottom: "1.2rem", maxWidth: 220 }}>{t('footer.cta_subtitle')}</p>
            <a href="/create" style={{ display: "inline-flex", alignItems: "center", padding: "0.6rem 1.2rem", borderRadius: 10, background: "var(--color-primary)", color: "#fff", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", width: "fit-content" }}>
              {t('footer.cta_button')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 6 }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>

          {/* Learn */}
          <div>
            <h4 style={colTitle}>{t('footer.learn')}</h4>
            <ul style={ul}>
              <li><a href={`${BSP}/what-is-bsp`} target="_blank" rel="noopener" style={link}>{t('footer.what_is_bsp')}</a></li>
              <li><a href={`${BSP}/learn`} target="_blank" rel="noopener" style={link}>{t('footer.learn_hub')}</a></li>
              <li><a href={`${BSP}/whitepaper`} target="_blank" rel="noopener" style={link}>{t('footer.whitepaper')}</a></li>
              <li><a href={`${BSP}/compare`} target="_blank" rel="noopener" style={link}>{t('footer.bsp_vs')}</a></li>
              <li><a href={`${BSP}/glossary`} target="_blank" rel="noopener" style={link}>{t('footer.glossary')}</a></li>
              <li><a href={`${BSP}/getting-started/faq`} target="_blank" rel="noopener" style={link}>{t('footer.faq')}</a></li>
              <li><a href={`${BSP}/getting-started/intro`} target="_blank" rel="noopener" style={link}>{t('footer.protocol_intro')}</a></li>
            </ul>
          </div>

          {/* Protocol */}
          <div>
            <h4 style={colTitle}>{t('footer.protocol')}</h4>
            <ul style={ul}>
              <li><a href={`${BSP}/specification/overview`} target="_blank" rel="noopener" style={link}>{t('footer.spec_overview')}</a></li>
              <li><a href={`${BSP}/specification/beo`} target="_blank" rel="noopener" style={link}>{t('footer.beo_schema')}</a></li>
              <li><a href={`${BSP}/specification/ieo`} target="_blank" rel="noopener" style={link}>{t('footer.ieo_schema')}</a></li>
              <li><a href={`${BSP}/specification/exchange`} target="_blank" rel="noopener" style={link}>{t('footer.exchange_protocol')}</a></li>
              <li><a href={`${BSP}/specification/biorecord`} target="_blank" rel="noopener" style={link}>{t('footer.biorecord_schema')}</a></li>
              <li><a href={`${BSP}/specification/bsp-domain`} target="_blank" rel="noopener" style={link}>{t('footer.bsp_domain')}</a></li>
              <li><a href={`${BSP}/specification/governance`} target="_blank" rel="noopener" style={link}>{t('footer.governance')}</a></li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h4 style={colTitle}>{t('footer.developers')}</h4>
            <ul style={ul}>
              <li><a href={`${BSP}/getting-started/quickstart`} target="_blank" rel="noopener" style={link}>{t('footer.quickstart')}</a></li>
              <li><a href={`${BSP}/getting-started/user-onboarding`} target="_blank" rel="noopener" style={link}>{t('footer.user_onboarding')}</a></li>
              <li><a href={`${BSP}/developers/sdk-reference`} target="_blank" rel="noopener" style={link}>{t('footer.sdk_reference')}</a></li>
              <li><a href={`${BSP}/developers/tutorials`} target="_blank" rel="noopener" style={link}>{t('footer.tutorials')}</a></li>
              <li><a href={`${BSP}/developers/implementation-guide`} target="_blank" rel="noopener" style={link}>{t('footer.impl_guide')}</a></li>
              <li><a href={`${BSP}/developers/examples`} target="_blank" rel="noopener" style={link}>{t('footer.json_examples')}</a></li>
              <li><a href={`${BSP}/developers/payloads`} target="_blank" rel="noopener" style={link}>{t('footer.payload_ref')}</a></li>
              <li><a href={`${BSP}/integrations`} target="_blank" rel="noopener" style={link}>{t('footer.integrations')}</a></li>
              <li><a href={`${BSP}/developers/certification`} target="_blank" rel="noopener" style={link}>{t('footer.certification')}</a></li>
            </ul>
          </div>

          {/* Use Cases */}
          <div>
            <h4 style={colTitle}>{t('footer.use_cases')}</h4>
            <ul style={ul}>
              <li><a href={`${BSP}/use-cases/health-data-ownership`} target="_blank" rel="noopener" style={link}>{t('footer.personal_health')}</a></li>
              <li><a href={`${BSP}/use-cases/decentralized-health-records`} target="_blank" rel="noopener" style={link}>{t('footer.decentralized_records')}</a></li>
              <li><a href={`${BSP}/use-cases/open-health-data-standard`} target="_blank" rel="noopener" style={link}>{t('footer.open_standard_health')}</a></li>
              <li><a href={`${BSP}/use-cases/longevity-ai-data`} target="_blank" rel="noopener" style={link}>{t('footer.longevity_ai')}</a></li>
              <li><a href={`${BSP}/use-cases/`} target="_blank" rel="noopener" style={link}>{t('footer.bio_sovereignty')}</a></li>
            </ul>
          </div>
        </div>

        {/* ═══ Row 2: Brand + Community + Ecosystem + Resources + Legal ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(4, 1fr)", gap: "2.5rem", paddingBottom: "2rem", borderTop: "1px solid var(--color-border)", paddingTop: "2.5rem" }}>

          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <img
              src={isDark ? "/bsp-logo-light.png" : "/bsp-logo-dark.png"}
              alt="Biological Sovereignty Protocol"
              style={{ height: 55, width: "auto", maxWidth: 200, objectFit: "contain", marginBottom: "0.75rem" }}
            />
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", lineHeight: 1.55, marginBottom: "1rem", maxWidth: 200 }}>{t('footer.brand_tagline')}</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <a href={GH} target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, color: "var(--color-text-muted)", border: "1px solid var(--color-border)", textDecoration: "none" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 style={colTitle}>{t('footer.community')}</h4>
            <ul style={ul}>
              <li><a href="/create" style={{ ...link, color: "var(--color-primary)", fontWeight: 600 }}>{t('footer.create_beo')}</a></li>
              <li><a href={`${BSP}/community`} target="_blank" rel="noopener" style={link}>{t('footer.community_hub')}</a></li>
              <li><a href={`${GH}/bsp-spec/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener" style={link}>{t('footer.how_to_contribute')}</a></li>
              <li><a href={`${GH}/bsp-spec/discussions`} target="_blank" rel="noopener" style={link}>{t('footer.discussion_forum')}</a></li>
              <li><a href="https://id.biologicalsovereigntyprotocol.com" target="_blank" rel="noopener" style={link}>{t('footer.bsp_id')}</a></li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 style={colTitle}>{t('footer.ecosystem')}</h4>
            <ul style={ul}>
              <li><a href={`${BSP}/architecture`} target="_blank" rel="noopener" style={link}>{t('footer.architecture')}</a></li>
              <li><a href={`${BSP}/architecture/ecosystem-flow`} target="_blank" rel="noopener" style={link}>{t('footer.ecosystem_flow')}</a></li>
              <li><a href={`${BSP}/roadmap`} target="_blank" rel="noopener" style={link}>{t('footer.roadmap')}</a></li>
              <li><a href={`${BSP}/bips/`} target="_blank" rel="noopener" style={link}>{t('footer.bips')}</a></li>
              <li><a href={`${GH}/bsp-spec/releases`} target="_blank" rel="noopener" style={link}>{t('footer.changelog')}</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 style={colTitle}>{t('footer.resources')}</h4>
            <ul style={ul}>
              <li><a href={`${BSP}/specification/taxonomy/level-1-core`} target="_blank" rel="noopener" style={link}>{t('footer.biomarker_taxonomy')}</a></li>
              <li><a href={`${BSP}/specification/taxonomy/level-2-standard`} target="_blank" rel="noopener" style={link}>{t('footer.taxonomy_l2')}</a></li>
              <li><a href={`${BSP}/specification/taxonomy/level-3-extended`} target="_blank" rel="noopener" style={link}>{t('footer.taxonomy_l3')}</a></li>
              <li><a href={`${BSP}/specification/taxonomy/level-4-device`} target="_blank" rel="noopener" style={link}>{t('footer.taxonomy_l4')}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={colTitle}>{t('footer.legal')}</h4>
            <ul style={ul}>
              <li><a href={`${BSP}/legal/privacy`} target="_blank" rel="noopener" style={link}>{t('footer.privacy_policy')}</a></li>
              <li><a href={`${BSP}/legal/terms`} target="_blank" rel="noopener" style={link}>{t('footer.terms_of_use')}</a></li>
              <li><a href={`${GH}/bsp-spec/blob/main/LICENSE`} target="_blank" rel="noopener" style={link}>{t('footer.mit_license')}</a></li>
            </ul>
          </div>
        </div>

        {/* ═══ Bottom bar ═══ */}
        <div style={{ borderTop: "1px solid var(--color-border)", padding: "1.25rem 0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>

          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{t('footer.copyright')}</span>
            <span style={{ color: "var(--color-border)", fontSize: "0.9rem" }}>&middot;</span>
            <span style={{ display: "inline-flex", alignItems: "center", fontSize: "0.72rem", fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "rgba(16,185,129,0.1)", color: "#059669", border: "1px solid rgba(16,185,129,0.25)" }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4 }}><circle cx="12" cy="12" r="10"/></svg>
              {t('footer.open_standard')}
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "rgba(0,118,255,0.08)", color: "var(--color-primary)", border: "1px solid rgba(0,118,255,0.2)" }}>{t('footer.mit_license')}</span>
          </div>

          {/* Right — language selector */}
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 8, pointerEvents: "none" }}>
              <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
            </svg>
            <select
              value={i18n.language?.substring(0, 2) || "en"}
              onChange={onLangChange}
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                background: "transparent",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                padding: "4px 28px 4px 28px",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--color-text-muted)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="en">EN</option>
              <option value="pt">PT</option>
              <option value="es">ES</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: 8, pointerEvents: "none" }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

      </div>
    </footer>
  );
}
