import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  CheckCircle2,
  ArrowRight,
  Target,
  PenTool,
  Search,
  Sparkles,
  Download,
  FileCheck2,
  FileSpreadsheet,
  Trophy,
  Flame,
  UserCheck,
  Compass
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

interface FinishStepProps {
  onPrint?: () => void;
  onExportWord?: () => void;
  onJumpToStep: (step: string) => void;
}

export default function FinishStep({
  onPrint,
  onExportWord,
  onJumpToStep,
}: FinishStepProps) {
  const { language } = useLanguageStore();
  const t = translations[language].landing.finish;

  const isAr = language === "ar";

  // Motivational Messages for candidate success
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
      icon: <Search className="w-5 h-5 text-brand-500" />
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

  const nextSteps = [
    {
      title: t.findJobs || "Apply with Hash Hunt",
      desc: t.findJobsDesc || "Publish your CV to our partner employers.",
      icon: <Search className="w-6 h-6 text-[#FF4D2D]" />,
      path: "/hash-hunt",
      type: "link",
    },
    {
      title: t.checkAts,
      desc: t.checkAtsDesc,
      icon: <Target className="w-6 h-6 text-[#FF4D2D]" />,
      action: () => onJumpToStep("finish"),
      type: "button",
    },
    {
      title: t.createCover,
      desc: t.createCoverDesc,
      icon: <PenTool className="w-6 h-6 text-[#FF4D2D]" />,
      path: "/cover-letter",
      type: "link",
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 max-w-4xl mx-auto relative overflow-hidden">
      
      {/* Decorative Floating Success Particles */}
      <div className="absolute top-0 inset-x-0 flex justify-center pointer-events-none opacity-45">
        <div className="w-[450px] h-[450px] bg-emerald-350/10 rounded-full blur-3xl" />
      </div>

      {/* Celebratory Header */}
      <div className="text-center space-y-4 relative z-10">
        <div className="relative inline-block">
          {/* Pulsing Backlight */}
          <span className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl animate-ping opacity-60" />
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-[0_8px_32px_rgba(16,185,129,0.3)]"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          
          {/* Sparkly Accents */}
          <div className="absolute -top-1 -right-3 text-amber-500 animate-bounce">
            <Sparkles size={20} />
          </div>
          <div className="absolute -bottom-1.5 -left-3 text-brand-500 animate-pulse delay-500">
            <Sparkles size={16} />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight pt-2">
          {isAr ? "تهانينا! سيرتك الذاتية جاهزة للانطلاق 🚀" : "Hooray! Your Professional Resume is Ready!"}
        </h2>
        <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {isAr 
            ? "لقد قمت بعمل رائع في صياغة خبراتك ومهاراتك بشكل منضبط وفندقي. الآن سيرتك مجهزة لتجاوز أنظمة الـ ATS والوصول بأمان لمسؤولي التوظيف."
            : "You have completed the intensive work of compiling your professional record. It is fully formatted and ready to leave an exceptional first impression."}
        </p>
      </div>

      {/* Download Center - Primary and Secondary Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* PDF Standard download - Most Popular */}
        <div className="bg-gradient-to-tr from-brand-500 to-amber-500 rounded-3xl p-0.5 shadow-xl hover:shadow-brand-500/15 group transition-all duration-300 hover:scale-[1.015]">
          <div className="bg-white rounded-[22px] p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-3 text-start">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-[#FF4D2D]">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black tracking-widest text-[#FF4D2D] bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full uppercase">
                  {isAr ? "النسخة الأكثر احترافية" : "Highly Recommended"}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {isAr ? "تحميل بصيغة PDF الاحترافية" : "Download PDF Document"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isAr
                  ? "التنسيق الرياضي القياسي لحفظ النواميس الفندقية وحماية خطوط سيرة الذاتية لتبدو منسقة ومتناظرة على أدوات الـ ATS وفي شاشات الـ HR."
                  : "Preserves symmetrical alignments, font styling, and page dimensions precisely across all recruiters' devices."}
              </p>
            </div>

            <button
              onClick={onPrint}
              className="w-full h-13 bg-gradient-to-r from-[#FF4D2D] to-amber-500 hover:from-[#e03d20] hover:to-amber-600 text-white rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg active:scale-98 transition-all cursor-pointer select-none"
            >
              <Download size={18} className="animate-bounce" />
              <span>{isAr ? "بدء التحميل الفوري (PDF)" : "Download PDF Now"}</span>
            </button>
          </div>
        </div>

        {/* Word Document DOCX Export */}
        <div className="bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-3xl p-0.5 shadow-xl hover:shadow-indigo-500/15 group transition-all duration-300 hover:scale-[1.015]">
          <div className="bg-white rounded-[22px] p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-3 text-start">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#185FA5]">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full uppercase">
                  {isAr ? "قابلة للتعديل والنسخ" : "Editable Copy"}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {isAr ? "تصدير بصيغة Word مخصصة" : "Export Word Format (.docx)"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isAr
                  ? "نسخة تفاعلية متناسقة تتيح لك حرية التعديل السريع على البيانات أو النصوص يدوياً لاحقاً باستخدام Microsoft Word."
                  : "Generates an editable backup copy compatible with MS Word layout tools for offline adjustments."}
              </p>
            </div>

            <button
              onClick={onExportWord}
              className="w-full h-13 bg-gradient-to-r from-[#185FA5] to-blue-500 hover:from-[#134D85] hover:to-blue-600 text-white rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg active:scale-98 transition-all cursor-pointer select-none"
            >
              <Download size={18} />
              <span>{isAr ? "تصدير بصيغة Word" : "Export word file"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Promoted AI Interview Coach Standalone Feature */}
      <div className="bg-gradient-to-tr from-slate-900 via-slate-850 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-radial from-[#FF4D2D]/[0.08] to-transparent pointer-events-none" />
        <div className="absolute top-3 right-3 text-amber-500/20 animate-pulse">
          <Flame size={70} />
        </div>
        <div className="space-y-4 relative z-10">
          <div className="mx-auto p-3 bg-white/10 rounded-2xl text-[#FF4D2D] w-fit font-black animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black tracking-tight flex items-center justify-center gap-2">
            <span>{isAr ? "الخطوة التالية الموصى بها: محاكي المقابلات 🎯" : "The Ultimate Next Step: Beat the Interview 🎯"}</span>
          </h3>
          <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-lg mx-auto">
            {isAr
              ? "السيرة الذاتية حصدت لك المقابلة، والآن حان دور التميز! تدرّب وقم بمحاكاة سيناريوهات المقابلات الحقيقية عبر مساعد المقابلات الذكي بالذكاء الاصطناعي لاختبار ثقتك وإيصال قصة نجاحك باحتراف."
              : "Resume gets you inside the room, but prep gets you the contract! Leverage our state-of-the-art interactive simulator built with Gemini to answer tough behavioral prompts."}
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              to="/interview-prep"
              className="flex items-center gap-2 h-11 px-7 bg-[#FF4D2D] hover:bg-[#E64528] active:scale-95 transition-all text-white rounded-2xl text-xs font-black shadow-lg shadow-brand-500/10 cursor-pointer select-none"
            >
              <span>{isAr ? "دخول مستشار المقابلات الشخصية بالذكاء الاصطناعي" : "Launch AI Interview Prep Coach"}</span>
              <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>

      {/* Motivational Roadmap for Candidate Success (نصائح مقابلات العمل) */}
      <div className="space-y-6 pt-6 border-t border-slate-150 relative z-10">
        <div className="text-center md:text-start space-y-1">
          <h3 className="text-xl font-black text-slate-900">
            {isAr ? "💡 خريطة طريق المقابلات الشخصية الذهبية" : "💡 Interview Success Golden Roadmap"}
          </h3>
          <p className="text-xs text-slate-500">
            {isAr 
              ? "نصائح وإرشادات سريعة لتعزيز ثقتك وتجهيزك لاختصار طريق النجاح الوظيفي" 
              : "Proactive behavioral recommendations curated by elite recruitment advisors to ease your anxiety."}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/60 flex gap-4 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 group text-start"
            >
              <div className="w-11 h-11 bg-white rounded-xl shadow-xs flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-110 transition-transform duration-200">
                {tip.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {tip.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {tip.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps Section - Custom Layout */}
      <div className="space-y-6 pt-6 border-t border-slate-150 relative z-10">
        <h3 className="text-xl font-black text-slate-900 px-2 text-start">
          {t.nextStepsTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nextSteps.map((step, idx) =>
            step.type === "link" ? (
              <Link
                key={idx}
                to={step.path!}
                className="group p-6 bg-slate-50/50 border border-slate-250/60 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-500/5 transition-all duration-300 text-start flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 p-4 bg-white border border-slate-100 rounded-2xl w-fit shadow-xs group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <h4 className="font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                    {step.title}
                    <ArrowRight
                      size={16}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-180 text-brand-500"
                    />
                  </h4>
                  <p className="text-xs text-slate-505 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </Link>
            ) : (
              <button
                key={idx}
                onClick={step.action}
                className="group p-6 bg-slate-50/50 border border-slate-250/60 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-500/5 transition-all duration-300 text-start cursor-pointer w-full flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 p-4 bg-white border border-slate-100 rounded-2xl w-fit shadow-xs group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <h4 className="font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                    {step.title}
                    <ArrowRight
                      size={16}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-180 text-brand-500"
                    />
                  </h4>
                  <p className="text-xs text-slate-505 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
