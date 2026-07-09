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
  AlertCircle,
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
  const { score, sections } = useMemo(() => calculateATSScore(data), [data]);
  const hasImprovements = sections.some(s => s.improvements.length > 0);

  // Toggle for collapsible details box
  const [showDetails, setShowDetails] = useState(false);

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
      icon: <Compass className="w-5 h-5 text-indigo-500" />
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-2 sm:p-4 max-w-4xl mx-auto relative overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      
      {/* ── 1. Immediate Premium Downloads (خلي التحميل يبقي في البدايه) ── */}
      <div className="bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6 text-center">
        
        {/* Subtle Check Badge */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              {isAr ? "سيرتك جاهزة للتحميل الفوري! 🚀" : "Your Resume is Ready to Launch!"}
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm font-medium max-w-lg mx-auto">
              {isAr 
                ? "انتهيت بامتياز! اختر التنسيق الأنسب لاحتياجك لبدء التقديم على الوظائف وحصد المقابلات."
                : "Excellent work! Choose the preferred format to download and start applying directly."}
            </p>
          </div>
        </div>

        {/* Clean Responsive Side-by-Side Download Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* PDF Card (Official / ATS friendly) */}
          <div className="bg-neutral-50 hover:bg-neutral-100/50 rounded-2xl p-5 border border-neutral-200/50 transition-all text-start flex flex-col justify-between group">
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-rose-100/60 text-rose-600 rounded-xl">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                  {isAr ? "النسخة الرسمية الحية" : "Official Copy"}
                </span>
              </div>
              <h3 className="text-sm font-bold text-neutral-800">
                {isAr ? "تحميل بصيغة PDF الاحترافية" : "Standard PDF Document"}
              </h3>
              <p className="text-[11px] text-neutral-500 leading-normal">
                {isAr
                  ? "يحفظ التنسيق والمحاذاة بدقة فندقية %100 عبر جميع الأجهزة ومطابق لشروط فحص الـ ATS."
                  : "Preserves exact layouts, fonts of record, margins and alignments consistently for hiring systems."}
              </p>
            </div>
            
            <button
              type="button"
              onClick={onPrint}
              className="w-full py-3 bg-neutral-950 hover:bg-neutral-900 text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              <Download size={14} className="animate-bounce text-[#FF4D2D]" />
              <span>{isAr ? "تحميل ملف PDF" : "Download PDF file"}</span>
            </button>
          </div>

          {/* Word Card (Editable) */}
          <div className="bg-neutral-50 hover:bg-neutral-100/50 rounded-2xl p-5 border border-neutral-200/50 transition-all text-start flex flex-col justify-between group">
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-blue-100/60 text-blue-600 rounded-xl">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                  {isAr ? "قابلة للتعديل والنسخ" : "Editable Microsoft Word"}
                </span>
              </div>
              <h3 className="text-sm font-bold text-neutral-800">
                {isAr ? "تصدير بصيغة Word مخصصة" : "Editable Word DOCX format"}
              </h3>
              <p className="text-[11px] text-neutral-500 leading-normal">
                {isAr
                  ? "يتيح لك تعديل النص أو هيكل المستند لاحقاً يدوياً بحرية كاملة عبر برامج المكتب دون قيود."
                  : "Provides fully customizable document model for native Word processors offline."}
              </p>
            </div>
            
            <button
              type="button"
              onClick={onExportWord}
              className="w-full py-3 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-250 rounded-xl font-bold text-xs shadow-3xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              <Download size={14} className="text-[#FF4D2D]" />
              <span>{isAr ? "تصدير بصيغة Word (.docx)" : "Export to Word DOCX"}</span>
            </button>
          </div>

        </div>
      </div>

      {/* ── 2. Collapsible ATS Review Card (مربع تحت كده لو حد عايز يعرف تفاصيل الي محتاجه تطوير او تحسين) ── */}
      <div className="border border-neutral-200/80 bg-white rounded-3xl overflow-hidden shadow-xs">
        {/* Toggle Panel Header */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full p-5 flex items-center justify-between bg-neutral-50 hover:bg-neutral-100/60 transition-all text-start cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <Target size={18} className={cn(showDetails ? "" : "animate-pulse")} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-850 flex items-center gap-2">
                <span>{isAr ? "🔍 تقرير فحص وملاحظات الـ ATS الخاصة بك" : "🔍 Your ATS Quality Audit Report"}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-bold leading-none",
                  score >= 80 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                )}>
                  {score}%
                </span>
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {isAr 
                  ? "اضغط هنا لرؤية النقاط التي تحتاج تطوير أو الأقسام المفقودة بالتفصيل" 
                  : "Click to explore dynamic guidelines, suggestions, and critical checklist errors."}
              </p>
            </div>
          </div>
          
          <div className="text-neutral-500">
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
              className="border-t border-neutral-150 overflow-hidden"
            >
              <div className="p-5 sm:p-6 space-y-6 bg-white">
                
                {/* Visual score horizontal progress bar */}
                <div className="bg-neutral-50/80 rounded-2xl p-4 border border-neutral-150/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 max-w-md">
                    <div className="flex justify-between items-center text-xs font-bold text-neutral-700">
                      <span>{isAr ? "درجة ملاءمة السيرة الذاتية لـ ATS" : "ATS Optimization Meter"}</span>
                      <span>{score} / 100</span>
                    </div>
                    {/* Minimal Progress Line */}
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500"
                        )}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Score Verdict Tag */}
                  <div className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-bold border",
                    scoreVerdict.color
                  )}>
                    {scoreVerdict.text}
                  </div>
                </div>

                {/* Split lists: Required Improvements (محتاجه تطوير) VS Success Points */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  
                  {/* Column 1: Suggestions / What to develop (النقاط التي تحتاج تطوير وتحسين) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-neutral-805 flex items-center gap-1.5 px-1 uppercase tracking-wide">
                      <AlertCircle size={15} className="text-amber-500" />
                      <span>{isAr ? "نقاط تحتاج تحسين وتطوير ⚠️" : "Improvement Suggestions ⚠️"}</span>
                    </h4>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {hasImprovements ? (
                        sections.map((section, idx) => 
                          section.improvements.length > 0 && (
                            <div key={idx} className="space-y-1.5">
                              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block px-1">
                                {section.title}
                              </span>
                              <div className="space-y-1.5">
                                {section.improvements.map((imp, i) => (
                                  <div key={i} className="flex gap-2 p-3 rounded-xl border border-amber-100/60 bg-gradient-to-br from-amber-50/40 to-amber-100/10 text-[11px] text-neutral-700 leading-relaxed font-medium">
                                    <span className="text-amber-600 shrink-0 font-bold">✦</span>
                                    <span>{imp}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center text-neutral-400 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                          <CheckCircle2 size={24} className="text-emerald-400 mb-1" />
                          <p className="text-[11px] italic">
                            {isAr ? "لا توجد تعديلات عاجلة، سيرتك ممتازة!" : "Awesome! No modifications recommended!"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Column 2: Working Well (النقاط المنجزة التي تجعل سيرتك قوية) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-neutral-805 flex items-center gap-1.5 px-1 uppercase tracking-wide">
                      <CheckCircle2 size={15} className="text-emerald-500" />
                      <span>{isAr ? "ما يميّز سيرتك الذاتية حالياً ✅" : "What is Working Well ✅"}</span>
                    </h4>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {sections.some(s => s.goodPoints.length > 0) ? (
                        sections.map((section, idx) => 
                          section.goodPoints.length > 0 && (
                            <div key={idx} className="space-y-1.5">
                              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block px-1">
                                {section.title}
                              </span>
                              <div className="space-y-1.5">
                                {section.goodPoints.map((gp, i) => (
                                  <div key={i} className="flex gap-2 p-3 rounded-xl border border-emerald-100/60 bg-gradient-to-br from-emerald-50/40 to-emerald-100/10 text-[11px] text-neutral-700 leading-relaxed font-medium">
                                    <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{gp}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center text-neutral-400 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                          <Target size={24} className="text-neutral-300 mb-1" />
                          <p className="text-[11px] italic">
                            {isAr ? "اكمل تعبئة الحقول الأساسية أولاً" : "Add some experience or skills description first"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Standalone Job Description Matcher (Moved outside so it's always visible!) */}
      <div className="border border-neutral-200/80 bg-white rounded-3xl overflow-hidden shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-50 shadow-3xs rounded-lg text-orange-500">
            <Wand2 size={16} />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-neutral-800">
              {isAr ? "مطابقة الوظيفة المستهدفة (Job Matcher)" : "Target Job Matcher"}
            </h4>
            <p className="text-[11px] text-neutral-500 leading-none">
              {isAr
                ? "الصق الوصف الوظيفي (Job Description)، ليقوم النظام باستخراج الكلمات المفتاحية لمطابقتها مع سيرتك لرفع نسبة الـ ATS!"
                : "Paste Job Description to extract keywords and identify missing skills to boost ATS match rate!"}
            </p>
          </div>
        </div>

        <div className="relative">
          <textarea dir="auto"
            value={data.jobDescription || ""}
            onChange={(e) => updateJobDescription(e.target.value)}
            placeholder={isAr ? "الصق متطلبات ومؤهلات الوظيفة المطلوبة هنا لحساب مطابقة الكلمات المفتاحية..." : "Paste corporate job description terms, requirements or specifications..."}
            className="w-full h-24 p-3 border border-neutral-200 hover:border-neutral-300 focus:border-brand-500 rounded-xl transition-all text-xs resize-none bg-neutral-50 focus:bg-white outline-none"
          />
          {!data.jobDescription && (
            <div className={cn(
              "absolute bottom-4 flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 pointer-events-none",
              isAr ? "left-4" : "right-4"
            )}>
              <Sparkles size={12} className="text-brand-500 animate-pulse" />
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

      {/* ── 3. Next Recommended Steps: Job Match & roadmap ── */}
      <div className="bg-gradient-to-tr from-neutral-900 via-neutral-850 to-neutral-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-radial from-[#FF4D2D]/[0.06] to-transparent pointer-events-none" />
        <div className="absolute top-2 right-2 text-neutral-700/20 animate-pulse">
          <Flame size={60} />
        </div>
        <div className="space-y-4 relative z-10 text-center">
          <div className="mx-auto p-2.5 bg-white/10 rounded-2xl text-[#FF4D2D] w-fit font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-black tracking-tight">
            {isAr ? "الخطوة التالية الموصى بها: البحث عن فرص عمل متطابقة 🎯" : "Next Recommended Step: Explore Matched Jobs 🎯"}
          </h3>
          <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed max-w-lg mx-auto">
            {isAr
              ? "لقد صممت سيرة ذاتية ممتازة ومتكاملة للتقييم الآلي! تصفح أفضل الفرص المتاحة التي تتوافق مع خبراتك لتزيد من احتمال الاتصال بك."
              : "You've crafted a powerful, ATS-optimized resume! Speed up your search and discover matched open positions tailored to your unique qualifications."}
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              to="/hash-hunt"
              className="flex items-center gap-2 h-10 px-6 bg-[#FF4D2D] hover:bg-[#E64528] active:scale-95 transition-all text-white rounded-xl text-xs font-bold cursor-pointer select-none"
            >
              <span>{isAr ? "دخول مستكشف الفرص الذكي (هاش هانت)" : "Explore Jobs (Hash Hunt)"}</span>
              <ArrowRight size={12} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>

      {/* Golden Success tips */}
      <div className="space-y-4 pt-4 border-t border-neutral-100">
        <div className="text-start space-y-0.5">
          <h3 className="text-base font-black text-neutral-800">
            {isAr ? "💡 خريطة ذهبية للتألق في المقابلة الوظيفية" : "💡 Interview Success Guidelines"}
          </h3>
          <p className="text-[11px] text-neutral-500">
            {isAr 
              ? "نصائح وإرشادات سريعة لتعزيز ثقتك وتجهيزك لاختصار طريق النجاح الوظيفي" 
              : "Core strategies and communication methods recommended by seasoned HR leaders."}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {tips.map((tip, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/50 flex gap-3 text-start"
            >
              <div className="w-9 h-9 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-center shrink-0 border border-neutral-100">
                {tip.icon}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-neutral-800 text-xs">
                  {tip.title}
                </h4>
                <p className="text-[11px] text-neutral-500 leading-normal">
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
