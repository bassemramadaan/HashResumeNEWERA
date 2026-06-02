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
  const isAr = lang === "ar";
  const cloudTooltip = isAr 
    ? "جميع تعديلاتك محفوظة تلقائياً وبأمان في متصفحك المحلي" 
    : "All of your changes are automatically synchronized to your secure local storage";

  return (
    <div className="group relative flex items-center">
      <div className={`flex items-center gap-1.5 text-xs font-semibold select-none leading-none px-3 py-1.5 rounded-full border transition-all duration-300 ${isSaved ? "text-emerald-700 bg-emerald-500/5 border-emerald-500/10 cursor-help" : "text-amber-600 bg-amber-500/5 border-amber-500/10 animate-pulse"}`}>
        {isSaved ? (
          <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 10v4M12 14l-2-2M12 14l2-2" />
            <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5A7 7 0 1 0 3.5 14.5c0 2.18 1.41 3.82 3.5 4" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
        )}
        <span className="text-[11px] font-bold">
          {isSaved 
            ? (isAr ? "محفوظ محلياً بأمان" : "Saved Locally & Securely") 
            : (isAr ? "جاري الحفظ..." : "Saving...")}
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
function ExportButton({ lang, onPDF, onWord, variant = "default" }: any) {
  const [open, setOpen]   = useState(false);
  const ref               = useRef<HTMLDivElement>(null);
  const t                 = T[lang as keyof typeof T] ?? T.en;

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

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
  ];

  if (variant === "airplane") {
    return (
      <div ref={ref} className="relative">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen((o: boolean) => !o)}
          title={t.export}
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer text-slate-500 hover:bg-slate-100/80 hover:text-[#FF4D2D] ${
            open ? "bg-slate-100 text-[#FF4D2D]" : ""
          }`}
        >
          <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 7 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 7 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute top-full mt-2.5 right-1/2 translate-x-1/2 bg-white border border-slate-200/80 shadow-xl rounded-2xl overflow-hidden z-[1110] min-w-[190px] p-1.5 space-y-0.5"
            >
              {menuItems.map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer text-left transition-colors hover:bg-slate-50 text-slate-750"
                  style={{ direction: "ltr" }}
                >
                  {item.icon}
                  <span className="flex-1 text-slate-700">{item.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

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
    <nav className="sticky top-0 z-[100] border-b border-slate-200/50 bg-[#fafafa]/85 backdrop-blur-md px-6 select-none transform-gpu" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      <div className="h-16 flex items-center justify-between gap-4">

        {/* ── Left group: Logo + Undo + Save ── */}
        <div className="flex items-center gap-3 shrink-0">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToHome}
            className="w-8.5 h-8.5 flex items-center justify-center shrink-0 cursor-pointer"
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

        {/* ── Center group: Floating Threads Capsule ── */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-white border border-slate-200/80 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.08)] rounded-full px-2 py-1 h-12 flex-row gap-1 select-none scale-100 sm:scale-105 transition-all">
          {/* 1. Home Icon 🏠 */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToHome}
            title={lang === "ar" ? "الرئيسية" : "Home"}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer text-slate-500 hover:bg-slate-100/80 hover:text-rose-600"
          >
            <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </motion.button>

          {/* 2. Paper Airplane Export Icon ✈️ */}
          <ExportButton
            lang={lang}
            onPDF={onExportPDF}
            onWord={onExportWord}
            variant="airplane"
          />

          {/* 3. Plus / Templates Icon ➕ */}
          {!isLocked && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowSettings}
              title={t.templates}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer text-slate-500 hover:bg-slate-100/80 hover:text-[#FF4D2D]"
            >
              <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </motion.button>
          )}

          {/* 4. Heart / ATS Score Widget ❤️ */}
          <ATSScoreWidget
            score={atsScore}
            breakdown={atsBreakdown}
            lang={lang as "ar" | "en" | "fr"}
            variant="heart"
          />

          {/* 5. User Profile / Shortcuts Icon 👤 */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShowShortcuts}
            title={lang === "ar" ? "اختصارات الكيبورد" : "Keyboard Shortcuts"}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer text-slate-500 hover:bg-slate-100/80 hover:text-[#FF4D2D]"
          >
            <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </motion.button>
        </div>

        {/* ── Right group: Lang + Preview Split toggle ── */}
        <div className="flex items-center gap-2 shrink-0">
          <LangSwitcher lang={lang} onChange={onLangChange} />

          <Divider />

          <NavBtn onClick={onTogglePreview} active={previewOpen}>
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
            <span className="hidden sm:inline-block font-bold">{previewOpen ? t.preview : t.editOnly}</span>
          </NavBtn>
        </div>

      </div>
    </nav>
  );
}
