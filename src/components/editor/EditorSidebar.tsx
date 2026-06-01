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
    "certifications", "custom", "cover-letter", "finish"
  ];
  const currentIndex = stepIds.indexOf(activeTab);

  return (
    <aside 
      className={cn(
        "w-60 min-w-60 h-full bg-neutral-50 border-neutral-200 flex flex-col overflow-y-auto select-none",
        isRtl ? "border-l" : "border-r"
      )}
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      <div className="text-[10px] font-extrabold text-neutral-450 tracking-wider uppercase px-4.5 pt-4.5 pb-2">
        {language === "ar" ? "خطوات العمل" : language === "fr" ? "Étapes" : "Progress"}
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
