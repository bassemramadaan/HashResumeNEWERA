import React from "react";
import ProgressStepper from "./ProgressStepper";
import { useLanguageStore } from "../../store/useLanguageStore";
import { cn } from "../../lib/utils";
import { FileUp } from "lucide-react";

interface EditorSidebarProps {
  activeTab?: string;
  onTabChange?: (id: string) => void;
  lang?: "ar" | "en" | "fr";
  completionMap?: Record<string, number>;
  onImportClick?: () => void;
}

export default function EditorSidebar({
  activeTab = "basics",
  onTabChange = () => {},
  completionMap = {},
  onImportClick = () => {},
}: EditorSidebarProps) {
  const { language } = useLanguageStore();
  const isRtl = language === "ar";
  
  const stepIds = [
    "basics", "experience", "education", "skills", "projects", 
    "certifications", "finish"
  ];
  const currentIndex = stepIds.indexOf(activeTab);

  return (
    <aside 
      className={cn(
        "w-64 min-w-64 h-[calc(100%-24px)] my-3 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(255,255,255,0.4)] flex flex-col overflow-y-auto select-none rounded-[28px] transition-all duration-300 relative z-20 scrollbar-none",
        isRtl ? "mr-3 ml-2" : "ml-3 mr-2"
      )}
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      <div className="text-[10px] font-black tracking-widest text-[#FF4D2D] uppercase px-6 pt-6 pb-2">
        {language === "ar" ? "🎯 خطة البناء" : language === "fr" ? "🎯 ÉTAPES DU PROGRÈS" : "🎯 BUILD PLAN"}
      </div>

      <div className="px-2 flex-1">
        <ProgressStepper
          variant="vertical"
          current={currentIndex}
          onStepClick={(i) => onTabChange(stepIds[i])}
          lang={language as "ar" | "en" | "fr"}
          completionMap={completionMap}
        />
      </div>

      <div className="p-4 mt-auto border-t border-slate-100">
        <button
          onClick={onImportClick}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm font-semibold text-sm group"
        >
          <FileUp size={16} className="text-slate-400 group-hover:text-white transition-colors" />
          {language === "ar" ? "استيراد السيرة الذاتية" : "Import CV / LinkedIn"}
        </button>
      </div>
    </aside>
  );
}
