import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Edit3, Eye, Grid, Download, 
  FileText, ChevronRight
} from "lucide-react";

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
    { id: "projects",       label: "المشاريع المنجزة",  emoji: "🚀" },
    { id: "certifications", label: "الشهادات والاعتمادات", emoji: "🏅" },
    
    { id: "cover-letter",   label: "خطاب التغطية (AI)", emoji: "📝" },
    { id: "finish",         label: "مراجعة وتحميل",     emoji: "📄" },
  ],
  en: [
    { id: "basics",         label: "Personal Info",    emoji: "👤" },
    { id: "experience",     label: "Experience",       emoji: "💼" },
    { id: "education",      label: "Education",        emoji: "🎓" },
    { id: "skills",         label: "Skills & Expertise",emoji: "⭐" },
    { id: "projects",       label: "Key Projects",    emoji: "🚀" },
    { id: "certifications", label: "Certifications",   emoji: "🏅" },
    
    { id: "cover-letter",   label: "Cover Letter",       emoji: "📝" },
    { id: "finish",         label: "Audit & Download", emoji: "📄" },
  ],
  fr: [
    { id: "basics",         label: "Informations",     emoji: "👤" },
    { id: "experience",     label: "Expérience",       emoji: "💼" },
    { id: "education",      label: "Formation",        emoji: "🎓" },
    { id: "skills",         label: "Compétences",      emoji: "⭐" },
    { id: "projects",       label: "Projets Clés",     emoji: "🚀" },
    { id: "certifications", label: "Certifications",   emoji: "🏅" },
    
    { id: "cover-letter",   label: "Lettre de Motivation", emoji: "📝" },
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
                    id={`m-tab-nav-${s.id}`}
            onClick={() => onSectionChange(s.id)}
            className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
              isActive 
                ? "bg-rose-500/5 border-rose-500/20 text-slate-900" 
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
            className="w-full flex items-center gap-3.5 p-4 bg-gradient-to-r from-slate-700/10 to-slate-900/5 hover:from-slate-700/15 hover:to-slate-900/10 border border-slate-700/20 rounded-2xl cursor-pointer transition-all text-slate-800"
          >
            <span className="text-2xl shrink-0 select-none">{auditSection.emoji}</span>
            <span className="flex-1 text-sm font-bold text-right ltr:text-left">{auditSection.label}</span>
            <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs leading-none">
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
  const [showPreviewDrawer, setShowPreviewDrawer] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 375);
  const [showQuickPreview, setShowQuickPreview] = useState(true);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen to capture scroll events on any list/form wrapper (like .editor-form-scrollable)
  useEffect(() => {
    const handleScrollCapture = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && typeof target.scrollTop === "number") {
        if (target.scrollTop > 50) {
          setShowQuickPreview(false);
        } else {
          setShowQuickPreview(true);
        }
      }
    };

    window.addEventListener("scroll", handleScrollCapture, true);
    return () => {
      window.removeEventListener("scroll", handleScrollCapture, true);
    };
  }, []);

  // Reset visibility when tabs or step sections change
  useEffect(() => {
    setShowQuickPreview(true);
  }, [activeSection, activeTab]);

  const sections                  = SECTIONS[lang] ?? SECTIONS.en;
  const isRtl                     = lang === "ar";
  
  const stepIds = [
    "basics", "experience", "education", "skills", "projects", 
    "certifications", "cover-letter", "finish"
  ];
  const currentIndex = stepIds.indexOf(activeSection);

  useEffect(() => {
    const tabEl = document.getElementById(`m-tab-${activeSection}`);
    if (tabEl) {
      tabEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeSection]);

  const handleSectionChange = (id: string) => {
    onSectionChange(id);
    setActiveTab("edit");
    // Ensure instant scroll recovery when transitioning section mobile tabs
    setTimeout(() => {
      const scrollable = document.querySelector(".editor-form-scrollable");
      if (scrollable) {
        scrollable.scrollTo({ top: 0, behavior: "instant" as any });
      }
    }, 45);
  };

  const TABS = [
    { id: "edit",     label: t.edit,     icon: Edit3 },
    { id: "preview",  label: t.preview,  icon: Eye },
    { id: "sections", label: t.sections, icon: Grid },
    { id: "export",   label: t.export,   icon: Download, isExport: true },
  ];

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-50 text-slate-800 overflow-hidden pb-[calc(76px+env(safe-area-inset-bottom,0px))]" style={{ direction: isRtl ? "rtl" : "ltr" }}>

      {/* ── Visual Mobile Header ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-300/30 px-4 py-3 flex items-center justify-between shrink-0 transform-gpu select-none">
        <div className="flex items-center gap-2.5">
          <motion.div 
            whileTap={{ scale: 0.92 }}
            onClick={() => { window.location.href = "/"; }}
            className="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-xs cursor-pointer hover:opacity-85 transition-opacity"
            title={lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
          >
            <img 
              src="https://i.ibb.co/qFFjyH8V/IN-LOGO-icon-3.png" 
              alt="HashResume Logo" 
              className="w-full h-full object-contain" 
            />
          </motion.div>
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

      {/* ── Proposal 3: Interactive steps progress bar pills ── */}
      <div className="bg-white border-b border-slate-100 px-4 py-2.5 flex items-center justify-between gap-1 select-none shrink-0" style={{ direction: isRtl ? "rtl" : "ltr" }}>
        <div className="flex items-center gap-1.5 flex-1 justify-center">
          {stepIds.map((stepId) => {
            const isActive = activeSection === stepId;
            const isCompleted = (completionMap[stepId] ?? 0) === 100;
            const s = sections.find(x => x.id === stepId);
            return (
              <button
                key={stepId}
                onClick={() => handleSectionChange(stepId)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? "w-8 bg-slate-900" 
                    : isCompleted 
                      ? "w-2.5 bg-emerald-500" 
                      : "w-1.5 bg-slate-200 hover:bg-slate-300"
                }`}
                title={s?.label || stepId}
              />
            );
          })}
        </div>
        <span className="text-[10px] font-black text-slate-400 select-none shrink-0 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-md">
          {currentIndex + 1} / {stepIds.length}
        </span>
      </div>

      {/* ── Main content area ── */}
      <main className="flex-1 overflow-hidden w-full max-w-lg mx-auto relative">
        {/* EDIT TAB */}
        <div className={`h-full w-full ${activeTab === "edit" ? "block" : "hidden"}`}>
          <div className="h-full flex flex-col overflow-hidden relative">
            <style>{`
              .mobile-tabs-container {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                overflow-x: auto !important;
                white-space: nowrap !important;
                scroll-snap-type: x mandatory !important;
                scrollbar-width: none !important; /* Firefox */
                -ms-overflow-style: none !important;  /* IE and Edge */
              }
              .mobile-tabs-container::-webkit-scrollbar {
                display: none !important; /* Chrome, Safari, Opera */
              }
              .mobile-tab-btn {
                scroll-snap-align: start !important;
              }
            `}</style>
            {/* Horizontal Sections Quick Switcher */}
            <div className="bg-white border-b border-slate-200/50 px-3 py-2.5 shrink-0 select-none mobile-tabs-container">
              {sections.map((s) => {
                const isActive = activeSection === s.id;
                const pct = completionMap[s.id] ?? 0;
                return (
                  <button
                    key={s.id}
                    id={`m-tab-${s.id}`}
                    onClick={() => {
                      onSectionChange(s.id);
                      // Scroll form to top
                      setTimeout(() => {
                        const scrollable = document.querySelector(".editor-form-scrollable");
                        if (scrollable) {
                          scrollable.scrollTo({ top: 0, behavior: "instant" as any });
                        }
                      }, 45);
                    }}
                    className={`relative flex flex-col items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-[10px] font-black whitespace-nowrap shrink-0 transition-all border mobile-tab-btn ${
                      isActive
                        ? "bg-[#001639] border-[#001639] text-white shadow-xs"
                        : "bg-transparent border-transparent text-[#6B7280] hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-sm select-none">{s.emoji}</span>
                    <span className="text-[9px] font-black tracking-tight leading-none">{s.label}</span>
                    {pct === 100 ? (
                      <span className="absolute -top-1 -end-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                    ) : pct > 0 ? (
                      <span className="absolute -top-1 -end-1 bg-amber-500 text-white font-black text-[7.5px] px-1 py-0.5 rounded-md leading-none border border-white scale-90">
                        {pct}%
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <div className="flex-1 overflow-hidden relative">
              <div className="h-full w-full overflow-hidden relative">
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* PREVIEW TAB */}
        <div className={`h-full w-full ${activeTab === "preview" ? "block" : "hidden"}`}>
          <div className="h-full overflow-hidden relative">
            {previewContent}
          </div>
        </div>

        {/* SECTIONS TAB */}
        <div className={`h-full w-full overflow-y-auto scrollbar-none pb-4 ${activeTab === "sections" ? "block" : "hidden"}`}>
          <SectionsScreen
            _lang={lang}
            sections={sections}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            completionMap={completionMap}
          />
        </div>

        {/* EXPORT TAB */}
        <div className={`h-full w-full overflow-y-auto scrollbar-none pb-4 ${activeTab === "export" ? "block" : "hidden"}`}>
          <ExportScreen lang={lang} onPDF={onExportPDF} onWord={onExportWord} />
        </div>
      </main>

      {/* ── Tactfully Designed Premium Bottom Navigation Bar ── */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-solid border-slate-200 px-3 py-1.5 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] md:pb-3 flex items-center justify-around shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] transform-gpu select-none">
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
                  className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-[0_4px_14px_rgba(255,77,45,0.4)] border border-rose-400/20"
                >
                  <Download className="w-4 h-4 shrink-0" />
                </motion.button>
                <span className="text-[9px] font-black mt-1 text-slate-900">
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
              className="flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer relative"
            >
              <div className="relative z-10">
                {IconComponent && (
                  <IconComponent className={`w-[18px] h-[18px] transition-colors duration-200 ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                )}
              </div>
              <span className={`text-[9px] font-bold mt-1 relative z-10 transition-colors duration-200 ${isActive ? "text-slate-900" : "text-slate-400"}`}>
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

      {/* Proposal 2: Floating Circular Live Preview FAB */}
      {activeTab === "edit" && !showPreviewDrawer && (
        <AnimatePresence>
          {showQuickPreview && (
            <motion.button
              initial={{ scale: 0, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0, y: 20, opacity: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowPreviewDrawer(true)}
              className="fixed bottom-[140px] z-40 bg-slate-900 text-white shadow-[0_12px_24px_rgba(15,23,42,0.3)] hover:bg-black rounded-full px-4 py-3 flex items-center gap-2 border border-slate-800 text-xs font-black tracking-tight active:scale-95 transition-all cursor-pointer select-none"
              style={{ right: isRtl ? "auto" : "20px", left: isRtl ? "20px" : "auto" }}
            >
              <span>📄</span>
              <span>{lang === "ar" ? "معاينة فورية" : lang === "fr" ? "Aperçu rapide" : "Quick Preview"}</span>
            </motion.button>
          )}
        </AnimatePresence>
      )}

      {/* Proposal 2: Bottom Sheet Drawer for Quick Live Preview */}
      <AnimatePresence>
        {showPreviewDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreviewDrawer(false)}
              className="fixed inset-0 bg-black/60 z-[100] pointer-events-auto"
            />
            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 inset-x-0 h-[82vh] bg-slate-50 rounded-t-[32px] border-t border-slate-200 z-[110] flex flex-col shadow-2xl overflow-hidden shadow-black/10 pb-[env(safe-area-inset-bottom,0px)]"
              style={{ direction: isRtl ? "rtl" : "ltr" }}
            >
              {/* Swipe/Touch pull indicator */}
              <div 
                className="w-full h-8 flex items-center justify-center shrink-0 cursor-pointer" 
                onClick={() => setShowPreviewDrawer(false)}
              >
                <div className="w-12 h-1.5 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors" />
              </div>

              {/* Header */}
              <div className="px-5 pb-3 border-b border-slate-200/60 flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📄</span>
                  <h3 className="text-sm font-black text-slate-800">
                    {lang === "ar" ? "المعاينة السريعة للسيرة الذاتية" : lang === "fr" ? "Aperçu rapide du CV" : "Quick Resume Preview"}
                  </h3>
                </div>
                <button
                  onClick={() => setShowPreviewDrawer(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer border border-slate-200"
                >
                  ✕
                </button>
              </div>

              {/* Real-time PDF layout view with correct scaling */}
              <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 overflow-y-auto p-4 flex justify-center bg-slate-150/40 pb-16">
                  <div 
                    className="origin-top shrink-0 transform-gpu transition-all" 
                    style={{
                      width: "210mm",
                      transform: `scale(${Math.min(0.88, (windowWidth - 32) / 794)})`,
                      marginBottom: `-${(1 - Math.min(0.88, (windowWidth - 32) / 794)) * 297}mm`
                    }}
                  >
                    <div className="bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] rounded-sm overflow-hidden select-none">
                      {previewContent}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
