import { useState } from "react";

// ── i18n ──────────────────────────────────────────────────
const TABS: Record<string, any[]> = {
  ar: [
    { id: "basics",          label: "المعلومات الشخصية", icon: "person"     },
    { id: "experience",      label: "الخبرات العملية",   icon: "briefcase"  },
    { id: "education",       label: "التعليم",           icon: "graduation" },
    { id: "skills",          label: "المهارات",          icon: "star"       },
    { id: "certifications",  label: "الشهادات",          icon: "badge"      },
    { id: "custom",          label: "أقسام مخصصة",       icon: "plus"       },
    { id: "finish",          label: "مراجعة وتحميل",     icon: "audit"      },
  ],
  en: [
    { id: "basics",          label: "Personal Info",     icon: "person"     },
    { id: "experience",      label: "Experience",        icon: "briefcase"  },
    { id: "education",       label: "Education",         icon: "graduation" },
    { id: "skills",          label: "Skills",            icon: "star"       },
    { id: "certifications",  label: "Certifications",    icon: "badge"      },
    { id: "custom",          label: "Custom Sections",   icon: "plus"       },
    { id: "finish",          label: "Audit & Download",  icon: "audit"      },
  ],
  fr: [
    { id: "basics",          label: "Informations",      icon: "person"     },
    { id: "experience",      label: "Expérience",        icon: "briefcase"  },
    { id: "education",       label: "Formation",         icon: "graduation" },
    { id: "skills",          label: "Compétences",       icon: "star"       },
    { id: "certifications",  label: "Certifications",    icon: "badge"      },
    { id: "custom",          label: "Sections custom",   icon: "plus"       },
    { id: "finish",          label: "Vérifier & Téléch.", icon: "audit"     },
  ],
};

