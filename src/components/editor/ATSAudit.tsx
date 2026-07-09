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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center border border-brand-100 shadow-xs">
            <Target className="text-brand-600 animate-pulse" size={20} />
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
        
        <div className="flex flex-wrap items-center gap-2">
          <div className={`px-3 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 ${scoreVerdict.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            <span>{scoreVerdict.text}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 items-stretch">
      
        {/* Metric gauge Card */}
        <div className="bg-white border border-slate-200/60 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between text-center md:text-start gap-8 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-500 to-rose-500 opacity-80" />
          
          <div className="flex-1 space-y-3 relative z-10 w-full">
            <h4 className="text-2xl font-black text-slate-800 tracking-tight">
              {score >= 80 ? t.greatJob : score >= 50 ? t.goodStart : t.needsImprovement}
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed max-w-lg mx-auto md:mx-0 font-medium">
              {t.atsExplanation}
            </p>
          </div>

          <div className="relative flex items-center justify-center w-40 h-40 shrink-0">
            {/* Soft backdrop glow behind gauge */}
            <div className={cn(
              "absolute inset-0 rounded-full blur-2xl opacity-20 transition-colors duration-1000",
              score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500"
            )} />
            
            <svg className="w-full h-full transform -rotate-90 absolute inset-0 z-10 drop-shadow-sm">
              <circle
                cx="80"
                cy="80"
                r="68"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="80"
                cy="80"
                r="68"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={427}
                strokeDashoffset={427 - (427 * Math.min(score, 100)) / 100}
                className={cn(
                  "transition-all duration-1500 ease-out",
                  score >= 80 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-rose-500"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <span className={cn(
                "text-5xl font-black tracking-tighter leading-none transition-colors duration-1000",
                score >= 80 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-rose-600"
              )}>
                {score}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
                {t.scoreOutOf}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Job Description Tailoring */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50/80 flex items-center justify-center border border-orange-100/50 shadow-inner">
              <Wand2 className="text-orange-500" size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">
                {isAr ? "مقارن الوصف الوظيفي الذكي (Instant Matching)" : "AI Job Description Mirroring"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {isAr 
                  ? "الصق متطلبات الوظيفة الشاغرة لتحليل الثغرات المهارية وحلها قبل تنزيل الملف." 
                  : "Compare against corporate vacancies to immediately find core skill targets."}
              </p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <textarea dir="auto"
            value={data.jobDescription || ""}
            onChange={(e) => updateJobDescription(e.target.value)}
            placeholder={isAr ? "الصق متطلبات الوظيفة الشاغرة ومؤهلاتها هنا..." : "Paste corporate job description terms, requirements or specifications..."}
            className="w-full h-32 p-5 border border-slate-200/80 bg-slate-50/50 hover:bg-white focus:bg-white hover:border-slate-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 rounded-2xl transition-all text-sm resize-none"
            dir={isAr ? "rtl" : "ltr"}
          />
          {!data.jobDescription && (
            <div className={`absolute bottom-4 ${isAr ? 'left-4' : 'right-4'} flex items-center gap-1.5 text-[11px] font-bold text-slate-400 select-none pointer-events-none`}>
              <Sparkles size={12} className="text-orange-400 animate-pulse" />
              <span>{isAr ? "يقوم بكتابة اقتراحات فورية للمهارات الصعبة" : "Auto-extracts key tags"}</span>
            </div>
          )}
        </div>

        {data.jobDescription && data.jobDescription.trim().length > 10 && (
          <div className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        <div className="bg-white border border-slate-200/60 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <AlertCircle size={18} className="text-orange-500 shrink-0" />
            </div>
            <h3 className="text-base font-black text-slate-800">
              {t.detailedSuggestions}
            </h3>
          </div>

          <div className="space-y-5 max-h-[420px] overflow-y-auto pr-2 scrollbar-none">
            {sections.some(s => s.improvements.length > 0) ? (
              sections.map((section, idx) => 
                section.improvements.length > 0 && (
                  <div key={idx} className="space-y-2.5">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block bg-slate-50 px-2 py-1 rounded w-fit">
                      {section.title}
                    </span>
                    <div className="space-y-2">
                      {section.improvements.map((imp, i) => (
                        <div key={i} className="flex gap-3 p-3.5 rounded-2xl border border-orange-100/60 bg-gradient-to-br from-orange-50/50 to-rose-50/20 text-xs text-slate-700 leading-relaxed font-medium">
                          <span className="text-orange-500 shrink-0 font-bold mt-0.5">✦</span>
                          <span>{imp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                <CheckCircle2 className="text-slate-200" size={32} />
                <p className="text-xs text-slate-400 italic">
                  {isAr ? "لا توجد تعديلات عاجلة للتطبيق!" : "No modifications recommended!"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Working Well / Points of Excellence */}
        <div className="bg-white border border-slate-200/60 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            </div>
            <h3 className="text-base font-black text-slate-800">
              {t.workingWell}
            </h3>
          </div>

          <div className="space-y-5 max-h-[420px] overflow-y-auto pr-2 scrollbar-none">
            {sections.some(s => s.goodPoints.length > 0) ? (
              sections.map((section, idx) => 
                section.goodPoints.length > 0 && (
                  <div key={idx} className="space-y-2.5">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block bg-slate-50 px-2 py-1 rounded w-fit">
                      {section.title}
                    </span>
                    <div className="space-y-2">
                      {section.goodPoints.map((gp, i) => (
                        <div key={i} className="flex gap-3 p-3.5 rounded-2xl border border-emerald-100/60 bg-gradient-to-br from-emerald-50/50 to-teal-50/20 text-xs text-slate-700 leading-relaxed font-medium">
                          <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{gp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                <Target className="text-slate-200" size={32} />
                <p className="text-xs text-slate-400 italic">
                  {isAr ? "اكمل تعبئة الحقول الأساسية أولاً" : "Include core information to calculate perfect marks"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
