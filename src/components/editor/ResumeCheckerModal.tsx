import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, AlertCircle, FileText, Download, Target, Check, Sparkles, Loader2 } from "lucide-react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import { cn } from "../../lib/utils";
import { aiService } from "../../services/aiService";

interface ResumeCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (format: "pdf" | "docx" | "txt") => void;
}

const ACTION_VERBS = new Set([
  "led", "managed", "developed", "created", "designed", "implemented", "improved",
  "increased", "decreased", "saved", "achieved", "launched", "built", "engineered",
  "architected", "coordinated", "collaborated", "mentored", "trained", "analyzed",
  "resolved", "negotiated", "presented", "wrote", "authored", "published", "researched",
  "investigated", "optimized", "streamlined", "automated", "transformed", "expanded",
  "generated", "delivered", "executed", "planned",
]);

interface AIResult {
  score: number;
  suggestions: string[];
  missingKeywords: string[];
  keywords?: string;
  match?: string;
  missing?: string;
}

export default function ResumeCheckerModal({
  isOpen,
  onClose,
  onProceed,
}: ResumeCheckerModalProps) {
  const { data } = useResumeStore();
  const { language } = useLanguageStore();
  const t = translations[language].resumeChecker;
  const isAr = language === "ar";
  const { personalInfo, experience, education, skills } = data;

  const [mounted, setMounted] = useState(false);
  const [targetJob, setTargetJob] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      if (!targetJob) {
        setTargetJob(personalInfo?.jobTitle || "");
      }
    } else {
      setMounted(false);
    }
  }, [isOpen, personalInfo?.jobTitle, targetJob]);

  const checks = [
    {
      id: "contact",
      title: t.contactTitle,
      passed: !!(personalInfo?.email && personalInfo?.phone && personalInfo?.address),
      message: t.contactMsg,
    },
    {
      id: "summary",
      title: t.summaryTitle,
      passed: !!(personalInfo?.summary && personalInfo?.summary.length > 50),
      message: t.summaryMsg,
    },
    {
      id: "experience_bullets",
      title: t.bulletsTitle,
      passed: (experience && experience.length > 0) && experience?.every((exp) => exp.description?.includes("•") || exp.description?.includes("-") || exp.description?.includes("<p>")),
      message: t.bulletsMsg,
    },
    {
      id: "action_verbs",
      title: t.verbsTitle,
      passed: (experience && experience.length > 0) && experience?.some((exp) => {
        const words = (exp.description || "").toLowerCase().split(/\s+/);
        return words.some((w) => ACTION_VERBS.has(w));
      }),
      message: t.verbsMsg,
    },
    {
      id: "skills",
      title: t.skillsTitle,
      passed: (skills && skills.length >= 5),
      message: t.skillsMsg,
    },
    {
      id: "education",
      title: t.educationTitle,
      passed: (education && education.length > 0),
      message: t.educationMsg,
    },
  ];

  const failedChecks = checks.filter((c) => !c.passed);
  const baseScore = Math.round(((checks.length - failedChecks.length) / checks.length) * 100);

  const displayScore = aiResult ? aiResult.score : baseScore;

  const handleAnalyze = async () => {
    if (!targetJob) return;
    setIsAnalyzing(true);
    setAiResult(null);

    const prompt = `
You are an expert ATS (Applicant Tracking System) software used by Fortune 500 recruiters.
Please analyze the following resume data against the target job title: "${targetJob}".
Provide your output as a pure JSON object without markdown formatting, using this structure:
{
  "score": <number between 0-100 based on keyword match, action verbs, and structure>,
  "suggestions": ["<string: actionable improvement 1>", "<string: actionable improvement 2>"],
  "missingKeywords": ["<string: keyword 1>", "<string: keyword 2>"],
  "keywords": "<string: brief keyword analysis or comparison>",
  "match": "<string: brief highlights of what matches well>",
  "missing": "<string: brief highlights of what is missing or can be improved with respect to target job>"
}

Resume Data:
Name: ${personalInfo?.fullName || "N/A"}
Summary: ${personalInfo?.summary || "N/A"}
Experience: ${(experience || []).map(e => (e.jobTitle || e.position || "") + " at " + (e.company || "") + ": " + (e.description || "")).join(" | ")}
Skills: ${(skills || []).map(s => s.name).join(", ")}
    `;

    try {
      const res = await aiService.generateContent(prompt);
      const text = res.text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(text);
      setAiResult({
        score: parsed.score || 75,
        suggestions: parsed.suggestions || [],
        missingKeywords: parsed.missingKeywords || [],
        keywords: parsed.keywords || "",
        match: parsed.match || "",
        missing: parsed.missing || "",
      });
    } catch (err) {
      console.error("AI ATS Check failed", err);
      // Fallback
      setAiResult({
        score: Math.max(50, baseScore - 10),
        suggestions: [
          isAr ? "قم بإضافة المزيد من الكلمات المفتاحية المتعلقة بالمسمى الوظيفي" : "Add more keywords related to the target job title.",
          isAr ? "ركز على الإنجازات الملموسة بالأرقام." : "Focus on quantifiable achievements using numbers."
        ],
        missingKeywords: [targetJob, isAr ? "إدارة المشاريع" : "Project Management", isAr ? "تحليل البيانات" : "Data Analysis"],
        keywords: isAr ? "تحليل الكلمات المفتاحية لم يكتمل بسبب خطأ في الاتصال." : "Keyword analysis not completed due to connection error.",
        match: isAr ? "تحليل نقاط القوة لم يكتمل." : "Match analysis not completed.",
        missing: isAr ? "تحليل نقاط الضعف لم يكتمل." : "Weakness analysis not completed.",
      });
    }
    setIsAnalyzing(false);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          dir={isAr ? "rtl" : "ltr"}
        >
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-[500px] bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-neutral-100 border border-white/20 overflow-hidden flex flex-col max-h-[85vh] z-10 font-sans"
          >
            {/* Minimal Brand Gradient Top Decorator */}
            <div className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-brand-500 via-brand-600 to-amber-500" />

            {/* Header section - Balanced & Spacious */}
            <div className="px-5 pt-6 pb-4 sm:px-7 border-b border-neutral-100 flex justify-between items-center bg-white">
              <div className="flex gap-2.5 items-center">
                <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 border border-brand-100/40 text-brand-500 shadow-xs">
                  <Target size={16} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900 leading-tight">
                    {t.title || (isAr ? "فحص التوافق ATS Scorer" : "ATS Scorer Check")}
                  </h2>
                  <p className="text-[10px] text-neutral-400 font-medium tracking-wider mt-0.5">
                    {t.subtitle || (isAr ? "تأكد من قوة سيرتك" : "Ensure your resume is competitive")}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-full transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Scrollable content body */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-5 custom-scrollbar bg-neutral-50/10">
              
              <div className="bg-white p-4 rounded-xl border border-neutral-200">
                <label className="block text-xs font-bold text-neutral-700 mb-2">
                  {isAr ? "المسمى الوظيفي المستهدف" : "Target Job Title"}
                </label>
                <div className="flex gap-2">
                  <input dir="auto"
                    type="text"
                    value={targetJob}
                    onChange={(e) => setTargetJob(e.target.value)}
                    placeholder={isAr ? "مثال: Senior Frontend Developer" : "e.g., Senior Frontend Developer"}
                    className="flex-1 p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand-500"
                  />
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !targetJob}
                    className="px-4 bg-brand-500 text-white text-xs font-bold rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
                  >
                    {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    {isAr ? "تحليل الذكاء الاصطناعي" : "AI Analyze"}
                  </button>
                </div>
              </div>

              {/* Premium score gauge - Compact Row Card */}
              <div className="flex flex-col sm:flex-row items-center gap-4.5 bg-white p-4 sm:p-5 rounded-2xl border border-neutral-100 shadow-xs">
                {/* Minimalist Dial */}
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90 origin-center">
                    <circle 
                      cx="36" 
                      cy="36" 
                      r="31" 
                      stroke="currentColor" 
                      strokeWidth="3.5" 
                      fill="none" 
                      className="text-neutral-50" 
                    />
                    <circle
                      cx="36"
                      cy="36"
                      r="31"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      fill="none"
                      strokeDasharray={194.7} 
                      strokeDashoffset={194.7 - (194.7 * (mounted ? displayScore : 0)) / 100}
                      strokeLinecap="round"
                      className={cn(
                        "transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        displayScore >= 80 ? "text-emerald-500" : displayScore >= 50 ? "text-brand-500" : "text-amber-550"
                      )}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn(
                      "text-lg font-extrabold tracking-tight", 
                      displayScore >= 80 ? "text-emerald-700" : displayScore >= 50 ? "text-brand-600" : "text-amber-700"
                    )}>
                      {displayScore}%
                    </span>
                  </div>
                </div>

                {/* Score analysis text */}
                <div className="text-center sm:text-start space-y-1 flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 leading-none select-none",
                      displayScore >= 80 ? "bg-emerald-50 text-emerald-700 border border-emerald-100/30" : 
                      displayScore >= 50 ? "bg-brand-50 text-brand-600 border border-brand-100/30" : 
                      "bg-amber-50 text-amber-700 border border-amber-100/30"
                    )}>
                      {displayScore >= 80 && <Sparkles size={8} className="text-emerald-500" />}
                      <span>
                        {displayScore >= 80 ? (isAr ? "جاهزية ممتازة" : "Excellent Ready") : 
                         displayScore >= 50 ? (isAr ? "مستوى متميز" : "Very Good") : 
                         (isAr ? "يحتاج تفاصيل" : "Needs Detail")}
                      </span>
                    </span>
                    <span className="text-[11px] font-bold text-neutral-800">
                      {isAr ? "معدل ملاءمة الـ ATS" : "ATS Readiness Score"}
                    </span>
                  </div>
                  <p className="text-neutral-500 text-[11px] leading-relaxed">
                    {isAr 
                      ? "فحص فوري ذكي لعناصر سيرتك الذاتية لضمان تفوقها وتجاوزها لفلترة أنظمة التوظيف بنجاح." 
                      : "A smart diagnostic evaluating your layout structure and contents to bypass typical applicant screen systems."}
                  </p>
                </div>
              </div>

              {aiResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="bg-brand-50/50 border border-brand-100 rounded-xl p-4">
                    <h3 className="font-bold text-sm text-brand-800 mb-2">
                      {isAr ? "تحليل الكلمات المفتاحية" : "Keyword Analysis"}
                    </h3>
                    <p className="text-xs text-brand-700 whitespace-pre-line leading-relaxed">
                      {aiResult.keywords}
                    </p>
                  </div>
                  
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
                    <h3 className="font-bold text-sm text-emerald-800 mb-2">
                      {isAr ? "نقاط القوة والمطابقة" : "Match Strengths"}
                    </h3>
                    <p className="text-xs text-emerald-700 whitespace-pre-line leading-relaxed">
                      {aiResult.match}
                    </p>
                  </div>

                  <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4">
                    <h3 className="font-bold text-sm text-rose-800 mb-2">
                      {isAr ? "نقاط الضعف المقترحة للتحسين" : "Weaknesses to Improve"}
                    </h3>
                    <p className="text-xs text-rose-700 whitespace-pre-line leading-relaxed">
                      {aiResult.missing}
                    </p>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1.5">
                      <Sparkles size={14} />
                      {isAr ? "نصائح ذكية مخصصة" : "AI Tailored Suggestions"}
                    </h4>
                    <ul className="list-disc list-inside text-xs text-amber-700 space-y-1.5">
                      {aiResult.suggestions.map((sug, i) => (
                        <li key={i}>{sug}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white border border-neutral-200 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-neutral-700 mb-2 flex items-center gap-1.5">
                      <Target size={14} className="text-rose-500" />
                      {isAr ? "كلمات مفتاحية مفقودة" : "Missing Keywords"}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {aiResult.missingKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[10px] font-semibold border border-neutral-200/60">
                          {kw}
                        </span>
                      ))}
                      {aiResult.missingKeywords.length === 0 && (
                        <span className="text-xs text-emerald-600 font-medium">{isAr ? "الكلمات المفتاحية ممتازة!" : "Keywords look great!"}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Raw ATS Preview Section */}
              <div className="bg-white border border-neutral-200 rounded-xl p-4 mt-6">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                  <FileText size={16} className="text-slate-500" />
                  <h3 className="font-bold text-sm text-slate-800">
                    {isAr ? "كيف يرى نظام الـ ATS سيرتك الذاتية الآن" : "How ATS Sees Your Resume"}
                  </h3>
                </div>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-[10px] sm:text-xs overflow-y-auto max-h-48 whitespace-pre-wrap leading-relaxed shadow-inner" dir="auto">
                  {/* Generate raw text from store */}
                  {`NAME: ${personalInfo?.fullName || 'N/A'}\nTITLE: ${personalInfo?.jobTitle || 'N/A'}\nEMAIL: ${personalInfo?.email || 'N/A'}\nPHONE: ${personalInfo?.phone || 'N/A'}\n\nSUMMARY:\n${personalInfo?.summary?.replace(/<[^>]+>/g, '') || 'N/A'}\n\nEXPERIENCE:\n${experience?.map(e => `${e.jobTitle || e.position || ''} at ${e.company || ''}\n${e.startDate || ''} to ${e.endDate || 'Present'}\n${e.description?.replace(/<[^>]+>/g, '') || ''}`).join('\n\n') || 'N/A'}\n\nEDUCATION:\n${education?.map(e => `${e.degree || ''} at ${e.school || ''}\n${e.startDate || ''} to ${e.endDate || 'Present'}\n${e.description?.replace(/<[^>]+>/g, '') || ''}`).join('\n\n') || 'N/A'}\n\nSKILLS:\n${skills?.map(s => s.name).join(', ') || 'N/A'}`}
                </div>
                <p className="mt-2 text-[10px] text-slate-500">
                  {isAr 
                    ? "هذه هي الطريقة التي تقوم بها أنظمة الفرز بقراءة واستخراج النصوص المجردة من سيرتك لتقييمها."
                    : "This is how applicant tracking systems parse and extract plain text from your resume for evaluation."}
                </p>
              </div>

              {!aiResult && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-neutral-700 px-1">{isAr ? "الفحوصات الأساسية" : "Basic Checks"}</h4>
                  {checks.map((check) => (
                    <div
                      key={check.id}
                      className={cn(
                        "flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-155",
                        check.passed 
                          ? "bg-white border-neutral-100 opacity-60 hover:opacity-100" 
                          : "bg-white border-neutral-200/50 hover:border-brand-100 hover:shadow-2xs"
                      )}
                    >
                      <div className={cn(
                        "mt-0.5 shrink-0 w-4.5 h-4.5 rounded-full flex items-center justify-center border",
                        check.passed 
                          ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                          : "bg-brand-50 border-brand-100/40 text-brand-500"
                      )}>
                        {check.passed ? (
                          <Check size={9} strokeWidth={3.5} />
                        ) : (
                          <AlertCircle size={9} strokeWidth={2.5} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "text-xs font-bold leading-none",
                          check.passed ? "text-neutral-450 line-through decoration-neutral-300" : "text-neutral-900"
                        )}>
                          {check.title}
                        </h4>
                        {!check.passed && (
                          <p className="text-[10px] text-neutral-550 leading-normal mt-1 font-medium">
                            {check.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with actions - Cohesive, simplified & premium */}
            <div className="px-5 py-4 sm:px-7 border-t border-neutral-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <button
                onClick={onClose}
                className="w-full sm:w-auto text-xs font-bold text-neutral-400 hover:text-neutral-700 transition-colors shrink-0 text-center py-2 cursor-pointer order-2 sm:order-none"
              >
                {t.keepEditing}
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest hidden sm:block select-none">
                  {t.exportAs}
                </span>
                
                <div className="flex w-full sm:w-auto p-1 bg-neutral-50 rounded-xl gap-1 shrink-0 border border-neutral-100">
                  <button
                    onClick={() => onProceed("pdf")}
                    className="flex-grow sm:flex-none h-8.5 px-3.5 rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-brand-500/10 leading-none transition-all active:scale-95 cursor-pointer"
                  >
                    <Download size={11} strokeWidth={2.5} />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => onProceed("docx")}
                    className="flex-grow sm:flex-none h-8.5 px-3.5 rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-bold text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-200 shadow-3xs leading-none transition-all active:scale-95 cursor-pointer"
                  >
                    <FileText size={11} strokeWidth={2.5} />
                    <span>DOCX</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
