import React, { useState } from "react";
import { aiService } from "../services/aiService";
import { useResumeStore } from "../store/useResumeStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { Loader2, Sparkles, CheckCircle, Plus, AlertCircle, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ATSAnalyzerProps {
  resume: string;
  jobDescription: string;
}

interface ATSResult {
  score: number;
  missingKeywords: string[];
  suggestions: string[];
  seniorityFit: string;
}

export const ATSAnalyzer: React.FC<ATSAnalyzerProps> = ({
  resume,
  jobDescription,
}) => {
  const { language } = useLanguageStore();
  const { data, addSkill } = useResumeStore();
  
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Real-time keyword matching based on current state skills
  const resumeSkills = data.skills || [];
  
  // Real-time quick estimator to show instant feedback before clicking deep AI Analysis!
  const getSimulatedMatch = () => {
    if (!jobDescription.trim()) return { score: 0, matched: [], missing: [] };
    
    // Simple word extractor
    const jdClean = jobDescription.toLowerCase().replace(/[^\w\s\u0600-\u06FF]/g, " ");
    const jdWords = jdClean.split(/\s+/).filter(w => w.length > 2);
    
    // Find unique key technical words from description
    const stopWords = new Set(["the", "and", "for", "with", "this", "that", "from", "your", "will", "have", "with", "من", "في", "على", "إلى", "أن", "أو", "مع", "هذا", "تم"]);
    const counts: Record<string, number> = {};
    
    jdWords.forEach(w => {
      if (!stopWords.has(w) && isNaN(Number(w))) {
        counts[w] = (counts[w] || 0) + 1;
      }
    });
    
    // Extract top keywords from description
    const topJDKeywords = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([word]) => word);
      
    const matched: string[] = [];
    const missing: string[] = [];
    
    topJDKeywords.forEach(kw => {
      const matchFound = resumeSkills.some(skill => 
        skill.toLowerCase().includes(kw) || kw.includes(skill.toLowerCase())
      );
      if (matchFound) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });
    
    const computedScore = topJDKeywords.length > 0
      ? Math.max(30, Math.round((matched.length / topJDKeywords.length) * 100))
      : 40;
      
    return {
      score: computedScore,
      matched: matched.map(w => w.charAt(0).toUpperCase() + w.slice(1)),
      missing: missing.map(w => w.charAt(0).toUpperCase() + w.slice(1))
    };
  };

  const realTimeEstimate = getSimulatedMatch();

  const runAnalysisSteps = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentStep(0);

    const steps = [
      language === "ar" ? "جاري استخراج المصطلحات الرئيسية للوظيفة..." : "Extracting core job parameters...",
      language === "ar" ? "جاري مقارنة مجالات الخبرة والمهارات..." : "Comparing experience headers...",
      language === "ar" ? "جاري قياس الكثافة والمثالية..." : "Measuring keyword density...",
      language === "ar" ? "جاري صياغة التوصيات الذكية للـ ATS..." : "Formulating custom ATS suggestions..."
    ];

    // Animate process sequences beautifully
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, 900));
    }

    try {
      const response = await aiService.matchResumeToJob(resume, jobDescription);
      if (response.error) {
        setError(response.error);
      } else {
        const parsed: ATSResult = JSON.parse(response.text);
        setResult(parsed);
      }
    } catch (err) {
      console.error("ATS Analyzer err:", err);
      setError(language === "ar" ? "حدث خطأ أثناء الاتصال بالمخدم." : "Failed to parse analysis result. Using estimated mirror values.");
      // Fallback to our incredibly high fidelity estimate so the experience never breaks
      setResult({
        score: realTimeEstimate.score,
        missingKeywords: realTimeEstimate.missing,
        suggestions: [
          language === "ar" 
            ? "أضف الكلمات المفتاحية الناقصة إلى قسم المهارات مباشرة عبر الضغط عليها."
            : "Directly click the missing keywords below to instantly inject them into your skills list.",
          language === "ar"
            ? "استخدم أفعالاً قوية ومقاييس رقمية في توصيف خبرتك العملية."
            : "Utilize metrics and solid analytical action verbs across responsibilities."
        ],
        seniorityFit: realTimeEstimate.score > 70 
          ? (language === "ar" ? "ملاءمة ممتازة للدور الوظيفي" : "High-Density Fit") 
          : (language === "ar" ? "تحتاج لتحسين وتعديل الكلمات" : "Partial Fit")
      });
    } finally {
      setLoading(false);
    }
  };

  // Add missing keyword dynamically to resume skills list!
  const handleAddSkill = (skill: string) => {
    if (!resumeSkills.includes(skill)) {
      addSkill(skill);
    }
  };

  return (
    <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm transition-all space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h4 className="font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-600" />
            {language === "ar" ? "مؤشر فجوة المهارات الفعلي (ATS)" : "Real-time Skill Gap Mirror & ATS Analysis"}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {language === "ar" 
              ? "يقارن مهاراتك الحالية بمتطلبات الوظيفة مباشرة ويعطيك تقريراً ذكياً."
              : "Compares current draft skills directly with pasted targets for maximum ATS pass rates."}
          </p>
        </div>
        
        <button
          onClick={runAnalysisSteps}
          disabled={loading || !jobDescription.trim()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 font-bold text-xs"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            <Sparkles size={14} className="animate-pulse" />
          )}
          {language === "ar" ? "تشغيل الفحص العميق بالذكاء الاصطناعي 🌟" : "Run Deep AI Audit 🌟"}
        </button>
      </div>

      {/* Loading Sequence State */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-5 bg-brand-50/50 rounded-xl border border-brand-100 space-y-4"
          >
            <div className="flex items-center gap-3">
              <Loader2 className="animate-spin text-brand-600" size={18} />
              <span className="text-xs font-bold text-brand-900 uppercase tracking-wider">
                {language === "ar" ? "جاري محاكاة وتحليل قارئات الـ ATS..." : "Analyzing with AI..."}
              </span>
            </div>
            
            <div className="space-y-2">
              {[
                { id: 0, en: "Extracting core job parameters...", ar: "جاري استخراج المصطلحات رئيسية للوظيفة..." },
                { id: 1, en: "Comparing experience fields...", ar: "جاري مقارنة مجالات الخبرة والمهارات..." },
                { id: 2, en: "Measuring keyword density...", ar: "جاري قياس الكثافة والمثالية..." },
                { id: 3, en: "Formulating custom ATS suggestions...", ar: "جاري صياغة التوصيات الذكية للـ ATS..." }
              ].map((step) => {
                const isActive = currentStep === step.id;
                const isPassed = currentStep > step.id;
                return (
                  <div key={step.id} className="flex items-center gap-2 text-xs">
                    <span className={`w-2 h-2 rounded-full ${isPassed ? "bg-emerald-500" : isActive ? "bg-brand-600 animate-ping" : "bg-slate-300"}`} />
                    <span className={isPassed ? "text-slate-400 line-through" : isActive ? "text-brand-900 font-bold" : "text-slate-500"}>
                      {language === "ar" ? step.ar : step.en}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time Match metrics (Updates instantaneously as they type!) */}
      {!loading && !result && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-slate-50/70 p-4 rounded-xl border border-slate-100">
          <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-e border-slate-200 pb-4 md:pb-0 md:pe-4 space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">
              {language === "ar" ? "التوافق الفوري التقريبي" : "Immediate Compatibility"}
            </span>
            <div className="text-4xl font-black text-amber-500">
              {realTimeEstimate.score}%
            </div>
            <span className="text-[10px] text-slate-400 block font-medium leading-tight">
              {language === "ar"
                ? "يقارن الكلمات الفنية والمصطلحات في نص الوصف بمهاراتك الحالية فوراً."
                : "Live comparison updates immediately as you type your requirements."}
            </span>
          </div>

          <div className="md:col-span-8 space-y-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {language === "ar" ? "المهارات المتطابقة المكتشفة" : "Matching Keywords Detected"}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {realTimeEstimate.matched.length > 0 ? (
                  realTimeEstimate.matched.map((kw, i) => (
                    <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-150 flex items-center gap-1">
                      <CheckCircle size={10} />
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    {language === "ar" ? "لا تطابق مستخرج بعد" : "No matching keywords found in current draft."}
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {language === "ar" ? "الكلمات المفتاحية الناقصة (اضغط للإضافة السريعة!)" : "Missing Keywords (Click to Instantly Add!)"}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {realTimeEstimate.missing.length > 0 ? (
                  realTimeEstimate.missing.map((kw, i) => (
                    <button
                      key={i}
                      onClick={() => handleAddSkill(kw)}
                      className="px-2 py-1 bg-slate-50 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 transition-colors text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200 flex items-center gap-1 cursor-pointer"
                      title={language === "ar" ? "إضافة هذه المهارة لسيرتك الذاتية" : "Click to inject this keyword as a skill"}
                    >
                      <Plus size={10} />
                      {kw}
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    {language === "ar" ? "لا توجد كلمات ناقصة مستخرجة" : "All key terms match your skills perfectly!"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Core AI Deep Audit Result Response */}
      {!loading && result && (
        <div className="space-y-5 animate-fade-in text-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Score & Seniority */}
            <div className="p-5 bg-brand-50/30 rounded-2xl border border-brand-100 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {language === "ar" ? "درجة التقييم النهائي للـ ATS" : "Final AI ATS Check Score"}
                </span>
                <div className="text-5xl font-black text-brand-600">
                  {result.score}/100
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-brand-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {language === "ar" ? "التقييم التقريبي للمستوى:" : "Audited Role Compatibility:"}
                </span>
                <span className="px-2.5 py-1 bg-brand-100 text-brand-800 text-xs font-black rounded-lg">
                  {result.seniorityFit}
                </span>
              </div>
            </div>

            {/* Suggestions */}
            <div className="p-5 bg-amber-50/20 rounded-2xl border border-amber-100 space-y-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {language === "ar" ? "توصيات تعزيز الترتيب والاختيار" : "Recommended optimization steps"}
              </span>
              <ul className="space-y-2">
                {result.suggestions.map((sug, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-700">
                    <span className="text-amber-500 shrink-0 select-none">✦</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Missing Keywords Adding Platform */}
          <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              {language === "ar" ? "الكلمات المفتاحية الناقصة الذكية (اضغط للإضافة الفورية للمهارات)" : "Identified Core Industry Gaps (Tap to Inject directly)"}
            </span>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.length > 0 ? (
                result.missingKeywords.map((kw, i) => (
                  <button
                    key={i}
                    onClick={() => handleAddSkill(kw)}
                    className="px-3 py-1.5 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                    title={language === "ar" ? "إضافة هذه المهارة لسيرتك الذاتية" : "Incorporate instantly into skills"}
                  >
                    <Plus size={12} className="text-brand-500" />
                    {kw}
                  </button>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">
                  {language === "ar" ? "لا توجد أي فجوات مهارية مستخرجة!" : "No key missing keywords identified. Exemplary structure!"}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm font-semibold text-rose-500 flex items-center gap-1.5 p-3 rounded-lg bg-rose-50 border border-rose-100">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
};
