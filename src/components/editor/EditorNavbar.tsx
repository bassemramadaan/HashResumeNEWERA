import React, { useState, useEffect, useRef } from "react";
import ATSScoreWidget from "../ATSScoreWidget";
import type { AppLang } from "../../hooks/useDirection";

// ── i18n ──────────────────────────────────────────────────
const T = {
  ar: {
    saved:       "تم الحفظ",
    saving:      "جاري الحفظ...",
    preview:     "معاينة",
    editOnly:    "إخفاء المعاينة",
    exportPDF:   "تصدير PDF",
    exportWord:  "تصدير Word",
    shareLink:   "نسخ رابط المشاركة",
    export:      "تصدير",
    copied:      "تم النسخ!",
    templates:   "القوالب",
  },
  en: {
    saved:       "Saved",
    saving:      "Saving...",
    preview:     "Preview",
    editOnly:    "Hide Preview",
    exportPDF:   "Export as PDF",
    exportWord:  "Export as Word",
    shareLink:   "Copy share link",
    export:      "Export",
    copied:      "Copied!",
    templates:   "Templates",
  },
  fr: {
    saved:       "Enregistré",
    saving:      "Enregistrement...",
    preview:     "Aperçu",
    editOnly:    "Masquer l'aperçu",
    exportPDF:   "Exporter en PDF",
    exportWord:  "Exporter en Word",
    shareLink:   "Copier le lien",
    export:      "Exporter",
    copied:      "Copié !",
    templates:   "Modèles",
  },
} as const;

const LANGS = [
  { code: "ar", label: "AR", flag: "🇸🇦" },
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
];

// ── small sub-components ──────────────────────────────────

function NavBtn({ onClick, children, title, active = false, style = {} }: any) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:        "flex",
        alignItems:     "center",
        gap:            5,
        padding:        "5px 10px",
        borderRadius:   7,
        border:         "none",
        background:     hovered || active ? "rgba(0,0,0,0.06)" : "transparent",
        cursor:         "pointer",
        fontSize:       13,
        fontWeight:     500,
        color:          "#444",
        transition:     "background .15s",
        whiteSpace:     "nowrap",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 22, background: "#E5E3DC", flexShrink: 0 }} />;
}

// ── SaveIndicator ─────────────────────────────────────────
function SaveIndicator({ isSaved, lang }: { isSaved: boolean; lang: AppLang }) {
  const t = T[lang] ?? T.en;
  return (
    <div style={{
      display:    "flex",
      alignItems: "center",
      gap:        4,
      fontSize:   12,
      color:      isSaved ? "#22c55e" : "#999",
      transition: "color .3s",
      whiteSpace: "nowrap",
    }}>
      {isSaved
        ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
      }
      {isSaved ? t.saved : t.saving}
    </div>
  );
}

