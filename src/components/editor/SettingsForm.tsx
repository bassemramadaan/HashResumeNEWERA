import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  Palette,
  LayoutTemplate,
  Globe,
  GraduationCap,
  Download,
  Upload,
  Save,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../../utils";
import React, { useRef, useState } from "react";

export default React.memo(function SettingsForm() {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const { data, updateSettings, updateData, resetData } = useResumeStore();
  const { settings } = data;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const COLORS = [
    { name: t.settings.colors.navy, value: "#1e3a8a" },
    { name: t.settings.colors.blue, value: "#2563eb" },
    { name: t.settings.colors.cyan, value: "#0891b2" },
    { name: t.settings.colors.teal, value: "#0d9488" },
    { name: t.settings.colors.green, value: "#16a34a" },
    { name: t.settings.colors.purple, value: "#9333ea" },
    { name: t.settings.colors.rose, value: "#e11d48" },
    { name: t.settings.colors.orange, value: "#ea580c" },
    { name: t.settings.colors.slate, value: "#475569" },
    { name: t.settings.colors.black, value: "#000000" },
  ];

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

  return (
    <div className="space-y-6 font-sans relative">
      {/* Alert Modal */}
      {alertMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center space-y-4">
              <p className="text-slate-700 font-medium">{alertMessage}</p>
              <button
                onClick={() => setAlertMessage(null)}
                className="w-full py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 :bg-slate-100 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
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
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 :bg-slate-700 transition-colors"
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
        </div>
      )}

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8 transition-colors">
        {/* Template Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <LayoutTemplate size={20} className="text-slate-400" />
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
                    : "border-slate-200 hover:border-slate-300 :border-slate-600 hover:bg-slate-50 :bg-slate-800/50",
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
                      : "text-slate-500",
                  )}
                >
                  {template.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Theme Color */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Palette size={20} className="text-slate-400" />
            {t.settings.themeColor}
          </h3>
          <div className="flex flex-wrap gap-4">
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => updateSettings({ themeColor: color.value })}
                className={cn(
                  "w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center",
                  settings.themeColor === color.value
                    ? "border-slate-900 scale-110"
                    : "border-transparent hover:scale-105",
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {settings.themeColor === color.value && (
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Globe size={20} className="text-slate-400" />
            {t.settings.language}
          </h3>
          <div className="flex gap-4">
            <button
              onClick={() => updateSettings({ language: "en" })}
              className={cn(
                "px-6 py-2 rounded-xl border-2 font-medium transition-all",
                settings.language === "en"
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 :border-slate-600 hover:bg-slate-50 :bg-slate-800",
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
                  : "border-slate-200 text-slate-600 hover:border-slate-300 :border-slate-600 hover:bg-slate-50 :bg-slate-800",
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
                  : "border-slate-200 text-slate-600 hover:border-slate-300 :border-slate-600 hover:bg-slate-50 :bg-slate-800",
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
          <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-xl border border-slate-200 hover:bg-slate-50 :bg-slate-800/50 transition-colors">
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
                    "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm",
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
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 :bg-slate-700 transition-colors text-sm font-bold shadow-sm"
            >
              <Download size={16} />
              {t.settings.exportData}
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 :bg-slate-700 transition-colors text-sm font-bold shadow-sm cursor-pointer">
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
              className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl hover:bg-red-100 :bg-red-900/40 transition-colors text-sm font-bold shadow-sm ms-auto"
            >
              {t.settings.resetAll}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
