import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, AlertCircle, FileText, Download, Target, Sparkles, Wand2 } from "lucide-react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import { cn } from "@/lib/utils";

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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          dir={isAr ? "rtl" : "ltr"}
        >
          {/* Cosmic Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Top accent glow */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-600 to-teal-500" />

            {/* Header */}
            <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                  <Target className="text-emerald-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {t.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1 max-w-sm leading-relaxed">
                    {t.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
              
              {/* Score Circular Indicator */}
              <div className="flex flex-col md:flex-row items-center gap-8 mb-10 bg-slate-50 p-6 rounded-3xl border border-slate-100 relative overflow-hidden">
                {/* Background ambient glow inside the card */}
                <div className={cn(
                  "absolute flex -top-10 -right-10 w-40 h-40 blur-[50px] opacity-30 rounded-full pointer-events-none transition-colors duration-1000",
                  score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500"
                )} />

                <div className="relative flex items-center justify-center w-36 h-36 shrink-0">
                  <svg className="w-full h-full transform -rotate-90 origin-center drop-shadow-sm">
                    <defs>
                      <linearGradient id="scoreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444"} />
                        <stop offset="100%" stopColor={score >= 80 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171"} />
                      </linearGradient>
                    </defs>
                    {/* Background Track */}
                    <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-200/60" />
                    {/* Progress Circle */}
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      stroke="url(#scoreGlow)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={402} 
                      strokeDashoffset={402 - (402 * (mounted ? score : 0)) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span 
                      initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}
                      className={cn("text-4xl font-black tracking-tighter", score >= 80 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-rose-600")}
                    >
                      {score}%
                    </motion.span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      {t.scoreLabel}
                    </span>
                  </div>
                </div>

                <div className="text-center md:text-start flex-1">
                  <h3 className={cn("text-xl font-bold mb-2", score >= 80 ? "text-emerald-700" : score >= 50 ? "text-amber-700" : "text-rose-700")}>
                    {score >= 80 ? (isAr ? "عمل رائع! سيرتك جاهزة للتقديم 🚀" : "Great job! Resume is ready 🚀") : 
                     score >= 50 ? (isAr ? "بداية جيدة، تحتاج لبعض التحسينات 💡" : "Good start, needs tweaks 💡") : 
                     (isAr ? "تحتاج إلى اهتمام ومراجعة أعمق ⚠️" : "Needs deeper review ⚠️")}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                    {isAr ? "هذا التقييم يعتمد على معايير أنظمة التتبع (ATS) لضمان عبور سيرتك بنجاح عبر الفلاتر الذكية لمسؤولي التوظيف." : "Score based on ATS formatting logic to ensure you pass successfully through HR smart filters."}
                  </p>
                </div>
              </div>

              {/* Checks List */}
              <div className="space-y-3">
                {checks.map((check, index) => (
                  <motion.div
                    key={check.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300",
                      check.passed 
                        ? "bg-white border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]" 
                        : "bg-rose-50/50 border-rose-100 shadow-[0_2px_10px_-4px_rgba(244,63,94,0.1)]"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                      check.passed ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                    )}>
                      {check.passed ? <CheckCircle2 size={18} strokeWidth={2.5} /> : <AlertCircle size={18} strokeWidth={2.5} />}
                    </div>
                    <div className="flex-1">
                      <h4 className={cn("text-sm font-bold tracking-tight mb-1", check.passed ? "text-slate-800" : "text-rose-900")}>
                        {check.title}
                      </h4>
                      {!check.passed && (
                        <p className="text-xs text-rose-600/90 font-medium leading-relaxed">
                          {check.message}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className="px-6 py-5 sm:px-8 sm:py-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 text-xs font-black text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-all"
              >
                {t.keepEditing}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block px-2">
                  {t.exportAs}
                </span>
                
                <div className="flex w-full sm:w-auto p-1.5 bg-white border border-slate-200/80 rounded-2xl shadow-sm gap-1">
                    <button
                        onClick={() => onProceed("pdf")}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-95 transition-all"
                    >
                        <Download size={14} /> PDF
                    </button>
                    <button
                        onClick={() => onProceed("docx")}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 active:scale-95 transition-all"
                    >
                        <FileText size={14} /> DOCX
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