// ── SVG icons ─────────────────────────────────────────────
function Icon({ name, size = 16, color = "currentColor" }: { name: string; size?: number; color?: string }) {
  const s = { width: size, height: size, flexShrink: 0 };
  const p = { fill: "none", stroke: color, strokeWidth: "1.8", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (name) {
    case "person":
      return <svg style={s} viewBox="0 0 24 24" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case "briefcase":
      return <svg style={s} viewBox="0 0 24 24" {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/></svg>;
    case "graduation":
      return <svg style={s} viewBox="0 0 24 24" {...p}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
    case "star":
      return <svg style={s} viewBox="0 0 24 24" {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case "badge":
      return <svg style={s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>;
    case "plus":
      return <svg style={s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
    case "audit":
      return <svg style={s} viewBox="0 0 24 24" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
    case "check":
      return <svg style={s} viewBox="0 0 24 24" {...p}><polyline points="20 6 9 17 4 12"/></svg>;
    default:
      return null;
  }
}

// ── completion ring (mini) ────────────────────────────────
function MiniRing({ pct }: { pct: number }) {
  const size = 18, R = 7, C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;
  const color = pct === 100 ? "#0F6E56" : pct > 0 ? "#BA7517" : "#D3D1C7";
  if (pct === 0) return null;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={R} fill="none" stroke="#F1EFE8" strokeWidth={2.5}/>
      <circle cx={size/2} cy={size/2} r={R} fill="none" stroke={color}
        strokeWidth={2.5} strokeLinecap="round"
        strokeDasharray={`${dash} ${C}`}/>
    </svg>
  );
}

// ── main ──────────────────────────────────────────────────
export default function EditorSidebar({
  activeTab     = "basics",
  onTabChange   = () => {},
  lang          = "ar",
  completionMap = {},
}: {
  activeTab?: string;
  onTabChange?: (id: string) => void;
  lang?: "ar" | "en" | "fr";
  completionMap?: Record<string, number>;
}) {
  const tabs  = TABS[lang] ?? TABS.en;
  const isRtl = lang === "ar";

  // اعزل الـ finish tab عشان يبقى في الأسفل
  const mainTabs  = tabs.filter(t => t.id !== "finish");
  const auditTab  = tabs.find(t => t.id === "finish");

  return (
    <aside style={{
      width:          220,
      minWidth:       220,
      height:         "100%",
      background:     "#FAFAF8",
      borderInlineEnd: "1px solid #E8E6DF",
      display:        "flex",
      flexDirection:  "column",
      padding:        "12px 8px",
      gap:            2,
      direction:      isRtl ? "rtl" : "ltr",
      overflowY:      "auto",
    }}>

      {/* ── Section label ── */}
      <div style={{
        fontSize:      11,
        fontWeight:    600,
        color:         "#999",
        letterSpacing: ".08em",
        padding:       "4px 10px 8px",
        textTransform: "uppercase",
      }}>
        {lang === "ar" ? "الأقسام" : lang === "fr" ? "Sections" : "Sections"}
      </div>

      {/* ── Main tabs ── */}
      {mainTabs.map((tab, i) => {
        const pct     = completionMap[tab.id] ?? 0;
        const isActive = activeTab === tab.id;
        const isDone   = pct === 100;

        return (
          <SidebarItem
            key={tab.id}
            tab={tab}
            isActive={isActive}
            pct={pct}
            isDone={isDone}
            isRtl={isRtl}
            onClick={() => onTabChange(tab.id)}
          />
        );
      })}

      {/* ── Spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Divider ── */}
      <div style={{ height: 1, background: "#E8E6DF", margin: "6px 4px" }} />

      {/* ── Audit tab — في الأسفل دايماً ── */}
      {auditTab && (
        <SidebarItem
          tab={auditTab}
          isActive={activeTab === auditTab.id}
          pct={completionMap[auditTab.id] ?? 0}
          isDone={false}
          isRtl={isRtl}
          isAudit
          onClick={() => onTabChange(auditTab.id)}
        />
      )}
    </aside>
  );
}

// ── SidebarItem ───────────────────────────────────────────
function SidebarItem({ tab, isActive, pct, isDone, isRtl, isAudit = false, onClick }: any) {
  const [hovered, setHovered] = useState(false);

  const bg = isActive
    ? "rgba(255,77,45,0.08)"
    : hovered
    ? "rgba(0,0,0,0.04)"
    : "transparent";

  const textColor = isActive ? "#FF4D2D" : "#333";
  const iconColor = isActive ? "#FF4D2D" : isDone ? "#0F6E56" : "#888";

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:        "flex",
        alignItems:     "center",
        gap:            10,
        padding:        "9px 10px",
        borderRadius:   9,
        border:         "none",
        background:     bg,
        cursor:         "pointer",
        width:          "100%",
        textAlign:      isRtl ? "right" : "left",
        transition:     "background .15s",
        position:       "relative",
      }}
    >
      {/* active indicator bar */}
      {isActive && (
        <span style={{
          position:    "absolute",
          [isRtl ? "right" : "left"]: 0,
          top:         "20%",
          height:      "60%",
          width:       3,
          background:  "#FF4D2D",
          borderRadius: isRtl ? "3px 0 0 3px" : "0 3px 3px 0",
        }} />
      )}

      {/* icon */}
      <span style={{ color: iconColor, display: "flex" }}>
        <Icon name={tab.icon} size={16} color={iconColor} />
      </span>

      {/* label */}
      <span style={{
        flex:       1,
        fontSize:   13,
        fontWeight: isActive ? 600 : 400,
        color:      textColor,
        lineHeight: 1.3,
        overflow:   "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {tab.label}
      </span>

      {/* completion indicator */}
      {!isAudit && (
        isDone
          ? <span style={{ display: "flex", color: "#0F6E56" }}><Icon name="check" size={14} color="#0F6E56" /></span>
          : <MiniRing pct={pct} />
      )}

      {/* audit CTA badge */}
      {isAudit && (
        <span style={{
          background:   "#FF4D2D",
          color:        "#fff",
          fontSize:     10,
          fontWeight:   700,
          padding:      "2px 6px",
          borderRadius: 99,
        }}>
          PDF
        </span>
      )}
    </button>
  );
}
