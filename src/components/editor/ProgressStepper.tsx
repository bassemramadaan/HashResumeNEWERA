import React from "react";
import { cn } from "../../lib/utils";
import {
  User,
  Briefcase,
  GraduationCap,
  Star,
  Rocket,
  Award,
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
          ? "scale-110 shadow-lg shadow-slate-900/10" 
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
          completion === 100
            ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
            : isDone && completion === 0
              ? "bg-emerald-50/70 border-emerald-250 text-emerald-600"
              : isDone && completion > 0
                ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold"
                : isActive
                  ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-white border-neutral-200 text-neutral-500 group-hover:border-neutral-450 group-hover:text-neutral-800"
        )}
      >
        {completion === 100 ? (
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
        "flex items-center justify-between gap-2 p-1.5 bg-[#ffffff]/85 backdrop-blur-md rounded-full border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-x-auto scrollbar-none scroll-smooth w-full",
        isRtl ? "rtl" : "ltr"
      )}
    >
      {steps.map((step, i) => {
        const isActive = i === current;
        const completion = completionMap[step.id] ?? 0;
        const isDone = completion === 100 || (i < current);
        const Icon = STEP_ICONS[step.id];

        return (
          <button
            key={step.id}
            data-tour={step.id === "basics" ? "personal-info" : step.id === "experience" ? "experience-section" : step.id === "skills" ? "skills-section" : step.id === "finish" ? "review-section" : undefined}
            onClick={() => onStepClick?.(i)}
            type="button"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all relative shrink-0 cursor-pointer border select-none transformactive active:scale-[0.98]",
              isActive 
                ? "bg-slate-900 border-slate-900 text-white shadow-sm font-black" 
                : isDone
                  ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10" 
                  : "bg-transparent border-transparent text-slate-550 hover:bg-slate-100/70 hover:text-slate-800"
            )}
          >
            {/* Left element: Done checkmark or step Icon */}
            <div className="flex items-center justify-center shrink-0">
              {isDone ? (
                <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center scale-102">
                  <Check size={11} className="stroke-[3.5]" />
                </div>
              ) : Icon ? (
                <Icon size={14} className={cn("stroke-[2.5]", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
              ) : null}
            </div>

            {/* Stepper shortLabel */}
            <span className="leading-none whitespace-nowrap">
              {step.shortLabel}
            </span>

            {/* Micro completion percent inside a clean, small badge */}
            {completion > 0 && completion < 100 && !isActive && (
              <span className="text-[9px] px-1 py-0.5 rounded-md bg-amber-500/10 text-amber-600 font-extrabold leading-none scale-90">
                {completion}%
              </span>
            )}
          </button>
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
                data-tour={step.id === "basics" ? "personal-info" : step.id === "experience" ? "experience-section" : step.id === "skills" ? "skills-section" : step.id === "finish" ? "review-section" : undefined}
                onClick={() => onStepClick?.(i)}
                 className={cn(
                  "flex-1 flex items-center justify-between text-start px-3 py-2 rounded-xl border transition-all duration-200 select-none cursor-pointer focus:outline-hidden group",
                  isActive
                    ? "bg-[#FFF7F5] border-y-transparent border-l-transparent border-r-2 border-r-[#FF4D2D] rounded-r-none rounded-l-xl shadow-2xs"
                    : "bg-transparent border-transparent hover:bg-neutral-100/70"
                )}
              >
                <div className="flex flex-col text-start">
                  <span 
                    className={cn(
                      "text-[13px] leading-tight transition-colors duration-200",
                      isActive 
                        ? "text-[#001639] font-bold" 
                        : "text-[#6B7280] group-hover:text-[#001639] font-medium"
                    )}
                  >
                    {step.label}
                  </span>
                  
                  {/* Subtle checklist stat helper */}
                  {completion > 0 ? (
                    <span className="text-[9px] font-semibold text-neutral-400 mt-0.5">
                      {completion === 100 ? (isRtl ? "مكتملة بالكامل" : "Completely Done") : `${completion}% ${isRtl ? "مكتمل" : "completed"}`}
                    </span>
                  ) : isDone ? (
                    <span className="text-[9px] font-medium text-slate-400 mt-0.5 italic">
                      {isRtl ? "تمت زيارة القسم" : "Section Visited"}
                    </span>
                  ) : null}
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
