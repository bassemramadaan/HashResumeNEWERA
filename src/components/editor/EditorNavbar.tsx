import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
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

// ── NavBtn Sub-component ──────────────────────────────
function NavBtn({ onClick, children, title, active = false }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
        active 
          ? "bg-slate-100 border-slate-200 text-slate-800" 
          : "bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200 hover:text-slate-800"
      }`}
    >
      {children}
    </motion.button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-slate-200 shrink-0 self-center" />;
}

// ── SaveIndicator ─────────────────────────────────────────
function SaveIndicator({ isSaved, lang }: { isSaved: boolean; lang: AppLang }) {
  const t = T[lang] ?? T.en;
  return (
    <div className={`flex items-center gap-1.5 text-xs font-semibold select-none leading-none px-2 py-1 rounded-lg ${isSaved ? "text-emerald-600 bg-emerald-500/5" : "text-slate-400 bg-slate-500/5 animate-pulse"}`}>
      {isSaved ? (
        <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5 text-slate-400 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121 12m-7-5h5v5" />
        </svg>
      )}
      <span>{isSaved ? t.saved : t.saving}</span>
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
    <div ref={ref} className="relative">
      <NavBtn onClick={() => setOpen((o: boolean) => !o)} active={open}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span>{current.label}</span>
        <svg width="9" height="9" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </NavBtn>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 7 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 7 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute top-full mt-1.5 left-0 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-[1110] min-w-[130px] p-1"
          >
            {LANGS.map(l => (
              <button
                key={l.code}
                onClick={() => { onChange(l.code as AppLang); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer text-left transition-colors ${
                  l.code === lang 
                    ? "bg-rose-500/10 text-[#FF4D2D]" 
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{l.flag}</span>
                <span className="flex-1">{l.label}</span>
                {l.code === lang && (
                  <svg className="w-3.5 h-3.5 text-[#FF4D2D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
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
      icon: <svg className="w-4 h-4 text-[#FF4D2D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
      label: t.exportPDF,
      action: () => { onPDF?.(); setOpen(false); },
    },
    {
      icon: <svg className="w-4 h-4 text-[#185FA5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/><polyline points="9 9 10 9"/></svg>,
      label: t.exportWord,
      action: () => { onWord?.(); setOpen(false); },
    },
    {
      icon: <svg className="w-4 h-4 text-[#534AB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
      label: copied ? t.copied : t.shareLink,
      action: handleCopy,
    },
  ];

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((o: boolean) => !o)}
        className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-[#FF4D2D] hover:from-rose-700 hover:to-[#E64528] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer select-none"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        <span>{t.export}</span>
        <svg width="9" height="9" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 7 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 7 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute top-full mt-1.5 right-0 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-[1110] min-w-[190px] p-1.5 space-y-0.5"
          >
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer text-left transition-colors hover:bg-slate-50 text-slate-750"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
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
  isLocked        = false,
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
  isLocked?: boolean;
  onBackToHome?: () => void;
  onShowSettings?: () => void;
  onShowShortcuts?: () => void;
}) {
  const t     = T[lang] ?? T.en;
  const isRtl = lang === "ar";

  return (
    <nav className="sticky top-0 z-[100] border-b border-sans border-slate-200/80 bg-slate-50/95 backdrop-blur-md px-4 select-none" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      <div className="h-14 flex items-center justify-between gap-4">

        {/* ── Left group: Logo + Undo + Save ── */}
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToHome}
            className="w-8 h-8 flex items-center justify-center shrink-0 cursor-pointer"
            title="Back to Home"
          >
            <img 
              src="https://i.ibb.co/qFFjyH8V/IN-LOGO-icon-3.png" 
              alt="HashResume" 
              className="w-full h-full object-contain rounded-lg shadow-xs" 
            />
          </motion.div>

          <NavBtn onClick={onUndo} title="Undo">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
          </NavBtn>

          <SaveIndicator isSaved={isSaved} lang={lang} />
        </div>

        {/* ── Right group: ATS + Lang + Preview + Export ── */}
        <div className="flex items-center gap-2">

          <ATSScoreWidget
            score={atsScore}
            breakdown={atsBreakdown}
            lang={lang}
          />

          <Divider />

          <LangSwitcher lang={lang} onChange={onLangChange} />

          {!isLocked && (
            <NavBtn onClick={onShowSettings} title={t.templates}>
               <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
               <span className="hidden lg:inline">{t.templates}</span>
            </NavBtn>
          )}

          <NavBtn onClick={onShowShortcuts} title={lang === "ar" ? "اختصارات الكيبورد" : "Keyboard shortcuts"}>
             <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 8h.01"/><path d="M12 12h.01"/><path d="M14 8h.01"/><path d="M16 12h.01"/><path d="M18 8h.01"/><path d="M6 8h.01"/><path d="M7 16h10"/><path d="M8 12h.01"/><rect width="20" height="16" x="2" y="4" rx="2"/></svg>
          </NavBtn>

          <NavBtn onClick={onTogglePreview} active={previewOpen}>
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
            <span className="hidden sm:inline">{previewOpen ? t.preview : t.editOnly}</span>
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
