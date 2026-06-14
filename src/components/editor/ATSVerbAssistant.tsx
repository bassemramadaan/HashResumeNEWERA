import React, { useState } from "react";
import { Sparkles, X, Check } from "lucide-react";

interface ATSVerbAssistantProps {
  onSelectWord: (word: string) => void;
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
      { en: "Maximised", ar: "عظّم وحفّز", descEn: "Pushed metrics to their absolute highest", descAr: "زيادة وتعظيم النتائج للحد الأقصى" },
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
  const [activeTab, setActiveTab] = useState("management");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSelect = (word: string) => {
    onSelectWord(word);
    setCopiedId(word);
    setTimeout(() => setCopiedId(null), 1000);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 bg-gradient-to-r from-brand-600 to-amber-600 text-white px-2 py-1 rounded-lg text-[10px] font-black cursor-pointer hover:shadow-xs hover:from-brand-650 hover:to-amber-650 transition-all active:scale-95"
      >
        <Sparkles size={11} className="animate-spin-slow" />
        <span>{isAr ? "⚡ أفعال حركة ATS القوية" : "⚡ Powerful ATS Verbs"}</span>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 top-7 z-50 w-80 md:w-96 rounded-2xl bg-white p-4 shadow-xl border border-slate-200"
          dir={isAr ? "rtl" : "ltr"}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
            <div>
              <h5 className="text-xs font-extrabold text-slate-800">
                {isAr ? "🎯 دليل الأفعال القوية المتوافقة مع ATS" : "🎯 ATS Action Words Companion"}
              </h5>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {isAr ? "اضغط لإدراج الكلمة مباشرة في حقل الوصف" : "Click to instantly inject verb into description"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Categorized Tabs */}
          <div className="flex bg-slate-50 p-1 rounded-xl gap-1 mb-3.5 text-[10px] font-bold overflow-x-auto scrollbar-none">
            {VERB_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`py-1.5 px-2.5 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === cat.id
                    ? "bg-white text-brand-605 shadow-2xs"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/60"
                }`}
              >
                {isAr ? cat.nameAr : cat.nameEn}
              </button>
            ))}
          </div>

          {/* List of Verbs */}
          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {VERB_CATEGORIES.find((cat) => cat.id === activeTab)?.verbs.map((verb) => (
              <button
                key={verb.en}
                type="button"
                onClick={() => handleSelect(isAr ? verb.ar : verb.en)}
                className="flex flex-col text-start p-2.5 rounded-xl border border-slate-100 bg-slate-50/20 hover:bg-brand-50/20 hover:border-brand-200 transition-all group relative cursor-pointer"
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-black text-slate-900 group-hover:text-brand-650 transition-colors font-mono">
                    {verb.en}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1 py-0.2 rounded">
                    {verb.ar}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 line-clamp-1 block leading-normal leading-tight font-medium">
                  {isAr ? verb.descAr : verb.descEn}
                </span>

                {copiedId === (isAr ? verb.ar : verb.en) && (
                  <div className="absolute inset-0 bg-brand-500/95 text-white flex items-center justify-center rounded-xl animate-fade-in text-[10px] font-black">
                    <Check size={12} className="mr-1" />
                    <span>{isAr ? "تم إدراجها!" : "Injected!"}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
