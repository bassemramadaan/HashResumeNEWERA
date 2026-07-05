import { motion } from "motion/react";
import { X, Sparkles, Check, LayoutTemplate } from "lucide-react";
import { useLanguageStore } from "../../store/useLanguageStore";
import { ResumeData } from "../../store/useResumeStore";
import TemplateClassic from "../preview/TemplateClassic";
import TemplateModern from "../preview/TemplateModern";
import TemplateExecutive from "../preview/TemplateExecutive";
import TemplateMinimal from "../preview/TemplateMinimal";
import TemplateTimeline from "../preview/TemplateTimeline";
import TemplateTwoColumn from "../preview/TemplateTwoColumn";
import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TemplateComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  onSelectTemplate: (id: string) => void;
  currentTemplateId: string;
}

export default function TemplateComparisonModal({
  isOpen,
  onClose,
  data,
  onSelectTemplate,
  currentTemplateId,
}: TemplateComparisonModalProps) {
  const { language } = useLanguageStore();
  const isRtl = language === "ar";
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const TEMPLATES_LIST = [
    {
      id: "classic",
      name: isRtl ? "كلاسيكي (Classic)" : "Classic",
      badge: isRtl ? "رسمي وموثوق" : "Formal & Trusted",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      description: isRtl 
        ? "مثالي للقطاعات التقليدية مثل المحاماة، المحاسبة، البنوك، والشركات الكبرى."
        : "Ideal for traditional fields like law, finance, banking, and blue-chip corporates.",
      component: <TemplateClassic data={data} />,
    },
    {
      id: "modern",
      name: isRtl ? "حديث (Modern)" : "Modern",
      badge: isRtl ? "عصري وتقني" : "Modern & Sleek",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      description: isRtl 
        ? "مصمم لقطاعات التقنية، البرمجة، التسويق، الشركات الناشئة، والمشاريع المعاصرة."
        : "Perfect for software engineering, tech, startups, and creative modern campaigns.",
      component: <TemplateModern data={data} />,
    },
    {
      id: "executive",
      name: isRtl ? "تنفيذي (Executive)" : "Executive",
      badge: isRtl ? "للمناصب القيادية" : "C-Suite & Senior",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      description: isRtl 
        ? "يتميز بهيدر بارز وفخم يركز على الإنجازات والقدرات القيادية العالية."
        : "Features a prestigious top banner designed for senior leaders, directors, and consultants.",
      component: <TemplateExecutive data={data} />,
    },
    {
      id: "minimal",
      name: isRtl ? "بسيط (Minimal)" : "Minimal",
      badge: isRtl ? "ناصع ومباشر" : "Clean & Focused",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      description: isRtl 
        ? "تصميم خالٍ من التعقيد والتكلف يركز كلياً على انسيابية قراءة المحتوى المهني."
        : "Ultra-clean aesthetics with crisp typesetting that prioritizes ease of reading above all else.",
      component: <TemplateMinimal data={data} />,
    },
    {
      id: "timeline",
      name: isRtl ? "جدول زمني (Timeline)" : "Timeline",
      badge: isRtl ? "سرد متسلسل رائع" : "Storyteller Layout",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: isRtl 
        ? "يعرض خبراتك المتراكمة ومسيرتك التعليمية على خط زمني متسق ومبتكر."
        : "Chronological vertical tracks highlighting career milestones in an elegant connected flow.",
      component: <TemplateTimeline data={data} />,
    },
    {
      id: "two-column",
      name: isRtl ? "عمودين (Two-Column)" : "Two-Column",
      badge: isRtl ? "منظم وموفر للمساحة" : "Efficient Sidebar",
      badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
      description: isRtl 
        ? "يقسم السيرة إلى عمودين ذكيين؛ عمود فرعي للمهارات والاتصال وعمود رئيسي للخبرات."
        : "A smart split design that houses contact info and skills in a stylish side column.",
      component: <TemplateTwoColumn data={data} />,
    },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
      />

      {/* Modal Dialog Card */}
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="relative w-full max-w-7xl h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl flex flex-col shadow-[0_30px_90px_rgba(0,0,0,0.4)] overflow-hidden text-slate-100 z-10"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        {/* Top Header */}
        <div className="px-6 py-5 sm:px-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-[#FF4D2D]">
              <LayoutTemplate className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                {isRtl ? "مقارنة القوالب الفورية" : "Instant Template Side-by-Side"}
                <span className="text-[10px] bg-[#FF4D2D]/10 text-[#FF4D2D] border border-[#FF4D2D]/20 px-2 py-0.5 rounded-full font-bold">
                  {isRtl ? "تفاعلي" : "Interactive Live"}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {isRtl 
                  ? "شاهد بياناتك الحقيقية مطبقة على جميع القوالب بلمحة واحدة، واختر التصميم الأمثل لمهنتك."
                  : "Compare how your actual content fits and formats across all templates in real-time."}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable grid area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-950">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEMPLATES_LIST.map((tpl) => {
              const isSelected = currentTemplateId === tpl.id;
              
              return (
                <motion.div
                  key={tpl.id}
                  whileHover={{ y: -4 }}
                  className={`flex flex-col rounded-2xl bg-slate-900 border transition-all overflow-hidden relative shadow-lg ${
                    isSelected 
                      ? "border-[#FF4D2D] ring-2 ring-[#FF4D2D]/20" 
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {/* Select badge banner */}
                  {isSelected && (
                    <div className="absolute top-3 end-3 z-30 bg-[#FF4D2D] text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{isRtl ? "التصميم الحالي" : "Current Active"}</span>
                    </div>
                  )}

                  {/* Header info of the card */}
                  <div className="p-4 bg-slate-900 border-b border-slate-800/60 z-10 shrink-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                        {tpl.name}
                      </h3>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${tpl.badgeColor}`}>
                        {tpl.badge}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                      {tpl.description}
                    </p>
                  </div>

                  {/* The Live Render Sandbox with Scale */}
                  <div className="flex-1 bg-slate-900 p-4 flex items-center justify-center min-h-[340px] relative overflow-hidden select-none border-b border-slate-800/50">
                    <div className="absolute inset-0 bg-slate-950/40 pointer-events-none z-10" />
                    
                    {/* Centered scaled canvas wrapper */}
                    <div className="w-[318px] h-[318px] relative shrink-0 overflow-hidden rounded-xl border border-slate-800 bg-white flex justify-center items-start shadow-inner">
                      <div 
                        className="absolute top-0 transform scale-[0.4] origin-top shrink-0 pointer-events-none"
                        style={{ width: "794px" }}
                      >
                        {tpl.component}
                      </div>
                    </div>
                  </div>

                  {/* Call to action at bottom of each grid item */}
                  <div className="p-4 bg-slate-900/60 backdrop-blur-xs flex items-center gap-2 shrink-0">
                    {isSelected ? (
                      <div className="w-full py-2.5 px-4 rounded-xl text-xs font-extrabold bg-[#FF4D2D]/10 border border-[#FF4D2D]/20 text-[#FF4D2D] text-center">
                        {isRtl ? "نشط حالياً" : "Currently Selected"}
                      </div>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onSelectTemplate(tpl.id);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-black bg-white hover:bg-slate-100 text-slate-900 transition-colors shadow-sm cursor-pointer text-center"
                      >
                        {isRtl ? "تطبيق هذا القالب" : "Apply This Design"}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {isRtl 
                ? "تغيير القالب لن يؤثر أبداً على نصوصك أو محتوى سيرتك الذاتية." 
                : "Switching templates preserves all your text content perfectly without data loss."}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-extrabold text-[#FF4D2D] hover:text-[#ff6a4f] transition-colors cursor-pointer"
          >
            {isRtl ? "حسناً، فهمت" : "Got it, back to editor"}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
