import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  CheckCircle2,
  ArrowRight,
  Target,
  PenTool,
  Search,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

interface FinishStepProps {
  onPrint?: () => void;
  onExportWord?: () => void;
  onJumpToStep: (step: string) => void;
}

export default function FinishStep({
  onJumpToStep,
}: FinishStepProps) {
  const { language } = useLanguageStore();
  const t = translations[language].landing.finish;

  const isAr = language === "ar";

  const nextSteps = [
    {
      title: t.findJobs || "Apply with Hash Hunt",
      desc: t.findJobsDesc || "Publish your CV to our partner employers.",
      icon: <Search className="w-6 h-6 text-emerald-500" />,
      path: "/hash-hunt",
      type: "link",
    },
    {
      title: t.checkAts,
      desc: t.checkAtsDesc,
      icon: <Target className="w-6 h-6 text-indigo-500" />,
      action: () => onJumpToStep("finish"),
      type: "button",
    },
    {
      title: t.createCover,
      desc: t.createCoverDesc,
      icon: <PenTool className="w-6 h-6 text-orange-500" />,
      path: "/cover-letter",
      type: "link",
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 max-w-4xl mx-auto relative">
      
      {/* Celebratory Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-2"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </motion.div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {t.readyTitle}
        </h2>
        <p className="text-slate-500 text-lg">{t.readySubtitle}</p>
      </div>

      {/* Promoted AI Interview Coach Standalone Feature */}
      <div className="bg-gradient-to-tr from-slate-900 via-slate-850 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl max-w-xl mx-auto text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-radial from-orange-500/[0.08] to-transparent pointer-events-none" />
        <div className="space-y-4">
          <div className="mx-auto p-3 bg-white/10 rounded-2xl text-[#FF4D2D] w-fit font-black animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight">
            {isAr ? "مستشار المقابلات الشخصية بالذكاء الاصطناعي" : "AI Interview Prep & Coach"}
          </h3>
          <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-md mx-auto">
            {isAr
              ? "هل أنهيت إعداد سيرتك الذاتية؟ جرب ميزتنا الحصرية في صفحة منفصلة! تدرّب على محاكاة أسئلة المقابلات الشخصية بناءً على خبراتك وحصد وظيفة أحلامك الآن."
              : "Finished compiling your resume? Test your performance using our separate master page tool! Prepare with exact contextual situational interview questions."}
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              to="/interview-prep"
              className="flex items-center gap-2 h-11 px-6 bg-[#FF4D2D] hover:bg-[#E64528] active:scale-95 transition-all text-white rounded-2xl text-xs font-black shadow-md cursor-pointer select-none"
            >
              <span>{isAr ? "دخول مستشار المقابلات الآن" : "Launch Prep Coach"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Next Steps Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 px-2 text-start">
          {t.nextStepsTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nextSteps.map((step, idx) =>
            step.type === "link" ? (
              <Link
                key={idx}
                to={step.path!}
                className="group p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:bg-slate-50 hover:shadow-xl hover:shadow-slate-500/5 transition-all duration-300 text-start"
              >
                <div className="mb-4 p-4 bg-slate-50 rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  {step.title}
                  <ArrowRight
                    size={16}
                    className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-180"
                  />
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </Link>
            ) : (
              <button
                key={idx}
                onClick={step.action}
                className="group p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:bg-slate-50 hover:shadow-xl hover:shadow-slate-500/5 transition-all duration-300 text-start cursor-pointer w-full"
              >
                <div className="mb-4 p-4 bg-slate-50 rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  {step.title}
                  <ArrowRight
                    size={16}
                    className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-180"
                  />
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
