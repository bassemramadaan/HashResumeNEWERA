import { motion, AnimatePresence } from "motion/react";
import { Loader2, RotateCcw, AlertCircle, Eye, EyeOff, MessageCircle } from "lucide-react";
import type { AppLang } from "../../hooks/useDirection";
import { cn } from "../../lib/utils";
import { LogoImage } from "../LogoImage";
import { LOGO_ICON_URL } from "../../constants";

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function EditorNavbar({
  lang = "ar",
  saveStatus = 'idle',
  onBackToHome = () => {},
  onReset = () => {},
  focusMode = false,
  onToggleFocus = () => {},
}: {
  lang?: AppLang;
  saveStatus?: SaveStatus;
  onBackToHome?: () => void;
  onReset?: () => void;
  focusMode?: boolean;
  onToggleFocus?: () => void;
  // allow other props without breaking TS
  [key: string]: any;
}) {
  const isRtl = lang === "ar";

  const renderStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <motion.div
            key="saving"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 text-slate-500"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span className="text-[11px] font-bold">
              {lang === 'ar' ? 'جاري الحفظ...' : lang === 'fr' ? 'Enregistrement...' : 'Saving...'}
            </span>
          </motion.div>
        );
      case 'saved':
        return (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2 text-emerald-600 font-sans"
          >
            <div className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[11px] font-bold">
              {lang === 'ar' ? 'تم الحفظ تلقائياً' : lang === 'fr' ? 'Enregistré' : 'Auto-saved'}
            </span>
          </motion.div>
        );
      case 'error':
        return (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 text-rose-500 font-sans"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">
              {lang === 'ar' ? 'فشل الحفظ' : lang === 'fr' ? 'Échec' : 'Save failed'}
            </span>
          </motion.div>
        );
      case 'idle':
      default:
        return (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2 text-emerald-600 font-sans"
          >
            <div className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[11px] font-bold">
              {lang === 'ar' ? 'تم الحفظ تلقائياً' : lang === 'fr' ? 'Auto-enregistré' : 'Auto-saved'}
            </span>
          </motion.div>
        );
    }
  };

  return (
    <div className="w-full z-[100] pt-2 sm:pt-4 px-4 sm:px-6 pb-1 sm:pb-2 bg-transparent pointer-events-none flex justify-center transform-gpu shrink-0" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      <nav className="pointer-events-auto bg-white border border-slate-200 shadow-sm rounded-[20px] px-4 md:px-5 h-12 sm:h-16 flex items-center justify-between w-full max-w-7xl transition-all relative">
        
        {/* Left side: Reset */}
        <div className="flex-1 hidden md:flex items-center">
            <button 
              onClick={onReset} 
              className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 px-3 py-1.5 rounded-xl cursor-pointer"
              title={lang === 'ar' ? 'مسح كل شيء' : 'Reset all'}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-xs font-bold">{lang === 'ar' ? 'البدء من جديد' : 'Start Over'}</span>
            </button>
        </div>

        {/* ── Center group: Logo & Auto-save ── */}
        <div className="flex items-center justify-center select-none transition-all gap-4">
           <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToHome}
            className="w-10 h-10 flex items-center justify-center shrink-0 cursor-pointer"
            title="Back to Home"
          >
            <LogoImage 
              src={LOGO_ICON_URL} 
              alt="HashResume" 
              className="w-full h-full object-contain drop-shadow-sm" 
            />
          </motion.div>
          
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5 hidden sm:flex">
             <AnimatePresence mode="wait">
               {renderStatus()}
             </AnimatePresence>
          </div>
        </div>
        
        {/* Right side: Focus Mode Toggle & WhatsApp */}
        <div className="flex-1 flex items-center justify-end gap-3">
          <a
            href="https://wa.me/201101007965"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-emerald-50 border border-emerald-100/40 px-3 py-1.5 rounded-full font-bold text-emerald-600 hover:text-emerald-700 transition-all flex items-center gap-1.5 text-xs cursor-pointer shadow-xs bg-white"
            title={lang === 'ar' ? 'تواصل معنا عبر واتساب' : 'Contact us on WhatsApp'}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggleFocus}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-xs",
              focusMode
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-[0_2px_10px_rgba(16,185,129,0.06)]"
                : "bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300"
            )}
            title={
              lang === "ar"
                ? "نمط التركيز (إخفاء المشتتات)"
                : lang === "fr"
                ? "Mode Focus (masquer les distractions)"
                : "Focus Mode (hide distractions)"
            }
          >
            {focusMode ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {lang === "ar"
                    ? "نمط التركيز: نشط"
                    : lang === "fr"
                    ? "Mode Focus : Actif"
                    : "Focus Mode: Active"}
                </span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {lang === "ar"
                    ? "نمط التركيز"
                    : lang === "fr"
                    ? "Mode Focus"
                    : "Focus Mode"}
                </span>
              </>
            )}
          </motion.button>
        </div>
      </nav>
    </div>
  );
}
