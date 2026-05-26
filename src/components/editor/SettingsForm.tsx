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
  Wand2
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
                  "p-4 rounded-xl border-2 text-start transition-all relative overflow-hidden group",
                  settings.template === template.id
                    ? "border-orange-500 bg-orange-50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                {settings.template === template.id && (
                  <div className="absolute top-0 end-0 w-16 h-16 bg-orange-500/10 rounded-bl-full -me-8 -mt-8 transition-transform group-hover:scale-110" />
                )}
                <div
                  className={cn(
                    "font-bold mb-1 transition-colors relative z-10",
                    settings.template === template.id
                      ? "text-orange-700"
                      : "text-slate-900",
                  )}
                >
                  {template.name}
                </div>
                <div
                  className={cn(
                    "text-xs transition-colors relative z-10",
                    settings.template === template.id
                      ? "text-orange-600/80"
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
                "px-6 py-2 rounded-xl border-2 font-medium transition-all",
                settings.language === "en"
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              English
            </button>
            <button
              onClick={() => updateSettings({ language: "ar" })}
              className={cn(
                "px-6 py-2 rounded-xl border-2 font-medium transition-all",
                settings.language === "ar"
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              العربية
            </button>
            <button
              onClick={() => updateSettings({ language: "fr" })}
              className={cn(
                "px-6 py-2 rounded-xl border-2 font-medium transition-all",
                settings.language === "fr"
                  ? "border-orange-500 bg-orange-50 text-orange-700"
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
                    "custom",
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
                  settings.isFreshGrad ? "bg-orange-500" : "bg-slate-300",
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

        {/* Fit to One Page Feature */}
        <div className="pt-6 border-t border-slate-200">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-1 shadow-lg shadow-orange-500/20 mb-6">
            <button
              onClick={() => {
                // "Fit to One Page" Optimizer
                updateSettings({
                  fontSize: "small",
                  sectionSpacing: "compact",
                  lineHeight: "tight",
                  marginSize: "compact"
                });
              }}
              className="w-full bg-white hover:bg-orange-50 flex items-center justify-between p-4 rounded-xl transition-colors group relative overflow-hidden"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                  <Wand2 size={20} />
                </div>
                <div className="text-start">
                  <div className="font-bold text-slate-900 group-hover:text-orange-700 transition-colors text-base">
                    {settings.language === "ar" ? "احتواء في صفحة واحدة التلقائي" : "Auto Fit to One Page"}
                  </div>
                  <div className="text-sm text-slate-500 mt-0.5">
                    {settings.language === "ar" ? "بضغطة زر، سيتم ضغط السيرة لتناسب صفحة واحدة" : "Instantly optimize spacing and fonts to fit perfectly on one page"}
                  </div>
                </div>
              </div>
              <div className="text-orange-600 font-bold bg-orange-100 px-4 py-1.5 rounded-full text-sm group-hover:bg-orange-200 transition-colors whitespace-nowrap ms-2">
                {settings.language === "ar" ? "تطبيق الميزة" : "Apply Magic"}
              </div>
            </button>
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
                onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
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
                onChange={(e) => updateSettings({ lineHeight: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
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
                onChange={(e) => updateSettings({ sectionSpacing: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                dir={settings.language === "ar" ? "rtl" : "ltr"}
              >
                <option value="compact">{settings.language === "ar" ? "مضغوط" : "Compact"}</option>
                <option value="normal">{settings.language === "ar" ? "طبيعي" : "Normal"}</option>
                <option value="relaxed">{settings.language === "ar" ? "واسع" : "Relaxed"}</option>
              </select>
            </div>

            {/* Font Family */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 block">
                {settings.language === "ar" ? "نوع الخط الفاخر" : "Premium Font"}
              </label>
              <select
                value={settings.fontFamily || "inter"}
                onChange={(e) => updateSettings({ fontFamily: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
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
                      onClick={() => updateSettings({ fontFamily: f.id as any })}
                      className={cn(
                        "p-2.5 rounded-xl border text-start transition-all cursor-pointer relative overflow-hidden",
                        settings.fontFamily === f.id
                          ? "border-orange-500 bg-orange-50/55 ring-2 ring-orange-400/25"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      )}
                    >
                      <div className="text-[10px] font-bold text-slate-500 mb-1 truncate">{f.name}</div>
                      <div className={cn("space-y-0.5 pointer-events-none leading-none", f.fontClass)}>
                        <div className="text-sm font-black text-slate-900">{f.previewText}</div>
                        <div className="text-xs text-slate-800 font-medium">{f.previewAr}</div>
                      </div>
                      {settings.fontFamily === f.id && (
                        <div className="absolute top-1 end-1 w-1.5 h-1.5 rounded-full bg-orange-500" />
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
        <div className="space-y-4 p-6 bg-orange-50 rounded-2xl border border-orange-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Save size={20} className="text-orange-500" />
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
