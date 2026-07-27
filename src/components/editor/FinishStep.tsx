import { useState, useMemo } from "react";
import { useLanguageStore } from "../../store/useLanguageStore";
import { useResumeStore } from "../../store/useResumeStore";
import { calculateATSScore } from "../../utils/ats";
import {
  CheckCircle2,
  ArrowRight,
  Target,
  Search,
  Sparkles,
  Download,
  FileCheck2,
  FileSpreadsheet,
  Trophy,
  Flame,
  UserCheck,
  Compass,
  ChevronDown,
  ChevronUp,
  Check,
  Wand2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { ATSAnalyzer } from "../ATSAnalyzer";
import { cn } from "../../lib/utils";

interface FinishStepProps {
  onPrint?: () => void;
  onExportWord?: () => void;
  onJumpToStep: (step: string) => void;
}

export default function FinishStep({
  onPrint,
  onExportWord,
  onJumpToStep: _onJumpToStep,
}: FinishStepProps) {
  const { language } = useLanguageStore();
  const { data, updateJobDescription } = useResumeStore();
  
  const isAr = language === "ar";

  // Calculate ATS Score and recommendations
  const { score, sections } = useMemo(() => calculateATSScore(data, language), [data, language]);
  const _hasImprovements = sections.some(s => s.improvements.length > 0);

  // Toggle for collapsible details box
  const [showDetails, setShowDetails] = useState(true);

  // Interview preparation resources
  const tips = [
    {
      title: isAr ? "1. أسلوب STAR الذكي" : "1. The STAR Interview Guide",
      desc: isAr 
        ? "أجب عن الأسئلة السلوكية بسرد: الموقف (Situation)، المهمة (Task)، الإجراء المتخذ (Action)، والنتيجة المحققة (Result)."
        : "Structure behavioral story answers using: Situation, Task, Action, and measurable Results to double your hire rate.",
      icon: <Trophy className="w-5 h-5 text-amber-500" />
    },
    {
      title: isAr ? "2. استطلاع ثقافة الشركة" : "2. Deep Company Intel",
      desc: isAr 
        ? "قبل المقابلة، ابحث عن أحدث مشاريع الشركة، قيمها المعلنة، ومسؤولي التوظيف عبر لينكد إن لزيادة انطباع الشغف لديهم."
        : "Research the employer's recent milestones, values, and interviewer names on LinkedIn to express authentic interest.",
      icon: <Search className="w-5 h-5 text-neutral-500" />
    },
    {
      title: isAr ? "3. تحضير الأسئلة المرتدة" : "3. Bold Proactive Questions",
      desc: isAr 
        ? "حضّر سؤالين أو ثلاثة للمحاورين يُظهران عمق فهمك للوظيفة، مثل: 'ما هو التحدي الأكبر الذي سيواجه من يستلم هذا الدور في أول 90 يوماً؟'"
        : "Ask back strategic questions: 'What does success look like for this role in the first 90 days?' to show proactivity.",
      icon: <Compass className="w-5 h-5 text-brand-500" />
    },
    {
      title: isAr ? "4. لغة جسد مهنية بثقة" : "4. Radiant Body Language",
      desc: isAr 
        ? "التواصل البصري المنضبط، الجلسة المعتدلة، الابتسامة المريحة، ونبرة الصوت الهادئة والواثقة تدل على نضجك واحترافيتك."
        : "Maintain standard eye contact, a comfortable upright posture, slight smiles, and balanced speech tempo to radiate maturity.",
      icon: <UserCheck className="w-5 h-5 text-emerald-500" />
    }
  ];

  // Visual verdict based on ATS score
  const getScoreVerdict = (s: number) => {
    if (s >= 85) return { text: isAr ? "سيرة مثالية ومطابقة لمعايير التوظيف!" : "Highly Optimized", color: "text-emerald-600 bg-emerald-50/85 border-emerald-150" };
    if (s >= 65) return { text: isAr ? "سيرتك جيدة ولكن تتوفر فرص ملموسة للتحسين" : "Good, but has room for improvements", color: "text-amber-600 bg-amber-50/85 border-amber-150" };
    return { text: isAr ? "تحتاج لإضافة أقسام هامة لتجاوز الفرز الآلي" : "Critical Optimization Required", color: "text-rose-600 bg-rose-50/85 border-rose-150" };
  };

  const scoreVerdict = getScoreVerdict(score);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-2 sm:p-4 max-w-4xl mx-auto relative overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      
      {/* ── 1. Hero Completion Banner & Download Action Center ── */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl shadow-slate-950/20 relative overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute -top-24 -end-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -start-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          
          {/* Header & ATS Score Ring/Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/80 text-center sm:text-start">
            <div className="space-y-2 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isAr ? "جاهزة للتحميل والتقديم الفوري" : "Ready for Instant Download & Application"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {isAr ? "سيرتك الذاتية في أبهى صورها 🚀" : "Your Resume is Ready to Launch!"}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                {isAr 
                  ? "تم فحص الهيكل والمحتوى والتوافق مع الـ ATS بنجاح. حمل النسخة الرسمية الآن لبدء حصد المقابلات."
                  : "Validated for ATS readability, styling, and structural impact. Download your preferred format now."}
              </p>
            </div>

            {/* Visual ATS Score Circle Badge */}
            <div className="shrink-0 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center min-w-[130px] shadow-lg">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                {isAr ? "معدل الـ ATS" : "ATS Score"}
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">{score}</span>
                <span className="text-sm font-black text-emerald-400/80">%</span>
              </div>
              <span className="mt-1 text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {score >= 80 ? (isAr ? "ممتاز جداً" : "Optimal") : (isAr ? "جيد جداً" : "Good")}
              </span>
            </div>
          </div>

          {/* Action Download Cards (Primary PDF vs Secondary DOCX) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* PDF Primary Card */}
            <div className="bg-white/10 hover:bg-white/[0.14] backdrop-blur-md rounded-2xl p-5 border border-white/15 transition-all duration-300 text-start flex flex-col justify-between group">
              <div className="space-y-2.5 mb-5">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    {isAr ? "النسخة الرسمية %100" : "Recommended Official"}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {isAr ? "تحميل ملف PDF المعتمد" : "Download Official PDF"}
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed mt-1 font-medium">
                    {isAr
                      ? "يحفظ التنسيق والمحاذاة والخطوط بدقة 100% عبر كافة الأجهزة الشاشات ومطابق لأنظمة ATS."
                      : "Preserves exact formatting, margins, typography, and structure for ATS scanners."}
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={onPrint}
                className="group/btn w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-black text-xs shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-orange-400/30"
              >
                <Download size={15} className="text-white group-hover/btn:translate-y-0.5 transition-transform duration-200" />
                <span>{isAr ? "تحميل ملف PDF النهائي" : "Download Official PDF"}</span>
                <ArrowRight size={14} className="rtl:rotate-180 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* Word DOCX Card */}
            <div className="bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 transition-all duration-300 text-start flex flex-col justify-between group">
              <div className="space-y-2.5 mb-5">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-500/30">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-300 bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
                    {isAr ? "قابل للتعديل" : "Editable DOCX"}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {isAr ? "تصدير بصيغة Word (.docx)" : "Export Word Document"}
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed mt-1 font-medium">
                    {isAr
                      ? "يتيح لك تعديل النص أو إضافة تفاصيل يدوياً بحرية كاملة عبر برنامج Microsoft Word."
                      : "Generates an editable Word file for offline modifications and manual tweaks."}
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={onExportWord}
                className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 rounded-xl font-extrabold text-xs shadow-2xs hover:-translate-y-0.5 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={15} className="text-slate-200" />
                <span>{isAr ? "تصدير بصيغة Word (.docx)" : "Export to Word DOCX"}</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── 2. Collapsible ATS Detailed Audit Report ── */}
      <div className="border border-slate-200/80 bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-xs transition-all">
        {/* Toggle Header */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full p-5 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100/70 transition-all text-start cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Target size={18} className={cn(showDetails ? "text-amber-400" : "animate-pulse")} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>{isAr ? "🔍 تقرير فحص جودة السيرة الذاتية وملاحظات الـ ATS" : "🔍 ATS Quality Audit & Diagnostics"}</span>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-black leading-none border",
                  score >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                )}>
                  {score}%
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {isAr 
                  ? "اضغط هنا لاستعراض الأقسام والتوصيات الخاصة بتحسين فرز السيرة الذاتية" 
                  : "Click to reveal line-by-line section diagnostics and keyword enhancements."}
              </p>
            </div>
          </div>
          
          <div className="text-slate-400 p-1 rounded-lg bg-white border border-slate-200">
            {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {/* Collapsible Content */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="border-t border-slate-200/80 overflow-hidden"
            >
              <div className="p-5 sm:p-6 space-y-6 bg-white">
                
                {/* Visual score horizontal progress bar */}
                <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                          {isAr ? "مقياس مطابقة الـ ATS" : "ATS Readiness Index"}
                        </span>
                        <h4 className="text-lg font-black">
                          {isAr ? "التقييم الفني المباشر" : "Live Quality Score"}
                        </h4>
                      </div>
                      <span className="text-3xl font-black text-emerald-400">{score}%</span>
                    </div>
                    {/* Minimal Progress Line */}
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          score >= 80 ? "bg-emerald-400" : score >= 50 ? "bg-amber-400" : "bg-rose-500"
                        )}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Score Verdict Tag */}
                  <div className={cn(
                    "px-4 py-2.5 rounded-xl text-xs font-black border text-center shrink-0 min-w-[150px] shadow-3xs",
                    score >= 80 
                      ? "text-emerald-400 bg-emerald-950/40 border-emerald-500/30" 
                      : score >= 50 
                        ? "text-amber-400 bg-amber-950/40 border-amber-500/30" 
                        : "text-rose-400 bg-rose-950/40 border-rose-500/30"
                  )}>
                    {scoreVerdict.text}
                  </div>
                </div>

                {/* Section-by-Section Breakdown */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">
                    {isAr ? "📂 تفصيل التقييم حسب أقسام السيرة الذاتية" : "📂 Section Score Breakdown"}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {sections.map((section, idx) => {
                      const pointsLost = section.maxScore - section.score;
                      const hasPointsLost = pointsLost > 0;
                      
                      return (
                        <div key={idx} className="p-4 border border-slate-200/80 rounded-2xl bg-slate-50/50 space-y-3 hover:border-slate-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900">{section.title}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-black text-slate-600">
                                {section.score}/{section.maxScore}
                              </span>
                              {hasPointsLost && (
                                <span className="px-1.5 py-0.5 rounded-md bg-rose-50 border border-rose-100 text-rose-600 text-[9px] font-black">
                                  -{pointsLost} {isAr ? "نقاط" : "pts"}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Individual Section Progress bar */}
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-700",
                                section.score / section.maxScore >= 0.8 
                                  ? "bg-emerald-500" 
                                  : section.score / section.maxScore >= 0.5 
                                    ? "bg-amber-500" 
                                    : "bg-rose-500"
                              )}
                              style={{ width: `${(section.score / (section.maxScore || 1)) * 100}%` }}
                            />
                          </div>

                          {/* Improvements & Success Points toggle list */}
                          <div className="space-y-1.5 pt-1">
                            {section.improvements.map((imp, i) => (
                              <div key={i} className="flex gap-2 p-2 rounded-xl bg-amber-50/80 border border-amber-200/60 text-[10px] sm:text-[11px] text-amber-950 leading-relaxed font-bold">
                                <span className="text-amber-500 shrink-0 font-black">⚠️</span>
                                <span>{imp}</span>
                              </div>
                            ))}

                            {section.goodPoints.map((gp, i) => (
                              <div key={i} className="flex gap-2 p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 text-[10px] sm:text-[11px] text-slate-700 leading-relaxed font-medium">
                                <Check size={12} className="text-emerald-600 shrink-0 mt-0.5" />
                                <span>{gp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 3. Target Job Description Matcher Tool ── */}
      <div className="border border-slate-200/80 bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
            <Wand2 size={18} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">
              {isAr ? "مطابقة الوصف الوظيفي (Job Description Matcher)" : "Target Job Description Matcher"}
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              {isAr
                ? "الصق متطلبات الوظيفة المستهدفة لاستخراج الكلمات المفتاحية ومقارنتها بسيرتك لرفع فرص القبول!"
                : "Paste corporate job description terms to extract keywords and verify ATS alignment."}
            </p>
          </div>
        </div>

        <div className="relative">
          <textarea dir="auto"
            value={data.jobDescription || ""}
            onChange={(e) => updateJobDescription(e.target.value)}
            placeholder={isAr ? "الصق متطلبات ومؤهلات الوظيفة المطلوبة هنا لحساب مطابقة الكلمات المفتاحية..." : "Paste corporate job description terms, requirements or specifications..."}
            className="w-full h-24 p-3.5 border border-slate-200 hover:border-slate-300 focus:border-slate-800 rounded-xl transition-all text-xs resize-none bg-slate-50/50 focus:bg-white outline-none font-medium"
          />
          {!data.jobDescription && (
            <div className={cn(
              "absolute bottom-4 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 pointer-events-none",
              isAr ? "left-4" : "right-4"
            )}>
              <Sparkles size={12} className="text-indigo-500 animate-pulse" />
              <span>{isAr ? "استخراج الكلمات المفتاحية الذكي متوفر" : "AI Keyword Extraction Ready"}</span>
            </div>
          )}
        </div>

        {data.jobDescription && data.jobDescription.trim().length > 10 && (
          <div className="pt-2 animate-in fade-in duration-300">
            <ATSAnalyzer
              resume={JSON.stringify(data)}
              jobDescription={data.jobDescription}
            />
          </div>
        )}
      </div>

      {/* ── 4. Hash Hunt Recommended Opportunities Banner ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden group">
        <div className="absolute top-2 right-2 text-slate-800/40 animate-pulse">
          <Flame size={70} />
        </div>
        <div className="space-y-4 relative z-10 text-center sm:text-start flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 text-[10px] font-black border border-amber-400/20">
              <Sparkles size={12} />
              <span>{isAr ? "الفرصة القادمة بانتظارك" : "Next Career Opportunity"}</span>
            </div>
            <h3 className="text-lg font-black tracking-tight text-white">
              {isAr ? "البحث عن وظائف متوافقة مع سيرتك الذاتية 🎯" : "Explore Matched Open Positions 🎯"}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed font-medium">
              {isAr
                ? "سيرتك الذاتية أصبحت جاهزة! ابدأ التقديم على أحدث الوظائف الشاغرة المتوافقة مع خبراتك عبر منصة Hash Hunt."
                : "Your resume is fully primed. Speed up your search and discover open positions tailored to your qualifications."}
            </p>
          </div>
          
          <Link
            to="/hash-hunt"
            className="group/link shrink-0 flex items-center gap-2 h-11 px-6 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all text-slate-950 rounded-xl text-xs font-black cursor-pointer select-none shadow-lg shadow-amber-400/20"
          >
            <span>{isAr ? "استكشف الوظائف المتاحة" : "Explore Jobs Now"}</span>
            <ArrowRight size={14} className="rtl:rotate-180 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ── 5. Interview Mastery Guidelines ── */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80">
        <div className="text-start space-y-0.5">
          <h3 className="text-base font-black text-slate-900">
            {isAr ? "💡 خريطة النجاح في المقابلة الوظيفية" : "💡 Interview Preparation Guidelines"}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            {isAr 
              ? "استعد للمقابلة باحترافية من خلال الإرشادات القيمة التي يقدمها خبراء التوظيف" 
              : "Core strategies and communication methods recommended by seasoned HR leaders."}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {tips.map((tip, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all flex gap-3.5 text-start"
            >
              <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-center shrink-0">
                {tip.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-slate-900 text-xs">
                  {tip.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal font-medium">
                  {tip.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
