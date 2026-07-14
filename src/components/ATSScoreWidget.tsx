import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DEFAULT_BREAKDOWN } from "../constants";
import { useResumeStore } from "../store/useResumeStore";
import { Sparkles, Check } from "lucide-react";

// ── Role Dictionary for Immediate Keywords ──
const ROLE_KEYWORDS: Record<string, string[]> = {
  "software": ["JavaScript", "TypeScript", "React", "Node.js", "Git", "API", "SQL", "Agile", "Testing", "AWS"],
  "frontend": ["HTML", "CSS", "JavaScript", "React", "Redux", "UI/UX", "Tailwind", "TypeScript", "Webpack"],
  "backend": ["Node.js", "Python", "Java", "SQL", "MongoDB", "Docker", "AWS", "RESTful", "Microservices", "Redis"],
  "designer": ["Figma", "UI/UX", "Wireframing", "Prototyping", "Adobe Creative Suite", "Design Systems", "User Research"],
  "data": ["Python", "SQL", "Machine Learning", "Data Analysis", "Tableau", "Pandas", "Statistics", "R", "Excel"],
  "marketing": ["SEO", "Content Marketing", "Google Analytics", "Social Media", "Copywriting", "Email Campaigns", "CRM"],
  "manager": ["Leadership", "Agile", "Scrum", "Project Planning", "Jira", "Risk Management", "Stakeholder Communication", "Budgeting"],
  "sales": ["CRM", "Negotiation", "B2B", "Lead Generation", "Salesforce", "Communication", "Closing", "Cold Calling"]
};

function getSuggestedKeywords(jobTitle: string = ""): string[] {
  const norm = jobTitle.toLowerCase();
  for (const key in ROLE_KEYWORDS) {
    if (norm.includes(key)) return ROLE_KEYWORDS[key];
  }
  return ["Communication", "Problem Solving", "Teamwork", "Leadership", "Time Management", "Project Management", "Critical Thinking"];
}

// ── i18n ──────────────────────────────────────────────────
const T = {
  ar: {
    title:   "دليل تحسين الـ ATS الذكي",
    done:    (d: number, t: number) => `${d} / ${t} مكتملة`,
    todo:    "نقاط أساسية",
    tipLow:  "أكمل الكلمات المفقودة لرفع تقييمك",
    tipHigh: "سيرتك قوية وجاهزة للفرز",
    missing: "كلمات مفقودة بمجالك (اضغط للإضافة)",
    matched: "مهارات متطابقة",
    labels:  { great: "ممتاز", good: "جيد جداً", avg: "متوسط", weak: "ضعيف" },
  },
  en: {
    title:   "Smart ATS Interactive Guide",
    done:    (d: number, t: number) => `${d} / ${t} complete`,
    todo:    "Core Checks",
    tipLow:  "Add missing keywords to boost your ATS score",
    tipHigh: "Excellent! Your resume is ATS-ready",
    missing: "Missing Industry Keywords (Click to add)",
    matched: "Matched Skills",
    labels:  { great: "Excellent", good: "Good", avg: "Average", weak: "Weak" },
  },
  fr: {
    title:   "Guide Interactif ATS",
    done:    (d: number, t: number) => `${d} / ${t} complétés`,
    todo:    "Vérifications",
    tipLow:  "Ajoutez les mots-clés manquants",
    tipHigh: "Excellent ! Votre CV est prêt",
    missing: "Mots-clés manquants (Cliquez pour ajouter)",
    matched: "Compétences correspondantes",
    labels:  { great: "Excellent", good: "Bien", avg: "Moyen", weak: "Faible" },
  },
};

// ── helpers ───────────────────────────────────────────────
function scoreColor(s: number) {
  if (s >= 80) return { fg: "text-emerald-600", bg: "bg-emerald-500/10 border-emerald-500/20", ring: "#0F6E56", fillBg: "#ecfdf5" };
  if (s >= 50) return { fg: "text-amber-700", bg: "bg-amber-500/10 border-amber-500/20", ring: "#BA7517", fillBg: "#fffbeb" };
  return             { fg: "text-rose-600", bg: "bg-rose-500/10 border-rose-500/20", ring: "#FF4D2D", fillBg: "#fff5f5" };
}

function scoreLabel(s: number, lang: "ar" | "en" | "fr") {
  const l = T[lang]?.labels ?? T.en.labels;
  if (s >= 80) return l.great;
  if (s >= 60) return l.good;
  if (s >= 40) return l.avg;
  return l.weak;
}

function getText(obj: Record<string, string> | string | undefined, lang: "ar" | "en" | "fr") {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] ?? obj.en ?? "";
}

// ── animated ring ─────────────────────────────────────────
function ScoreRing({ score, size = 88 }: { score: number; size?: number }) {
  const [val, setVal] = useState(0);
  const { ring }      = scoreColor(score);
  const R             = (size - 10) / 2;
  const C             = 2 * Math.PI * R;

  useEffect(() => {
    let start: number | null = null;
    const dur = 1000;
    let animId: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p    = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(score * ease));
      if (p < 1) animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [score]);

  const dash = (val / 100) * C;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 select-none">
        <circle cx={size/2} cy={size/2} r={R} fill="none" stroke="#F1EFE8" strokeWidth={6} />
        <motion.circle 
          cx={size/2} 
          cy={size/2} 
          r={R} 
          fill="none" 
          stroke={ring}
          strokeWidth={6} 
          strokeLinecap="round"
          strokeDasharray={`${C} ${C}`}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C - dash }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center font-bold text-center" style={{ color: ring }}>
        <span className="text-lg leading-none font-black">{val}%</span>
      </div>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────
