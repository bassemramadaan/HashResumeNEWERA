import ProgressStepper from "./ProgressStepper";
import { useLanguageStore } from "../../store/useLanguageStore";

export default function EditorSidebar({
  activeTab     = "basics",
  onTabChange   = () => {},
  completionMap = {},
}: {
  activeTab?: string;
  onTabChange?: (id: string) => void;
  lang?: "ar" | "en" | "fr";
  completionMap?: Record<string, number>;
}) {
  const { language } = useLanguageStore();
  
  const stepIds = [
    "basics", "experience", "education", "skills", "projects", 
    "certifications", "custom", "cover-letter", "finish"
  ];
  const currentIndex = stepIds.indexOf(activeTab);

  return (
    <aside style={{
      width:          240,
      minWidth:       240,
      height:         "100%",
      background:     "#FAFAF8",
      borderInlineEnd: "1px solid #E8E6DF",
      display:        "flex",
      flexDirection:  "column",
      direction:      language === "ar" ? "rtl" : "ltr",
      overflowY:      "auto",
    }}>
      <div style={{
        fontSize:      11,
        fontWeight:    600,
        color:         "#999",
        letterSpacing: ".08em",
        padding:       "16px 16px 4px",
        textTransform: "uppercase",
      }}>
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
