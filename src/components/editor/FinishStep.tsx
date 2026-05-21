import { useState } from "react";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  CheckCircle2,
  ArrowRight,
  Target,
  PenTool,
  Search,
  Share2,
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
  const [copiedLink, setCopiedLink] = useState(false);

  const isAr = language === "ar";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

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

      {/* Centered Share Link Container */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.03)] text-center relative overflow-hidden group max-w-xl mx-auto">
        <div className="absolute top-0 end-0 w-32 h-32 bg-emerald-500/[0.02] rounded-full -me-16 -mt-16 transition-transform group-hover:scale-110 duration-500" />

        <div className="space-y-5">
          <div className="mx-auto p-2.5 bg-rose-50 rounded-2xl text-[#FF4D2D] w-fit">
            <Share2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            {isAr ? "رابط المشاركة المباشر" : "Live Share Link"}
          </h3>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-sm mx-auto">
            {isAr 
              ? "انسخ رابط سيرتك الذاتية المباشر لمشاركته فوراً مع مسؤولي التوظيف والشركات."
              : "Copy your direct live resume link to immediately share it with employers and recruiters."}
          </p>
          
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 h-12 px-6 text-white bg-gradient-to-r from-rose-600 to-[#FF4D2D] hover:from-rose-700 hover:to-[#E64528] active:scale-95 transition-all rounded-2xl text-xs font-black shadow-md cursor-pointer select-none"
            >
              <Share2 size={14} />
              <span>{copiedLink ? (isAr ? "تم نسخ الرابط بنجاح!" : "Link Copied!") : (isAr ? "نسخ رابط سيرتك المباشر" : "Copy Live Link")}</span>
            </button>
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
