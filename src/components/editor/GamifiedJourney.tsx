import React from "react";
import { motion } from "motion/react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { useResumeValidation } from "../../hooks/editor/useResumeValidation";
import { Award, Check, Lock, Star, Shield, Trophy, Flame, Play } from "lucide-react";

// Definitions of the 5 Master Badges
interface Badge {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  minScore: number;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  glowColor: string;
}

const BADGES: Badge[] = [
  {
    id: "bronze",
    nameAr: "🥉 المكتشف المبتدئ",
    nameEn: "🥉 Initiated Explorer",
    descAr: "تم تأسيس البيانات الأساسية وبدء رحلة التوظيف بنجاح!",
    descEn: "Basic data established and your job search journey has begun!",
    minScore: 20,
    icon: Shield,
    color: "bg-amber-600",
    borderColor: "border-amber-550",
    glowColor: "shadow-amber-500/35",
  },
  {
    id: "silver",
    nameAr: "🥈 الحرفي المهني",
    nameEn: "🥈 Professional Craftsman",
    descAr: "الملخص والتعليم مضافان بعناية. بدأت الملامح المهنية تتضح!",
    descEn: "Summary and Education added. Professional profile is taking shape!",
    minScore: 50,
    icon: Flame,
    color: "bg-slate-400",
    borderColor: "border-slate-500",
    glowColor: "shadow-slate-400/35",
  },
  {
    id: "gold",
    nameAr: "🥇 القائد الاستراتيجي",
    nameEn: "🥇 Strategic Leader",
    descAr: "خبرات عملية قوية وموثقة ترفع فرص قبولك بنسبة كبيرة!",
    descEn: "Solid and documented work experience boosts your odds significantly!",
    minScore: 75,
    icon: Award,
    color: "bg-amber-550",
    borderColor: "border-amber-600",
    glowColor: "shadow-amber-500/40",
  },
  {
    id: "diamond",
    nameAr: "💎 بطل الـ ATS الخارق",
    nameEn: "💎 ATS Superhero",
    descAr: "أداء مذهل! سيرتك تخترق أنظمة التوظيف وتبرز بامتياز.",
    descEn: "Superb! Your resume easily parses through applicant tracking systems.",
    minScore: 85,
    icon: Star,
    color: "bg-indigo-650",
    borderColor: "border-indigo-600",
    glowColor: "shadow-indigo-500/40",
  },
  {
    id: "royal",
    nameAr: "👑 التاج الملكي: السيرة المثالية",
    nameEn: "👑 Royal Complete CV",
    descAr: "سيرة مكتملة ومثالية وخالية من العيوب جاهزة للاكتساح والتقديم!",
    descEn: "Complete, flawless, premium resume ready to land top job offers!",
    minScore: 95,
    icon: Trophy,
    color: "bg-amber-500",
    borderColor: "border-yellow-500",
    glowColor: "shadow-yellow-500/50",
  },
];

// Steps for the interactive journey path
interface JourneyStep {
  id: string;
  labelAr: string;
  labelEn: string;
  x: number; // SVG center coordinate
  y: number;
}

const JOURNEY_STEPS: JourneyStep[] = [
  { id: "basics", labelAr: "البيانات", labelEn: "Basics", x: 40, y: 50 },
  { id: "education", labelAr: "التعليم", labelEn: "Education", x: 140, y: 50 },
  { id: "skills", labelAr: "المهارات", labelEn: "Skills", x: 240, y: 80 },
  { id: "experience", labelAr: "الخبرات", labelEn: "Experience", x: 200, y: 160 },
  { id: "projects", labelAr: "المشاريع", labelEn: "Projects", x: 100, y: 160 },
  { id: "certifications", labelAr: "الشهادات", labelEn: "Certs", x: 40, y: 240 },
  { id: "finish", labelAr: "التنزيل", labelEn: "Finish", x: 140, y: 240 },
];