export default function ATSScoreWidget({
  score,
  breakdown = DEFAULT_BREAKDOWN,
  lang      = "ar",
  variant   = "default",
}: {
  score?: number;
  breakdown?: Record<string, unknown>[];
  lang?: "ar" | "en" | "fr";
  variant?: "default" | "heart";
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const t = T[lang] ?? T.en;
  const isRtl = lang === "ar";
  
  const { data } = useResumeStore();
  const currentSkills = data.skills?.map(s => s.toLowerCase().trim()) || [];
  const jobTitle = data.personalInfo?.jobTitle || "";
  
  const suggested = getSuggestedKeywords(jobTitle);
  const matched = suggested.filter(kw => currentSkills.includes(kw.toLowerCase()));

  // Dynamic score based on matched keywords + structural checklist
  const doneChecklist = breakdown.filter(b => b.done).length;
  const totalChecklist = breakdown.length;
  const keywordScore = suggested.length > 0 ? (matched.length / suggested.length) * 50 : 50;
  const structScore = totalChecklist > 0 ? (doneChecklist / totalChecklist) * 50 : 50;
  const activeScore = score !== undefined ? score : Math.min(100, Math.round(keywordScore + structScore));
  
  const displayScore = activeScore === 0 ? "--" : activeScore;
  const { fg, bg, ring } = scoreColor(activeScore);

  // Celebratory Faux-Confetti Gamification Effect
  interface ConfettiParticle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    duration: number;
    rotation: number;
  }
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);
  const lastScoreRef = useRef(activeScore);

  useEffect(() => {
    if (activeScore >= 85 && lastScoreRef.current < 85) {
      const colors = ["#FF4D2D", "#F59E0B", "#10B981", "#3B82F6", "#EC4899", "#8B5CF6"];
      const particles: ConfettiParticle[] = Array.from({ length: 35 }).map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 160,
        y: -40 - Math.random() * 120,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 6,
        duration: Math.random() * 1.6 + 1.2,
        rotation: Math.random() * 360,
      }));
      setConfetti(particles);
      const timer = setTimeout(() => {
        setConfetti([]);
      }, 3200);
      return () => clearTimeout(timer);
    }
    lastScoreRef.current = activeScore;
  }, [activeScore]);

  useEffect(() => {
    const h = (e: MouseEvent) => { 
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={wrapRef} className="relative inline-block" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      {/* Confetti Explosion */}
      {confetti.map((c) => (
        <motion.span
          key={c.id}
          className="absolute pointer-events-none z-[9999]"
          initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
          animate={{ 
            x: c.x, 
            y: c.y, 
            scale: [0, 1, 1, 0],
            rotate: c.rotation + 360,
          }}
          transition={{
            duration: c.duration,
            ease: "easeOut",
          }}
          style={{
            backgroundColor: c.color,
            width: c.size,
            height: c.size,
            borderRadius: Math.random() > 0.5 ? "50%" : "3px",
            top: "50%",
            left: "50%",
            marginTop: -c.size / 2,
            marginLeft: -c.size / 2,
          }}
        />
      ))}

      {variant === "heart" ? (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(o => !o)}
          title={t.title}
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer text-slate-500 hover:bg-slate-100/80 hover:text-black ${open ? "bg-slate-100 text-black" : ""}`}
        >
          <Sparkles className={`w-5.5 h-5.5 transition-colors ${open ? "fill-amber-400 stroke-amber-500 text-amber-500" : "fill-none text-slate-500"}`} />
          <span className="absolute -top-1 -right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-slate-950 border border-white text-white min-w-[18px] text-center leading-none shadow-sm scale-90">
            {displayScore}
          </span>
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpen(o => !o)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold leading-none cursor-pointer transition-colors shadow-xs ${fg} ${bg}`}
        >
          <Sparkles size={12} className="opacity-70" />
          ATS {displayScore}%
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className={`absolute top-full mt-2.5 w-[340px] bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden z-[1100] ${variant === "heart" ? "left-1/2 -translate-x-1/2" : (isRtl ? "right-0" : "left-0")}`}
          >
            <div className="p-5 border-b border-slate-100 flex items-center gap-4 bg-gradient-to-b from-slate-50/50 to-white">
              <ScoreRing score={activeScore} size={80} />
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{t.title}</div>
                <div className="text-xl font-black mt-0.5" style={{ color: ring }}>
                  {scoreLabel(activeScore, lang)}
                </div>
                <div className="text-xs text-slate-500 font-semibold mt-1">
                  {t.done(doneChecklist + matched.length, totalChecklist + suggested.length)}
                </div>
              </div>
            </div>

            <div className="h-1 bg-slate-100 w-full relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${activeScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full"
                style={{ backgroundColor: ring }}
              />
            </div>

            <div className="p-5 max-h-[290px] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
              
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">{t.todo}</span>
                {breakdown.map((item, i) => (
                  <motion.div 
                    key={i} 
                    className={`flex items-start gap-2.5 p-2 rounded-xl transition-all ${item.done ? "opacity-60" : "bg-slate-50/50"}`}
                  >
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-white ${item.done ? "bg-emerald-500 border-emerald-500" : "border-slate-300"}`}>
                      {item.done && <Check size={10} strokeWidth={4} />}
                    </span>
                    <div>
                      <div className={`text-xs font-semibold ${item.done ? "line-through text-slate-500" : "text-slate-700"}`}>
                        {getText(item.label, lang)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
