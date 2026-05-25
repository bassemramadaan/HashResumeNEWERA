import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Edit3, Eye, Grid, Download, 
  FileText, ChevronRight, Share2 
} from "lucide-react";
import ProgressStepper from "./ProgressStepper";

// ── i18n ──────────────────────────────────────────────────
const T: Record<string, Record<string, string>> = {
  ar: {
    edit:     "تعديل",
    preview:  "معاينة",
    sections: "الأقسام",
    export:   "تصدير",
    exportPDF:  "تصدير PDF",
    exportWord: "تصدير Word",
    shareLink:  "نسخ رابط",
    exportTitle: "سيرتك جاهزة!",
    exportSub:   "اختر صيغة التحميل المهنية",
    pdfNote:  "الأنسب لأغلب أنظمة التقديم (ATS)",
    wordNote: "ملف Word قابل للتعديل بالكامل",
    linkNote: "شارك سيرتك برابط مباشر وبسيط",
  },
  en: {
    edit:     "Edit",
    preview:  "Preview",
    sections: "Sections",
    export:   "Export",
    exportPDF:  "Export as PDF",
    exportWord: "Export as Word",
    shareLink:  "Copy Link",
    exportTitle: "Resume Ready!",
    exportSub:   "Choose your professional format",
    pdfNote:  "Best for most ATS filters",
    wordNote: "Fully editable .docx format",
    linkNote: "Share with a direct, simple link",
  },
  fr: {
    edit:     "Modifier",
    preview:  "Aperçu",
    sections: "Sections",
    export:   "Exporter",
    exportPDF:  "Exporter en PDF",
    exportWord: "Exporter en Word",
    shareLink:  "Copier le lien",
    exportTitle: "CV Prêt !",
    exportSub:   "Choisissez votre format",
    pdfNote:  "Recommandé pour les filtres ATS",
    wordNote: "Fichier .docx entièrement modifiable",
    linkNote: "Partager avec un lien direct",
  },
};

const SECTIONS: Record<string, { id: string; label: string; emoji: string }[]> = {
  ar: [
    { id: "basics",         label: "المعلومات الشخصية", emoji: "👤" },
    { id: "experience",     label: "الخبرات العملية",   emoji: "💼" },
    { id: "education",      label: "التعليم والشهادات",   emoji: "🎓" },
    { id: "skills",         label: "المهارات المهنية",  emoji: "⭐" },
    { id: "certifications", label: "الشهادات والاعتمادات", emoji: "🏅" },
    { id: "custom",         label: "أقسام مخصصة إضافية", emoji: "➕" },
    { id: "finish",         label: "مراجعة وتحميل",     emoji: "📄" },
  ],
  en: [
    { id: "basics",         label: "Personal Info",    emoji: "👤" },
    { id: "experience",     label: "Experience",       emoji: "💼" },
    { id: "education",      label: "Education",        emoji: "🎓" },
    { id: "skills",         label: "Skills & Expertise",emoji: "⭐" },
    { id: "certifications", label: "Certifications",   emoji: "🏅" },
    { id: "custom",         label: "Custom Sections",  emoji: "➕" },
    { id: "finish",         label: "Audit & Download", emoji: "📄" },
  ],
  fr: [
    { id: "basics",         label: "Informations",     emoji: "👤" },
    { id: "experience",     label: "Expérience",       emoji: "💼" },
    { id: "education",      label: "Formation",        emoji: "🎓" },
    { id: "skills",         label: "Compétences",      emoji: "⭐" },
    { id: "certifications", label: "Certifications",   emoji: "🏅" },
    { id: "custom",         label: "Sections custom",  emoji: "➕" },
    { id: "finish",         label: "Vérifier & Télécharger", emoji: "📄" },
  ],
};

// ── Mini Completion Rating Ring ──────────────────────────
function MiniRing({ pct }: { pct: number }) {
  if (pct == null || pct === 0) return null;
  const size = 18, R = 7, C = 2 * Math.PI * R, dash = (pct / 100) * C;
  const col  = pct === 100 ? "#10b981" : "#f59e0b";
  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle cx={size/2} cy={size/2} r={R} fill="none" stroke="#f1f5f9" strokeWidth={2.5}/>
      <circle cx={size/2} cy={size/2} r={R} fill="none" stroke={col}
        strokeWidth={2.5} strokeLinecap="round"
        strokeDasharray={`${dash} ${C}`}/>
    </svg>
  );
}

