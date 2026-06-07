import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, AlertCircle, FileText, Download, Target, Check, Sparkles } from "lucide-react";
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

// ── Role Dictionary for Immediate Keywords ──

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
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    } else {
      setMounted(false);
    }
  }, [isOpen]);

  const checks = [
    {
      id: "contact",
      title: t.contactTitle,
      passed: !!(personalInfo.email && personalInfo.phone && personalInfo.address),
      message: t.contactMsg,
    },
    {
      id: "summary",
      title: t.summaryTitle,
      passed: !!(personalInfo.summary && personalInfo.summary.length > 50),
      message: t.summaryMsg,
    },
    {
      id: "experience_bullets",
      title: t.bulletsTitle,
      passed: experience.length > 0 && experience.every((exp) => exp.description.includes("•") || exp.description.includes("-")),
      message: t.bulletsMsg,
    },
    {
      id: "action_verbs",
      title: t.verbsTitle,
      passed: experience.length > 0 && experience.some((exp) => {
        const words = exp.description.toLowerCase().split(/\s+/);
        return words.some((w) => ACTION_VERBS.has(w));
      }),
      message: t.verbsMsg,
    },
    {
      id: "skills",
      title: t.skillsTitle,
      passed: skills.length >= 5,
      message: t.skillsMsg,
    },
    {
      id: "education",
      title: t.educationTitle,
      passed: education.length > 0,
      message: t.educationMsg,
    },
  ];

  const failedChecks = checks.filter((c) => !c.passed);
  const score = Math.round(((checks.length - failedChecks.length) / checks.length) * 100);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          dir={isAr ? "rtl" : "ltr"}
        >
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-[500px] bg-white rounded-3xl shadow-[0_24px_50px_rgba(18,18,16,0.12)] border border-neutral-100/80 overflow-hidden flex flex-col max-h-[85vh] z-10 font-sans"
          >
            {/* Minimal Brand Gradient Top Decorator */}
            <div className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-brand-500 via-brand-600 to-amber-500" />

            {/* Header section - Balanced & Spacious */}
            <div className="px-5 pt-6 pb-4 sm:px-7 border-b border-neutral-100 flex justify-between items-center bg-white">
              <div className="flex gap-2.5 items-center">
                <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 border border-brand-100/40 text-brand-500 shadow-xs">
                  <Target size={16} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900 leading-tight">
                    {t.title}
                  </h2>
                  <p className="text-[10px] text-neutral-400 font-medium tracking-wider mt-0.5">
                    {t.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-full transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Scrollable content body */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-5 custom-scrollbar bg-neutral-50/10">
              
              {/* Premium score gauge - Compact Row Card */}
              <div className="flex flex-col sm:flex-row items-center gap-4.5 bg-white p-4 sm:p-5 rounded-2xl border border-neutral-100 shadow-xs">
                {/* Minimalist Dial */}
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90 origin-center">
                    <circle 
                      cx="36" 
                      cy="36" 
                      r="31" 
                      stroke="currentColor" 
                      strokeWidth="3.5" 
                      fill="none" 
                      className="text-neutral-50" 
                    />
                    <circle
                      cx="36"
                      cy="36"
                      r="31"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      fill="none"
                      strokeDasharray={194.7} 
                      strokeDashoffset={194.7 - (194.7 * (mounted ? score : 0)) / 100}
                      strokeLinecap="round"
                      className={cn(
                        "transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        score >= 80 ? "text-emerald-500" : score >= 50 ? "text-brand-500" : "text-amber-550"
                      )}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn(
                      "text-lg font-extrabold tracking-tight", 
                      score >= 80 ? "text-emerald-700" : score >= 50 ? "text-brand-600" : "text-amber-700"
                    )}>
                      {score}%
                    </span>
                  </div>
                </div>

                {/* Score analysis text */}
                <div className="text-center sm:text-start space-y-1 flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 leading-none select-none",
                      score >= 80 ? "bg-emerald-50 text-emerald-700 border border-emerald-100/30" : 
                      score >= 50 ? "bg-brand-50 text-brand-600 border border-brand-100/30" : 
                      "bg-amber-50 text-amber-700 border border-amber-100/30"
                    )}>
                      {score >= 80 && <Sparkles size={8} className="text-emerald-500" />}
                      <span>
                        {score >= 80 ? (isAr ? "جاهزية ممتازة" : "Excellent Ready") : 
                         score >= 50 ? (isAr ? "مستوى متميز" : "Very Good") : 
                         (isAr ? "يحتاج تفاصيل" : "Needs Detail")}
                      </span>
                    </span>
                    <span className="text-[11px] font-bold text-neutral-800">
                      {isAr ? "معدل ملاءمة الـ ATS" : "ATS Readiness Score"}
                    </span>
                  </div>
                  <p className="text-neutral-500 text-[11px] leading-relaxed">
                    {isAr 
                      ? "فحص فوري ذكي لعناصر سيرتك الذاتية لضمان تفوقها وتجاوزها لفلترة أنظمة التوظيف بنجاح." 
                      : "A smart diagnostic evaluating your layout structure and contents to bypass typical applicant screen systems."}
                  </p>
                </div>
              </div>

              {/* Minimal integrated checklist */}
              <div className="space-y-2.5">
                {checks.map((check) => (
                  <div
                    key={check.id}
                    className={cn(
                      "flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-155",
                      check.passed 
                        ? "bg-white border-neutral-100 opacity-60 hover:opacity-100" 
                        : "bg-white border-neutral-200/50 hover:border-brand-100 hover:shadow-2xs"
                    )}
                  >
                    {/* Circle icon with check or dynamic warning dot */}
                    <div className={cn(
                      "mt-0.5 shrink-0 w-4.5 h-4.5 rounded-full flex items-center justify-center border",
                      check.passed 
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                        : "bg-brand-50 border-brand-100/40 text-brand-500"
                    )}>
                      {check.passed ? (
                        <Check size={9} strokeWidth={3.5} />
                      ) : (
                        <AlertCircle size={9} strokeWidth={2.5} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={cn(
                        "text-xs font-bold leading-none",
                        check.passed ? "text-neutral-450 line-through decoration-neutral-300" : "text-neutral-900"
                      )}>
                        {check.title}
                      </h4>
                      {!check.passed && (
                        <p className="text-[10px] text-neutral-550 leading-normal mt-1 font-medium">
                          {check.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with actions - Cohesive, simplified & premium */}
            <div className="px-5 py-4 sm:px-7 border-t border-neutral-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <button
                onClick={onClose}
                className="w-full sm:w-auto text-xs font-bold text-neutral-400 hover:text-neutral-700 transition-colors shrink-0 text-center py-2 cursor-pointer order-2 sm:order-none"
              >
                {t.keepEditing}
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest hidden sm:block select-none">
                  {t.exportAs}
                </span>
                
                <div className="flex w-full sm:w-auto p-1 bg-neutral-50 rounded-xl gap-1 shrink-0 border border-neutral-100">
                  <button
                    onClick={() => onProceed("pdf")}
                    className="flex-grow sm:flex-none h-8.5 px-3.5 rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-brand-500/10 leading-none transition-all active:scale-95 cursor-pointer"
                  >
                    <Download size={11} strokeWidth={2.5} />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => onProceed("docx")}
                    className="flex-grow sm:flex-none h-8.5 px-3.5 rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-bold text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-200 shadow-3xs leading-none transition-all active:scale-95 cursor-pointer"
                  >
                    <FileText size={11} strokeWidth={2.5} />
                    <span>DOCX</span>
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
