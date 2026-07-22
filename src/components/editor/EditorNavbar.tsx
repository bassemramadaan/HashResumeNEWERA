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
  [key: string]: any;
}) {
  const isRtl = lang === "ar";

  const renderStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <motion.div
            key="saving"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-1.5 text-slate-400"
          >
            <Loader2 className="w-3 h-3 animate-spin text-brand-600" />
            <span className="text-[10px] font-black tracking-wide uppercase">
              {lang === 'ar' ? 'جاري الحفظ...' : lang === 'fr' ? 'Enregistrement...' : 'Saving...'}
            </span>
          </motion.div>
        );
      case 'saved':
      case 'idle':
      default:
        return (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-1.5 text-emerald-600 font-sans"
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-wide uppercase text-slate-400">
              {lang === 'ar' ? 'تم الحفظ تلقائياً' : lang === 'fr' ? 'Enregistré' : 'Auto-saved'}
            </span>
          </motion.div>
        );
      case 'error':
        return (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-1.5 text-rose-500 font-sans"
          >
            <AlertCircle className="w-3 h-3" />
            <span className="text-[10px] font-black tracking-wide uppercase">
              {lang === 'ar' ? 'فشل الحفظ' : lang === 'fr' ? 'Échec' : 'Save failed'}
            </span>
          </motion.div>
        );
    }
  };

  return (
    <div className="w-full z-[100] bg-white border-b border-slate-200/80 shrink-0 transform-gpu" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      <nav className="h-14 px-4 sm:px-6 flex items-center justify-between w-full transition-all">
        
        {/* Left side: Logo and Back button */}
        <div className="flex items-center gap-3.5">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToHome}
            className="w-8 h-8 flex items-center justify-center shrink-0 cursor-pointer bg-slate-50 border border-slate-100 rounded-lg p-1.5"
            title="Back to Home"
          >
            <LogoImage 
              src={LOGO_ICON_URL} 
              alt="HashResume" 
              className="w-full h-full object-contain" 
            />
          </motion.div>
          <div className="h-4 w-px bg-slate-200 hidden md:block" />
          <button 
            onClick={onReset} 
            className="hidden md:flex items-center gap-1.5 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 px-2.5 py-1 rounded-lg cursor-pointer border border-transparent hover:border-red-100"
            title={lang === 'ar' ? 'مسح كل شيء' : 'Reset all'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">{lang === 'ar' ? 'البدء من جديد' : 'Start Over'}</span>
          </button>
        </div>

        {/* ── Center group: Save status dot ── */}
        <div className="flex items-center gap-2 bg-slate-50/55 border border-slate-100 rounded-full px-2.5 py-1 shrink-0">
          <AnimatePresence mode="wait">
            {renderStatus()}
          </AnimatePresence>
        </div>
        
        {/* Right side: Quick Actions */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://wa.me/201101007965"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-emerald-50 border border-emerald-100/40 px-3 py-1.5 rounded-lg font-black text-emerald-600 hover:text-emerald-700 transition-all flex items-center gap-1 text-[11px] cursor-pointer bg-white"
            title={lang === 'ar' ? 'تواصل معنا عبر واتساب' : 'Contact us on WhatsApp'}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggleFocus}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-black transition-all cursor-pointer",
              focusMode
                ? "bg-slate-900 border-slate-900 text-white"
                : "bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300"
            )}
            title={
              lang === "ar"
                ? "نمط التركيز"
                : "Focus Mode"
            }
          >
            {focusMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {focusMode 
                ? (lang === "ar" ? "إلغاء التركيز" : "Exit Focus") 
                : (lang === "ar" ? "تركيز" : "Focus")}
            </span>
          </motion.button>
        </div>
      </nav>
    </div>
  );
}
