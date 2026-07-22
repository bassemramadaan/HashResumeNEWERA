import React, { useState } from "react";
import { Sparkles, X, Check, BookOpen, MessageSquare, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface ATSVerbAssistantProps {
  onSelectWord?: (word: string) => void;
  isAr: boolean;
}

interface VerbCategory {
  id: string;
  nameEn: string;
  nameAr: string;
  verbs: { en: string; ar: string; descEn: string; descAr: string }[];
}

const VERB_CATEGORIES: VerbCategory[] = [
  {
    id: "management",
    nameEn: "Management & Leadership",
    nameAr: "الإدارة والقيادة",
    verbs: [
      { en: "Spearheaded", ar: "قاد ووجّه", descEn: "Led an initiative with extreme drive", descAr: "توجيه مبادرة بجهد ريادي" },
      { en: "Orchestrated", ar: "نظّم وأسس", descEn: "Coordinated complex processes smoothly", descAr: "تنسيق عمليات معقدة بانسجام" },
      { en: "Directed", ar: "أشرف على", descEn: "Supervised and guided teams toward goals", descAr: "توجيه وتدريب الفرق نحو الأهداف" },
      { en: "Championed", ar: "تبنّى ودعم", descEn: "Drove a successful idea or policy", descAr: "تبني فكرة أو ثقافة عمل ناجحة" },
      { en: "Executed", ar: "نفّذ وأنجز", descEn: "Completed a plan or action perfectly", descAr: "إتمام وتطبيق خطة عملية بدقة" },
      { en: "Coordinated", ar: "نسّق وسهّل", descEn: "Brought multiple parties together effectively", descAr: "تنسيق جهود أطراف متعددة بفعالية" },
    ],
  },
  {
    id: "tech",
    nameEn: "Tech & Engineering",
    nameAr: "الهندسة والتقنية",
    verbs: [
      { en: "Architected", ar: "صمّم وهيكل", descEn: "Designed structural and backend details", descAr: "تصميم وبناء هيكلية برمجية متطورة" },
      { en: "Automated", ar: "أتمت وسرّع", descEn: "Reduced manual effort via scripts/tools", descAr: "تقليل المجهود البشري باستعمال التقنية" },
      { en: "Developed", ar: "برمج وطوّر", descEn: "Created robust and scalable applications", descAr: "تطوير تطبيقات قوية وقابلة للتوسع" },
      { en: "Deployed", ar: "أطلق وثبّت", descEn: "Pushed releases/features into production", descAr: "إطلاق وتثبيت الخصائص في بيئة العمل" },
      { en: "Optimized", ar: "حسّن وسرّع", descEn: "Improved performance, memory or load times", descAr: "تحسين معايير الأداء والسرعة" },
      { en: "Engineered", ar: "هندس وبنى", descEn: "Solved deep technical problems skillfully", descAr: "حل مشاكل تقنية معقدة بمهارة" },
    ],
  },
  {
    id: "sales",
    nameEn: "Sales & Growth",
    nameAr: "المبيعات والتسويق",
    verbs: [
      { en: "Generated", ar: "حقّق وجلب", descEn: "Produced fresh revenues or organic leads", descAr: "تحقيق عوائد مالية أو جذب عملاء جدد" },
      { en: "Boosted", ar: "ضاعف وزاد", descEn: "Increased overall metrics and metrics", descAr: "رفع مؤشرات الأداء والتحصيل" },
      { en: "Acquired", ar: "امتلك واستقطب", descEn: "Brought new key client accounts", descAr: "استقطاب صفقات وعملاء استراتيجيين" },
      { en: "Cultivated", ar: "عزز ونمّى", descEn: "Nurtured relationships to grow business", descAr: "بناء وتغذية الشراكات لنمو الأعمال" },
      { en: "Maximized", ar: "عظّم وحفّز", descEn: "Pushed metrics to their absolute highest", descAr: "زيادة وتعظيم النتائج للحد الأقصى" },
    ],
  },
  {
    id: "operations",
    nameEn: "Operations & Quality",
    nameAr: "العمليات والجودة",
    verbs: [
      { en: "Streamlined", ar: "بسط وسهّل", descEn: "Simplified workflows to reduce waste", descAr: "تبسيط مسارات العمل وتقليص الهدر" },
      { en: "Standardized", ar: "وحّد وقنّن", descEn: "Created clean repeatable processes", descAr: "توحيد المعايير والعمليات التكرارية" },
      { en: "Revitalized", ar: "أحيا وافتتح", descEn: "Brought deprecated processes to life", descAr: "تجديد وإحياء أنظمة عمل قديمة" },
      { en: "Formulated", ar: "صاغ وحدّد", descEn: "Drafted strategic roadmaps and policies", descAr: "صياغة السياسات والخطط الاستراتيجية" },
      { en: "Resolved", ar: "حلّ وتغلّب على", descEn: "Discovered and fixed heavy operational bottlenecks", descAr: "اكتشاف وحل عوائق العمليات الصعبة" },
    ],
  },
];

export default function ATSVerbAssistant({ onSelectWord, isAr }: ATSVerbAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState<"verbs" | "star">("verbs");
  const [activeTab, setActiveTab] = useState("management");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSelect = (word: string) => {
    if (onSelectWord) {
      onSelectWord(word);
    } else {
      navigator.clipboard.writeText(word);
    }
    setCopiedId(word);
    setTimeout(() => setCopiedId(null), 1200);
  };

  return (
    <>
      {/* Floating Trigger Badge */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-amber-600 text-white px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-black cursor-pointer hover:shadow-lg hover:from-brand-650 hover:to-amber-650 transition-all active:scale-95 shadow-xs shadow-brand-500/10"
      >
        <Sparkles size={12} className="animate-pulse" />
        <span>{isAr ? "⚡ قاموس أفعال ATS وصياغة STAR" : "⚡ ATS Verbs & STAR Companion"}</span>
      </button>

      {/* Slide-out Drawer Panel overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end font-sans">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Container */}
          <div
            className={cn(
              "relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-350 ease-out border-l border-slate-100",
              isAr ? "text-right" : "text-left"
            )}
            dir={isAr ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <Sparkles size={16} />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800">
                    {isAr ? "مساعد صياغة الإنجازات الاحترافي" : "Professional Achievement Formulator"}
                  </h3>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  {isAr 
                    ? "اختر الأفعال القوية وصغ إنجازاتك بأسلوب STAR لتجاوز أنظمة ATS." 
                    : "Formulate bulletproof achievement records using action verbs and STAR method."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-450 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Segment Selector tabs */}
            <div className="grid grid-cols-2 border-b border-slate-100 font-bold text-xs p-2 gap-2 bg-slate-100/30">
              <button
                type="button"
                onClick={() => setActiveSegment("verbs")}
                className={cn(
                  "py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                  activeSegment === "verbs"
                    ? "bg-white text-brand-600 shadow-3xs"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/30"
                )}
              >
                <Sparkles size={14} />
                <span>{isAr ? "أفعال حركة ATS قيادية" : "ATS Action Verbs"}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSegment("star")}
                className={cn(
                  "py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                  activeSegment === "star"
                    ? "bg-white text-brand-600 shadow-3xs"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/30"
                )}
              >
                <BookOpen size={14} />
                <span>{isAr ? "منهجية STAR للصياغة" : "STAR Formulation Guide"}</span>
              </button>
            </div>

            {/* Content Drawer Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeSegment === "verbs" ? (
                <div className="space-y-4">
                  <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl text-[10px] text-orange-850 leading-relaxed font-medium">
                    {isAr 
                      ? "💡 نصيحة ممتازة: ابدأ دائماً كل نقطة في قسم الخبرات أو المشاريع بفعل حركة مبني للمعلوم قوي بدلاً من صياغات سلبية خاملة."
                      : "💡 Quick Tip: Always kick off each description bullet point with a decisive action verb rather than passive phrases."}
                  </div>

                  {/* Sidebar Tabs */}
                  <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100">
                    {VERB_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveTab(cat.id)}
                        className={cn(
                          "py-1.5 px-3 rounded-lg text-[10px] font-bold cursor-pointer transition-all",
                          activeTab === cat.id
                            ? "bg-brand-600 text-white shadow-3xs"
                            : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        )}
                      >
                        {isAr ? cat.nameAr : cat.nameEn}
                      </button>
                    ))}
                  </div>

                  {/* Verbs Grid */}
                  <div className="grid grid-cols-1 gap-2.5 pt-2">
                    {VERB_CATEGORIES.find((cat) => cat.id === activeTab)?.verbs.map((verb) => (
                      <button
                        key={verb.en}
                        type="button"
                        onClick={() => handleSelect(isAr ? verb.ar : verb.en)}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-150 bg-slate-50/20 hover:bg-brand-50/20 hover:border-brand-200 transition-all text-start group relative cursor-pointer"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-black text-slate-900 group-hover:text-brand-650 transition-colors font-mono">
                              {verb.en}
                            </span>
                            <span className="text-[10px] font-black text-brand-600">
                              {verb.ar}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-450 leading-relaxed font-medium">
                            {isAr ? verb.descAr : verb.descEn}
                          </p>
                        </div>
                        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                          <Copy size={11} />
                        </div>

                        {copiedId === (isAr ? verb.ar : verb.en) && (
                          <div className="absolute inset-0 bg-brand-500/95 text-white flex items-center justify-center rounded-xl animate-fade-in text-xs font-black">
                            <Check size={14} className={isAr ? "ml-1.5" : "mr-1.5"} />
                            <span>{isAr ? "تم النسخ والإدراج!" : "Copied & Injected!"}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-start">
                  {/* STAR Explanation Card */}
                  <div className="space-y-4">
                    <div className="flex gap-2 items-center text-xs font-black text-slate-800">
                      <BookOpen size={16} className="text-brand-600" />
                      <span>{isAr ? "ما هي طريقة STAR في الكتابة؟" : "What is the STAR Method?"}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {isAr
                        ? "منهجية هيكلية لإثبات كفاءتك وعرض إنجازاتك في جملة مركزة ومقنعة تبدأ بفعل حركة وتقدم مقاييس وأرقام ملموسة."
                        : "A golden structural framework to explain any task or success story powerfully using decisive metrics."}
                    </p>

                    <div className="space-y-2">
                      <div className="p-3 bg-red-50/40 rounded-xl border-l-[3px] border-brand-600 space-y-1">
                        <span className="text-xs font-black text-brand-600 block">S - Situation (الموقف)</span>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                          {isAr ? "تحديد السياق أو المشكلة التي عانى منها فريقك." : "Describe the background context or the problem."}
                        </p>
                      </div>

                      <div className="p-3 bg-red-50/40 rounded-xl border-l-[3px] border-brand-600 space-y-1">
                        <span className="text-xs font-black text-brand-600 block">T - Task (المهمة)</span>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                          {isAr ? "توضيح الأهداف أو المطلوب تغييره لمعالجة الموقف." : "Explain what challenges needed to be addressed."}
                        </p>
                      </div>

                      <div className="p-3 bg-red-50/40 rounded-xl border-l-[3px] border-brand-600 space-y-1">
                        <span className="text-xs font-black text-brand-600 block">A - Action (الإجراء)</span>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                          {isAr ? "كيف تصرفت ووظفت خبرتك لحل الأزمة (استعمل الفعل القوي)." : "Detail the exact professional solutions you devised."}
                        </p>
                      </div>

                      <div className="p-3 bg-red-50/40 rounded-xl border-l-[3px] border-brand-600 space-y-1">
                        <span className="text-xs font-black text-brand-600 block">R - Result (النتيجة)</span>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                          {isAr ? "النتائج النهائية المدعومة بالأرقام والنسب المئوية." : "Highlight direct quantitative success (revenue, speed, ratios)."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Concrete Formulas comparison template */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-2">
                      <MessageSquare size={14} className="text-brand-600" />
                      {isAr ? "صياغة المبتدئ ❌ مقابل صياغة الخبير بالنظام ✅" : "Beginner Writing ❌ vs STAR Pro Writing ✅"}
                    </span>

                    <div className="space-y-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-slate-500">
                        <span className="font-bold text-[10px] text-rose-500 block">❌ {isAr ? "صياغة ضعيفة" : "Weak Phrase"}</span>
                        <p className="text-[10px] font-medium leading-relaxed">
                          {isAr ? "عملت على تسريع لوحة التحكم وموقع الشركة وتحميل الصفحة." : "Worked on improving page load speed on dashboard."}
                        </p>
                      </div>

                      <div className="bg-brand-50/30 p-3 rounded-xl border border-brand-150 space-y-1.5 text-slate-700">
                        <span className="font-bold text-[10px] text-emerald-600 block">✅ {isAr ? "صياغة STAR" : "STAR Phrase"}</span>
                        <p className="text-[10px] font-bold leading-relaxed leading-normal">
                          {isAr 
                            ? "أتمتت [فعل حركة] ملفات الواجهة الأمامية عبر خزم كود الترحيل مما سرع [النتيجة] استجابة الصفحة بنسبة 45% لـ 10 آلاف عميل."
                            : "Optimized [Action Verb] front-end bundle assets, boosting [Result] response speeds by 45% for over 10K+ end-users."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Notice */}
            <div className="p-4 border-t border-slate-100 text-center text-[10px] text-slate-400 bg-slate-50/50 font-bold uppercase tracking-wider">
              {isAr ? "صُنع لمطابقة معايير توظيف دول الخليج والشركات الكبرى" : "Optimized for global ATS screening filters"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
