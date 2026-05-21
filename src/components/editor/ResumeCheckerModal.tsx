import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, AlertCircle, FileText, Download, Target, Sparkles } from "lucide-react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import { cn } from "../../lib/utils";

interface ResumeCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (format: "pdf" | "docx" | "txt") => void;
}

const ACTION_VERBS = new Set([
  "led", "managed", "developed", "created", "designed", "implemented", "improved",
  "increased", "decreased", "saved", "achieved", "launched", "built", "engineered",
  "architected", "coordinated", "collaborated", "mentored", "trained", "analyzed",
  "resolved", "negotiated", "presented", "wrote", "authored", "published", "researched",
  "investigated", "optimized", "streamlined", "automated", "transformed", "expanded",
  "generated", "delivered", "executed", "planned",
]);

export default function ResumeCheckerModal({
  isOpen,
  onClose,
  onProceed,
}: ResumeCheckerModalProps) {
  const { data } = useResumeStore();
  const { language } = useLanguageStore();
  const t = translations[language].resumeChecker;
  const isAr = language === "ar";
  const { personalInfo, experience, education, skills } = data;

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const checks = [
    {
      id: "contact",
      title: t.contactTitle,
      passed: !!(personalInfo.email && personalInfo.phone && personalInfo.address),
      message: t.contactMsg,
      severity: "high",
    },
    {
      id: "summary",
      title: t.summaryTitle,
      passed: !!(personalInfo.summary && personalInfo.summary.length > 50),
      message: t.summaryMsg,
      severity: "medium",
    },
    {
      id: "experience_bullets",
      title: t.bulletsTitle,
      passed: experience.length > 0 && experience.every((exp) => exp.description.includes("•") || exp.description.includes("-")),
      message: t.bulletsMsg,
      severity: "high",
    },
    {
      id: "action_verbs",
      title: t.verbsTitle,
      passed: experience.length > 0 && experience.some((exp) => {
        const words = exp.description.toLowerCase().split(/\s+/);
        return words.some((w) => ACTION_VERBS.has(w));
      }),
      message: t.verbsMsg,
      severity: "medium",
    },
    {
      id: "skills",
      title: t.skillsTitle,
      passed: skills.length >= 5,
      message: t.skillsMsg,
      severity: "medium",
    },
    {
      id: "education",
      title: t.educationTitle,
      passed: education.length > 0,
      message: t.educationMsg,
      severity: "high",
    },
  ];

  const failedChecks = checks.filter((c) => !c.passed);
  const score = Math.round(((checks.length - failedChecks.length) / checks.length) * 100);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          dir={isAr ? "rtl" : "ltr"}
        >
          {/* Custom Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 15 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-[0_24px_70px_-15px_rgba(0,0,0,0.18)] border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] z-10 my-8"
          >
            {/* Top accent glow */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 to-[#FF4D2D] overflow-hidden" />

            {/* Glowing accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50 rounded-full blur-[64px] -z-10 translate-x-1/3 -translate-y-1/3 opacity-70" />

            {/* Header */}
            <div className="px-5 py-5 sm:px-7 sm:py-6 border-b border-slate-100/80 flex justify-between items-start bg-slate-50/40">
              <div className="flex gap-3.5 items-start">
                <div className="w-11 h-11 rounded-2xl bg-white shadow-sm border border-slate-200/60 flex items-center justify-center shrink-0">
                  <Target className="text-[#FF4D2D] animate-pulse" size={20} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    {t.title}
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-relaxed">
                    {t.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100/80 rounded-full transition-all duration-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Checklist */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 custom-scrollbar">
              
              {/* Score Circular Indicator & Message Panel */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-150/70 relative overflow-hidden shadow-sm">
                
                {/* Background score state color splash */}
                <div className={cn(
                  "absolute -top-10 -right-10 w-36 h-36 blur-[40px] opacity-15 rounded-full pointer-events-none transition-colors duration-1000",
                  score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500"
                )} />

                {/* Score Circle */}
                <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
                  <svg className="w-full h-full transform -rotate-90 origin-center">
                    <defs>
                      <linearGradient id="checkerScoreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={score >= 80 ? "#059669" : score >= 50 ? "#d97706" : "#dc2626"} />
                        <stop offset="100%" stopColor={score >= 80 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171"} />
                      </linearGradient>
                    </defs>
                    <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="6" fill="none" className="text-slate-200/80" />
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="url(#checkerScoreGlow)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={301.6} 
                      strokeDashoffset={301.6 - (301.6 * (mounted ? score : 0)) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span 
                      initial={{ scale: 0.6, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      transition={{ delay: 0.25 }}
                      className={cn("text-3xl font-black tracking-tighter leading-none", score >= 80 ? "text-emerald-700" : score >= 50 ? "text-amber-700" : "text-rose-700")}
                    >
                      {score}%
                    </motion.span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider mt-1">
                      {t.scoreLabel}
                    </span>
                  </div>
                </div>

                {/* Status Advice text block */}
                <div className="text-center sm:text-start flex-1">
                  <h3 className={cn("text-base font-black flex items-center justify-center sm:justify-start gap-1.5", score >= 80 ? "text-emerald-800" : score >= 50 ? "text-amber-800" : "text-rose-800")}>
                    <Sparkles size={14} className={score >= 80 ? "text-emerald-500" : "text-amber-500"} />
                    {score >= 80 ? (isAr ? "عمل ممتع! سيرتك الذاتية متكاملة تماماً 🚀" : "Superb! Resume meets standard HR limits 🚀") : 
                     score >= 50 ? (isAr ? "مستوى ممتاز، تبقى بضع لمسات ذكية" : "Good progress, minor polishes left") : 
                     (isAr ? "سيرتك الذاتية تحتاج لإضافة المزيد من البيانات" : "Significant details missing")}
                  </h3>
                  <p className="text-slate-500 text-[11px] font-semibold leading-relaxed mt-1.5 max-w-xs sm:max-w-sm mx-auto sm:mx-0">
                    {isAr 
                      ? "نطابق الآن صياغة ومحتويات سيرتك مع أنظمة التوظيف ATS لرفع فرص القبول وتجاوز فرز السير الذاتية الذكي." 
                      : "We matched your contents with ATS engine checklists. Optimize elements below to bypass standard human filtration."}
                  </p>
                </div>
              </div>

              {/* Simplified & beautifully padded list checks */}
              <div className="space-y-2.5">
                {checks.map((check, index) => (
                  <motion.div
                    key={check.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 + 0.1 }}
                    className={cn(
                      "flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all duration-300",
                      check.passed 
                        ? "bg-white border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]" 
                        : "bg-red-50/30 border-red-100 shadow-[0_2px_12px_rgba(239,68,68,0.03)]"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 shrink-0 w-7 h-7 rounded-lg flex items-center justify-center",
                      check.passed ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-500 border border-red-100"
                    )}>
                      {check.passed ? <CheckCircle2 size={14} strokeWidth={2.5} /> : <AlertCircle size={14} strokeWidth={2.5} />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={cn("text-xs font-black tracking-tight", check.passed ? "text-slate-800" : "text-red-900")}>
                        {check.title}
                      </h4>
                      {!check.passed && (
                        <p className="text-[11px] text-red-650/90 font-semibold leading-relaxed mt-0.5">
                          {check.message}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Redesigned Footer with Solid Elegant Colors & CTA */}
            <div className="px-5 py-4 sm:px-7 sm:py-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                onClick={onClose}
                className="w-full sm:w-auto h-11 px-5 text-xs font-black text-slate-500 hover:text-slate-800 hover:bg-slate-150/80 rounded-xl transition-all duration-200"
              >
                {t.keepEditing}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden sm:block px-2">
                  {t.exportAs}
                </span>
                
                <div className="flex w-full sm:w-auto p-1 bg-white border border-slate-200 rounded-2xl shadow-sm gap-1">
                  <button
                    onClick={() => onProceed("pdf")}
                    className="flex-1 sm:flex-none h-9 flex items-center justify-center gap-1.5 px-4 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    <Download size={13} strokeWidth={2.5} /> PDF
                  </button>
                  <button
                    onClick={() => onProceed("docx")}
                    className="flex-1 sm:flex-none h-9 flex items-center justify-center gap-1.5 px-4 rounded-xl text-xs font-black text-[#FF4D2D] bg-orange-50 hover:bg-orange-100 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    <FileText size={13} strokeWidth={2.5} /> DOCX
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
