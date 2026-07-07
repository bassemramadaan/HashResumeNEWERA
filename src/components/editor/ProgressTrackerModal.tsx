import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Briefcase, GraduationCap, Wrench, Target, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResumeData } from '@/types/resume';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations } from '@/i18n/translations';

interface ProgressTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  activeTab: string;
  onJumpToStep: (id: string) => void;
}

export const ProgressTrackerModal: React.FC<ProgressTrackerModalProps> = ({
  isOpen,
  onClose,
  data,
  activeTab,
  onJumpToStep,
}) => {
  const { language } = useLanguageStore();
  const t = translations[language].editor.progressTracker;
  const isRtl = language === 'ar';

  const steps = [
    {
      id: "basics",
      label: String(t.steps.basics || "Basic Info"),
      icon: User,
      done: !!(data.personalInfo.fullName && data.personalInfo.email),
    },
    {
      id: "experience",
      label: String(t.steps.experience || "Experience"),
      icon: Briefcase,
      done: data.experience.length > 0,
    },
    {
      id: "education",
      label: String(t.steps.education || "Education"),
      icon: GraduationCap,
      done: data.education.length > 0,
    },
    {
      id: "skills",
      label: String(t.steps.skills || "Skills"),
      icon: Wrench,
      done: data.skills.length > 0,
    },
    {
      id: "finish",
      label: String(t.steps.polish || "Review & Polish"),
      icon: Target,
      done: false,
    },
  ];

  const filledCount = steps.filter((s) => s.done).length;
  const progressPercent = Math.round((filledCount / (steps.length - 1)) * 100);
  const estimatedTime =
    progressPercent === 100 ? 0 : progressPercent > 50 ? 2 : 5;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-neutral-50 rounded-3xl shadow-2xl overflow-hidden border border-neutral-200"
          >
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl mb-4">
                  <Target size={32} />
                </div>
                <h2 className="text-2xl font-black text-neutral-900 mb-2">
                  {String(t.title || "")}
                </h2>
                <p className="text-neutral-500 text-sm">{String(t.subtitle || "")}</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-neutral-400 mb-2 px-1">
                  <span>{progressPercent}% Complete</span>
                  <span>
                    {estimatedTime > 0
                      ? String(t.estimatedTime || "").replace(
                          "{time}",
                          estimatedTime.toString(),
                        )
                      : String(t.ready || "")}
                  </span>
                </div>
                <div className="h-3 bg-neutral-100 rounded-full overflow-hidden mb-8">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-brand-500"
                  />
                </div>

                <div className="relative">
                  {/* Decorative timeline connecting line running through icon centers */}
                  <div className={cn(
                    "absolute top-9 bottom-9 w-1 bg-neutral-200 rounded-full z-0",
                    isRtl ? "right-9" : "left-9"
                  )}>
                    <motion.div 
                      className="w-full bg-gradient-to-b from-[#FF4D2D] to-orange-400 rounded-full origin-top"
                      initial={{ height: "0%" }}
                      animate={{ height: `${linePercent}%` }}
                      transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    />
                  </div>

                  <div className="grid gap-4.5 relative z-10">
                    {steps.map((step) => {
                      const Icon = step.icon;
                      const isActive = activeTab === step.id;
                      return (
                        <button
                          key={step.id}
                          onClick={() => {
                            onJumpToStep(step.id);
                            onClose();
                          }}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-2xl border transition-all text-start group relative z-10",
                            isActive
                              ? "bg-white border-slate-300 shadow-md ring-1 ring-slate-100/50"
                              : "bg-white/90 backdrop-blur-xs border-neutral-100 hover:bg-neutral-50 hover:border-neutral-200",
                          )}
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
                              step.done
                                ? "bg-emerald-50 text-emerald-600"
                                : isActive
                                  ? "bg-slate-900 text-white"
                                  : "bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200",
                            )}
                          >
                            {step.done ? (
                              <CheckCircle2 size={20} />
                            ) : (
                              <Icon size={20} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3
                              className={cn(
                                "font-bold text-sm",
                                isActive
                                  ? "text-neutral-900"
                                  : "text-neutral-600 group-hover:text-neutral-900",
                              )}
                            >
                              {step.label}
                            </h3>
                          </div>
                          <div className="text-neutral-300 pointer-events-none">
                            <CheckCircle2
                              size={16}
                              className={cn(
                                "transition-all",
                                step.done
                                  ? "text-emerald-500 opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full mt-8 bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 active:scale-95"
                >
                  {String(t.continue || "Continue Editing")}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
