import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, FileText, Share2, Sparkles, ChevronDown } from "lucide-react";
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
function NavBtn({ onClick, children, title, active = false }: unknown) {
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
      <div className={`flex items-center gap-2 text-[11px] font-black select-none leading-none px-3.5 py-1.5 rounded-full transition-all duration-500 shadow-3xs ${
        isSaved 
          ? "text-emerald-700 bg-emerald-50/75 border border-emerald-100/50 cursor-help" 
          : "text-amber-600 bg-amber-50 border border-amber-100 animate-pulse"
      }`}>
        {isSaved ? (
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 animate-pulse"></span>
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
function ExportButton({ lang, onPDF, onWord, isReady = false }: { lang: AppLang; onPDF?: () => void; onWord?: () => void; isReady?: boolean }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isAr = lang === "ar";

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const ctaText = isAr ? "تحميل وتصدير السيرة" : lang === "fr" ? "Télécharger CV" : "Download Resume";

  return (
    <div ref={ref} className="relative z-50">
      <motion.button
        data-tour="export-button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((o: boolean) => !o)}
        className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-[#FF4D2D] hover:from-rose-700 hover:to-[#E64528] text-white font-extrabold text-xs sm:text-sm px-4.5 py-2.5 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer select-none relative group"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        
        <span className="tracking-wide">{ctaText}</span>
        
        <ChevronDown size={14} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />

        {isReady && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 7 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 7 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className={`absolute top-full mt-2 bg-white border border-slate-200/80 shadow-2xl rounded-2xl overflow-hidden z-[1110] p-2 space-y-1 w-[260px] sm:w-[310px] ${
              isAr ? "left-0 sm:left-auto sm:-right-4" : "right-0 sm:right-auto sm:-left-4"
            }`}
            style={{ direction: isAr ? "rtl" : "ltr" }}
          >
            {/* Header Hint */}
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 rounded-xl mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                {isAr ? "خيارات الحفظ الفوري" : "Instant Export Actions"}
              </span>
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Sparkles size={8} />
                {isAr ? "متوافق مع ATS" : "ATS-Compliant"}
              </span>
            </div>

            {/* PDF Item */}
            <button
              onClick={() => { onPDF?.(); setOpen(false); }}
              className="w-full flex items-start gap-3 p-2.5 rounded-xl cursor-pointer text-start transition-all hover:bg-slate-50 group/item active:scale-98"
            >
              <div className="w-10 h-10 bg-rose-50 text-[#FF4D2D] rounded-xl flex items-center justify-center shrink-0 group-hover/item:bg-rose-100/70 transition-colors">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover/item:text-[#FF4D2D] transition-colors">
                    {isAr ? "تحميل ملف PDF رسمي" : "Download Official PDF"}
                  </span>
                  <span className="text-[8px] font-bold text-[#FF4D2D] bg-rose-50/70 px-1 py-0.2 rounded-md">
                    {isAr ? "موصى به" : "Best"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                  {isAr 
                    ? "النسخة النموذجية للتقديم المباشر والطباعة الفندقية." 
                    : "The standard, highly optimized copy for job applications and ATS scanners."}
                </p>
              </div>
            </button>

            {/* Word Item */}
            <button
              onClick={() => { onWord?.(); setOpen(false); }}
              className="w-full flex items-start gap-3 p-2.5 rounded-xl cursor-pointer text-start transition-all hover:bg-slate-50 group/item active:scale-98"
            >
              <div className="w-10 h-10 bg-[#185FA5]/5 text-[#185FA5] rounded-xl flex items-center justify-center shrink-0 group-hover/item:bg-[#185FA5]/10 transition-colors">
                <Download size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover/item:text-[#185FA5] transition-colors block">
                  {isAr ? "تحميل مستند Word قابل للتعديل" : "Download Word DOCX"}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                  {isAr 
                    ? "نسخة قابلة للتحرير والتعديل بالكامل في برنامج Word." 
                    : "Fully editable Microsoft Word file to customize independently later."}
                </p>
              </div>
            </button>

            {/* Share Link Item */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-start gap-3 p-2.5 rounded-xl cursor-pointer text-start transition-all hover:bg-slate-50 group/item active:scale-98"
            >
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover/item:bg-emerald-100/70 transition-colors">
                <Share2 size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover/item:text-emerald-600 transition-colors">
                    {isAr ? "رابط المشاركة السحابي" : "Get Online Share Link"}
                  </span>
                  {copied && (
                    <span className="text-[8px] font-black text-white bg-emerald-500 px-1.5 py-0.2 rounded-md animate-bounce shrink-0">
                      {isAr ? "تم النسخ!" : "Copied!"}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                  {isAr 
                    ? "رابط مباشر تفاعلي لمشاركته مع مدراء التوظيف." 
                    : "Live web link to send directly to recruiters or share on LinkedIn."}
                </p>
              </div>
            </button>
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
  onShowCommandBar = () => {},
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
  onShowCommandBar?: () => void;
  focusMode?: boolean;
  onToggleFocus?: () => void;
}) {
  const t     = T[lang] ?? T.en;
  const isRtl = lang === "ar";

  return (
    <div className="w-full z-[100] pt-4 px-4 sm:px-6 pb-2 bg-transparent pointer-events-none flex justify-center transform-gpu shrink-0" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      <nav className="pointer-events-auto bg-white/80 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] rounded-2xl px-4 md:px-5 h-16 flex items-center justify-between w-full max-w-7xl transition-all relative">
        
        {/* ── Left group: Logo + Command Bar + Save ── */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
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

          <div className="hidden sm:block">
            <NavBtn onClick={onUndo} title="Undo">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
            </NavBtn>
          </div>

          <button 
            onClick={onShowCommandBar} 
            title={lang === "ar" ? "شريط الأوامر السريع (Cmd+K)" : "Universal Command Bar (Cmd+K)"}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/60 bg-white/50 shadow-sm text-xs font-bold transition-all cursor-pointer hover:bg-slate-50 border-b-2 hover:border-b-slate-200 hover:text-[#FF4D2D] select-none"
          >
            <span className="flex items-center gap-0.5 font-mono text-[10px] font-black text-slate-400">
              <span>⌘</span>
              <span>K</span>
            </span>
          </button>

          <div className="hidden md:block ml-2 rtl:ml-0 rtl:mr-2">
            <SaveIndicator isSaved={isSaved} lang={lang} />
          </div>
        </div>

        {/* ── Center group: Floating ATS Capsule ── */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-white/90 border border-slate-150 shadow-sm rounded-full px-1.5 py-1 flex-row gap-1 select-none transition-all">
          {/* Templates/Settings Button */}
          {!isLocked && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowSettings}
              title={t.templates}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer text-slate-500 hover:bg-slate-100 hover:text-[#FF4D2D]"
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

        {/* ── Right group: Lang + Export CTA + Toggles ── */}
        <div className="flex items-center gap-1.5 md:gap-2.5 shrink-0">
          <LangSwitcher lang={lang} onChange={onLangChange} />

          <div className="hidden md:block">
            <Divider />
          </div>

          <ExportButton
            lang={lang}
            onPDF={onExportPDF}
            onWord={onExportWord}
            isReady={atsScore >= 80}
          />

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
