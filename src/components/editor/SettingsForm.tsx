import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  LayoutTemplate,
  Globe,
  GraduationCap,
  Download,
  Upload,
  Save,
  AlertTriangle,
  Settings2,
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
      id: "modern",
      name: t.settings.templates.modern.name,
      description: t.settings.templates.modern.desc,
    },
    {
      id: "classic",
      name: t.settings.templates.classic.name,
      description: t.settings.templates.classic.desc,
    },
    {
      id: "creative",
      name: t.settings.templates.creative.name,
      description: t.settings.templates.creative.desc,
    },
    {
      id: "minimal",
      name: t.settings.templates.minimal.name,
      description: t.settings.templates.minimal.desc,
    },
    {
      id: "tech",
      name: t.settings.templates.tech.name,
      description: t.settings.templates.tech.desc,
    },
    {
      id: "executive",
      name: t.settings.templates.executive.name,
      description: t.settings.templates.executive.desc,
    },
    {
      id: "medical",
      name: t.settings.templates.medical.name,
      description: t.settings.templates.medical.desc,
    },
    {
      id: "legal",
      name: t.settings.templates.legal.name,
      description: t.settings.templates.legal.desc,
    },
    {
      id: "academic",
      name: t.settings.templates.academic.name,
      description: t.settings.templates.academic.desc,
    },
    {
      id: "arabic",
      name: t.settings.templates.arabic.name,
      description: t.settings.templates.arabic.desc,
    },
    {
      id: "engineering",
      name: t.settings.templates.engineering.name,
      description: t.settings.templates.engineering.desc,
    },
    {
      id: "finance",
      name: t.settings.templates.finance.name,
      description: t.settings.templates.finance.desc,
    },
  ] as const;

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleExportJson = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${data.personalInfo.fullName || "resume"}_backup.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (
          importedData &&
          importedData.personalInfo &&
          importedData.experience
        ) {
          updateData(importedData);
          setAlertMessage(t.settings.importSuccess);
        } else {
          setAlertMessage(t.settings.importInvalid);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        setAlertMessage(t.settings.importFailed);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => updateSettings({ template: template.id })}
                className={cn(
                  "p-4 rounded-xl border text-start transition-all relative overflow-hidden group",
                  settings.template === template.id
                    ? "border-brand-500 bg-brand-50/50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                {settings.template === template.id && (
                  <div className="absolute top-0 end-0 w-16 h-16 bg-brand-500/10 rounded-bl-full -me-8 -mt-8 transition-transform group-hover:scale-110" />
                )}
                <div
                  className={cn(
                    "font-bold mb-1 transition-colors relative z-10",
                    settings.template === template.id
                      ? "text-brand-700"
                      : "text-slate-900",
                  )}
                >
                  {template.name}
                </div>
                <div
                  className={cn(
                    "text-xs transition-colors relative z-10",
                    settings.template === template.id
                      ? "text-brand-600/80"
                      : "text-white0",
                  )}
                >
                  {template.description}
                </div>
              </button>
            ))}
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

        {/* Styling & Spacing Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Settings2 size={20} className="text-slate-500" />
              {settings.language === "ar" ? "تنسيق المسافات والخطوط (متقدم)" : "Advanced Styling & Spacing"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Font Size */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">
                {settings.language === "ar" ? "حجم الخط" : "Font Size"}
              </label>
              <select
                value={settings.fontSize || "medium"}
                onChange={(e) => updateSettings({ fontSize: e.target.value as "small" | "medium" | "large" })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                dir={settings.language === "ar" ? "rtl" : "ltr"}
              >
                <option value="small">{settings.language === "ar" ? "صغير" : "Small"}</option>
                <option value="medium">{settings.language === "ar" ? "متوسط" : "Medium"}</option>
                <option value="large">{settings.language === "ar" ? "كبير" : "Large"}</option>
              </select>
            </div>

            {/* Line Height */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">
                {settings.language === "ar" ? "تباعد الأسطر" : "Line Height"}
              </label>
              <select
                value={settings.lineHeight || "normal"}
                onChange={(e) => updateSettings({ lineHeight: e.target.value as "tight" | "normal" | "relaxed" })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                dir={settings.language === "ar" ? "rtl" : "ltr"}
              >
                <option value="tight">{settings.language === "ar" ? "ضيق" : "Tight"}</option>
                <option value="normal">{settings.language === "ar" ? "طبيعي" : "Normal"}</option>
                <option value="relaxed">{settings.language === "ar" ? "مريح" : "Relaxed"}</option>
              </select>
            </div>

            {/* Section Spacing */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">
                {settings.language === "ar" ? "المسافات بين الأقسام" : "Section Spacing"}
              </label>
              <select
                value={settings.sectionSpacing || "normal"}
                onChange={(e) => updateSettings({ sectionSpacing: e.target.value as "compact" | "normal" | "relaxed" })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                dir={settings.language === "ar" ? "rtl" : "ltr"}
              >
                <option value="compact">{settings.language === "ar" ? "مضغوط" : "Compact"}</option>
                <option value="normal">{settings.language === "ar" ? "طبيعي" : "Normal"}</option>
                <option value="relaxed">{settings.language === "ar" ? "واسع" : "Relaxed"}</option>
              </select>
            </div>

            {/* Empty Spot */}
            <div className="hidden md:block" />

            {/* Fine-Tuning Spacing & Density Controllers */}
            <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-sm font-extrabold text-[#e24e2c] flex items-center gap-2">
                <span>🎛️</span>
                <span>{settings.language === "ar" ? "التحكم الدقيق والمخصص بمسافات وهوامش الصفحة" : "Fine-Tuning & Content Density Sliders"}</span>
              </h4>
              <p className="text-xs text-slate-500">
                {settings.language === "ar" 
                  ? "اسحب لتعديل المسافات والهوامش وحجم الخط بدقة متناهية لاحتواء السيرة في صفحة واحدة ومنع التداخل." 
                  : "Drag the sliders below to fine-tune section packing, margins, and content sizing to perfectly fit your content on exactly 1 page."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Font Size Slider */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">
                      {settings.language === "ar" ? "🔍 مقياس حجم الخط والكتابة" : "Font Size Scale"}
                    </span>
                    <span className="text-xs font-black text-brand-650 bg-brand-50 px-2 py-0.5 rounded-full">
                      {settings.customFontSize || 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="135"
                    value={settings.customFontSize || 100}
                    onChange={(e) => updateSettings({ customFontSize: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>{settings.language === "ar" ? "أصغر (70%)" : "Smaller (70%)"}</span>
                    <span>{settings.language === "ar" ? "طبيعي (100%)" : "Normal (100%)"}</span>
                    <span>{settings.language === "ar" ? "أكبر (135%)" : "Larger (135%)"}</span>
                  </div>
                </div>

                {/* Section Spacing Slider */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">
                      {settings.language === "ar" ? "↕️ التباعد العمودي بين الأقسام" : "Vertical Section Spacing"}
                    </span>
                    <span className="text-xs font-black text-brand-650 bg-brand-50 px-2 py-0.5 rounded-full">
                      {settings.customSpacing || 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="160"
                    value={settings.customSpacing || 100}
                    onChange={(e) => updateSettings({ customSpacing: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>{settings.language === "ar" ? "مضغوط (40%)" : "Compact (40%)"}</span>
                    <span>{settings.language === "ar" ? "طبيعي (100%)" : "Normal (100%)"}</span>
                    <span>{settings.language === "ar" ? "متباعد (160%)" : "Relaxed (160%)"}</span>
                  </div>
                </div>

                {/* Line Height Slider */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">
                      {settings.language === "ar" ? "📏 ارتفاع أسطر الكتابة" : "Line Height Multiplier"}
                    </span>
                    <span className="text-xs font-black text-brand-650 bg-brand-50 px-2 py-0.5 rounded-full">
                      {settings.customLineHeight || 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="65"
                    max="135"
                    value={settings.customLineHeight || 100}
                    onChange={(e) => updateSettings({ customLineHeight: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>{settings.language === "ar" ? "ضيق (65%)" : "Tight (65%)"}</span>
                    <span>{settings.language === "ar" ? "طبيعي (100%)" : "Normal (100%)"}</span>
                    <span>{settings.language === "ar" ? "مريح (135%)" : "Relaxed (135%)"}</span>
                  </div>
                </div>

                {/* Outer Margins Slider */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">
                      {settings.language === "ar" ? "↔️ هوامش وحواف صفحة الـ PDF" : "Page Margin Padding"}
                    </span>
                    <span className="text-xs font-black text-brand-650 bg-brand-50 px-2 py-0.5 rounded-full">
                      {settings.customMargin || 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="170"
                    value={settings.customMargin || 100}
                    onChange={(e) => updateSettings({ customMargin: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>{settings.language === "ar" ? "صغير جداً (30%)" : "Micro (30%)"}</span>
                    <span>{settings.language === "ar" ? "طبيعي (100%)" : "Normal (100%)"}</span>
                    <span>{settings.language === "ar" ? "عريض (170%)" : "Relaxed (170%)"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active CV Accent Color Picker Segment */}
            <div className="space-y-2 col-span-1 md:col-span-2 pt-4 border-t border-slate-150">
              <label className="text-sm font-bold text-slate-700 block">
                {settings.language === "ar" ? "🎨 لون السيرة الذاتية النشط" : "🎨 Active CV Theme Accent"}
              </label>
              <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                {settings.language === "ar"
                  ? "اختر طيف الألوان المناسب لمهنتك وصبغ العناوين والرموز بلمسة فندقية مخصصة."
                  : "Surgically personalize your CV typography, progress gauges, and visual layout lines in one click."}
              </p>
              <div className="flex gap-3 flex-wrap p-3.5 bg-white rounded-xl border border-slate-200/80">
                {["#2563EB", "#FF4D2D", "#10B981", "#8B5CF6", "#F97316", "#0EA5E9", "#BE185D", "#0F766E"].map((c) => {
                  const isActive = (settings.themeColor || "#2563EB") === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => updateSettings({ themeColor: c })}
                      className={cn(
                        "w-9 h-9 rounded-full transition-all flex items-center justify-center cursor-pointer relative",
                        isActive
                          ? "scale-110 shadow-md ring-2 ring-offset-2 ring-slate-800"
                          : "hover:scale-105 hover:shadow-xs hover:ring-1 hover:ring-slate-300"
                      )}
                      style={{ backgroundColor: c }}
                      title={c}
                    >
                      {isActive && (
                        <svg className="w-5 h-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 block">
                {settings.language === "ar" ? "نوع الخط الفاخر" : "Premium Font"}
              </label>
              <select
                value={settings.fontFamily || "inter"}
                onChange={(e) => updateSettings({ fontFamily: e.target.value as "inter" | "serif" | "mono" })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                dir={settings.language === "ar" ? "rtl" : "ltr"}
              >
                <option value="inter">{settings.language === "ar" ? "الحداثة (Sans)" : "Modern (Sans)"}</option>
                <option value="serif">{settings.language === "ar" ? "الكلاسيكي (Serif)" : "Classic (Serif)"}</option>
                <option value="mono">{settings.language === "ar" ? "التقني (Mono)" : "Technical (Mono)"}</option>
              </select>

              {/* Interactive Visual Font Cards */}
              <div className="mt-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                  {settings.language === "ar" ? "معاينة بصرية حية للخطوط المختارة" : "Active Typography Preview"}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    {
                      id: "inter",
                      name: settings.language === "ar" ? "حديث / Sans" : "Modern / Sans",
                      fontClass: "font-sans",
                      previewText: "A1 abc",
                      previewAr: "الاسم الكامل"
                    },
                    {
                      id: "serif",
                      name: settings.language === "ar" ? "كلاسيكي / Serif" : "Classic / Serif",
                      fontClass: "font-serif",
                      previewText: "A1 abc",
                      previewAr: "الاسم الكامل"
                    },
                    {
                      id: "mono",
                      name: settings.language === "ar" ? "تقني / Mono" : "Tech / Mono",
                      fontClass: "font-mono",
                      previewText: "A1 abc",
                      previewAr: "الاسم الكامل"
                    }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => updateSettings({ fontFamily: f.id as "inter" | "serif" | "mono" })}
                      className={cn(
                        "p-2.5 rounded-xl border text-start transition-all cursor-pointer relative overflow-hidden",
                        settings.fontFamily === f.id
                          ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/10"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      )}
                    >
                      <div className="text-[10px] font-bold text-slate-500 mb-1 truncate">{f.name}</div>
                      <div className={cn("space-y-0.5 pointer-events-none leading-none", f.fontClass)}>
                        <div className="text-sm font-black text-slate-900">{f.previewText}</div>
                        <div className="text-xs text-slate-800 font-medium">{f.previewAr}</div>
                      </div>
                      {settings.fontFamily === f.id && (
                        <div className="absolute top-1 end-1 w-1.5 h-1.5 rounded-full bg-brand-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Data Backup & Restore */}
        <div className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-200/85">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Save size={20} className="text-slate-600" />
            {t.settings.dataBackup}
          </h3>
          <p className="text-sm text-slate-600">
            {t.settings.dataBackupDesc}
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-sm font-bold shadow-sm"
            >
              <Download size={16} />
              {t.settings.exportData}
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-sm font-bold shadow-sm cursor-pointer">
              <Upload size={16} />
              {t.settings.importData}
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportJson}
                ref={fileInputRef}
              />
            </label>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-bold shadow-sm ms-auto"
            >
              {t.settings.resetAll}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