export default function GamifiedJourney() {
  const data = useResumeStore((state) => state.data);
  const { language } = useLanguageStore();
  const { atsScore } = useResumeValidation(data);
  const isRtl = language === "ar";

  // Calculate completeness for each step id
  const completionMap: Record<string, boolean> = {
    basics: !!(data.personalInfo.fullName && data.personalInfo.email && data.personalInfo.phone),
    education: data.education && data.education.length > 0,
    skills: data.skills && data.skills.length >= 3,
    experience: data.experience && data.experience.length > 0,
    projects: data.projects && data.projects.length > 0,
    certifications: data.certifications && data.certifications.length > 0,
    finish: atsScore >= 80,
  };

  // Determine current active and unlocked badges
  const activeBadge = [...BADGES]
    .reverse()
    .find((badge) => atsScore >= badge.minScore) || BADGES[0];

  const handleStepClick = (stepId: string) => {
    // Dispatch custom event to switch the active tab in EditorPage
    const event = new CustomEvent("preview-section-clicked", {
      detail: { tab: stepId, field: stepId },
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="space-y-6 font-sans select-none text-slate-800" dir={isRtl ? "rtl" : "ltr"}>
      {/* 1. Header with Current Active Badge & Level */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 relative overflow-hidden shadow-xl flex flex-col items-center text-center">
        {/* Subtle background glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-brand-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-brand-500/10 rounded-full blur-xl pointer-events-none" />

        {/* Floating pulse circle */}
        <div className="relative mb-3 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute w-16 h-16 rounded-full bg-brand-500/30 blur-md ${activeBadge.glowColor}`}
          />
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white border-2 relative z-10 ${activeBadge.color} ${activeBadge.borderColor}`}>
            <activeBadge.icon size={22} className="stroke-[2.5]" />
          </div>
        </div>

        <h3 className="font-extrabold text-sm tracking-tight text-white mb-1">
          {isRtl ? activeBadge.nameAr : activeBadge.nameEn}
        </h3>
        <p className="text-[10px] text-slate-300 leading-relaxed font-semibold max-w-[240px]">
          {isRtl ? activeBadge.descAr : activeBadge.descEn}
        </p>

        {/* Progress gauge for next badge */}
        {(() => {
          const nextBadge = BADGES.find((b) => b.minScore > atsScore);
          if (!nextBadge) {
            return (
              <span className="text-[9px] bg-yellow-500/20 text-yellow-400 font-extrabold px-2.5 py-1 rounded-full mt-3 uppercase tracking-wider animate-pulse">
                👑 {isRtl ? "أنت في أعلى رتبة ممكنة!" : "You achieved Royal status!"}
              </span>
            );
          }
          const currentBadgeMin = activeBadge.minScore;
          const nextBadgeMin = nextBadge.minScore;
          const progressPercent = Math.min(
            100,
            Math.max(0, ((atsScore - currentBadgeMin) / (nextBadgeMin - currentBadgeMin)) * 100)
          );

          return (
            <div className="w-full mt-4 space-y-1.5 pt-3 border-t border-slate-800/60">
              <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-wider">
                <span>{isRtl ? "الرتبة القادمة:" : "Next Rank:"} {isRtl ? nextBadge.nameAr : nextBadge.nameEn}</span>
                <span>{atsScore} / {nextBadgeMin}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          );
        })()}
      </div>

      {/* 2. Interactive SVG Journey Path Map */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col items-center">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 self-start">
          🧭 {isRtl ? "مسار خريطة الإنجاز" : "Journey Trail Map"}
        </h4>

        <div className="relative w-full aspect-[280/300] max-w-[280px]">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 280 300">
            {/* Defs for gradients */}
            <defs>
              <linearGradient id="glow-line" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4D2D" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Connecting lines */}
            {JOURNEY_STEPS.map((step, idx) => {
              if (idx === JOURNEY_STEPS.length - 1) return null;
              const nextStep = JOURNEY_STEPS[idx + 1];
              const isLineDone = completionMap[step.id];

              return (
                <g key={`line-${idx}`}>
                  {/* Background shadow line */}
                  <line
                    x1={step.x}
                    y1={step.y}
                    x2={nextStep.x}
                    y2={nextStep.y}
                    stroke="#E2E8F0"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Glowing active line */}
                  {isLineDone && (
                    <motion.line
                      initial={{ strokeDasharray: "100", strokeDashoffset: "100" }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 1 }}
                      x1={step.x}
                      y1={step.y}
                      x2={nextStep.x}
                      y2={nextStep.y}
                      stroke={atsScore >= 80 ? "url(#glow-line)" : "#10B981"}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  )}
                </g>
              );
            })}

            {/* Render Nodes */}
            {JOURNEY_STEPS.map((step, idx) => {
              const isCompleted = completionMap[step.id];
              const isBasicsDone = completionMap.basics;
              const isLocked = idx > 0 && !isBasicsDone; // Lock other nodes until basics are completed

              return (
                <g
                  key={step.id}
                  className="cursor-pointer group"
                  onClick={() => !isLocked && handleStepClick(step.id)}
                >
                  {/* Node pulse effect if completed or active */}
                  {isCompleted && !isLocked && (
                    <circle
                      cx={step.x}
                      cy={step.y}
                      r="16"
                      fill="transparent"
                      stroke="#10B981"
                      strokeWidth="2"
                      className="animate-ping opacity-25"
                      style={{ transformOrigin: `${step.x}px ${step.y}px` }}
                    />
                  )}

                  {/* Node outer circle */}
                  <circle
                    cx={step.x}
                    cy={step.y}
                    r="12"
                    fill={isLocked ? "#F1F5F9" : isCompleted ? "#10B981" : "#FFFFFF"}
                    stroke={isLocked ? "#CBD5E1" : isCompleted ? "#10B981" : "#FF4D2D"}
                    strokeWidth="3"
                    className="transition-colors duration-300 group-hover:scale-110"
                    style={{ transformOrigin: `${step.x}px ${step.y}px` }}
                  />

                  {/* Inside node icon/content */}
                  {isLocked ? (
                    <g transform={`translate(${step.x - 5}, ${step.y - 5})`}>
                      <Lock size={10} className="text-slate-400" />
                    </g>
                  ) : isCompleted ? (
                    <g transform={`translate(${step.x - 5}, ${step.y - 5})`}>
                      <Check size={10} className="text-white stroke-[3.5]" />
                    </g>
                  ) : (
                    <g transform={`translate(${step.x - 4}, ${step.y - 4.5})`}>
                      <Play size={8} className="fill-brand-500 text-brand-500" />
                    </g>
                  )}

                  {/* Label Text */}
                  <text
                    x={step.x}
                    y={step.y + 24}
                    textAnchor="middle"
                    className={`text-[9px] font-black ${
                      isLocked
                        ? "fill-slate-400"
                        : isCompleted
                        ? "fill-emerald-600 font-bold"
                        : "fill-brand-600 font-extrabold"
                    }`}
                  >
                    {isRtl ? step.labelAr : step.labelEn}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Small legend */}
        <div className="flex justify-center gap-4 mt-2 text-[9px] font-bold text-slate-500 border-t border-slate-100 pt-3 w-full">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>{isRtl ? "مكتمل" : "Completed"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-brand-500 bg-white" />
            <span>{isRtl ? "جاهز للبناء" : "In Progress"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[6px] text-slate-400 font-black">🔒</span>
            <span>{isRtl ? "مغلق" : "Locked"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
