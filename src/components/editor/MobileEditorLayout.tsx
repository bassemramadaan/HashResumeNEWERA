import { useState, useEffect } from "react";

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
    exportTitle: "السيرة جاهزة!",
    exportSub:   "اختار صيغة التحميل",
    pdfNote:  "الأنسب لأغلب الشركات",
    wordNote: "ملف Word قابل للتعديل",
    linkNote: "شارك مع أي حد",
  },
  en: {
    edit:     "Edit",
    preview:  "Preview",
    sections: "Sections",
    export:   "Export",
    exportPDF:  "Export as PDF",
    exportWord: "Export as Word",
    shareLink:  "Copy link",
    exportTitle: "Resume Ready!",
    exportSub:   "Choose your download format",
    pdfNote:  "Best for most companies",
    wordNote: "Editable .docx file",
    linkNote: "Share with anyone",
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
    pdfNote:  "Idéal pour la plupart des entreprises",
    wordNote: "Fichier .docx modifiable",
    linkNote: "Partager avec n'importe qui",
  },
};

const SECTIONS: Record<string, { id: string; label: string; emoji: string }[]> = {
  ar: [
    { id: "basics",         label: "المعلومات الشخصية", emoji: "👤" },
    { id: "experience",     label: "الخبرات العملية",   emoji: "💼" },
    { id: "education",      label: "التعليم",           emoji: "🎓" },
    { id: "skills",         label: "المهارات",          emoji: "⭐" },
    { id: "certifications", label: "الشهادات",          emoji: "🏅" },
    { id: "custom",         label: "أقسام مخصصة",       emoji: "➕" },
    { id: "finish",          label: "مراجعة وتحميل",     emoji: "📄" }, // Changed audit -> finish to match EditorPage Tabs
  ],
  en: [
    { id: "basics",         label: "Personal Info",    emoji: "👤" },
    { id: "experience",     label: "Experience",       emoji: "💼" },
    { id: "education",      label: "Education",        emoji: "🎓" },
    { id: "skills",         label: "Skills",           emoji: "⭐" },
    { id: "certifications", label: "Certifications",   emoji: "🏅" },
    { id: "custom",         label: "Custom Sections",  emoji: "➕" },
    { id: "finish",          label: "Audit & Download", emoji: "📄" },
  ],
  fr: [
    { id: "basics",         label: "Informations",     emoji: "👤" },
    { id: "experience",     label: "Expérience",       emoji: "💼" },
    { id: "education",      label: "Formation",        emoji: "🎓" },
    { id: "skills",         label: "Compétences",      emoji: "⭐" },
    { id: "certifications", label: "Certifications",   emoji: "🏅" },
    { id: "custom",         label: "Sections custom",  emoji: "➕" },
    { id: "finish",          label: "Vérifier & Téléch",emoji: "📄" },
  ],
};

// ── hook: detect mobile ───────────────────────────────────
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [breakpoint]);
  return isMobile;
}

// ── SVG icons ─────────────────────────────────────────────
const Icons = {
  edit: (c: string) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  preview: (c: string) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  sections: (c: string) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <line x1="8" y1="6"  x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6"  x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  download: (c: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
};

// ── MiniRing ──────────────────────────────────────────────
function MiniRing({ pct }: { pct: number }) {
  if (pct == null) return null;
  const size = 18, R = 7, C = 2 * Math.PI * R, dash = (pct / 100) * C;
  const col  = pct === 100 ? "#0F6E56" : "#BA7517";
  if (pct === 0) return null;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={9} cy={9} r={R} fill="none" stroke="#F1EFE8" strokeWidth={2.5}/>
      <circle cx={9} cy={9} r={R} fill="none" stroke={col}
        strokeWidth={2.5} strokeLinecap="round"
        strokeDasharray={`${dash} ${C}`}/>
    </svg>
  );
}

// ── ExportScreen ──────────────────────────────────────────
function ExportScreen({ lang, onPDF, onWord }: any) {
  const t = T[lang] ?? T.en;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const items = [
    { emoji: "📕", label: t.exportPDF,  note: t.pdfNote,  color: "#FF4D2D", bg: "rgba(255,77,45,0.1)",  action: onPDF },
    { emoji: "📘", label: t.exportWord, note: t.wordNote, color: "#185FA5", bg: "rgba(24,95,165,0.1)",  action: onWord },
    { emoji: "🔗", label: copied ? "✓ " + t.shareLink : t.shareLink, note: t.linkNote, color: "#534AB7", bg: "rgba(83,74,183,0.1)", action: handleCopy },
  ];

  return (
    <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ textAlign: "center", paddingBottom: 8 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 4 }}>{t.exportTitle}</div>
        <div style={{ fontSize: 13, color: "#888" }}>{t.exportSub}</div>
      </div>

      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.action}
          style={{
            display:       "flex",
            alignItems:    "center",
            gap:           14,
            padding:       "16px",
            background:    "#fff",
            border:        "1px solid #E8E6DF",
            borderRadius:  14,
            cursor:        "pointer",
            width:         "100%",
            textAlign:     lang === "ar" ? "right" : "left",
          }}
        >
          <div style={{
            width: 44, height: 44, background: item.bg,
            borderRadius: 12, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
          }}>
            {item.emoji}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{item.label}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{item.note}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ── SectionsScreen ────────────────────────────────────────
