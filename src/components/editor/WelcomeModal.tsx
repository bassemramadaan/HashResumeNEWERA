import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Play,
  SkipForward,
  LayoutTemplate,
  Check,
  ArrowRight,
  FileText,
} from "lucide-react";
import Logo from "../Logo";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";

interface WelcomeModalProps {
  isOpen: boolean;
  onStartTour: () => void;
  onSkip: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20, 
    transition: { 
      duration: 0.3,
      ease: "easeInOut"
    } 
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { 
      type: "spring",
      damping: 20,
      stiffness: 100
    } 
  },
};

const QUICK_TEMPLATES = [
  { id: "modern", gradient: "from-indigo-600 to-blue-600", color: "text-indigo-600" },
  { id: "professional", gradient: "from-slate-700 to-slate-900", color: "text-slate-700" },
  { id: "creative", gradient: "from-purple-600 to-pink-600", color: "text-purple-600" },
  { id: "arabic", gradient: "from-emerald-600 to-teal-600", color: "text-emerald-600" },
];

export default function WelcomeModal({
  isOpen,
  onStartTour,
  onSkip,
}: WelcomeModalProps) {
  const [step, setStep] = useState<"welcome" | "template">("welcome");
  const { data, updateSettings } = useResumeStore();
  const { language } = useLanguageStore();
  const t = translations[language].welcomeModal;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md"
            onClick={onSkip}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-xl bg-slate-50 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100/50"
          >
            {/* Decorative Top Gradient */}
            <div className="absolute top-0 start-0 w-full h-40 bg-gradient-to-br from-orange-50 to-indigo-50 opacity-50 pointer-events-none" />

            <div className="relative p-8 sm:p-10 text-center">
              <AnimatePresence mode="wait">
                {step === "welcome" ? (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div variants={itemVariants} className="relative mb-8 flex justify-center">
                      <Logo className="w-64 sm:w-80 h-auto" variant="gradient" />
                    </motion.div>

                    <motion.h2
                      variants={itemVariants}
                      className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 font-display tracking-tight"
                    >
                      {t.welcomeTitle}
                    </motion.h2>
                    
                    <motion.p
                      variants={itemVariants}
                      className="text-base sm:text-lg text-slate-600 mb-10 leading-relaxed max-w-md mx-auto"
                    >
                      {t.welcomeDesc}
                    </motion.p>

                    <motion.div variants={itemVariants} className="w-full flex flex-col gap-4">
                      <button
                        onClick={() => setStep("template")}
                        className="w-full bg-[#ff4d2d] hover:bg-[#e63e1d] text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 group"
                      >
                        <span>{t.getStarted}</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        onClick={onSkip}
                        className="w-full bg-slate-50 text-slate-600 hover:text-slate-700 hover:bg-slate-100 py-4 px-6 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <SkipForward size={18} />
                        {t.skipTour}
                      </button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="template"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div variants={itemVariants} className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-b from-indigo-400 to-indigo-600 shadow-[0_8px_16px_-6px_rgba(79,70,229,0.5),inset_0_2px_0_rgba(255,255,255,0.2)] flex items-center justify-center mb-6 relative overflow-hidden">
                      <LayoutTemplate className="text-white w-8 h-8 relative z-10 drop-shadow-sm" />
                    </motion.div>

                    <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 font-display tracking-tight">
                      {t.pickTemplate}
                    </motion.h2>
                    <motion.p variants={itemVariants} className="text-slate-500 mb-8 text-base">
                      {t.pickTemplateDesc}
                    </motion.p>

                    <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
                      {QUICK_TEMPLATES.map((tpl) => {
                        const isSelected = data.settings.template === tpl.id;
                        const templateInfo = t.templates[tpl.id as keyof typeof t.templates];
                        return (
                          <button
                            key={tpl.id}
                            onClick={() => updateSettings({ template: tpl.id })}
                            className={`relative p-5 rounded-2xl border-2 transition-all flex items-center gap-4 group text-start ${
                              isSelected
                                ? "border-indigo-500 bg-indigo-50/50 shadow-md shadow-indigo-500/10"
                                : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 bg-slate-50"
                            }`}
                          >
                            <div
                              className={`w-12 h-16 rounded-lg shadow-sm flex items-center justify-center shrink-0 bg-gradient-to-br ${tpl.gradient} border border-slate-200/50`}
                            >
                              <FileText size={20} className={isSelected ? "text-indigo-600" : "text-slate-500"} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-bold text-base truncate ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>
                                {templateInfo.name}
                              </div>
                              <div className="text-xs text-slate-500 truncate mt-0.5">
                                {templateInfo.desc}
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              isSelected ? "border-indigo-500 bg-indigo-500" : "border-slate-200 group-hover:border-indigo-300"
                            }`}>
                              {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>

                    <motion.div variants={itemVariants} className="w-full flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => setStep("welcome")}
                        className="w-full sm:w-auto px-6 py-4 rounded-2xl font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        {t.back}
                      </button>
                      <button
                        onClick={onStartTour}
                        className="flex-1 bg-slate-900 hover:bg-zinc-800 text-slate-50 py-4 px-6 rounded-2xl font-bold transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Play size={18} fill="currentColor" />
                        {t.startEditing}
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
