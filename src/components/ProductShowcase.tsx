import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";
import { Sparkles, Target, CheckCircle2 } from "lucide-react";

export default function ProductShowcase() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 font-display tracking-tight">
          {t.showcaseTitle}
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          {t.showcaseSubtitle}
        </p>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[500px]">
            {/* Left Panel: Editor */}
            <div
              className="flex-1 border-e border-slate-200 p-8 flex flex-col bg-slate-50/50"
              dir="ltr"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-4 rounded-full bg-rose-400"></div>
                <div className="w-4 h-4 rounded-full bg-amber-400"></div>
                <div className="w-4 h-4 rounded-full bg-emerald-400"></div>
                <div className="ms-4 text-sm font-medium text-slate-500">
                  Experience Editor
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex-1 shadow-sm relative">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-bold text-slate-700">
                    Software Engineer
                  </div>
                  <motion.button
                    animate={{
                      scale: step >= 1 ? [1, 1.1, 1] : 1,
                      backgroundColor: step >= 1 ? "var(--color-indigo-500)" : "var(--color-indigo-50)",
                      color: step >= 1 ? "white" : "var(--color-indigo-500)",
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors border border-orange-100"
                  >
                    <Sparkles size={14} />
                    AI Enhance
                  </motion.button>
                </div>

                <div className="relative h-32">
                  <AnimatePresence mode="wait">
                    {step === 0 ? (
                      <motion.div
                        key="raw"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-slate-500 font-mono text-sm leading-relaxed"
                      >
                        <span className="typing-animation-1">
                          Did stuff at company X.
                        </span>
                        <br />
                        <span className="typing-animation-2">
                          Fixed bugs and wrote code.
                        </span>
                        <br />
                        <span className="typing-animation-3">
                          Used React and Node.
                        </span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="enhanced"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-slate-700 text-sm leading-relaxed space-y-2"
                      >
                        <div className="flex items-start gap-2">
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-orange-500 mt-2"
                          >
                            •
                          </motion.span>
                          <span>
                            Spearheaded the development of scalable web
                            applications using React and Node.js, improving load
                            times by 40%.
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-orange-500 mt-2"
                          >
                            •
                          </motion.span>
                          <span>
                            Resolved 50+ critical bugs, increasing overall
                            system stability and user satisfaction.
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Panel: ATS Score */}
            <div
              className="w-full md:w-80 bg-slate-50 p-8 flex flex-col items-center justify-center border-t md:border-t-0 md:border-s border-slate-200"
              dir="ltr"
            >
              <div className="text-center mb-8">
                <Target className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                <h3 className="font-bold text-slate-900">Live ATS Score</h3>
                <p className="text-xs text-slate-500 mt-2">
                  Updates as you type
                </p>
              </div>

              <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={440}
                    style={{
                      strokeDashoffset:
                        step === 0
                          ? 440 - (440 * 75) / 100
                          : 440 - (440 * 95) / 100,
                      stroke: step === 0 ? "#eab308" : "#10b981",
                      transition: "all 1.5s ease-out",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="text-4xl font-black"
                    style={{
                      color: step === 0 ? "#eab308" : "#10b981",
                      transition: "color 1.5s ease-out",
                    }}
                  >
                    {step === 0 ? "75" : "95"}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    / 100
                  </span>
                </div>
              </div>

              {step >= 1 && (
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                  <CheckCircle2 size={16} />
                  ATS Optimized!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
 .typing-animation-1 { overflow: hidden; white-space: nowrap; display: inline-block; animation: typing 1s steps(20, end);}
 .typing-animation-2 { overflow: hidden; white-space: nowrap; display: inline-block; animation: typing 1s steps(20, end) 1s both;}
 .typing-animation-3 { overflow: hidden; white-space: nowrap; display: inline-block; animation: typing 1s steps(20, end) 2s both;}
 @keyframes typing { from { width: 0} to { width: 100%}}
`}</style>
    </section>
  );
}