function SectionsScreen({ lang, sections, activeSection, onSectionChange, completionMap }: any) {
  const mainSections = sections.filter((s: any) => s.id !== "finish");
  const auditSection = sections.find((s: any) => s.id === "finish");

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 8 }}>
      {mainSections.map((s: any) => {
        const pct      = completionMap[s.id] ?? 0;
        const isActive = activeSection === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onSectionChange(s.id)}
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          12,
              padding:      "14px",
              background:   isActive ? "rgba(255,77,45,0.06)" : "#fff",
              border:       `1px solid ${isActive ? "rgba(255,77,45,0.2)" : "#E8E6DF"}`,
              borderRadius: 14,
              cursor:       "pointer",
              width:        "100%",
              textAlign:    lang === "ar" ? "right" : "left",
            }}
          >
            <span style={{ fontSize: 22 }}>{s.emoji}</span>
            <span style={{ flex: 1, fontSize: 15, fontWeight: isActive ? 600 : 400, color: isActive ? "#FF4D2D" : "#333" }}>
              {s.label}
            </span>
            {pct === 100
              ? <span style={{ color: "#0F6E56", fontSize: 16 }}>✓</span>
              : <MiniRing pct={pct} />
            }
          </button>
        );
      })}

      {auditSection && (
        <>
          <div style={{ height: 1, background: "#E8E6DF", margin: "4px 0" }} />
          <button
            onClick={() => onSectionChange("finish")}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px", background: "#fff",
              border: "1px solid #E8E6DF", borderRadius: 14,
              cursor: "pointer", width: "100%",
              textAlign: lang === "ar" ? "right" : "left",
            }}
          >
            <span style={{ fontSize: 22 }}>{auditSection.emoji}</span>
            <span style={{ flex: 1, fontSize: 15, color: "#333" }}>{auditSection.label}</span>
            <span style={{
              background: "#FF4D2D", color: "#fff",
              fontSize: 11, fontWeight: 700,
              padding: "3px 8px", borderRadius: 99,
            }}>PDF</span>
          </button>
        </>
      )}
    </div>
  );
}

import ProgressStepper from "./ProgressStepper";

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
  children,                       // ← الـ form بتاع الـ section الحالية
}: any) {
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

  // لما المستخدم يختار section من الـ sections screen → روح للـ edit screen
  const handleSectionChange = (id: string) => {
    onSectionChange(id);
    setActiveTab("edit");
  };

  const TABS = [
    { id: "edit",     label: t.edit,     icon: Icons.edit },
    { id: "preview",  label: t.preview,  icon: Icons.preview },
    { id: "sections", label: t.sections, icon: Icons.sections },
    { id: "export",   label: t.export,   icon: null, isExport: true },
  ];

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div style={{
      display:       "flex",
      flexDirection: "column",
      height:        "100dvh",
      background:    "#FAFAF8",
      direction:     isRtl ? "rtl" : "ltr",
      overflow:      "hidden",
    }}>

      {/* ── Top bar ── */}
      <header style={{
        background:     "rgba(250,250,248,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom:   "1px solid #E8E6DF",
        padding:        "10px 16px",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        flexShrink:     0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <img src="https://i.ibb.co/qFFjyH8V/IN-LOGO-icon-3.png" alt="IN LOGO icon(3)" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 8 }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
            {currentSection?.emoji} {currentSection?.label}
          </span>
        </div>

        {/* ATS pill */}
        <div style={{
          background:   "rgba(255,77,45,0.1)",
          border:       "1px solid rgba(255,77,45,0.2)",
          borderRadius: 99,
          padding:      "3px 10px",
          fontSize:     12,
          fontWeight:   700,
          color:        "#993C1D",
        }}>
          ATS {atsScore}%
        </div>
      </header>

      {/* ── Main content area ── */}
      <main style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        {activeTab === "edit"     && (
          <>
            <div style={{ paddingBottom: 120 }}>{children}</div>
            <ProgressStepper
              variant="mini"
              current={currentIndex}
              onNext={handleNext}
              onPrev={handlePrev}
              lang={lang as any}
            />
          </>
        )}
        {activeTab === "preview"  && <div style={{ padding: "16px", paddingBottom: 80, height: "100%" }}>{previewContent}</div>}
        {activeTab === "sections" && (
          <SectionsScreen
            lang={lang}
            sections={sections}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            completionMap={completionMap}
          />
        )}
        {activeTab === "export"   && (
          <ExportScreen lang={lang} onPDF={onExportPDF} onWord={onExportWord} />
        )}
      </main>

      {/* ── Bottom Tab Bar ── */}
      <nav style={{
        background:   "rgba(250,250,248,0.97)",
        borderTop:    "1px solid #E8E6DF",
        display:      "flex",
        alignItems:   "center",
        padding:      "8px 4px 16px",  // 16px bottom for home indicator
        flexShrink:   0,
        backdropFilter: "blur(12px)",
      }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const color    = isActive ? "#FF4D2D" : "#888";

          if (tab.isExport) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab("export")}
                style={{
                  flex:           1,
                  display:        "flex",
                  flexDirection:  "column",
                  alignItems:     "center",
                  gap:            3,
                  border:         "none",
                  background:     "transparent",
                  cursor:         "pointer",
                  padding:        "4px",
                }}
              >
                <div style={{
                  width:        40,
                  height:       40,
                  background:   "#FF4D2D",
                  borderRadius: 14,
                  display:      "flex",
                  alignItems:   "center",
                  justifyContent: "center",
                  boxShadow:    "0 4px 12px rgba(255,77,45,0.35)",
                  transform:    activeTab === "export" ? "scale(0.92)" : "scale(1)",
                  transition:   "transform .15s",
                }}>
                  {Icons.download("#fff")}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#FF4D2D" }}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex:           1,
                display:        "flex",
                flexDirection:  "column",
                alignItems:     "center",
                gap:            3,
                border:         "none",
                background:     "transparent",
                cursor:         "pointer",
                padding:        "6px 4px",
              }}
            >
              {tab.icon && tab.icon(color)}
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
