import { motion, AnimatePresence } from "motion/react";
import { Loader2, RotateCcw, AlertCircle, Eye, EyeOff, Undo2, Redo2, Download, ArrowRight, ArrowLeft } from "lucide-react";
import type { AppLang } from "../../hooks/useDirection";
import { cn } from "../../lib/utils";
import { LogoImage } from "../LogoImage";
import { LOGO_ICON_URL } from "../../constants";
import { useStore } from "zustand";
import { useResumeStore } from "../../store/useResumeStore";
import { useResumeValidation } from "../../hooks/editor/useResumeValidation";

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function EditorNavbar({
  lang = "ar",
  saveStatus = 'idle',
  onBackToHome = () => {},
  onReset = () => {},
  focusMode = false,
  onToggleFocus = () => {},
  onExportPDF = () => {},
  onNavigateToStep = () => {},
}: {
  lang?: AppLang;
  saveStatus?: SaveStatus;
  onBackToHome?: () => void;
  onReset?: () => void;
  focusMode?: boolean;
  onToggleFocus?: () => void;
  onExportPDF?: () => void;
  onNavigateToStep?: (step: string) => void;
  [key: string]: unknown;
}) {
  const isRtl = lang === "ar";
  
  // Undo/Redo state
  const { undo, redo, pastStates, futureStates } = useStore(useResumeStore.temporal);
  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  // Validation / Completion
  const { data } = useResumeStore();
  const { breakdown } = useResumeValidation(data);
  const completedSteps = breakdown.filter(b => b.done).length;
  const totalSteps = breakdown.length;
  const percentage = Math.round((completedSteps / totalSteps) * 100);
  const nextBestAction = breakdown.find(b => !b.done);

  const getStepId = (index: number) => {
    switch (index) {
      case 0: return "basics";
      case 1: return "summary";
      case 2: return "experience";
      case 3: return "skills";
      case 4: return "education";
      case 5: return "summary";
      default: return "basics";
    }
  };

  const handleNextActionClick = () => {
    if (nextBestAction) {
      const index = breakdown.findIndex(b => b.label === nextBestAction.label);
      onNavigateToStep(getStepId(index));
    }
  };

  const renderStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <motion.div
            key="saving"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-1.5 text-[var(--foreground-muted)]"
          >
            <Loader2 className="w-3 h-3 animate-spin text-[var(--primary)]" />
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
            className="flex items-center gap-1.5 text-[var(--success)] font-sans"
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--success)]"></span>
            </span>
            <span className="text-[10px] font-black tracking-wide uppercase text-[var(--foreground-muted)]">
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
            className="flex items-center gap-1.5 text-[var(--danger)] font-sans"
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
    <div className="w-full z-[100] bg-[var(--surface)]/80 backdrop-blur-md border-b border-[var(--border)]/60 shadow-sm shrink-0 transform-gpu sticky top-0" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      <nav className="h-14 px-4 sm:px-6 flex items-center justify-between w-full transition-all">
        
        {/* Left side: Logo and Back button */}
        <div className="flex items-center gap-3.5">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToHome}
            className="w-8 h-8 flex items-center justify-center shrink-0 cursor-pointer bg-[var(--surface-muted)] border border-[var(--border)] rounded-lg p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            title="Back to Home"
          >
            <LogoImage 
              src={LOGO_ICON_URL} 
              alt="HashResume" 
              className="w-full h-full object-contain" 
            />
          </motion.div>
          <div className="h-4 w-px bg-[var(--border)] hidden md:block" />

          <div className="hidden md:flex items-center bg-[var(--surface-muted)] rounded-lg border border-[var(--border)] p-0.5">
            <button
              onClick={() => undo()}
              disabled={!canUndo}
              className={cn(
                "p-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                canUndo ? "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]" : "text-[var(--foreground-muted)] opacity-50 cursor-not-allowed"
              )}
              title={lang === 'ar' ? 'تراجع (Ctrl+Z)' : 'Undo (Ctrl+Z)'}
              aria-label="Undo"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => redo()}
              disabled={!canRedo}
              className={cn(
                "p-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                canRedo ? "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]" : "text-[var(--foreground-muted)] opacity-50 cursor-not-allowed"
              )}
              title={lang === 'ar' ? 'إعادة (Ctrl+Y)' : 'Redo (Ctrl+Y)'}
              aria-label="Redo"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button 
            onClick={onReset} 
            className="hidden md:flex items-center gap-1.5 text-[var(--foreground-muted)] hover:text-[var(--danger)] transition-colors bg-[var(--surface-muted)] hover:bg-[var(--danger)]/10 px-2.5 py-1 rounded-lg cursor-pointer border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)]"
            title={lang === 'ar' ? 'مسح كل شيء' : 'Reset all'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">{lang === 'ar' ? 'البدء من جديد' : 'Start Over'}</span>
          </button>
        </div>

        {/* ── Center group: Save status dot & Progress ── */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-[var(--surface-muted)] border border-[var(--border)] rounded-full px-2.5 py-1 shrink-0">
            <AnimatePresence mode="wait">
              {renderStatus()}
            </AnimatePresence>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-[var(--surface-muted)] border border-[var(--border)] rounded-full pl-1.5 pr-3 py-1">
            <div className="relative w-6 h-6 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" className="stroke-[var(--border-strong)]" strokeWidth="2.5" />
                <circle 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  fill="none" 
                  className={percentage === 100 ? "stroke-[var(--success)]" : "stroke-[var(--primary)]"} 
                  strokeWidth="2.5"
                  strokeDasharray="62.83"
                  strokeDashoffset={62.83 - (62.83 * percentage) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[8px] font-black">{percentage}%</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold">
              {percentage === 100 ? (
                <span className="text-[var(--success)]">{lang === 'ar' ? 'مكتمل' : 'Complete'}</span>
              ) : (
                <button 
                  onClick={handleNextActionClick}
                  className="flex items-center gap-1 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)] rounded px-1"
                >
                  <span className="truncate max-w-[120px]">{nextBestAction?.tip[lang as 'en'|'ar'|'fr']}</span>
                  {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Right side: Quick Actions */}
        <div className="flex items-center gap-2.5">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggleFocus}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-extrabold transition-all cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
              focusMode
                ? "bg-[var(--foreground)] border-[var(--foreground)] text-[var(--background)] shadow-md"
                : "bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)]"
            )}
            title={
              lang === "ar"
                ? "نمط التركيز الكامل"
                : "Full Focus Mode"
            }
          >
            {focusMode ? <Eye className="w-3.5 h-3.5 text-[var(--warning)]" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {focusMode 
                ? (lang === "ar" ? "إلغاء التركيز" : "Exit Focus") 
                : (lang === "ar" ? "وضع التركيز 🎯" : "Focus Mode 🎯")}
            </span>
          </motion.button>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExportPDF}
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 text-[11px] sm:text-xs cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تصدير' : 'Export'}</span>
          </motion.button>
        </div>
      </nav>
    </div>
  );
}