// ── ExportScreen ──────────────────────────────────────────
function ExportScreen({ lang, onPDF, onWord }: { lang: string; onPDF: () => void; onWord: () => void }) {
  const t = T[lang] ?? T.en;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const items = [
    { 
      icon: <FileText className="w-5 h-5 text-rose-600" />, 
      label: t.exportPDF,  
      note: t.pdfNote,  
      bg: "bg-rose-50 border-rose-100",  
      action: onPDF 
    },
    { 
      icon: <Download className="w-5 h-5 text-blue-600" />, 
      label: t.exportWord, 
      note: t.wordNote, 
      bg: "bg-blue-50 border-blue-100",  
      action: onWord 
    },
    { 
      icon: <Share2 className="w-5 h-5 text-indigo-600" />, 
      label: copied ? "✓ " + t.shareLink : t.shareLink, 
      note: t.linkNote, 
      bg: "bg-indigo-50 border-indigo-100", 
      action: handleCopy 
    },
  ];

  return (
    <div className="px-4 py-8 space-y-4 max-w-md mx-auto">
      <div className="text-center pb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-3 text-3xl animate-bounce">
          🎉
        </div>
        <h3 className="text-lg font-black text-slate-800">{t.exportTitle}</h3>
        <p className="text-xs text-slate-400 mt-1">{t.exportSub}</p>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            key={i}
            onClick={item.action}
            className="w-full flex items-center gap-4 p-4 bg-white border border-slate-200/80 rounded-2xl cursor-pointer text-right ltr:text-left transition-all hover:bg-slate-50 shadow-xs"
          >
            <div className={`w-11 h-11 ${item.bg} border rounded-xl flex items-center justify-center shrink-0`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-800">{item.label}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">{item.note}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 rtl:rotate-180 shrink-0" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ── SectionsScreen ────────────────────────────────────────
function SectionsScreen({ _lang, sections, activeSection, onSectionChange, completionMap }: {
  _lang: string;
  sections: { id: string; label: string; emoji: string }[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  completionMap: Record<string, number>;
}) {
  const mainSections = sections.filter((s) => s.id !== "finish");
  const auditSection = sections.find((s) => s.id === "finish");

  return (
    <div className="p-4 space-y-2 max-w-md mx-auto">
      {mainSections.map((s) => {
        const pct      = completionMap[s.id] ?? 0;
        const isActive = activeSection === s.id;
        return (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            key={s.id}
            onClick={() => onSectionChange(s.id)}
            className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
              isActive 
                ? "bg-rose-500/5 border-rose-500/20 text-[#FF4D2D]" 
                : "bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700"
            }`}
          >
            <span className="text-2xl filter drop-shadow-xs shrink-0 select-none">{s.emoji}</span>
            <span className={`flex-1 text-sm text-right ltr:text-left ${isActive ? "font-bold" : "font-semibold"}`}>
              {s.label}
            </span>
            {pct === 100 ? (
              <span className="text-emerald-500 font-bold text-sm">✓</span>
            ) : (
              <MiniRing pct={pct} />
            )}
          </motion.button>
        );
      })}

      {auditSection && (
        <div className="pt-2">
          <div className="h-px bg-slate-200/60 my-3" />
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSectionChange("finish")}
            className="w-full flex items-center gap-3.5 p-4 bg-gradient-to-r from-rose-500/10 to-[#FF4D2D]/5 hover:from-rose-500/15 hover:to-[#FF4D2D]/10 border border-[#FF4D2D]/20 rounded-2xl cursor-pointer transition-all text-slate-800"
          >
            <span className="text-2xl shrink-0 select-none">{auditSection.emoji}</span>
            <span className="flex-1 text-sm font-bold text-right ltr:text-left">{auditSection.label}</span>
            <span className="bg-[#FF4D2D] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs leading-none">
              PDF
            </span>
          </motion.button>
        </div>
      )}
    </div>
  );
}

// ── main MobileEditorLayout ───────────────────────────────
export default function MobileEditorLayout({
  lang            = "ar",
  atsScore        = 0,
  activeSection   = "basics",
  onSectionChange = () => {},
  completionMap   = {},
  onExportPDF     = () => {},
  onExportWord    = () => {},
  previewContent  = null,
  children,
}: {
  lang?: string;
  atsScore?: number;
  activeSection?: string;
  onSectionChange?: (id: string) => void;
  completionMap?: Record<string, number>;
  onExportPDF?: () => void;
  onExportWord?: () => void;
  previewContent?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const t                         = T[lang] ?? T.en;
  const [activeTab, setActiveTab] = useState("edit");
  const sections                  = SECTIONS[lang] ?? SECTIONS.en;
  const isRtl                     = lang === "ar";
  
  const stepIds = [
    "basics", "experience", "education", "skills", "projects", 
    "certifications", "custom", "cover-letter", "finish"
  ];
  const currentIndex = stepIds.indexOf(activeSection);

  const handleNext = () => {
    if (currentIndex < stepIds.length - 1) {
      onSectionChange(stepIds[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSectionChange(stepIds[currentIndex - 1]);
    }
  };

  const handleSectionChange = (id: string) => {
    onSectionChange(id);
    setActiveTab("edit");
  };

  const TABS = [
    { id: "edit",     label: t.edit,     icon: Edit3 },
    { id: "preview",  label: t.preview,  icon: Eye },
    { id: "sections", label: t.sections, icon: Grid },
    { id: "export",   label: t.export,   icon: Download, isExport: true },
  ];

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 text-slate-800 overflow-hidden relative pb-[calc(76px+env(safe-area-inset-bottom,0px))]" style={{ direction: isRtl ? "rtl" : "ltr" }}>

      {/* ── Visual Mobile Header ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-sans border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 transform-gpu select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-xs">
            <img 
              src="https://i.ibb.co/qFFjyH8V/IN-LOGO-icon-3.png" 
              alt="HashResume Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <span className="text-sm font-black text-slate-800">
            {currentSection?.emoji} {currentSection?.label}
          </span>
        </div>

        {/* Floating live badge with state colors */}
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-xs bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 shadow-2xs">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span>ATS {atsScore}%</span>
        </div>
      </header>

      {/* ── Main content area with fade animations ── */}
      <main className="flex-1 overflow-hidden w-full max-w-lg mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            {activeTab === "edit" && (
              <div className="h-full flex flex-col overflow-hidden relative">
                <div className="flex-1 overflow-hidden relative">{children}</div>
                <div className="p-4 bg-white border-t border-slate-150 shrink-0 select-none transform-gpu bg-white/95 backdrop-blur-md">
                  <ProgressStepper
                    variant="mini"
                    current={currentIndex}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    lang={lang as "ar" | "en" | "fr"}
                  />
                </div>
              </div>
            )}
            {activeTab === "preview" && (
              <div className="h-full overflow-hidden relative">
                {previewContent}
              </div>
            )}
            {activeTab === "sections" && (
              <div className="h-full overflow-y-auto w-full scrollbar-none pb-4">
                <SectionsScreen
                  _lang={lang}
                  sections={sections}
                  activeSection={activeSection}
                  onSectionChange={handleSectionChange}
                  completionMap={completionMap}
                />
              </div>
            )}
            {activeTab === "export" && (
              <div className="h-full overflow-y-auto w-full scrollbar-none pb-4">
                <ExportScreen lang={lang} onPDF={onExportPDF} onWord={onExportWord} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Tactfully Designed Premium Bottom Navigation Bar ── */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-sans border-slate-200 px-4 py-2 pb-[calc(1.2rem+env(safe-area-inset-bottom,0px))] md:pb-4 flex items-center justify-around shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] transform-gpu select-none">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;

          if (tab.isExport) {
            return (
              <div key={tab.id} className="relative flex flex-col items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("export")}
                  className="w-12 h-12 bg-gradient-to-r from-rose-600 to-[#FF4D2D] text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-[0_4px_14px_rgba(255,77,45,0.4)] border border-rose-400/20"
                >
                  <Download className="w-5 h-5 shrink-0" />
                </motion.button>
                <span className="text-[10px] font-black mt-1 text-[#FF4D2D]">
                  {tab.label}
                </span>
              </div>
            );
          }

          return (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl cursor-pointer relative"
            >
              <div className="relative z-10">
                {IconComponent && (
                  <IconComponent className={`w-5 h-5 transition-colors duration-200 ${isActive ? "text-[#FF4D2D]" : "text-slate-400"}`} />
                )}
              </div>
              <span className={`text-[10px] font-bold mt-1 relative z-10 transition-colors duration-200 ${isActive ? "text-[#FF4D2D]" : "text-slate-400"}`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-rose-500/5 border border-rose-500/10 rounded-2xl"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

    </div>
  );
}
