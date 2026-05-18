import React, { useState } from "react";

// ── Types ─────────────────────────────────────────────────
type Locale = "ar" | "en" | "fr";
type Variant = "horizontal" | "vertical" | "mini";
type StepState = "done" | "active" | "pending";

interface Step {
  id: string;
  label: string;
  shortLabel: string;
  emoji: string;
}

interface ProgressStepperProps {
  variant?: Variant;
  current?: number;
  onStepClick?: (index: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  lang?: Locale;
  completionMap?: Record<string, number>;
}

// ── Steps definition ──────────────────────────────────────
const STEPS: Record<Locale, Step[]> = {
  ar: [
    { id: "basics",         label: "البيانات",  shortLabel: "البيانات",  emoji: "👤" },
    { id: "experience",     label: "الخبرات",   shortLabel: "الخبرات",   emoji: "💼" },
    { id: "education",      label: "التعليم",   shortLabel: "التعليم",   emoji: "🎓" },
    { id: "skills",         label: "المهارات",  shortLabel: "المهارات",  emoji: "⭐" },
    { id: "projects",       label: "المشاريع",  shortLabel: "المشاريع",  emoji: "🚀" },
    { id: "certifications", label: "الشهادات",  shortLabel: "الشهادات",  emoji: "🏅" },
    { id: "custom",         label: "إضافات",    shortLabel: "إضافات",    emoji: "➕" },
    { id: "cover-letter",   label: "الخطاب",    shortLabel: "الخطاب",    emoji: "📝" },
    { id: "finish",          label: "تحميل",     shortLabel: "تحميل",     emoji: "📄" },
  ],
  en: [
    { id: "basics",         label: "Basics",      shortLabel: "Basics",  emoji: "👤" },
    { id: "experience",     label: "Experience",  shortLabel: "Exp",     emoji: "💼" },
    { id: "education",      label: "Education",   shortLabel: "Edu",     emoji: "🎓" },
    { id: "skills",         label: "Skills",      shortLabel: "Skills",  emoji: "⭐" },
    { id: "projects",       label: "Projects",    shortLabel: "Proj",    emoji: "🚀" },
    { id: "certifications", label: "Certs",       shortLabel: "Certs",   emoji: "🏅" },
    { id: "custom",         label: "Custom",      shortLabel: "Custom",  emoji: "➕" },
    { id: "cover-letter",   label: "Cover",       shortLabel: "Cover",   emoji: "📝" },
    { id: "finish",          label: "Download",    shortLabel: "Done",    emoji: "📄" },
  ],
  fr: [
    { id: "basics",         label: "Infos",       shortLabel: "Infos",   emoji: "👤" },
    { id: "experience",     label: "Expérience",  shortLabel: "Exp",     emoji: "💼" },
    { id: "education",      label: "Formation",   shortLabel: "Form",    emoji: "🎓" },
    { id: "skills",         label: "Compétences", shortLabel: "Comp",    emoji: "⭐" },
    { id: "projects",       label: "Projets",     shortLabel: "Proj",    emoji: "🚀" },
    { id: "certifications", label: "Certifs",     shortLabel: "Cert",    emoji: "🏅" },
    { id: "custom",         label: "Custom",      shortLabel: "Custom",  emoji: "➕" },
    { id: "cover-letter",   label: "Lettre",      shortLabel: "Lett",    emoji: "📝" },
    { id: "finish",          label: "Télécharger", shortLabel: "Fin",     emoji: "📄" },
  ],
};

const NAV_LABELS: Record<Locale, { next: string; prev: string }> = {
  ar: { next: "التالي", prev: "السابق" },
  en: { next: "Next",   prev: "Back"   },
  fr: { next: "Suivant",prev: "Retour" },
};

// ── color helpers ─────────────────────────────────────────
function getStepState(i: number, current: number): StepState {
  if (i < current)  return "done";
  if (i === current) return "active";
  return "pending";
}

function dotColors(state: StepState) {
  switch (state) {
    case "done":    return { bg: "#0F6E56", text: "#fff", border: "#0F6E56" };
    case "active":  return { bg: "#FF4D2D", text: "#fff", border: "#FF4D2D" };
    default:        return { bg: "#fff",    text: "#999", border: "#E0DDD6" };
  }
}

function labelColor(state: StepState) {
  switch (state) {
    case "done":   return "#0F6E56";
    case "active": return "#FF4D2D";
    default:       return "#999";
  }
}

function connectorColor(i: number, current: number) {
  return i < current ? "#0F6E56" : "#E0DDD6";
}

// ── DotNode ───────────────────────────────────────────────
function DotNode({ index, state, onClick, size = 32 }: { index: number; state: StepState; onClick?: () => void; size?: number }) {
  const [hovered, setHovered] = useState(false);
  const c = dotColors(state);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:          size,
        height:         size,
        borderRadius:   "50%",
        background:     c.bg,
        color:          c.text,
        border:         `2px solid ${c.border}`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        fontSize:       size < 28 ? 10 : 12,
        fontWeight:     700,
        cursor:         "pointer",
        flexShrink:     0,
        transition:     "all .25s",
        transform:      hovered && state !== "active" ? "scale(1.1)" : "scale(1)",
        boxShadow:      state === "active" ? "0 0 0 4px rgba(255,77,45,0.15)" : "none",
        zIndex:         1,
        position:       "relative",
      }}
    >
      {state === "done"
        ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        : index + 1
      }
    </div>
  );
}

