import React from "react";
import { cn } from "../../lib/utils";
import {
  User,
  Briefcase,
  GraduationCap,
  Star,
  Rocket,
  Award,
  Plus,
  FileText,
  Download,
  Check,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────
type Locale = "ar" | "en" | "fr";
type Variant = "horizontal" | "vertical" | "mini";

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

const STEP_ICONS: Record<string, React.ElementType> = {
  basics: User,
  experience: Briefcase,
  education: GraduationCap,
  skills: Star,
  projects: Rocket,
  certifications: Award,
  custom: Plus,
  "cover-letter": FileText,
  finish: Download,
};

// ── Steps definition ──────────────────────────────────────
const STEPS: Record<Locale, Step[]> = {
  ar: [
    { id: "basics",         label: "البيانات الأساسية",  shortLabel: "البيانات",  emoji: "👤" },
    { id: "experience",     label: "الخبرات المهنية",   shortLabel: "الخبرات",   emoji: "💼" },
    { id: "education",      label: "التعليم والدراسة",   shortLabel: "التعليم",   emoji: "🎓" },
    { id: "skills",         label: "المهارات والقدرات",  shortLabel: "المهارات",  emoji: "⭐" },
    { id: "projects",       label: "المشاريع المنجزة",  shortLabel: "المشاريع",  emoji: "🚀" },
    { id: "certifications", label: "الشهادات والجوائز",  shortLabel: "الشهادات",  emoji: "🏅" },
    { id: "custom",         label: "أقسام مخصصة",    shortLabel: "إضافات",    emoji: "➕" },
    { id: "cover-letter",   label: "خطاب التغطية (AI)", shortLabel: "الخطاب",    emoji: "📝" },
    { id: "finish",          label: "التدقيق والتحميل",     shortLabel: "تحميل",     emoji: "📄" },
  ],
  en: [
    { id: "basics",         label: "Personal Info",      shortLabel: "Basics",  emoji: "👤" },
    { id: "experience",     label: "Work Experience",  shortLabel: "Exp",     emoji: "💼" },
    { id: "education",      label: "Education",   shortLabel: "Edu",     emoji: "🎓" },
    { id: "skills",         label: "Skills & Stack",      shortLabel: "Skills",  emoji: "⭐" },
    { id: "projects",       label: "Key Projects",    shortLabel: "Proj",    emoji: "🚀" },
    { id: "certifications", label: "Certifications",       shortLabel: "Certs",   emoji: "🏅" },
    { id: "custom",         label: "Custom Sections",      shortLabel: "Custom",  emoji: "➕" },
    { id: "cover-letter",   label: "Cover Letter",       shortLabel: "Cover",   emoji: "📝" },
    { id: "finish",          label: "Download Resume",    shortLabel: "Done",    emoji: "📄" },
  ],
  fr: [
    { id: "basics",         label: "Infos Personnelles",       shortLabel: "Infos",   emoji: "👤" },
    { id: "experience",     label: "Expérience Pro",  shortLabel: "Exp",     emoji: "💼" },
    { id: "education",      label: "Formation et Études",   shortLabel: "Form",    emoji: "🎓" },
    { id: "skills",         label: "Compétences", shortLabel: "Comp",    emoji: "⭐" },
    { id: "projects",       label: "Projets Clés",     shortLabel: "Proj",    emoji: "🚀" },
    { id: "certifications", label: "Certifications",     shortLabel: "Cert",    emoji: "🏅" },
    { id: "custom",         label: "Sections Custom",      shortLabel: "Custom",  emoji: "➕" },
    { id: "cover-letter",   label: "Lettre de Motivation",      shortLabel: "Lett",    emoji: "📝" },
    { id: "finish",          label: "Téléchargement", shortLabel: "Fin",     emoji: "📄" },
  ],
};

const NAV_LABELS: Record<Locale, { next: string; prev: string }> = {
  ar: { next: "التالي", prev: "السابق" },
  en: { next: "Next",   prev: "Back"   },
  fr: { next: "Suivant",prev: "Retour" },
};

// ── Step Node with Circular Completion SVG Ring ────────────
interface NodeProps {
  index: number;
  id: string;
  isActive: boolean;
  isDone: boolean;
  completion: number;
  onClick?: () => void;
  size?: number;
}

function ProgressNode({ index, id, isActive, isDone, completion, onClick, size = 32 }: NodeProps) {
  const Icon = STEP_ICONS[id];
  
  // Outer circle circumference for SVG indicator: 2 * pi * r. Let's use radius = 14 for a 32px box
  const radius = 14;
  const strokeWidth = 2.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completion / 100) * circumference;

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "relative flex items-center justify-center rounded-full transition-all duration-300 shrink-0 select-none group focus:outline-hidden",
        isActive 
          ? "scale-110 shadow-lg shadow-brand-500/15" 
          : "hover:scale-105"
      )}
      style={{ width: size, height: size }}
    >
      {/* Background ring for completion percentage */}
      {completion > 0 && completion < 100 && (
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform-gpu pointer-events-none" viewBox="0 0 32 32">
          {/* Base track */}
          <circle 
            cx="16" cy="16" r={radius} 
            fill="transparent" 
            stroke="var(--color-neutral-200)" 
            strokeWidth={strokeWidth} 
          />
          {/* Progress circle */}
          <circle 
            cx="16" cy="16" r={radius} 
            fill="transparent" 
            stroke="var(--color-brand-500)" 
            strokeWidth={strokeWidth} 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
      )}

      {/* Main Core Node */}
      <div 
        className={cn(
          "w-full h-full rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300",
          isDone || completion === 100
            ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
            : isActive
              ? "bg-brand-500 border-brand-500 text-white shadow- brand-500/20"
              : "bg-white border-neutral-200 text-neutral-500 group-hover:border-neutral-450 group-hover:text-neutral-800"
        )}
      >
        {isDone || completion === 100 ? (
          <Check size={13} className="stroke-[3]" />
        ) : Icon ? (
          <Icon size={12} className="stroke-[2.5]" />
        ) : (
          index + 1
        )}
      </div>

      {/* Mini state tooltip */}
      <div className="absolute top-full mt-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
        <div className="bg-neutral-900 text-white text-[10px] px-2 py-1 rounded-md font-black shadow-lg whitespace-nowrap">
          {completion}%
        </div>
      </div>
    </button>
  );
}

