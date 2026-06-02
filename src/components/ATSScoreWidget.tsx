import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DEFAULT_BREAKDOWN } from "../constants";

// ── i18n ──────────────────────────────────────────────────
const T = {
  ar: {
    title:   "درجة الـ ATS",
    done:    (d: number, t: number) => `${d} / ${t} عناصر مكتملة`,
    todo:    "اللي محتاج تكمله",
    tipLow:  "اكمل كل العناصر وسيرتك هتبقى جاهزة لـ 95% من أنظمة الفلترة",
    tipHigh: "سيرتك ممتازة وجاهزة لأنظمة ATS",
    labels:  { great: "ممتاز", good: "كويس", avg: "متوسط", weak: "ضعيف" },
  },
  en: {
    title:   "ATS Score",
    done:    (d: number, t: number) => `${d} / ${t} items complete`,
    todo:    "What to complete",
    tipLow:  "Complete all items and your resume will pass 95% of ATS filters",
    tipHigh: "Great job! Your resume is ATS-ready",
    labels:  { great: "Excellent", good: "Good", avg: "Average", weak: "Weak" },
  },
  fr: {
    title:   "Score ATS",
    done:    (d: number, t: number) => `${d} / ${t} éléments complétés`,
    todo:    "Ce qu'il faut compléter",
    tipLow:  "Complétez tous les éléments pour passer 95% des filtres ATS",
    tipHigh: "Excellent ! Votre CV est prêt pour les ATS",
    labels:  { great: "Excellent", good: "Bien", avg: "Moyen", weak: "Faible" },
  },
};

// ── default breakdown imported from constants ───────────

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

function getText(obj: any, lang: "ar" | "en" | "fr") {
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
      const ease = 1 - Math.pow(1 - p, 3); // Cubic Out
      setVal(Math.round(score * ease));
      if (p < 1) {
        animId = requestAnimationFrame(step);
      }
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [score]);

  const dash = (val / 100) * C;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 select-none">
        {/* Background circle */}
        <circle cx={size/2} cy={size/2} r={R} fill="none" stroke="#F1EFE8" strokeWidth={6} />
        {/* Foreground circle with animation */}
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
      {/* Centered Percentage */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center font-bold text-center"
        style={{ color: ring }}
      >
        <span className="text-lg leading-none font-black">{val}%</span>
      </div>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────
export default function ATSScoreWidget({
  score     = 0,
  breakdown = DEFAULT_BREAKDOWN,
  lang      = "ar",
  variant   = "default",
}: {
  score?: number;
  breakdown?: any[];
  lang?: "ar" | "en" | "fr";
  variant?: "default" | "heart";
}) {
  const [open, setOpen] = useState(false);
  const wrapRef         = useRef<HTMLDivElement>(null);
  const t               = T[lang] ?? T.en;
  const { fg, bg, ring, fillBg } = scoreColor(score);
  const isRtl           = lang === "ar";
  const done            = breakdown.filter(b => b.done).length;
  const total           = breakdown.length;

  // close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => { 
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={wrapRef} className="relative inline-block" style={{ direction: isRtl ? "rtl" : "ltr" }}>

      {variant === "heart" ? (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(o => !o)}
          title={lang === "ar" ? "درجة الـ ATS والجاهزية" : "ATS Score & Readiness"}
          aria-expanded={open}
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer text-slate-500 hover:bg-slate-100/80 hover:text-black ${
            open ? "bg-slate-100 text-black" : ""
          }`}
        >
          <svg
            className={`w-5.5 h-5.5 transition-colors ${open ? "fill-black stroke-black text-black" : "fill-none"}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          {/* High contrast Threads style notification badge */}
          <span className="absolute -top-1 -right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-slate-950 border border-white text-white min-w-[18px] text-center leading-none shadow-sm scale-90">
            {score}
          </span>
        </motion.button>
      ) : (
        /* ── Pill Button with Pulse Accent ── */
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold leading-none select-none cursor-pointer transition-colors shadow-xs ${fg} ${bg}`}
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`} style={{ backgroundColor: ring }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: ring }} />
          </span>
          ATS {score}%
          <span className="text-[9px] opacity-60 leading-none transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
            ▼
          </span>
        </motion.button>
      )}

      {/* ── Interactive Premium Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className={`absolute top-full mt-2.5 w-[330px] bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden z-[1100] ${
              variant === "heart" ? "left-1/2 -translate-x-1/2" : ""
            }`}
            style={variant === "heart" ? undefined : (isRtl ? { right: 0 } : { left: 0 })}
          >
            {/* Header Content */}
            <div className="p-5 border-b border-sans border-slate-100 flex items-center gap-4 bg-gradient-to-b from-slate-50/50 to-white">
              <ScoreRing score={score} />
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{t.title}</div>
                <div className="text-xl font-black mt-0.5" style={{ color: ring }}>
                  {scoreLabel(score, lang)}
                </div>
                <div className="text-xs text-slate-500 font-semibold mt-1">
                  {t.done(done, total)}
                </div>
              </div>
            </div>

            {/* Dynamic Progress indicator */}
            <div className="h-1 bg-slate-100 w-full relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full"
                style={{ backgroundColor: ring }}
              />
            </div>

            {/* Actionable Checklist */}
            <div className="p-5 max-h-[280px] overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t.todo}
              </div>
              <div className="flex flex-col gap-1.5">
                {breakdown.map((item, i) => {
                  const label = getText(item.label, lang);
                  const tip   = getText(item.tip,   lang);
                  return (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-start gap-3 p-2.5 rounded-xl border border-transparent transition-all ${
                        item.done 
                          ? "bg-emerald-50/30 border-emerald-100/30" 
                          : "hover:bg-slate-50/60"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all text-white font-black text-[9px] ${
                        item.done 
                          ? "bg-emerald-600 border-emerald-600" 
                          : "border-slate-300"
                      }`}>
                        {item.done && (
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <div>
                        <div className={`text-xs font-semibold leading-tight transition-colors ${
                          item.done 
                            ? "text-emerald-700/80 line-through" 
                            : "text-slate-800"
                        }`}>
                          {label}
                        </div>
                        {!item.done && tip && (
                          <div className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">
                            {tip}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Premium Smart Tip Footer Card */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <div 
                className={`p-3 rounded-xl border text-xs leading-relaxed font-semibold transition-all shadow-xs`}
                style={{ 
                  backgroundColor: fillBg,
                  borderColor: `${ring}20`,
                  color: ring 
                }}
              >
                {score >= 80 ? t.tipHigh : t.tipLow}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
