import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  LayoutTemplate,
  Globe,
  GraduationCap,
  AlertTriangle,
  Wand2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";

export default React.memo(function SettingsForm() {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const { data, updateSettings, updateData, resetData } = useResumeStore();
  const { settings } = data;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fitAppliedMode, setFitAppliedMode] = useState<"one" | "two" | null>(null);

  const TEMPLATES = [
    {
      id: "classic",
      name: language === "ar" ? "كلاسيكي (Classic)" : "Classic",
      description: language === "ar" ? "الرسمي التقليدي الكلاسيكي بخطوط واضحة" : "Traditional classic layout with clean borders",
    },
    {
      id: "modern",
      name: language === "ar" ? "الحديث (Modern)" : "Modern",
      description: language === "ar" ? "الحديث والأنيق بمسافات واضحة مناسب للتقنية والمشاريع الناشئة" : "Modern elegant layout best for tech & startups",
    },
    {
      id: "executive",
      name: language === "ar" ? "التنفيذي (Executive)" : "Executive",
      description: language === "ar" ? "المظهر القيادي ذو الهوية الفاخرة للرؤساء التنفيذيين والمدراء" : "Professional layout with a strong header for managers & executives",
    },
    {
      id: "minimal",
      name: language === "ar" ? "مينيمال (Minimal)" : "Minimal",
      description: language === "ar" ? "مظهر بسيط وخالي من التكلف يركز على المحتوى بدون خطوط" : "Clean and uncluttered layout with focus on content",
    },
    {
      id: "timeline",
      name: language === "ar" ? "جدول زمني (Timeline)" : "Timeline",
      description: language === "ar" ? "تصميم يعرض الخبرات التعليمية والعملية بشكل جدول زمني" : "Displays experience and education in a timeline format",
    },
  ] as const;

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const AlertModal = () => {
    if (!alertMessage || typeof document === 'undefined') return null;
    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-6 text-center space-y-4">
            <p className="text-slate-700 font-medium">{alertMessage}</p>
            <button
              onClick={() => setAlertMessage(null)}
              className="w-full py-2 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  const ResetConfirmModal = () => {
    if (!showResetConfirm || typeof document === 'undefined') return null;
    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-6 space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900">
              {t.settings.resetConfirmTitle}
            </h3>
            <p className="text-center text-slate-600">
              {t.settings.resetConfirmDesc}
            </p>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                {t.settings.cancel}
              </button>
              <button
                onClick={() => {
                  resetData();
                  setShowResetConfirm(false);
                  setAlertMessage(t.settings.dataReset);
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors"
              >
                {t.settings.yesReset}
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="space-y-6 font-sans relative">
      <AlertModal />
      <ResetConfirmModal />

      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8 transition-colors">
        {/* Template Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <LayoutTemplate size={20} className="text-slate-500" />
            {t.settings.templateStyle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((template) => {
              const TEMPLATE_SUGGESTIONS: Record<string, { ar: string; en: string; color: string; badge: string }> = {
                classic: {
                  ar: "🏛️ يوصى به لقطاعات: القانون، المالية، والشركات الكبرى والبنوك.",
                  en: "🏛️ Recommended: Corporate Law, Banking, Finance.",
                  color: "bg-slate-100 border-slate-200 text-slate-700",
                  badge: "Banking & Law"
                },
                modern: {
                  ar: "💼 يوصى به لقطاعات: البرمجة والتقنية والمشاريع الإدارية الحديثة وريادة الأعمال.",
                  en: "💼 Recommended: Software, Tech, Management.",
                  color: "bg-slate-100 border-slate-200 text-slate-700",
                  badge: "Tech & Ops"
                },
                executive: {
                  ar: "👑 يوصى به لقطاعات: المناصب الإدارية العليا، الاستشارات الاستراتيجية، والمسؤولين التنفيذيين.",
                  en: "👑 Recommended: High Management, C-Suite, Senior Director Roles.",
                  color: "bg-slate-100 border-slate-200 text-slate-700",
                  badge: "Executive"
                },
                minimal: {
                  ar: "✨ يوصى به لقطاعات: التصميم، الفنون، والمجالات الإبداعية.",
                  en: "✨ Recommended: Design, Arts, Creative Fields.",
                  color: "bg-slate-100 border-slate-200 text-slate-700",
                  badge: "Creative"
                },
                timeline: {
                  ar: "⏱️ يوصى به لمن لديهم تسلسل زمني طويل من الخبرات المتعددة.",
                  en: "⏱️ Recommended: Long history of experience and multiple roles.",
                  color: "bg-slate-100 border-slate-200 text-slate-700",
                  badge: "Experienced"
                }
              };

              const suggestion = TEMPLATE_SUGGESTIONS[template.id] || {
                ar: "✨ نوصي به لجميع القطاعات والأدوار المهنية المختلفة.",
                en: "✨ Recommended for all professional roles seeking pristine readability.",
                color: "bg-slate-50 border-slate-100 text-slate-600",
                badge: "Universal"
              };
              const adviceText = language === "ar" ? suggestion.ar : suggestion.en;

              const renderThumbnail = (id: string) => {
                switch (id) {
                  case 'classic':
                    return (
                      <div className="w-16 h-20 bg-white border border-slate-200 rounded flex flex-col p-1.5 shadow-sm mx-auto mb-3">
                        <div className="h-1.5 w-8 bg-slate-800 mx-auto mb-0.5"></div>
                        <div className="h-0.5 w-12 bg-slate-400 mx-auto mb-1.5"></div>
                        <div className="h-0.5 w-full bg-slate-800 mb-1"></div>
                        <div className="h-1 w-6 bg-slate-800 mb-0.5"></div>
                        <div className="h-1 w-full bg-slate-300 mb-0.5"></div>
                        <div className="h-1 w-5/6 bg-slate-300 mb-1.5"></div>
                        <div className="h-1 w-6 bg-slate-800 mb-0.5"></div>
                        <div className="h-1 w-full bg-slate-300 mb-0.5"></div>
                        <div className="h-1 w-4/6 bg-slate-300 mb-0.5"></div>
                      </div>
                    );
                  case 'modern':
                    return (
                      <div className="w-16 h-20 bg-white border border-slate-200 rounded flex flex-col p-1.5 shadow-sm mx-auto mb-3">
                        <div className="h-2 w-10 bg-slate-800 mb-0.5"></div>
                        <div className="h-[0.5px] w-full bg-slate-300 mb-0.5"></div>
                        <div className="h-0.5 w-12 bg-slate-400 mb-1.5"></div>
                        <div className="h-1 w-6 bg-slate-800 mb-0.5 border-b-[0.5px] border-slate-300 pb-[1px]"></div>
                        <div className="h-1 w-full bg-slate-300 mb-0.5 mt-0.5"></div>
                        <div className="h-1 w-5/6 bg-slate-300 mb-1.5"></div>
                        <div className="h-1 w-6 bg-slate-800 mb-0.5 border-b-[0.5px] border-slate-300 pb-[1px]"></div>
                        <div className="h-1 w-full bg-slate-300 mb-0.5 mt-0.5"></div>
                      </div>
                    );
                  case 'executive':
                    return (
                      <div className="w-16 h-20 bg-white border border-slate-200 rounded flex flex-col shadow-sm mx-auto mb-3">
                        <div className="bg-slate-100 p-1 border-b border-slate-800 mb-1">
                          <div className="h-1.5 w-10 bg-slate-800 mb-0.5"></div>
                          <div className="h-0.5 w-6 bg-slate-600 mb-0.5"></div>
                          <div className="h-0.5 w-8 bg-slate-400"></div>
                        </div>
                        <div className="px-1.5">
                          <div className="flex gap-1 mb-1.5">
                            <div className="w-0.5 h-2 bg-slate-800"></div>
                            <div className="flex-1">
                              <div className="h-0.5 w-6 bg-slate-800 mb-0.5"></div>
                              <div className="h-0.5 w-full bg-slate-300 mb-0.5"></div>
                              <div className="h-0.5 w-5/6 bg-slate-300"></div>
                            </div>
                          </div>
                          <div className="flex gap-1 mb-1">
                            <div className="w-0.5 h-2 bg-slate-800"></div>
                            <div className="flex-1">
                              <div className="h-0.5 w-6 bg-slate-800 mb-0.5"></div>
                              <div className="h-0.5 w-full bg-slate-300 mb-0.5"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  case 'minimal':
                    return (
                      <div className="w-16 h-20 bg-white border border-slate-200 rounded flex flex-col p-1.5 shadow-sm mx-auto mb-3">
                        <div className="h-1 w-8 bg-slate-800 mx-auto mb-0.5 tracking-widest uppercase"></div>
                        <div className="h-0.5 w-10 bg-slate-400 mx-auto mb-2"></div>
                        <div className="h-0.5 w-6 bg-slate-600 mx-auto mb-1"></div>
                        <div className="h-0.5 w-full bg-slate-300 mb-0.5"></div>
                        <div className="h-0.5 w-5/6 bg-slate-300 mb-1.5 mx-auto"></div>
                        <div className="h-0.5 w-6 bg-slate-600 mx-auto mb-1"></div>
                        <div className="flex justify-between mb-0.5">
                          <div className="h-0.5 w-4 bg-slate-800"></div>
                          <div className="h-0.5 w-4 bg-slate-400"></div>
                        </div>
                        <div className="h-0.5 w-full bg-slate-300 mb-0.5"></div>
                      </div>
                    );
                  case 'timeline':
                    return (
                      <div className="w-16 h-20 bg-white border border-slate-200 rounded flex flex-col p-1.5 shadow-sm mx-auto mb-3">
                        <div className="h-1.5 w-10 bg-slate-800 mb-0.5"></div>
                        <div className="h-0.5 w-12 bg-slate-400 mb-1"></div>
                        <div className="h-0.5 w-full bg-slate-800 mb-1.5"></div>
                        
                        <div className="h-0.5 w-6 bg-slate-800 mb-1"></div>
                        
                        <div className="relative pl-2 mb-1.5">
                          <div className="absolute left-0 top-0.5 w-0.5 h-0.5 rounded-full bg-slate-600"></div>
                          <div className="absolute left-[0.5px] top-1 bottom-[-2px] w-[0.5px] bg-slate-300"></div>
                          <div className="h-0.5 w-6 bg-slate-800 mb-0.5"></div>
                          <div className="h-0.5 w-10 bg-slate-400 mb-0.5"></div>
                          <div className="h-0.5 w-full bg-slate-300"></div>
                        </div>
                        
                        <div className="relative pl-2">
                          <div className="absolute left-0 top-0.5 w-0.5 h-0.5 rounded-full bg-slate-600"></div>
                          <div className="h-0.5 w-6 bg-slate-800 mb-0.5"></div>
                          <div className="h-0.5 w-8 bg-slate-400"></div>
                        </div>
                      </div>
                    );
                  default:
                    return null;
                }
              };

              return (
                <button
                  key={template.id}
                  onClick={() => updateSettings({ template: template.id })}
                  className={cn(
                    "p-4.5 rounded-xl border text-start transition-all relative overflow-hidden group flex flex-col justify-between h-auto min-h-[160px]",
                    settings.template === template.id
                      ? "border-brand-500 bg-brand-50/50 shadow-sm font-black"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  {settings.template === template.id && (
                    <div className="absolute top-0 end-0 w-16 h-16 bg-brand-500/10 rounded-bl-full -me-8 -mt-8 transition-transform group-hover:scale-110" />
                  )}
                  <div className="w-full">
                    {renderThumbnail(template.id)}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div
                        className={cn(
                          "font-extrabold transition-colors relative z-10 text-xs sm:text-sm",
                          settings.template === template.id
                            ? "text-brand-700"
                            : "text-slate-900",
                        )}
                      >
                        {template.name}
                      </div>
                      <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-md border shrink-0 tracking-wider", suggestion.color)}>
                        {suggestion.badge}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "text-[11px] leading-relaxed transition-colors relative z-10 mb-3",
                        settings.template === template.id
                          ? "text-brand-600/90"
                          : "text-slate-500",
                      )}
                    >
                      {template.description}
                    </div>
                  </div>

                  <div className="text-[10px] w-full bg-white/70 border border-slate-200/50 rounded-lg p-2.5 mt-auto font-bold text-slate-500 tracking-tight leading-relaxed">
                    {adviceText}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Language */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Globe size={20} className="text-slate-500" />
            {t.settings.language}
          </h3>
          <div className="flex gap-4">
            <button
              onClick={() => updateSettings({ language: "en" })}
              className={cn(
                "px-6 py-2 rounded-xl border font-medium transition-all",
                settings.language === "en"
                  ? "border-brand-500 bg-brand-50/55 text-brand-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              English
            </button>
            <button
              onClick={() => updateSettings({ language: "ar" })}
              className={cn(
                "px-6 py-2 rounded-xl border font-medium transition-all",
                settings.language === "ar"
                  ? "border-brand-500 bg-brand-50/55 text-brand-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              العربية
            </button>
            <button
              onClick={() => updateSettings({ language: "fr" })}
              className={cn(
                "px-6 py-2 rounded-xl border font-medium transition-all",
                settings.language === "fr"
                  ? "border-brand-500 bg-brand-50/55 text-brand-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              Français
            </button>
          </div>
        </div>

        {/* Fresh Graduate Mode */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap size={20} className="text-slate-400" />
            {t.settings.freshGradMode}
          </h3>
          <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="checkbox"
                checked={settings.isFreshGrad}
                onChange={(e) => {
                  const isFreshGrad = e.target.checked;
                  const currentOrder = settings.sectionOrder || [
                    "summary",
                    "experience",
                    "education",
                    "skills",
                    "projects",
                    "certifications",
                  ];
                  const newOrder = [...currentOrder];
                  const eduIdx = newOrder.indexOf("education");
                  const expIdx = newOrder.indexOf("experience");

                  if (isFreshGrad && eduIdx > expIdx) {
                    // Swap to put education before experience
                    newOrder[eduIdx] = "experience";
                    newOrder[expIdx] = "education";
                  } else if (!isFreshGrad && expIdx > eduIdx) {
                    // Swap to put experience before education
                    newOrder[eduIdx] = "experience";
                    newOrder[expIdx] = "education";
                  }

                  updateSettings({ isFreshGrad, sectionOrder: newOrder });
                }}
                className="sr-only"
              />
              <div
                className={cn(
                  "w-11 h-6 rounded-full transition-colors relative",
                  settings.isFreshGrad ? "bg-brand-500" : "bg-slate-300",
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 left-1 bg-slate-50 w-4 h-4 rounded-full transition-transform shadow-sm",
                    settings.isFreshGrad ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </div>
            </div>
            <div>
              <div className="font-bold text-slate-900">
                {t.settings.enableFreshGrad}
              </div>
              <div className="text-sm text-slate-500 mt-1">
                {t.settings.freshGradModeDesc}
              </div>
            </div>
          </label>
        </div>

        {/* Dynamic Section Manager */}
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles size={20} className="text-[#e24e2c]" />
            {settings.language === "ar" ? "مدير الأقسام (إعادة ترتيب وإخفاء الأقسام)" : "Interactive Section Manager"}
          </h3>
          <p className="text-sm text-slate-500">
            {settings.language === "ar" 
              ? "تحكم في تسلسل ظهور الأقسام في السيرة الذاتية بالضغط على أسهم الترتيب، ويمكنك إخفاء أو إظهار أي قسم سريعاً بلمسة زر." 
              : "Arrange the sequence of sections on your CV using up/down controls, and toggle visibility on the fly."}
          </p>

          <div className="space-y-2 max-w-2xl">
            {(settings.sectionOrder || [
              "summary",
              "experience",
              "education",
              "skills",
              "projects",
              "certifications",
            ]).map((sectionId, index) => {
              const orderList = settings.sectionOrder || [
                "summary",
                "experience",
                "education",
                "skills",
                "projects",
                "certifications",
              ];
              const isHidden = (settings.hiddenSections || []).includes(sectionId as any);
              
              const SECTION_NAMES: Record<string, { en: string; ar: string; fr: string }> = {
                summary: { en: "Summary / Profile Summary", ar: "الملخص وبطاقة التعريف", fr: "Résumé " },
                experience: { en: "Work Experience", ar: "الخبرات والمسيرة المهنية", fr: "Expérience Professionnelle" },
                education: { en: "Education & Studies", ar: "التعليم والدراسات الأكاديمية", fr: "Éducation" },
                skills: { en: "Technical Skills", ar: "المهارات والخبرات التقنية", fr: "Compétences" },
                projects: { en: "Projects", ar: "المشاريع والإنجازات", fr: "Projets" },
                certifications: { en: "Certifications", ar: "الشهادات والاعتمادات", fr: "Certifications" },
              };
              
              const label = SECTION_NAMES[sectionId]?.[settings.language] || sectionId;

              const handleMove = (direction: "up" | "down", e: React.MouseEvent) => {
                e.preventDefault();
                const targetIdx = direction === "up" ? index - 1 : index + 1;
                if (targetIdx < 0 || targetIdx >= orderList.length) return;
                const newOrder = [...orderList];
                const temp = newOrder[index];
                newOrder[index] = newOrder[targetIdx];
                newOrder[targetIdx] = temp;
                updateSettings({ sectionOrder: newOrder as any[] });
              };

              const handleToggleVisibility = (e: React.MouseEvent) => {
                e.preventDefault();
                const currentHidden = settings.hiddenSections || [];
                let newHidden: any[];
                if (currentHidden.includes(sectionId as any)) {
                  newHidden = currentHidden.filter((id) => id !== sectionId);
                } else {
                  newHidden = [...currentHidden, sectionId];
                }
                updateSettings({ hiddenSections: newHidden });
              };

              return (
                <div 
                  key={sectionId}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 bg-white",
                    isHidden 
                      ? "border-slate-100 bg-slate-50/50 opacity-60" 
                      : "border-slate-200/80 hover:border-slate-300 shadow-xs"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col text-slate-400">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={(e) => handleMove("up", e)}
                        className="hover:text-brand-600 disabled:opacity-20 cursor-pointer p-0.5"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={index === orderList.length - 1}
                        onClick={(e) => handleMove("down", e)}
                        className="hover:text-brand-600 disabled:opacity-20 cursor-pointer p-0.5"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    <div className="text-start">
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono uppercase font-black mr-2">
                        {settings.language === "ar" ? `الترتيب #${index + 1}` : `#${index + 1}`}
                      </span>
                      <span className={cn(
                        "text-sm font-bold text-slate-800",
                        isHidden && "line-through text-slate-400"
                      )}>
                        {label}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleVisibility}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative overflow-hidden ring-1 cursor-pointer",
                      isHidden 
                        ? "bg-slate-100 text-slate-500 ring-slate-200" 
                        : "bg-emerald-50 text-emerald-700 ring-emerald-200/50 hover:bg-emerald-100/50"
                    )}
                  >
                    {isHidden ? (
                      <>
                        <EyeOff size={14} />
                        <span>{settings.language === "ar" ? "مخفي" : settings.language === "fr" ? "Masqué" : "Hidden"}</span>
                      </>
                    ) : (
                      <>
                        <Eye size={14} />
                        <span>{settings.language === "ar" ? "نشط وعارض" : settings.language === "fr" ? "Visible" : "Visible"}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fit to One/Two Pages Premium Feature */}
        <div className="pt-6 border-t border-slate-200">
          <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2 mb-3">
            <Wand2 size={18} className="text-[#e24e2c]" />
            <span>{settings.language === "ar" ? "معالج الاحتواء والتباعد السريع ذكي الأبعاد" : "Smart Fit-to-Page Layout Wizards"}</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            {settings.language === "ar"
              ? "لتفادي قياس وتعديل الـ Sliders يدوياً، تتيح لك الأزرار السفلية ضبط التباعد وحجم الخط والهوامش بذكاء بنسب منضبطة فندقية لتصغير ملفك واحتوائه كاملاً وبشكل جذاب."
              : "Instead of manually adjusting sliders, let these automated wizards optimize font scale, vertical spacing, and page margins to fit perfectly."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Fit to 1 Page Button */}
            <div className="bg-gradient-to-r from-brand-500 to-amber-500 rounded-2xl p-0.5 shadow-xs hover:shadow-sm transition-all active:scale-98">
              <button
                type="button"
                onClick={() => {
                  updateSettings({
                    fontSize: "small",
                    sectionSpacing: "compact",
                    lineHeight: "tight",
                    marginSize: "compact",
                    customFontSize: 92,
                    customSpacing: 75,
                    customLineHeight: 88,
                    customMargin: 75,
                  });
                  setFitAppliedMode("one");
                  setTimeout(() => setFitAppliedMode(null), 3500);
                }}
                className="w-full bg-white hover:bg-brand-50/20 text-start p-4 rounded-[14px] transition-colors relative overflow-hidden cursor-pointer flex flex-col justify-between h-full gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center text-brand-650 shrink-0">
                    <Wand2 size={16} />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-sm">
                      {settings.language === "ar" ? "احتواء ذكي في صفحة واحدة" : "Auto Fit: Exactly 1 Page"}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                      {settings.language === "ar" 
                        ? "يضغط الخط والهوامش والمسافات بنسب منضبطة جداً للنوم في ورقة واحدة." 
                        : "Compacts fonts, margins and paddings symmetrically to fit exactly 1 page."}
                    </p>
                  </div>
                </div>
                
                <div className="w-full flex justify-between items-center mt-1">
                  <span className="text-[10px] font-black text-amber-600 bg-amber-50/75 px-2 py-0.5 rounded-full">
                    {settings.language === "ar" ? "ضغط 92% عالي الكثافة" : "92% Dense Compression"}
                  </span>
                  <div className="text-[11px] font-black text-white bg-slate-900 hover:bg-slate-800 px-3 py-1 rounded-lg transition-colors shadow-xs">
                    {fitAppliedMode === "one" ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 size={12} />
                        {settings.language === "ar" ? "تم الضغط!" : "Fit Applied!"}
                      </span>
                    ) : (
                      <span>{settings.language === "ar" ? "تنفيذ السحر" : "Optimize"}</span>
                    )}
                  </div>
                </div>
              </button>
            </div>

            {/* Fit to 2 Pages Button */}
            <div className="bg-gradient-to-r from-slate-300 to-slate-400 rounded-2xl p-0.5 shadow-xs hover:shadow-sm transition-all active:scale-98">
              <button
                type="button"
                onClick={() => {
                  updateSettings({
                    fontSize: "medium",
                    sectionSpacing: "normal",
                    lineHeight: "normal",
                    marginSize: "normal",
                    customFontSize: 100,
                    customSpacing: 95,
                    customLineHeight: 98,
                    customMargin: 95,
                  });
                  setFitAppliedMode("two");
                  setTimeout(() => setFitAppliedMode(null), 3500);
                }}
                className="w-full bg-white hover:bg-slate-50/50 text-start p-4 rounded-[14px] transition-colors relative overflow-hidden cursor-pointer flex flex-col justify-between h-full gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 shrink-0">
                    <LayoutTemplate size={16} />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-sm">
                      {settings.language === "ar" ? "احتواء متكامل في صَفحتين" : "Auto Fit: Exactly 2 Pages"}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                      {settings.language === "ar" 
                        ? "يعيد السيرة للوضع الكلاسيكي ويقترح توزيعاً مريحاً للأقسام على ورقتين." 
                        : "Resets spacing styles to elegant medium margins best suited for 2 pages."}
                    </p>
                  </div>
                </div>
                
                <div className="w-full flex justify-between items-center mt-1">
                  <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    {settings.language === "ar" ? "توزيع متوازن ومقروء" : "100% Symmetrical Spacing"}
                  </span>
                  <div className="text-[11px] font-black text-white bg-slate-900 hover:bg-slate-800 px-3 py-1 rounded-lg transition-colors shadow-xs">
                    {fitAppliedMode === "two" ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 size={12} />
                        {settings.language === "ar" ? "تم الضبط!" : "Layout Done!"}
                      </span>
                    ) : (
                      <span>{settings.language === "ar" ? "تنفيذ السحر" : "Optimize"}</span>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
