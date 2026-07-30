import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Target, ArrowRight, ArrowLeft, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { useLanguageStore } from "../../store/useLanguageStore";

interface CompactATSActionPlanProps {
  sections: Array<{
    title: string;
    score: number;
    maxScore: number;
    goodPoints: string[];
    improvements: string[];
  }>;
  onNavigate: (step: string) => void;
  atsScore: number;
  onOpenDetailedAnalysis?: () => void;
}

const mapTitleToStep = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes("contact") || t.includes("اتصال")) return "basics";
  if (t.includes("summary") || t.includes("ملخص")) return "summary";
  if (t.includes("experience") || t.includes("خبرات") || t.includes("achievements") || t.includes("إنجازات")) return "experience";
  if (t.includes("education") || t.includes("مؤهل") || t.includes("تعليم")) return "education";
  if (t.includes("skill") || t.includes("مهارات")) return "skills";
  if (t.includes("project") || t.includes("مشاريع")) return "projects";
  if (t.includes("certifications") || t.includes("شهادات")) return "certifications";
  if (t.includes("formatting") || t.includes("تنسيق") || t.includes("length") || t.includes("طول")) return "finish";
  return "basics";
};

export default function CompactATSActionPlan({ sections, onNavigate, atsScore, onOpenDetailedAnalysis }: CompactATSActionPlanProps) {
  const { language } = useLanguageStore();
  const isRtl = language === "ar";
  const [isExpanded, setIsExpanded] = useState(false);

  // Group sections into Needs Work vs Good
  const needsWorkSections = sections.filter(s => s.improvements.length > 0);
  
  if (needsWorkSections.length === 0) return null; // Nothing to improve

  return (
    <div className="mb-6 bg-white border border-rose-200/60 rounded-2xl shadow-xs overflow-hidden transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-rose-50/30">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 flex items-center justify-between hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-start">
              <h3 className="text-sm font-bold text-slate-800">
                {isRtl ? "خطة عمل ATS" : "ATS Action Plan"}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {isRtl 
                  ? `لديك ${needsWorkSections.length} تحسينات لرفع درجة ${atsScore}%`
                  : `You have ${needsWorkSections.length} improvements to boost your ${atsScore}% score`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
             {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>
        
        <div className="mt-3 sm:mt-0 flex items-center gap-2 sm:border-l sm:border-rose-100 sm:pl-4 rtl:pl-0 rtl:pr-4">
          {onOpenDetailedAnalysis && (
            <button
              onClick={onOpenDetailedAnalysis}
              className="text-[10px] font-bold px-3 py-1.5 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              {isRtl ? "عرض التحليل المفصل" : "Detailed Analysis"}
            </button>
          )}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden sm:flex items-center gap-2 text-[10px] font-bold bg-white border border-rose-200 px-3 py-1.5 rounded-lg text-rose-600 shadow-3xs hover:bg-rose-50 transition-colors cursor-pointer"
          >
             <span>{isRtl ? "عرض التوصيات" : "View Recommendations"}</span>
             {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-rose-100/50 bg-white space-y-3">
              {needsWorkSections.map((sec, idx) => {
                const step = mapTitleToStep(sec.title);
                return (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-brand-200/50 transition-all">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <h4 className="text-xs font-bold text-slate-800">{sec.title}</h4>
                      </div>
                      <ul className="space-y-1 pl-5 rtl:pl-0 rtl:pr-5">
                        {sec.improvements.map((imp, i) => (
                          <li key={i} className="text-[11px] text-slate-600 font-medium list-disc">
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button 
                      onClick={() => onNavigate(step)}
                      className="mt-2 sm:mt-0 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50 text-brand-700 rounded-lg text-[10px] font-bold shadow-3xs transition-all active:scale-95 shrink-0"
                    >
                      <span>{isRtl ? "أصلح الآن" : "Fix Now"}</span>
                      {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
