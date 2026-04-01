import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Sparkles,
  Play,
  SkipForward,
  LayoutTemplate,
  Check,
  ArrowRight,
  FileText,
} from "lucide-react";
import { useResumeStore, ResumeData } from "../../store/useResumeStore";

interface WelcomeModalProps {
  isOpen: boolean;
  onStartTour: () => void;
  onSkip: () => void;
}

const QUICK_TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean & minimal",
    color: "bg-blue-500",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Traditional & trusted",
    color: "bg-slate-700",
    gradient: "from-slate-500/20 to-slate-700/20",
  },
  {
    id: "arabic",
    name: "Arabic (RTL)",
    description: "Optimized for RTL",
    color: "bg-emerald-600",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Stand out visually",
    color: "bg-[#ff4d2d]",
    gradient: "from-orange-500/20 to-rose-500/20",
  },
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function WelcomeModal({
  isOpen,
  onStartTour,
  onSkip,
}: WelcomeModalProps) {
  const [step, setStep] = useState<"welcome" | "template">("welcome");
  const { data, updateSettings } = useResumeStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          onClick={onSkip}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100/50"
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
                  <motion.div variants={itemVariants} className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff4d2d] to-orange-500 blur-2xl opacity-20 rounded-full" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#ff4d2d] to-orange-500 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/20 rotate-3 transform hover:rotate-6 transition-transform duration-300">
                      <Sparkles className="text-white w-12 h-12" />
                    </div>
                  </motion.div>

                  <motion.h2
                    variants={itemVariants}
                    className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 font-display tracking-tight"
                  >
                    Welcome to Hash Resume
                  </motion.h2>
                  
                  <motion.p
                    variants={itemVariants}
                    className="text-base sm:text-lg text-slate-600 mb-10 leading-relaxed max-w-md mx-auto"
                  >
                    Let's build your perfect resume in minutes. We'll show you around the editor and help you get started with a professional template.
                  </motion.p>

                  <motion.div variants={itemVariants} className="w-full flex flex-col gap-4">
                    <button
                      onClick={() => setStep("template")}
                      className="w-full bg-[#ff4d2d] hover:bg-[#e63e1d] text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 group"
                    >
                      <span>Get Started</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={onSkip}
                      className="w-full bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100 py-4 px-6 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <SkipForward size={18} />
                      Skip the tour
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
                  <motion.div variants={itemVariants} className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100/50 shadow-sm">
                    <LayoutTemplate className="text-indigo-600 w-8 h-8" />
                  </motion.div>

                  <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 font-display tracking-tight">
                    Pick a Starting Point
                  </motion.h2>
                  <motion.p variants={itemVariants} className="text-slate-500 mb-8 text-base">
                    Choose a template to begin. You can easily change this later.
                  </motion.p>

                  <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
                    {QUICK_TEMPLATES.map((t) => {
                      const isSelected = data.settings.template === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => updateSettings({ template: t.id })}
                          className={`relative p-5 rounded-2xl border-2 transition-all flex items-center gap-4 group text-start ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50/50 shadow-md shadow-indigo-500/10"
                              : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 bg-white"
                          }`}
                        >
                          <div
                            className={`w-12 h-16 rounded-lg shadow-sm flex items-center justify-center shrink-0 bg-gradient-to-br ${t.gradient} border border-white/50`}
                          >
                            <FileText size={20} className={isSelected ? "text-indigo-600" : "text-slate-400"} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-bold text-base truncate ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>
                              {t.name}
                            </div>
                            <div className="text-xs text-slate-500 truncate mt-0.5">
                              {t.description}
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
                      Back
                    </button>
                    <button
                      onClick={onStartTour}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-4 px-6 rounded-2xl font-bold transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Play size={18} fill="currentColor" />
                      Start Editing
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
