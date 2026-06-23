import React, { useState, useMemo } from "react";
import { Sparkles, CheckCircle2, AlertCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { ResumeData } from "../../store/useResumeStore";
import { calculateATSScore } from "../../utils/ats";

interface ATSHealthGaugeProps {
  data: ResumeData;
  isAr: boolean;
  onClose?: () => void;
}

// Strong ATS verbs list for density checking
const EXCEL_VERBS = [
  "spearheaded", "orchestrated", "directed", "championed", "executed", "coordinated",
  "architected", "automated", "developed", "deployed", "optimized", "engineered",
  "generated", "boosted", "acquired", "cultivated", "maximised", "streamlined",
  "standardized", "revitalized", "formulated", "resolved", "pioneered", "implemented",
  "قاد", "أشرف", "نسّق", "طوّر", "صمّم", "أتمت", "نفّذ", "أطلق", "حسّن", "هندس",
  "أسس", "تبنى", "أحيا", "صاغ", "بسط", "ابتكر"
];

export default function ATSHealthGauge({ data, isAr, onClose }: ATSHealthGaugeProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Sync to application standard ATS Score calculation
  const unifiedScore = useMemo(() => {
    return calculateATSScore(data).score;
  }, [data]);

  // Parse stats in real-time for detailed visual indicators
  const stats = useMemo(() => {
    const textBlocks: string[] = [];
    
    // Personal Info
    if (data.personalInfo?.fullName) textBlocks.push(data.personalInfo.fullName);
    if (data.personalInfo?.jobTitle) textBlocks.push(data.personalInfo.jobTitle);
    if (data.personalInfo?.summary) textBlocks.push(data.personalInfo.summary);
    
    // Experience
    data.experience?.forEach(exp => {
      if (exp.title) textBlocks.push(exp.title);
      if (exp.company) textBlocks.push(exp.company);
      if (exp.description) textBlocks.push(exp.description);
    });

    // Education
    data.education?.forEach(edu => {
      if (edu.degree) textBlocks.push(edu.degree);
      if (edu.school) textBlocks.push(edu.school);
      if (edu.description) textBlocks.push(edu.description);
    });

    // Skills
    data.skills?.forEach(s => {
      if (typeof s === "string") textBlocks.push(s);
      else if (s && typeof s === "object") {
        const item = s as { name?: string };
        textBlocks.push(item.name || "");
      }
    });

    // Projects
    data.projects?.forEach(p => {
      if (p.name) textBlocks.push(p.name);
      if (p.description) textBlocks.push(p.description);
    });

    // Certifications
    data.certifications?.forEach(c => {
      if (c.name) textBlocks.push(c.name);
      if (c.issuer) textBlocks.push(c.issuer);
    });

    const fullText = textBlocks.join(" ").toLowerCase();
    
    // Word count calculation
    const words = fullText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Action verbs density calculation
    let verbCount = 0;
    EXCEL_VERBS.forEach(verb => {
      const regex = new RegExp(`\\b${verb}\\b|${verb}`, "gi");
      const matches = fullText.match(regex);
      if (matches) {
        verbCount += matches.length;
      }
    });

    // Profile summary status
    const hasSummary = !!(data.personalInfo?.summary && data.personalInfo.summary.trim().length > 20);

    let wordStatus: "low" | "optimal" | "high" = "low";
    if (wordCount >= 300 && wordCount <= 600) {
      wordStatus = "optimal";
    } else if (wordCount > 600) {
      wordStatus = "high";
    } else {
      wordStatus = "low";
    }

    let verbStatus: "low" | "optimal" = "low";
    if (verbCount >= 3) {
      verbStatus = "optimal";
    } else {
      verbStatus = "low";
    }

    return {
      wordCount,
      wordStatus,
      verbCount,
      verbStatus,
      hasSummary
    };
  }, [data]);

  return (
    <div 
      className="print:hidden w-72 md:w-80 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-[0_12px_45px_rgba(15,23,42,0.08),0_0_1px_rgba(15,23,42,0.1)] transition-all overflow-hidden"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-slate-50/60 hover:bg-slate-50 border-b border-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-50 rounded-lg flex items-center justify-center text-brand-605">
            <Sparkles size={13} className="animate-pulse" />
          </div>
          <span className="text-xs font-black text-slate-800 tracking-tight">
            {isAr ? "⚡ مؤشر صحة الـ ATS المباشر" : "⚡ Real-time ATS Health Gauge"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-black px-1.8 py-0.5 rounded-full ${
            unifiedScore >= 80 ? "bg-emerald-50 text-emerald-700" :
            unifiedScore >= 50 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
          }`}>
            {unifiedScore}%
          </span>
          <div className="flex items-center gap-1">
            <span 
              onClick={(e) => { 
                e.stopPropagation(); 
                setIsExpanded(!isExpanded); 
              }} 
              className="p-1 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              {isExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
            </span>
            {onClose && (
              <span 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onClose(); 
                }} 
                className="p-1 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-md transition-colors cursor-pointer font-bold text-xs leading-none z-10 select-none"
                title={isAr ? "إخفاء" : "Hide"}
              >
                ✕
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Expanded Metrics Content */}
      {isExpanded && (
        <div className="p-4 space-y-3.5 transition-all">
          {/* Circular Score & Mini Title */}
          <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
            {/* Visual Gauge Circle */}
            <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="22" 
                  cy="22" 
                  r="18" 
                  className="stroke-slate-100 fill-none" 
                  strokeWidth="3.5"
                />
                <circle 
                  cx="22" 
                  cy="22" 
                  r="18" 
                  className={`fill-none transition-all duration-1000 ${
                    unifiedScore >= 80 ? "stroke-emerald-500" :
                    unifiedScore >= 50 ? "stroke-amber-500" : "stroke-rose-500"
                  }`} 
                  strokeWidth="3.5"
                  strokeDasharray={2 * Math.PI * 18}
                  strokeDashoffset={2 * Math.PI * 18 * (1 - unifiedScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[10px] font-black text-slate-800">
                {unifiedScore}%
              </span>
            </div>
            
            {/* Verdict text */}
            <div className="space-y-0.5">
              <h6 className="text-[11px] font-black text-slate-800">
                {unifiedScore >= 80 
                  ? (isAr ? "سيرة متوافقة للغاية! 🚀" : "Highly ATS-Compatible! 🚀")
                  : unifiedScore >= 50 
                  ? (isAr ? "تحسينات جيدة، تابع! 📈" : "Solid progress, keep improving! 📈")
                  : (isAr ? "نوصي بإضافة المزيد من البيانات ⚠️" : "Improve details to beat filters ⚠️")
                }
              </h6>
              <p className="text-[9px] text-slate-400 leading-normal leading-tight font-medium">
                {isAr 
                  ? "يتم مراجعة وتحديث هذه المؤشرات تلقائياً مع كل حرف تكتبه."
                  : "These calculations refresh as you write to beat candidate parsing bots."
                }
              </p>
            </div>
          </div>

          {/* Indicators List */}
          <div className="space-y-2 text-[10px] font-semibold text-slate-600">
            {/* word count indicator */}
            <div className="flex items-center justify-between bg-slate-50/50 p-2 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5">
                {stats.wordStatus === "optimal" ? (
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                ) : stats.wordStatus === "high" ? (
                  <Info size={13} className="text-amber-500 shrink-0" />
                ) : (
                  <AlertCircle size={13} className="text-rose-400 shrink-0" />
                )}
                <span>{isAr ? "مجموع كلمات السيرة" : "Total Word Count"}</span>
              </div>
              <span className={`text-[10px] font-black ${
                stats.wordStatus === "optimal" ? "text-emerald-600" : "text-slate-500"
              }`}>
                {stats.wordCount} {isAr ? "كلمة" : "words"} ({
                  stats.wordStatus === "optimal" ? (isAr ? "مثالي" : "Optimal") :
                  stats.wordStatus === "high" ? (isAr ? "طويل" : "Detailed") : (isAr ? "قصير" : "Short")
                })
              </span>
            </div>

            {/* verb count indicator */}
            <div className="flex items-center justify-between bg-slate-50/50 p-2 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5">
                {stats.verbStatus === "optimal" ? (
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle size={13} className="text-amber-500 shrink-0" />
                )}
                <span>{isAr ? "الأفعال القوية المكتشفة" : "ATS Action Verbs"}</span>
              </div>
              <span className={`text-[10px] font-black ${
                stats.verbStatus === "optimal" ? "text-emerald-600" : "text-amber-600"
              }`}>
                {stats.verbCount} ({
                  stats.verbStatus === "optimal" ? (isAr ? "ممتاز ✨" : "Awesome ✨") : (isAr ? "زد الأفعال 💡" : "Add verbs 💡")
                })
              </span>
            </div>

            {/* summary present check */}
            <div className="flex items-center justify-between bg-slate-50/50 p-2 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5">
                {stats.hasSummary ? (
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle size={13} className="text-rose-400 shrink-0" />
                )}
                <span>{isAr ? "الملخص أو الخلاصة المهنية" : "Executive Profile Summary"}</span>
              </div>
              <span className={`text-[10px] font-black ${
                stats.hasSummary ? "text-emerald-600" : "text-rose-500"
              }`}>
                {stats.hasSummary ? (isAr ? "مكتمل" : "Defined") : (isAr ? "مفقود" : "Missing")}
              </span>
            </div>
          </div>

          {/* Quick interactive hint */}
          <div className="bg-brand-50/45 border border-brand-100 p-2.5 rounded-xl flex items-start gap-2">
            <span className="text-xs text-brand-605 mt-0.5">💡</span>
            <p className="text-[9px] text-slate-500 leading-normal leading-relaxed font-semibold">
              {isAr 
                ? "استخدم زر \"⚡ أفعال حركة ATS القوية\" في حقل الخبرات، للارتقاء بفرص قبولك في الشركات الكبرى بنسبة 45%!"
                : "Inject industry action words into your role descriptions easily via our ⚡ ATS Verb tool to boost search discovery metrics."
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
