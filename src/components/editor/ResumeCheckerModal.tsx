import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
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
  "led",
  "managed",
  "developed",
  "created",
  "designed",
  "implemented",
  "improved",
  "increased",
  "decreased",
  "saved",
  "achieved",
  "launched",
  "built",
  "engineered",
  "architected",
  "coordinated",
  "collaborated",
  "mentored",
  "trained",
  "analyzed",
  "resolved",
  "negotiated",
  "presented",
  "wrote",
  "authored",
  "published",
  "researched",
  "investigated",
  "optimized",
  "streamlined",
  "automated",
  "transformed",
  "expanded",
  "generated",
  "delivered",
  "executed",
  "planned",
]);

export default function ResumeCheckerModal({
  isOpen,
  onClose,
  onProceed,
}: ResumeCheckerModalProps) {
  const { data } = useResumeStore();
  const { language } = useLanguageStore();
  const t = translations[language].resumeChecker;
  const { personalInfo, experience, education, skills } = data;

  const checks = [
    {
      id: "contact",
      title: t.contactTitle,
      passed: !!(
        personalInfo.email &&
        personalInfo.phone &&
        personalInfo.address
      ),
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
      passed:
        experience.length > 0 &&
        experience.every(
          (exp) =>
            exp.description.includes("•") || exp.description.includes("-"),
        ),
      message: t.bulletsMsg,
      severity: "high",
    },
    {
      id: "action_verbs",
      title: t.verbsTitle,
      passed:
        experience.length > 0 &&
        experience.some((exp) => {
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
  const score = Math.round(
    ((checks.length - failedChecks.length) / checks.length) * 100,
  );

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {t.title}
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  {t.subtitle}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
              <div className="flex items-center justify-center mb-12 mt-4">
                <div className="relative flex items-center justify-center">
                  {/* Glow Effect */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full blur-3xl opacity-25 transform scale-90 transition-colors duration-700",
                      score >= 80
                        ? "bg-emerald-400"
                        : score >= 50
                          ? "bg-orange-400"
                          : "bg-rose-400",
                    )}
                  />

                  <div className="relative">
                    <svg className="w-56 h-56 transform -rotate-90 drop-shadow-xl overflow-visible">
                      <defs>
                        <linearGradient
                          id="modal-score-gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#ff4d2d" />
                          <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                      </defs>
                      {/* Background Track */}
                      <circle
                        cx="112"
                        cy="112"
                        r="100"
                        stroke="currentColor"
                        strokeWidth="14"
                        fill="white"
                        className="text-slate-100 shadow-inner"
                      />
                      {/* Progress Circle */}
                      <circle
                        cx="112"
                        cy="112"
                        r="100"
                        stroke={
                          score >= 80
                            ? "#10b981"
                            : "url(#modal-score-gradient)"
                        }
                        strokeWidth="14"
                        fill="transparent"
                        strokeDasharray={628} // 2 * pi * 100
                        strokeDashoffset={628 - (628 * score) / 100}
                        strokeLinecap="round"
                        className={cn(
                          "transition-all duration-1000 ease-out",
                          score < 80
                            ? score >= 50
                              ? "text-orange-500"
                              : "text-rose-500"
                            : "text-emerald-500",
                        )}
                      />
                    </svg>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className={cn(
                          "text-6xl font-black tracking-tighter transition-colors duration-500",
                          score >= 80
                            ? "text-emerald-600"
                            : score >= 50
                              ? "text-orange-600"
                              : "text-rose-600",
                        )}
                      >
                        {score}%
                      </motion.span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                        {t.scoreLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {checks.map((check, index) => (
                  <motion.div
                    key={check.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all group",
                      check.passed
                        ? "bg-white border-slate-100 hover:border-emerald-100 shadow-sm"
                        : "bg-rose-50/30 border-rose-100/50 hover:border-rose-200",
                    )}
                  >
                    <div
                      className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center transition-all shadow-sm",
                        check.passed 
                          ? "bg-emerald-50 text-emerald-500 group-hover:scale-110" 
                          : "bg-rose-50 text-rose-500 group-hover:shake",
                      )}
                    >
                      {check.passed ? (
                        <CheckCircle2 size={24} strokeWidth={2.5} />
                      ) : (
                        <AlertCircle size={24} strokeWidth={2.5} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4
                        className={cn(
                          "text-base font-bold tracking-tight",
                          check.passed ? "text-slate-900" : "text-rose-900",
                        )}
                      >
                        {check.title}
                      </h4>
                      {!check.passed && (
                        <p className="text-xs text-rose-600/80 font-medium mt-0.5 leading-relaxed">
                          {check.message}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-slate-100 bg-white grid grid-cols-1 sm:grid-cols-2 items-center gap-6">
              <button
                onClick={onClose}
                className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all w-fit"
              >
                {t.keepEditing}
              </button>

              <div className="flex items-center justify-end gap-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest me-2 hidden lg:block">
                  {t.exportAs}
                </span>
                
                <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
                    <button
                        onClick={() => onProceed("pdf")}
                        className="px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-b from-[#ff4d2d] to-orange-600 text-white shadow-lg shadow-orange-200 active:scale-95 transition-all"
                    >
                        PDF
                    </button>
                    <button
                        onClick={() => onProceed("docx")}
                        className="px-5 py-2 rounded-xl text-xs font-black text-slate-600 hover:text-slate-900 hover:bg-white active:scale-95 transition-all"
                    >
                        DOCX
                    </button>
                    <button
                        onClick={() => onProceed("txt")}
                        className="px-5 py-2 rounded-xl text-xs font-black text-slate-600 hover:text-slate-900 hover:bg-white active:scale-95 transition-all"
                    >
                        TXT
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