// ── LangSwitcher ──────────────────────────────────────────
function LangSwitcher({ lang, onChange }: { lang: AppLang, onChange: (lang: AppLang) => void }) {
  const [open, setOpen]   = useState(false);
  const ref               = useRef<HTMLDivElement>(null);
  const current           = LANGS.find(l => l.code === lang) ?? LANGS[1];

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <NavBtn onClick={() => setOpen((o: boolean) => !o)} active={open}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        {current.label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </NavBtn>

      {open && (
        <div style={{
          position:     "absolute",
          top:          "calc(100% + 6px)",
          left:         0,
          background:   "#fff",
          border:       "1px solid #EBEBEB",
          borderRadius: 12,
          boxShadow:    "0 4px 20px rgba(0,0,0,0.10)",
          overflow:     "hidden",
          zIndex:       1000,
          minWidth:     130,
        }}>
          {LANGS.map(l => (
            <div
              key={l.code}
              onClick={() => { onChange(l.code as AppLang); setOpen(false); }}
              style={{
                display:    "flex",
                alignItems: "center",
                gap:        8,
                padding:    "9px 14px",
                cursor:     "pointer",
                fontSize:   13,
                fontWeight: l.code === lang ? 600 : 400,
                color:      l.code === lang ? "#FF4D2D" : "#333",
                background: l.code === lang ? "rgba(255,77,45,0.06)" : "transparent",
              }}
              onMouseEnter={(e: any) => { if (l.code !== lang) e.currentTarget.style.background = "#F5F5F0"; }}
              onMouseLeave={(e: any) => { e.currentTarget.style.background = l.code === lang ? "rgba(255,77,45,0.06)" : "transparent"; }}
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
              {l.code === lang && (
                <svg style={{ marginRight: "auto" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF4D2D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ExportButton ──────────────────────────────────────────
function ExportButton({ lang, onPDF, onWord }: any) {
  const [open, setOpen]   = useState(false);
  const [copied, setCopied] = useState(false);
  const ref               = useRef<HTMLDivElement>(null);
  const t                 = T[lang as keyof typeof T] ?? T.en;

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  };

  const menuItems = [
    {
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF4D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
      label: t.exportPDF,
      action: () => { onPDF?.(); setOpen(false); },
    },
    {
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/><polyline points="9 9 10 9"/></svg>,
      label: t.exportWord,
      action: () => { onWord?.(); setOpen(false); },
    },
    {
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
      label: copied ? t.copied : t.shareLink,
      action: handleCopy,
    },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o: boolean) => !o)}
        style={{
          display:      "flex",
          alignItems:   "center",
          gap:          6,
          background:   "#FF4D2D",
          color:        "#fff",
          border:       "none",
          borderRadius: 8,
          padding:      "7px 14px",
          fontSize:     13,
          fontWeight:   700,
          cursor:       "pointer",
          whiteSpace:   "nowrap",
          transition:   "background .15s",
        }}
        onMouseEnter={(e: any) => e.currentTarget.style.background = "#CC3A1F"}
        onMouseLeave={(e: any) => e.currentTarget.style.background = "#FF4D2D"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        {t.export}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {open && (
        <div style={{
          position:     "absolute",
          top:          "calc(100% + 6px)",
          right:        0,
          background:   "#fff",
          border:       "1px solid #EBEBEB",
          borderRadius: 12,
          boxShadow:    "0 4px 20px rgba(0,0,0,0.10)",
          overflow:     "hidden",
          zIndex:       1000,
          minWidth:     190,
          padding:      "4px",
        }}>
          {menuItems.map((item, i) => (
            <div
              key={i}
              onClick={item.action}
              style={{
                display:    "flex",
                alignItems: "center",
                gap:        10,
                padding:    "9px 12px",
                borderRadius: 8,
                cursor:     "pointer",
                fontSize:   13,
                color:      "#222",
              }}
              onMouseEnter={(e: any) => e.currentTarget.style.background = "#F5F5F0"}
              onMouseLeave={(e: any) => e.currentTarget.style.background = "transparent"}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── main EditorNavbar ─────────────────────────────────────
export default function EditorNavbar({
  lang            = "ar",
  onLangChange    = () => {},
  atsScore        = 0,
  atsBreakdown,
  isSaved         = true,
  onUndo          = () => {},
  onExportPDF     = () => {},
  onExportWord    = () => {},
  onTogglePreview = () => {},
  previewOpen     = true,
  onBackToHome    = () => {},
  onShowSettings  = () => {},
  onShowShortcuts = () => {},
}: {
  lang?: AppLang;
  onLangChange?: (lang: AppLang) => void;
  atsScore?: number;
  atsBreakdown?: any;
  isSaved?: boolean;
  onUndo?: () => void;
  onExportPDF?: () => void;
  onExportWord?: () => void;
  onTogglePreview?: () => void;
  previewOpen?: boolean;
  onBackToHome?: () => void;
  onShowSettings?: () => void;
  onShowShortcuts?: () => void;
}) {
  const t     = T[lang] ?? T.en;
  const isRtl = lang === "ar";


  return (
    <nav style={{
      position:       "sticky",
      top:            0,
      zIndex:         100,
      background:     "rgba(250,250,248,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom:   "1px solid #E8E6DF",
      padding:        "0 16px",
      direction:      isRtl ? "rtl" : "ltr",
    }}>
      <div style={{
        height:         52,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        gap:            12,
      }}>

        {/* ── Left group: Logo + Undo + Save ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div 
            onClick={onBackToHome}
            style={{
              width: 32, height: 32, display: "flex", alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              cursor: "pointer",
            }}
            title="Back to Home"
          >
            <img src="https://i.ibb.co/qFFjyH8V/IN-LOGO-icon-3.png" alt="IN LOGO icon(3)" border="0" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 8 }} />
          </div>

          <NavBtn onClick={onUndo} title="Undo">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
          </NavBtn>

          <SaveIndicator isSaved={isSaved} lang={lang} />
        </div>

        {/* ── Right group: ATS + Lang + Preview + Export ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

          <ATSScoreWidget
            score={atsScore}
            breakdown={atsBreakdown}
            lang={lang}
          />

          <Divider />

          <LangSwitcher lang={lang} onChange={onLangChange} />

          <NavBtn onClick={onShowSettings} title={t.templates}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
             <span className="hidden sm:inline">{t.templates}</span>
          </NavBtn>

          <NavBtn onClick={onShowShortcuts} title={lang === "ar" ? "اختصارات الكيبورد" : "Keyboard shortcuts"}>
             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 8h.01"/><path d="M12 12h.01"/><path d="M14 8h.01"/><path d="M16 12h.01"/><path d="M18 8h.01"/><path d="M6 8h.01"/><path d="M7 16h10"/><path d="M8 12h.01"/><rect width="20" height="16" x="2" y="4" rx="2"/></svg>
          </NavBtn>

          <NavBtn onClick={onTogglePreview} active={previewOpen}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
            {previewOpen ? t.preview : t.editOnly}
          </NavBtn>

          <Divider />

          <ExportButton
            lang={lang}
            onPDF={onExportPDF}
            onWord={onExportWord}
          />

        </div>
      </div>
    </nav>
  );
}
