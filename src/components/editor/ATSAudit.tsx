import { useMemo } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  CheckCircle2,
  AlertCircle,
  Activity,
  Target,
  Wand2,
  Check,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateATSScore } from "../../utils/ats";
import { ATSAnalyzer } from "../ATSAnalyzer";

export default function ATSAudit() {
  const { data, updateJobDescription } = useResumeStore();
  const { language } = useLanguageStore();
  const t = translations[language].atsAudit;
  const { personalInfo } = data;
  const isAr = language === "ar";

  const { score, sections } = useMemo(() => calculateATSScore(data), [data]);
  const isEmpty = score === 0 && !personalInfo.fullName;

  if (isEmpty) {
    return (
      <div className="space-y-6 font-sans max-w-4xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100 shadow-xs">
            <Target className="text-orange-500" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-950">{t.title}</h2>
            <p className="text-[11px] text-slate-500 font-medium">HashResume Automated Intelligence</p>
          </div>
        </div>

        <div className="bg-white p-8 md:p-14 rounded-3xl border border-slate-200/70 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-slate-100">
            <Activity className="text-slate-400 animate-pulse" size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">{t.noDataTitle}</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">{t.noDataDesc}</p>
          </div>
        </div>
      </div>
    );
  }

  // Visual status markers matching premium tone
  const getScoreVerdict = (s: number) => {
    if (s >= 85) return { text: isAr ? "سيرة مثالية وجاهزة!" : "Highly Optimized", color: "text-emerald-600 bg-emerald-50 border-emerald-150" };
    if (s >= 65) return { text: isAr ? "جيدة وتحتاج تحسين طفيف" : "Needs Adjustments", color: "text-amber-600 bg-amber-50 border-amber-150" };
    return { text: isAr ? "تحتاج إعادة هيكلة" : "Critical Optimization Required", color: "text-rose-600 bg-rose-50 border-rose-150" };
  };

  const scoreVerdict = getScoreVerdict(score);

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Title Header area */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-xs">
            <Target className="text-indigo-600 animate-pulse" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">
              {t.title}
            </h2>
            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
              {isAr ? "تحليل فوري قبل تفعيل التصدير" : "Instance diagnostic before lock"}
            </p>
          </div>
        </div>
        
        <div className={`px-3 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 ${scoreVerdict.color}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
          <span>{scoreVerdict.text}</span>
        </div>
      </div>

      {/* Main Core Score Dashboard Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Metric gauge Card */}
        <div className="lg:col-span-4 bg-white border border-slate-200/70 p-6 md:p-8 rounded-3xl shadow-xs flex flex-col items-center justify-center text-center space-y-5 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 to-orange-500" />
          
          <div className="relative flex items-center justify-center w-36 h-36">
            <svg className="w-full h-full transform -rotate-90 absolute inset-0">
              <circle
                cx="72"
                cy="72"
                r="62"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="72"
                cy="72"
                r="62"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={390}
                strokeDashoffset={390 - (390 * Math.min(score, 100)) / 100}
                className={cn(
                  "transition-all duration-1000 ease-out text-indigo-600"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                {score}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                {t.scoreOutOf}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-sm font-extrabold text-slate-950">
              {score >= 80 ? t.greatJob : score >= 50 ? t.goodStart : t.needsImprovement}
            </h4>
            <p className="text-[11px] text-slate-500 max-w-[220px] mx-auto leading-relaxed">
              {t.atsExplanation}
            </p>
          </div>
        </div>

        {/* Section Breakdown Grid list */}
        <div className="lg:col-span-8 bg-white border border-slate-200/70 p-6 md:p-8 rounded-3xl shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
              {t.sectionBreakdown}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section, idx) => {
              const pct = section.maxScore > 0 ? (section.score / section.maxScore) * 100 : 0;
              const isPerfect = section.score === section.maxScore;
              return (
                <div key={idx} className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">{section.title}</span>
                    <span className={`font-extrabold px-1.5 py-0.5 rounded-md text-[10px] ${
                      isPerfect ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {section.score}/{section.maxScore}
                    </span>
                  </div>
                  
                  <div className="w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500 rounded-full",
                        isPerfect ? "bg-emerald-500" : pct > 50 ? "bg-indigo-500" : "bg-orange-500"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Job Description Tailoring */}
      <div className="bg-white border border-slate-200/70 rounded-3xl p-6 md:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100">
              <Wand2 className="text-orange-500" size={16} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {isAr ? "مقارن الوصف الوظيفي الذكي (Instant Matching)" : "AI Job Description Mirroring"}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {isAr 
                  ? "الصق متطلبات الوظيفة الشاغرة لتحليل الثغرات المهارية وحلها قبل تنزيل الملف." 
                  : "Compare against corporate vacancies to immediately find core skill targets."}
              </p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <textarea
            value={data.jobDescription || ""}
            onChange={(e) => updateJobDescription(e.target.value)}
            placeholder={isAr ? "الصق متطلبات الوظيفة الشاغرة ومؤهلاتها هنا..." : "Paste corporate job description terms, requirements or specifications..."}
            className="w-full h-28 p-4 border border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 rounded-2xl transition-all text-xs resize-none"
            dir={isAr ? "rtl" : "ltr"}
          />
          {!data.jobDescription && (
            <div className={`absolute bottom-3 ${isAr ? 'left-3' : 'right-3'} flex items-center gap-1.5 text-[10px] font-bold text-slate-400 select-nonepointer-events-none`}>
              <Sparkles size={11} className="text-orange-400 animate-pulse" />
              <span>{isAr ? "يقوم بكتابة اقتراحات فورية للمهارات الصعبة" : "Auto-extracts key tags"}</span>
            </div>
          )}
        </div>

        {data.jobDescription && data.jobDescription.trim().length > 10 && (
          <div className="pt-2">
            <ATSAnalyzer
              resume={JSON.stringify(data)}
              jobDescription={data.jobDescription}
            />
          </div>
        )}
      </div>

      {/* Detailed Diagnostic logs / Improvements & Success points */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recommended Upgrades / Detailed suggestions */}
        <div className="bg-white border border-slate-200/70 p-6 md:p-8 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertCircle size={16} className="text-orange-500 shrink-0" />
            <h3 className="text-sm font-extrabold text-slate-900">
              {t.detailedSuggestions}
            </h3>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {sections.some(s => s.improvements.length > 0) ? (
              sections.map((section, idx) => 
                section.improvements.length > 0 && (
                  <div key={idx} className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      {section.title}
                    </span>
                    <div className="space-y-2">
                      {section.improvements.map((imp, i) => (
                        <div key={i} className="flex gap-2.5 p-3 rounded-xl border border-orange-100/50 bg-orange-50/20 text-xs text-slate-700 leading-normal">
                          <span className="text-orange-500 shrink-0 font-bold">✦</span>
                          <span>{imp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-6">
                {isAr ? "لا توجد تعديلات عاجلة للتطبيق!" : "No modifications recommended!"}
              </p>
            )}
          </div>
        </div>

        {/* Working Well / Points of Excellence */}
        <div className="bg-white border border-slate-200/70 p-6 md:p-8 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <h3 className="text-sm font-extrabold text-slate-900">
              {t.workingWell}
            </h3>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {sections.some(s => s.goodPoints.length > 0) ? (
              sections.map((section, idx) => 
                section.goodPoints.length > 0 && (
                  <div key={idx} className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      {section.title}
                    </span>
                    <div className="space-y-2">
                      {section.goodPoints.map((gp, i) => (
                        <div key={i} className="flex gap-2.5 p-3 rounded-xl border border-emerald-100/50 bg-emerald-50/20 text-xs text-slate-700 leading-normal">
                          <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{gp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-6">
                {isAr ? "اكمل تعبئة الحقول الأساسية أولاً" : "Include core information to calculate perfect marks"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
