import React, { useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { getJobMatchResults } from "../../utils/ats";
import { Sparkles, CheckCircle2, AlertTriangle, HelpCircle, FileText, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface JobMatchAdvisorProps {
  language: string;
}

export const JobMatchAdvisor: React.FC<JobMatchAdvisorProps> = ({ language }) => {
  const { data, updateJobDescription } = useResumeStore();
  const [jdInput, setJdInput] = useState(data.jobDescription || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const results = getJobMatchResults(data);
  const isRtl = language === "ar";

  const handleApplyJD = () => {
    setIsUpdating(true);
    updateJobDescription(jdInput);
    setTimeout(() => {
      setIsUpdating(false);
    }, 400);
  };

  const handleClearJD = () => {
    setJdInput("");
    updateJobDescription("");
  };

  const scoreColorClass = (score: number) => {
    if (score >= 80) return "text-emerald-600 border-emerald-200 bg-emerald-50";
    if (score >= 50) return "text-amber-600 border-amber-200 bg-amber-50";
    return "text-rose-600 border-rose-200 bg-rose-50";
  };

  const progressColorClass = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="flex flex-col h-full bg-white p-5 space-y-5 overflow-y-auto select-none font-sans" dir={isRtl ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-[#001639]/10 rounded-xl text-[#001639]">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div className="text-start">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
            {isRtl ? "مقارن الوصف الوظيفي الذكي (ATS)" : "ATS Job Match & Keyword Advisor"}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
            {isRtl 
              ? "قارن سيرتك الذاتية مع الوصف الوظيفي المستهدف واكشف الكلمات المفتاحية الناقصة فوراً لرفع نسبة قبولك."
              : "Paste the target job description to verify compliance, extract key terms, and tailor your CV instantly."}
          </p>
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-2.5 text-start">
        <label className="text-xs font-bold text-slate-800 block">
          {isRtl ? "📋 الوصف الوظيفي المستهدف:" : "📋 Target Job Description / Requirements:"}
        </label>
        <div className="relative">
          <textarea dir="auto"
            value={jdInput}
            onChange={(e) => setJdInput(e.target.value)}
            placeholder={
              isRtl
                ? "ألصق متطلبات الوظيفة الشاغرة أو الوصف الوظيفي هنا (مثال: مطلوب مهندس برمجيات يمتلك خبرة في React و Node.js)..."
                : "Paste the hiring requirement, responsibilities, or skills list here (e.g., Seeking a frontend developer proficient in React, Tailwind)..."
            }
            className="w-full h-36 p-3 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:border-[#001639] focus:ring-1 focus:ring-[#001639]/20 resize-none leading-relaxed transition-all font-medium text-slate-700 bg-slate-50/50"
          />
          {jdInput && (
            <button
              onClick={handleClearJD}
              className="absolute top-2.5 end-2.5 p-1 hover:bg-slate-200/80 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title={isRtl ? "مسح النص" : "Clear text"}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleApplyJD}
            disabled={isUpdating}
            className="flex-1 bg-neutral-900 hover:bg-black text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-70"
          >
            {isUpdating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
            <span>{isRtl ? "بدء التحليل والمقارنة" : "Analyze & Match Now"}</span>
          </button>
        </div>
      </div>

      {/* Real-time Results Dashboard */}
      <AnimatePresence mode="wait">
        {!results ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-slate-800">
                {isRtl ? "في انتظار الوصف الوظيفي" : "Awaiting Job Details"}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[240px]">
                {isRtl
                  ? "ألصق متطلبات الوظيفة بالأعلى وسنقوم بمقارنتها بسيرتك الذاتية في أقل من ثانية!"
                  : "Insert the job specifications above to trigger the live ATS matching scorecard."}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5 text-start"
          >
            {/* Scorecard */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center gap-4 shadow-2xs">
              {/* Circular Gauge */}
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 shadow-inner">
                <span className="text-sm font-mono font-black text-slate-800">{results.matchPercentage}%</span>
                {/* Visual Progress ring */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-200" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900">
                  {isRtl ? "معدل تطابق الكلمات المفتاحية" : "Keyword Match Score"}
                </h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${progressColorClass(results.matchPercentage)}`}
                      style={{ width: `${results.matchPercentage}%` }}
                    />
                  </div>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${scoreColorClass(results.matchPercentage)}`}>
                    {results.matchPercentage >= 80 
                      ? (isRtl ? "تطابق قوي ممتاز 🔥" : "Excellent Match 🔥") 
                      : results.matchPercentage >= 50
                      ? (isRtl ? "تطابق متوسط" : "Good Match")
                      : (isRtl ? "تطابق ضعيف" : "Weak Match")}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  {isRtl
                    ? results.matchPercentage >= 80
                      ? "رائع! سيرتك غنية بالكلمات المفتاحية المطلوبة وجاهزة للعبور من أنظمة الفرز بنجاح."
                      : "تحتاج لإضافة الكلمات المفتاحية الناقصة المذكورة بالأسفل لرفع فرصة تخطي الفرز الآلي."
                    : results.matchPercentage >= 80
                    ? "Exceptional compliance! Your resume is highly compatible with the target job criteria."
                    : "Tailor your sections to include the missing keywords highlighted below."}
                </p>
              </div>
            </div>

            {/* Matched Keywords */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isRtl ? "الكلمات المفتاحية المتطابقة:" : "Matched Keywords:"}</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-100 font-mono font-bold">
                  {results.matched.length}
                </span>
              </div>
              {results.matched.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic">
                  {isRtl ? "لا توجد كلمات متطابقة بعد." : "No matching keywords found yet."}
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {results.matched.map((kw, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg px-2.5 py-1 flex items-center gap-1 shadow-2xs"
                    >
                      <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                      <span>{kw}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Missing Keywords */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
                <span>{isRtl ? "⚠️ الكلمات المفتاحية الناقصة (هام جداً):" : "⚠️ Missing Target Keywords (Crucial):"}</span>
                <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg border border-amber-100 font-mono font-bold">
                  {results.missing.length}
                </span>
              </div>
              {results.missing.length === 0 ? (
                <p className="text-[10px] text-slate-500 font-bold bg-emerald-50 border border-emerald-100 text-emerald-800 p-2.5 rounded-xl leading-relaxed">
                  {isRtl 
                    ? "✓ ممتاز! قمت بتغطية كافة الكلمات المفتاحية الرئيسية المطلوبة للوظيفة."
                    : "✓ Fantastic! You have successfully covered all target job requirements."}
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {results.missing.slice(0, 15).map((kw, idx) => (
                      <span 
                        key={idx} 
                        className="text-[10px] font-extrabold bg-amber-50/50 text-amber-800 border border-amber-200/80 rounded-lg px-2.5 py-1 shadow-2xs"
                      >
                        {kw}
                      </span>
                    ))}
                    {results.missing.length > 15 && (
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                        +{results.missing.length - 15} {isRtl ? "أخرى" : "more"}
                      </span>
                    )}
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[10px] leading-relaxed text-slate-600 font-medium">
                    {isRtl
                      ? "💡 نصيحة احترافية: قم بإضافة الكلمات المذكورة أعلاه في أقسام المهارات (Skills) أو قم بدمجها بذكاء وسلاسة داخل ملخصك المهني أو فقرات الخبرات الوظيفية لضمان قراءة مستخرج الـ ATS لها بنجاح."
                      : "💡 Tailoring Tip: Inject these missing skills into your Skills list or naturally integrate them into your Experience Bullet Points to satisfy automated screening parameters."}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