// ── HORIZONTAL variant (desktop top bar) ──────────────────
function HorizontalStepper({ 
  steps, 
  current, 
  onStepClick, 
  completionMap, 
  isRtl 
}: { 
  steps: Step[]; 
  current: number; 
  onStepClick?: (i: number) => void; 
  completionMap: Record<string, number>; 
  isRtl: boolean; 
}) {
  return (
    <div 
      className={cn(
        "flex items-center gap-1.5 p-4 sm:p-5 bg-neutral-50/50 border-b border-neutral-200 overflow-x-auto scrollbar-none scroll-smooth",
        isRtl ? "rtl" : "ltr"
      )}
    >
      {steps.map((step, i) => {
        const isActive = i === current;
        const isDone = i < current;
        const completion = completionMap[step.id] ?? 0;

        return (
          <div key={step.id} className="flex items-center flex-1 min-w-0 last:flex-none">
            {/* Node + Label */}
            <div className="flex items-center gap-2.5 px-1.5 py-1">
              <ProgressNode 
                index={i} 
                id={step.id} 
                isActive={isActive} 
                isDone={isDone} 
                completion={completion} 
                onClick={() => onStepClick?.(i)} 
              />
              <span 
                className={cn(
                  "text-[11px] font-bold tracking-tight whitespace-nowrap transition-colors duration-200",
                  isActive 
                    ? "text-brand-500 font-extrabold" 
                    : isDone || completion === 100
                      ? "text-emerald-700" 
                      : "text-neutral-500"
                )}
              >
                {step.shortLabel}
                {completion > 0 && completion < 100 && (
                  <span className="text-[9px] text-neutral-400 font-normal ms-1">({completion}%)</span>
                )}
              </span>
            </div>

            {/* Connecting line */}
            {i < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 min-w-[12px] bg-neutral-200 rounded-full overflow-hidden shrink-0">
                <div 
                  className={cn(
                    "h-full transition-all duration-500",
                    isDone || completion === 100
                      ? "bg-emerald-600 w-full" 
                      : isActive 
                        ? "bg-gradient-to-r from-brand-500 to-neutral-200 w-1/2" 
                        : "bg-transparent w-0"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── VERTICAL variant (desktop left sidebar) ───────────────
function VerticalStepper({ 
  steps, 
  current, 
  onStepClick, 
  completionMap, 
  isRtl 
}: { 
  steps: Step[]; 
  current: number; 
  onStepClick?: (i: number) => void; 
  completionMap: Record<string, number>; 
  isRtl: boolean; 
}) {
  return (
    <div className={cn("flex flex-col gap-1 p-3 w-full", isRtl ? "rtl" : "ltr")}>
      {steps.map((step, i) => {
        const isActive = i === current;
        const isDone = i < current;
        const isLast = i === steps.length - 1;
        const completion = completionMap[step.id] ?? 0;

        return (
          <div key={step.id} className="flex flex-col w-full">
            <div className="flex items-center gap-3 w-full">
              {/* Node container with vertical connector embedded */}
              <div className="flex flex-col items-center shrink-0">
                <ProgressNode 
                  index={i} 
                  id={step.id} 
                  isActive={isActive} 
                  isDone={isDone} 
                  completion={completion} 
                  onClick={() => onStepClick?.(i)} 
                  size={30}
                />
              </div>

              {/* Label Info Card */}
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                className={cn(
                  "flex-1 flex items-center justify-between text-start p-2 rounded-xl border transition-all duration-200 select-none cursor-pointer focus:outline-hidden",
                  isActive
                    ? "bg-brand-50/50 border-brand-500/25 shadow-xs"
                    : "bg-transparent border-transparent hover:bg-neutral-100/70"
                )}
              >
                <div className="flex flex-col text-start">
                  <span 
                    className={cn(
                      "text-xs font-bold leading-tight",
                      isActive 
                        ? "text-brand-500 font-extrabold" 
                        : isDone || completion === 100
                          ? "text-emerald-700" 
                          : "text-neutral-700"
                    )}
                  >
                    {step.label}
                  </span>
                  
                  {/* Subtle checklist stat helper */}
                  {completion > 0 && (
                    <span className="text-[9px] font-semibold text-neutral-400 mt-0.5">
                      {completion === 100 ? (isRtl ? "مكتملة بالكامل" : "Completely Done") : `${completion}% ${isRtl ? "مكتمل" : "completed"}`}
                    </span>
                  )}
                </div>

                {completion === 100 && (
                  <Check size={14} className="text-emerald-600 shrink-0" />
                )}
              </button>
            </div>

            {/* Connecting line spacer */}
            {!isLast && (
              <div className={cn("h-4 w-[2px] my-0.5", isRtl ? "mr-[14px]" : "ml-[14px]", isDone || completion === 100 ? "bg-emerald-600/30" : "bg-neutral-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── MINI variant (mobile bottom controller bar) ───────────
function MiniStepper({ 
  steps, 
  current, 
  onNext, 
  onPrev, 
  isRtl, 
  navLabels,
  completionMap
}: { 
  steps: Step[]; 
  current: number; 
  onNext: () => void; 
  onPrev: () => void; 
  isRtl: boolean; 
  navLabels: { next: string; prev: string };
  completionMap: Record<string, number>;
}) {
  const safeCurrent = Math.max(0, Math.min(current, steps.length - 1));
  const step = steps[safeCurrent];
  const progress = ((safeCurrent + 1) / steps.length) * 100;
  const canNext = safeCurrent < steps.length - 1;
  const canPrev = safeCurrent > 0;
  const completion = completionMap[step.id] ?? 0;

  const Icon = STEP_ICONS[step.id];

  return (
    <div className={cn("flex items-center gap-3.5 w-full", isRtl ? "rtl" : "ltr")}>
      {/* Back button */}
      <button
        onClick={onPrev}
        disabled={!canPrev}
        type="button"
        className={cn(
          "w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-150 select-none shrink-0",
          canPrev 
            ? "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 active:scale-95" 
            : "border-neutral-150 bg-neutral-100 text-neutral-300 cursor-not-allowed"
        )}
      >
        <span className="text-sm font-black">{isRtl ? "←" : "→"}</span>
      </button>

      {/* Center text description with progress */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-black text-neutral-900 flex items-center gap-1.5 truncate">
            {Icon && <Icon size={12} className="text-brand-500 shrink-0" />}
            <span className="truncate">{step.label}</span>
            {completion > 0 && (
              <span className="text-[10px] text-emerald-600 font-extrabold shrink-0">({completion}%)</span>
            )}
          </span>
          <span className="text-[10px] text-neutral-450 font-black font-mono select-none shrink-0">
            {safeCurrent + 1} / {steps.length}
          </span>
        </div>

        {/* Dynamic single visual slider */}
        <div className="h-1.5 bg-neutral-150 rounded-full overflow-hidden shrink-0">
          <div 
            className="h-full rounded-full bg-brand-500 transition-all duration-500 ease-out"
            style={{ 
              width: `${progress}%`,
              float: isRtl ? "right" : "left"
            }} 
          />
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={!canNext}
        type="button"
        className={cn(
          "h-9 px-4.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer font-bold text-xs select-none transition-all duration-150 shrink-0 border-none",
          canNext 
            ? "bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95" 
            : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
        )}
      >
        <span>{navLabels.next}</span>
        <span className="text-[10px] font-black">{isRtl ? "→" : "←"}</span>
      </button>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────
export default function ProgressStepper({
  variant = "horizontal",
  current = 0,
  onStepClick = () => {},
  onNext = () => {},
  onPrev = () => {},
  lang = "ar",
  completionMap = {},
}: ProgressStepperProps) {
  const steps = STEPS[lang] ?? STEPS.en;
  const isRtl = lang === "ar";
  const navLabels = NAV_LABELS[lang] ?? NAV_LABELS.en;
  const safeCurrent = Math.max(0, Math.min(current, steps.length - 1));

  switch (variant) {
    case "vertical":
      return (
        <VerticalStepper
          steps={steps}
          current={safeCurrent}
          onStepClick={onStepClick}
          completionMap={completionMap}
          isRtl={isRtl}
        />
      );
    case "mini":
      return (
        <MiniStepper
          steps={steps}
          current={safeCurrent}
          onNext={onNext}
          onPrev={onPrev}
          isRtl={isRtl}
          navLabels={navLabels}
          completionMap={completionMap}
        />
      );
    default:
      return (
        <HorizontalStepper
          steps={steps}
          current={safeCurrent}
          onStepClick={onStepClick}
          completionMap={completionMap}
          isRtl={isRtl}
        />
      );
  }
}
