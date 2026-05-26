import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, AlertCircle, FileText, Download, Target, Check, HelpCircle } from "lucide-react";
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
  const passedChecks = checks.filter((c) => c.passed);
  const score = Math.round(((checks.length - failedChecks.length) / checks.length) * 100);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          dir={isAr ? "rtl" : "ltr"}
        >
          {/* Blur backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="relative w-full max-w-[560px] bg-white rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.14)] border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] z-10 my-8 font-sans"
          >
            {/* Elegant brand decorative top bar */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-orange-500 via-indigo-500 to-emerald-500 overflow-hidden" />

            {/* Subtle glow background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/30 rounded-full blur-3xl -z-10 translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-150/20 rounded-full blur-3xl -z-10 -translate-x-1/4 translate-y-1/4" />

            {/* Header section */}
            <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-indigo-55/10 flex items-center justify-center shrink-0 border border-indigo-100">
                  <Target className="text-indigo-600" size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {t.title}
                  </h2>
                  <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mt-0.5">
                    {t.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Main content body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-7 custom-scrollbar">
              
              {/* Premium score insight block */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
                
                {/* Score Dial */}
                <div className="sm:col-span-4 flex justify-center shrink-0">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90 origin-center">
                      <circle 
                        cx="48" 
                        cy="48" 
                        r="42" 
                        stroke="currentColor" 
                        strokeWidth="5" 
                        fill="none" 
                        className="text-slate-200" 
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="5"
                        fill="none"
                        strokeDasharray={263.8} 
                        strokeDashoffset={263.8 - (263.8 * (mounted ? score : 0)) / 100}
                        strokeLinecap="round"
                        className={cn(
                          "transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          score >= 80 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-[#FF4D2D]"
                        )}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                      <span className={cn(
                        "text-2xl font-black tracking-tight", 
                        score >= 80 ? "text-emerald-700" : score >= 50 ? "text-amber-700" : "text-[#FF4D2D]"
                      )}>
                        {score}%
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 scale-90">
                        {isAr ? "النتيجة" : "Score"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status indicator message */}
                <div className="sm:col-span-8 text-center sm:text-start space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                    <span className={cn(
                      "px-2 px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider",
                      score >= 80 ? "bg-emerald-50 text-emerald-700 border border-emerald-150" : 
                      score >= 50 ? "bg-amber-50 text-amber-700 border border-amber-150" : 
                      "bg-rose-50 text-[#FF4D2D] border border-rose-150"
                    )}>
                      {score >= 80 ? (isAr ? "فائق الموثوقية" : "Ready") : 
                       score >= 50 ? (isAr ? "مستوى متميز" : "Good Progress") : 
                       (isAr ? "تحتاج لإضافة تفاصيل" : "Missing Info")}
                    </span>

                    <span className="text-slate-350 select-none text-xs hidden sm:block">•</span>

                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-wide">
                      {isAr ? "جاهزية الفرز الأوتوماتيكي" : "ATS Screening Score"}
                    </h3>
                  </div>

                  <p className="text-slate-500 text-[11px] font-bold leading-normal max-w-sm">
                    {isAr 
                      ? "برامج الـ ATS تفضل السير الذاتية الكاملة. إليك تحليل سريع للعناصر المفقودة لضمان تجاوز الفرز." 
                      : "Corporate ATS checkers favor rich, structured data. We tracked missing fields so you don't get filtered."}
                  </p>
                </div>
              </div>

              {/* Categorized check sections */}
              <div className="space-y-6">
                
                {/* 1. Opportunity Items / Needs Improvement */}
                {failedChecks.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <HelpCircle size={13} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        {isAr ? "ملاحظات وتوصيات لتحسين السيرة الذاتية" : "Improvements Recommended"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {failedChecks.map((check, index) => (
                        <motion.div
                          key={check.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="flex items-start gap-3 p-3 bg-rose-50/15 border border-rose-100 rounded-xl transition-all"
                        >
                          <div className="mt-0.5 shrink-0 w-5 h-5 rounded-md bg-rose-50 border border-rose-100 flex items-center justify-center text-[#FF4D2D]">
                            <AlertCircle size={11} strokeWidth={2.5} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800">
                              {check.title}
                            </h4>
                            <p className="text-[10px] text-slate-550 font-bold leading-normal mt-0.5">
                              {check.message}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Successfully Met elements */}
                {passedChecks.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        {isAr ? "نقاط القوة المستوفاة" : "Met Criteria"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {passedChecks.map((check) => (
                        <div
                          key={check.id}
                          className="flex items-center gap-2.5 p-2.5 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-colors"
                        >
                          <div className="shrink-0 w-4.5 h-4.5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Check size={10} strokeWidth={3} />
                          </div>
                          <span className="text-xs font-bold text-slate-700 truncate">
                            {check.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Redesigned interactive Footer */}
            <div className="px-6 py-4 sm:px-8 sm:py-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 h-10 text-xs font-black text-slate-500 hover:text-slate-800 transition-colors shrink-0"
              >
                {t.keepEditing}
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden sm:block select-none">
                  {t.exportAs}
                </span>
                
                <div className="flex w-full sm:w-auto p-1 bg-white border border-slate-200 rounded-xl gap-1 shrink-0">
                  <button
                    onClick={() => onProceed("pdf")}
                    className="flex-1 sm:flex-none h-8.5 px-4 rounded-lg flex items-center justify-center gap-1 text-[11px] font-black bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <Download size={12} strokeWidth={2.5} /> PDF
                  </button>
                  <button
                    onClick={() => onProceed("docx")}
                    className="flex-1 sm:flex-none h-8.5 px-4 rounded-lg flex items-center justify-center gap-1 text-[11px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 active:scale-95 transition-all cursor-pointer border border-indigo-100/50"
                  >
                    <FileText size={12} strokeWidth={2.5} /> DOCX
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
