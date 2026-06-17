import React from "react";
import ProgressStepper from "./ProgressStepper";
import { useLanguageStore } from "../../store/useLanguageStore";
import { cn } from "../../lib/utils";

interface EditorSidebarProps {
  activeTab?: string;
  onTabChange?: (id: string) => void;
  lang?: "ar" | "en" | "fr";
  completionMap?: Record<string, number>;
}

export default function EditorSidebar({
  activeTab = "basics",
  onTabChange = () => {},
  completionMap = {},
}: EditorSidebarProps) {
  const { language } = useLanguageStore();
  const isRtl = language === "ar";
  
  const stepIds = [
    "basics", "experience", "education", "skills", "projects", 
    "certifications", "cover-letter", "finish"
  ];
  const currentIndex = stepIds.indexOf(activeTab);

  return (
    <aside 
      className={cn(
        "w-60 min-w-60 h-[calc(100%-24px)] my-3 bg-white/75 backdrop-blur-md border border-slate-200/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col overflow-y-auto select-none rounded-[20px] transition-all duration-300 relative z-20",
        isRtl ? "mr-4 ml-2" : "ml-4 mr-2"
      )}
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      <div className="text-[10px] font-black tracking-widest text-[#FF4D2D] uppercase px-5.5 pt-5 pb-2.5">
        {language === "ar" ? "🎯 خطوات البناء" : language === "fr" ? "🎯 ÉTAPES DU PROGRÈS" : "🎯 BUILD STEPS"}
      </div>

      <ProgressStepper
        variant="vertical"
        current={currentIndex}
        onStepClick={(i) => onTabChange(stepIds[i])}
        lang={language as "ar" | "en" | "fr"}
        completionMap={completionMap}
      />
    </aside>
  );
}