// ── HORIZONTAL variant ────────────────────────────────────
function HorizontalStepper({ steps, current, onStepClick, completionMap, isRtl }: { steps: Step[]; current: number; onStepClick?: (i: number) => void; completionMap: Record<string, number>; isRtl: boolean }) {
  return (
    <div style={{
      display:     "flex",
      alignItems:  "flex-start",
      padding:     "16px 24px",
      background:  "#FAFAF8",
      borderBottom: "1px solid #E8E6DF",
      direction:   isRtl ? "rtl" : "ltr",
      overflowX:   "auto",
    }}>
      {steps.map((step, i) => {
        const state = getStepState(i, current);
        return (
          <div key={step.id} style={{ display: "flex", alignItems: "flex-start", flex: 1, minWidth: 0 }}>
            {/* dot + label */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <DotNode index={i} state={state} onClick={() => onStepClick?.(i)} />
              <span style={{
                fontSize:   10,
                fontWeight: state === "active" ? 700 : 400,
                color:      labelColor(state),
                whiteSpace: "nowrap",
              }}>
                {step.shortLabel}
              </span>
            </div>
            {/* connector */}
            {i < steps.length - 1 && (
              <div style={{
                flex:       1,
                height:     2,
                background: connectorColor(i, current),
                marginTop:  15,
                transition: "background .4s",
                minWidth:   8,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── VERTICAL variant ──────────────────────────────────────
function VerticalStepper({ steps, current, onStepClick, completionMap, isRtl }: { steps: Step[]; current: number; onStepClick?: (i: number) => void; completionMap: Record<string, number>; isRtl: boolean }) {
  return (
    <div style={{
      display:       "flex",
      flexDirection: "column",
      padding:       "16px 12px",
      direction:     isRtl ? "rtl" : "ltr",
    }}>
      {steps.map((step, i) => {
        const state  = getStepState(i, current);
        const isLast = i === steps.length - 1;
        return (
          <div key={step.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            {/* dot + vertical connector */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <DotNode index={i} state={state} onClick={() => onStepClick?.(i)} size={28} />
              {!isLast && (
                <div style={{
                  width:      2,
                  flex:       1,
                  minHeight:  24,
                  background: connectorColor(i, current),
                  margin:     "3px 0",
                  transition: "background .4s",
                }} />
              )}
            </div>
            {/* label + sub */}
            <div style={{ paddingBottom: isLast ? 0 : 16, paddingTop: 3 }}>
              <div style={{
                fontSize:   13,
                fontWeight: state === "active" ? 700 : 400,
                color:      labelColor(state),
                cursor:     "pointer",
              }}
                onClick={() => onStepClick?.(i)}
              >
                {step.emoji} {step.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── MINI variant (mobile bottom bar) ─────────────────────
function MiniStepper({ steps, current, onNext, onPrev, isRtl, navLabels }: { steps: Step[]; current: number; onNext: () => void; onPrev: () => void; isRtl: boolean; navLabels: { next: string; prev: string } }) {
  const step     = steps[current];
  const progress = ((current + 1) / steps.length) * 100;
  const canNext  = current < steps.length - 1;
  const canPrev  = current > 0;

  return (
    <div style={{
      display:        "flex",
      alignItems:     "center",
      gap:            12,
      padding:        "10px 16px",
      background:     "rgba(250,250,248,0.97)",
      borderTop:      "1px solid #E8E6DF",
      backdropFilter: "blur(12px)",
      direction:      isRtl ? "rtl" : "ltr",
      position:       "fixed",
      bottom:         0,
      left:           0,
      right:          0,
      zIndex:         1000,
    }}>
      {/* prev btn */}
      <button
        onClick={onPrev}
        disabled={!canPrev}
        style={{
          width:          38,
          height:         38,
          borderRadius:   "50%",
          border:         "1px solid #E8E6DF",
          background:     canPrev ? "#fff" : "#F5F5F0",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          cursor:         canPrev ? "pointer" : "not-allowed",
          flexShrink:     0,
          color:          canPrev ? "#333" : "#CCC",
          fontSize:       16,
          transition:     "all .15s",
        }}
      >
        {isRtl ? "→" : "←"}
      </button>

      {/* progress info */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>
            {step.emoji} {step.label}
          </span>
          <span style={{ fontSize: 12, color: "#999" }}>
            {current + 1} / {steps.length}
          </span>
        </div>
        {/* progress bar */}
        <div style={{ height: 4, background: "#F0EDE8", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height:     4,
            width:      `${progress}%`,
            background: current === steps.length - 1 ? "#0F6E56" : "#FF4D2D",
            borderRadius: 99,
            transition: "width .4s cubic-bezier(.22,1,.36,1)",
            ...(isRtl ? { float: "right" } : {}),
          }} />
        </div>
      </div>

      {/* next btn */}
      <button
        onClick={onNext}
        disabled={!canNext}
        style={{
          height:         38,
          paddingInline:  16,
          borderRadius:   10,
          border:         "none",
          background:     canNext ? "#111" : "#F5F5F0",
          color:          canNext ? "#fff" : "#CCC",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          gap:            6,
          cursor:         canNext ? "pointer" : "not-allowed",
          flexShrink:     0,
          fontSize:       13,
          fontWeight:     700,
          transition:     "all .15s",
          whiteSpace:     "nowrap",
        }}
      >
        {navLabels.next} {isRtl ? "←" : "→"}
      </button>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────
export default function ProgressStepper({
  variant       = "horizontal",   // "horizontal" | "vertical" | "mini"
  current       = 0,
  onStepClick   = () => {},
  onNext        = () => {},
  onPrev        = () => {},
  lang          = "ar",
  completionMap = {},
}: ProgressStepperProps) {
  const steps     = STEPS[lang] ?? STEPS.en;
  const isRtl     = lang === "ar";
  const navLabels = NAV_LABELS[lang] ?? NAV_LABELS.en;

  switch (variant) {
    case "vertical":
      return (
        <VerticalStepper
          steps={steps}
          current={current}
          onStepClick={onStepClick}
          completionMap={completionMap}
          isRtl={isRtl}
        />
      );
    case "mini":
      return (
        <MiniStepper
          steps={steps}
          current={current}
          onNext={onNext}
          onPrev={onPrev}
          isRtl={isRtl}
          navLabels={navLabels}
        />
      );
    default:
      return (
        <HorizontalStepper
          steps={steps}
          current={current}
          onStepClick={onStepClick}
          completionMap={completionMap}
          isRtl={isRtl}
        />
      );
  }
}
