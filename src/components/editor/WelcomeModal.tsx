import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Play,
  SkipForward,
  LayoutTemplate,
  Check,
} from "lucide-react";
import { useResumeStore, ResumeData } from "../../store/useResumeStore";

interface WelcomeModalProps {
  isOpen: boolean;
  onStartTour: () => void;
  onSkip: () => void;
}

const QUICK_TEMPLATES = [
  { id: "modern", name: "Modern", color: "bg-blue-500" },
  { id: "professional", name: "Professional", color: "bg-slate-700" },
  { id: "arabic", name: "Arabic (RTL)", color: "bg-emerald-600" },
  { id: "creative", name: "Creative", color: "bg-orange-500" },
] as const;

export default function WelcomeModal({
  isOpen,
  onStartTour,
  onSkip,
}: WelcomeModalProps) {
  const [step, setStep] = useState<"welcome" | "template">("welcome");
  const { data, updateSettings } = useResumeStore();

  if (!isOpen) return null;

  const handleTemplateSelect = (
    templateId: ResumeData["settings"]["template"],
  ) => {
    updateSettings({ template: templateId });
    onStartTour();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onSkip}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        >
          <div className="absolute top-0 start-0 w-full h-32 bg-gradient-to-br from-orange-500 to-amber-600 opacity-10"></div>

          <div className="relative p-8 text-center">
            {step === "welcome" ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mx-auto mb-6 rotate-3">
                  <Sparkles className="text-white w-10 h-10" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-4 font-display">
                  Welcome to Hash Resume!
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Let's take a quick tour to help you build your perfect resume
                  in minutes. We'll show you the key features and how to get the
                  most out of our editor.
                </p>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setStep("template")}
                    className="w-full bg-[#ff4d2d] hover:bg-[#e63e1d] text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <LayoutTemplate size={18} />
                    Choose a Template
                  </button>

                  <button
                    onClick={onSkip}
                    className="w-full bg-white text-slate-500 hover:text-slate-700 :text-slate-200 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 hover:bg-slate-50 :bg-slate-700/50"
                  >
                    <SkipForward size={18} />
                    Skip for Now
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <LayoutTemplate className="text-indigo-600 w-8 h-8" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-2 font-display">
                  Pick a Starting Point
                </h2>
                <p className="text-slate-600 mb-6 text-sm">
                  You can always change this later in the settings.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {QUICK_TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTemplateSelect(t.id)}
                      className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 group ${
                        data.settings.template === t.id
                          ? "border-indigo-500 bg-indigo-50 "
                          : "border-slate-200 hover:border-indigo-300 :border-indigo-700 hover:bg-slate-50 :bg-slate-800/50"
                      }`}
                    >
                      <div
                        className={`w-12 h-16 rounded shadow-sm ${t.color} opacity-80 group-hover:opacity-100 transition-opacity`}
                      />
                      <span className="font-bold text-sm text-slate-700">
                        {t.name}
                      </span>
                      {data.settings.template === t.id && (
                        <div className="absolute top-2 end-2 bg-indigo-500 text-white p-1 rounded-full">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={onStartTour}
                  className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 :bg-slate-700 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Play size={18} fill="currentColor" />
                  Continue to Editor
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
