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
    focusMode:   "وضع التركيز",
    exitFocus:   "إلغاء التركيز",
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
    focusMode:   "Focus Mode",
    exitFocus:   "Exit Focus",
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
    focusMode:   "Mode Focus",
    exitFocus:   "Quitter Focus",
  },
} as const;

const LANGS = [
  { code: "ar", label: "AR", flag: "🇸🇦" },
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
];

// ── NavBtn Sub-component ──────────────────────────────
function NavBtn({ onClick, children, title, active = false }: { onClick?: () => void; children: React.ReactNode; title?: string; active?: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
        active 
          ? "bg-neutral-100/80 border-neutral-200/50 text-neutral-800" 
          : "bg-transparent border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-200/40 hover:text-neutral-800"
      }`}
    >
      {children}
    </motion.button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-neutral-200 shrink-0 self-center" />;
}

// ── SaveIndicator ─────────────────────────────────────────
function SaveIndicator({ isSaved, lang }: { isSaved: boolean; lang: AppLang }) {
  const isAr = lang === "ar";
  const isFr = lang === "fr";
  
  const cloudTooltip = isAr 
    ? "جميع تعديلاتك محفوظة تلقائياً وبأمان في متصفحك المحلي" 
    : isFr
      ? "Toutes vos modifications sont automatiquement sauvegardées sur votre stockage local"
      : "All of your changes are automatically synchronized to your secure local storage";

  const displayText = isSaved 
    ? (isAr ? "تم الحفظ تلقائياً ✓" : isFr ? "Saisie enregistrée ✓" : "Auto-saved ✓") 
    : (isAr ? "جاري الحفظ..." : isFr ? "Enregistrement..." : "Saving...");

  return (
    <div className="group relative flex items-center">
      <div className={`flex items-center gap-2 text-[11px] font-extrabold select-none leading-none px-3.5 py-1.5 rounded-full transition-all duration-500 ${
        isSaved 
          ? "text-emerald-650 bg-emerald-500/10 border border-emerald-500/10 cursor-help" 
          : "text-amber-600 bg-amber-500/10 border border-amber-100/10 animate-pulse"
      }`}>
        {isSaved ? (
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        ) : (
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        )}
        <span className="tracking-wide">
          {displayText}
        </span>
      </div>

      {/* Elegant floating tooltip */}
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-white text-[10px] sm:text-xs py-1.5 px-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
        <div className="flex items-center gap-1.5 font-bold">
          <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {cloudTooltip}
        </div>
      </div>
    </div>
  );
}

// ── LangSwitcher ──────────────────────────────────────────
function LangSwitcher({ lang, onChange }: { lang: AppLang, onChange: (lang: AppLang) => void }) {
  const [open, setOpen]   = useState(false);
  const ref               = useRef<HTMLDivElement>(null);
  const isRtl            = lang === "ar";
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
            className={`absolute top-full mt-1.5 ${isRtl ? "right-0" : "left-0"} bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-[1110] min-w-[130px] p-1`}
          >
            {LANGS.map(l => (
              <button
                key={l.code}
                onClick={() => { onChange(l.code as AppLang); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${isRtl ? "text-right" : "text-left"} ${
                  l.code === lang 
                    ? "bg-rose-500/10 text-[#FF4D2D]" 
                    : "text-slate-700 hover:bg-slate-50"
                }`}
                style={{ direction: isRtl ? "rtl" : "ltr" }}
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

// ── main EditorNavbar ─────────────────────────────────────
export default function EditorNavbar({
  lang            = "ar",
  onLangChange    = () => {},
  atsScore        = 0,
  atsBreakdown,
  isSaved         = true,
  onUndo          = () => {},
  onTogglePreview = () => {},
  previewOpen     = true,
  isLocked        = false,
  onBackToHome    = () => {},
  onShowSettings  = () => {},
  focusMode       = false,
  onToggleFocus   = () => {},
}: {
  lang?: AppLang;
  onLangChange?: (lang: AppLang) => void;
  atsScore?: number;
  atsBreakdown?: unknown;
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
  focusMode?: boolean;
  onToggleFocus?: () => void;
}) {
  const t     = T[lang] ?? T.en;
  const isRtl = lang === "ar";

  return (
    <div className="w-full z-[100] pt-4 px-4 sm:px-6 pb-2 bg-transparent pointer-events-none flex justify-center transform-gpu shrink-0" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      <nav className="pointer-events-auto bg-white/40 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.02)] rounded-3xl px-4 md:px-5 h-16 flex items-center justify-between w-full max-w-7xl transition-all relative">
        
        {/* ── Left group: Undo + Save ── */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <div className="hidden sm:block">
            <NavBtn onClick={onUndo} title="Undo">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
            </NavBtn>
          </div>

          <div className="hidden md:block ml-2 rtl:ml-0 rtl:mr-2">
            <SaveIndicator isSaved={isSaved} lang={lang} />
          </div>
        </div>

        {/* ── Center group: Floating Logo + ATS Capsule ── */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-white/45 border border-white/60 shadow-xs rounded-full px-1.5 py-1 flex-row gap-1 select-none transition-all">
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
              className="w-full h-full object-contain drop-shadow-sm" 
            />
          </motion.div>
          
          {/* Templates/Settings Button */}
          {!isLocked && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowSettings}
              title={t.templates}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer text-neutral-500 hover:bg-white/60 hover:text-[#FF4D2D]"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </motion.button>
          )}

          {/* ATS Heart Indicator */}
          <ATSScoreWidget
            score={atsScore}
            breakdown={atsBreakdown}
            lang={lang as "ar" | "en" | "fr"}
            variant="heart"
          />
        </div>

        {/* ── Right group: Lang + Toggles ── */}
        <div className="flex items-center gap-1.5 md:gap-2.5 shrink-0">

          <LangSwitcher lang={lang} onChange={onLangChange} />

          <div className="hidden md:block">
            <Divider />
          </div>

          <div className="hidden lg:flex items-center gap-1.5">
            <NavBtn onClick={onToggleFocus} active={focusMode} title={focusMode ? t.exitFocus : t.focusMode}>
              <span className="text-sm shrink-0 leading-none">👁</span>
              <span className="hidden xl:inline-block font-bold">{focusMode ? t.exitFocus : t.focusMode}</span>
            </NavBtn>

            <NavBtn onClick={onTogglePreview} active={previewOpen} title={previewOpen ? t.editOnly : t.preview}>
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
              <span className="hidden xl:inline-block font-bold">{previewOpen ? t.preview : t.editOnly}</span>
            </NavBtn>
          </div>
        </div>

      </nav>
    </div>
  );
}
