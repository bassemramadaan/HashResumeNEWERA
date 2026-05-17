import React, { useState, useEffect, useRef } from "react";

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

// ── default breakdown (bilingual labels + tips) ───────────
export const DEFAULT_BREAKDOWN = [
  {
    label: { ar: "معلومات التواصل",  en: "Contact info",         fr: "Coordonnées" },
    tip:   { ar: "أضف email ورقم التليفون", en: "Add email and phone number", fr: "Ajoutez email et téléphone" },
    done: false,
  },
  {
    label: { ar: "الملخص المهني",    en: "Professional summary",  fr: "Résumé professionnel" },
    tip:   { ar: "اكتب 3–4 جمل بـ keywords مناسبة", en: "Write 3–4 sentences with relevant keywords", fr: "Rédigez 3–4 phrases avec des mots-clés pertinents" },
    done: false,
  },
  {
    label: { ar: "الخبرات العملية",  en: "Work experience",       fr: "Expérience professionnelle" },
    tip:   { ar: "أضف خبرة واحدة على الأقل", en: "Add at least one experience", fr: "Ajoutez au moins une expérience" },
    done: false,
  },
  {
    label: { ar: "المهارات",         en: "Skills",                fr: "Compétences" },
    tip:   { ar: "أضف 5 مهارات على الأقل", en: "Add at least 5 skills", fr: "Ajoutez au moins 5 compétences" },
    done: false,
  },
  {
    label: { ar: "التعليم",          en: "Education",             fr: "Formation" },
    tip:   { ar: "أضف آخر شهادة حصلت عليها", en: "Add your most recent degree", fr: "Ajoutez votre dernier diplôme" },
    done: false,
  },
  {
    label: { ar: "Keywords مناسبة",  en: "Relevant keywords",     fr: "Mots-clés pertinents" },
    tip:   { ar: "الـ AI هيساعدك تختار الكلمات الصح", en: "Use AI to pick the right keywords", fr: "Utilisez l'IA pour choisir les bons mots-clés" },
    done: false,
  },
];

// ── helpers ───────────────────────────────────────────────
function scoreColor(s: number) {
  if (s >= 80) return { fg: "#0F6E56", bg: "rgba(15,110,86,0.10)", ring: "#0F6E56" };
  if (s >= 50) return { fg: "#854F0B", bg: "rgba(133,79,11,0.10)", ring: "#BA7517" };
  return             { fg: "#993C1D", bg: "rgba(255,77,45,0.10)",  ring: "#FF4D2D" };
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
  const animRef       = useRef<number | null>(null);
  const [val, setVal] = useState(0);
  const { ring }      = scoreColor(score);
  const R             = (size - 10) / 2;
  const C             = 2 * Math.PI * R;
  const dash          = (val / 100) * C;

  useEffect(() => {
    let start: number | null = null;
    const dur = 900;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p    = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(score * ease));
      if (p < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => { if(animRef.current) cancelAnimationFrame(animRef.current); };
  }, [score]);

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={R} fill="none" stroke="#F1EFE8" strokeWidth={8} />
      <circle cx={size/2} cy={size/2} r={R} fill="none" stroke={ring}
        strokeWidth={8} strokeLinecap="round"
        strokeDasharray={`${dash} ${C}`} />
      <text x={size/2} y={size/2}
        textAnchor="middle" dominantBaseline="central"
        fontSize={17} fontWeight={700} fill={ring}
        style={{ transform: "rotate(90deg)", transformOrigin: `${size/2}px ${size/2}px` }}>
        {val}%
      </text>
    </svg>
  );
}

// ── main ──────────────────────────────────────────────────
export default function ATSScoreWidget({
  score     = 0,
  breakdown = DEFAULT_BREAKDOWN,
  lang      = "ar",
}: {
  score?: number;
  breakdown?: any[];
  lang?: "ar" | "en" | "fr";
}) {
  const [open, setOpen] = useState(false);
  const wrapRef         = useRef<HTMLDivElement>(null);
  const t               = T[lang] ?? T.en;
  const { fg, bg }      = scoreColor(score);
  const isRtl           = lang === "ar";
  const done            = breakdown.filter(b => b.done).length;
  const total           = breakdown.length;

  // close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={wrapRef} style={{ position: "relative", display: "inline-block", direction: isRtl ? "rtl" : "ltr" }}>

      {/* ── Pill ── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: bg, border: `1px solid ${fg}44`,
          borderRadius: 99, padding: "4px 12px 4px 10px",
          cursor: "pointer", fontSize: 13, fontWeight: 600,
          color: fg, userSelect: "none", outline: "none",
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: fg, flexShrink: 0 }} />
        ATS {score}%
        <span style={{ fontSize: 9, opacity: .55 }}>{open ? "▲" : "▼"}</span>
      </button>

      {/* ── Panel ── */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)",
          [isRtl ? "right" : "left"]: 0,
          width: 320, background: "#fff",
          border: "1px solid #EBEBEB", borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          zIndex: 1000, overflow: "hidden",
          direction: isRtl ? "rtl" : "ltr",
        }}>

          {/* header */}
          <div style={{
            padding: "16px 20px 14px",
            borderBottom: "1px solid #F0EDE8",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <ScoreRing score={score} />
            <div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 3 }}>{t.title}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: fg, lineHeight: 1 }}>
                {scoreLabel(score, lang)}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 5 }}>{t.done(done, total)}</div>
            </div>
          </div>

          {/* thin progress bar */}
          <div style={{ height: 3, background: "#F1EFE8" }}>
            <div style={{
              height: 3, width: `${score}%`, background: fg,
              transition: "width .9s cubic-bezier(.22,1,.36,1)",
              ...(isRtl ? { marginRight: "auto", float: "right" } : {}),
            }} />
          </div>

          {/* checklist */}
          <div style={{ padding: "12px 20px 8px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#999", marginBottom: 8, letterSpacing: ".05em" }}>
              {t.todo}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {breakdown.map((item, i) => {
                const label = getText(item.label, lang);
                const tip   = getText(item.tip,   lang);
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 8,
                    padding: "6px 10px", borderRadius: 8,
                    background: item.done ? "rgba(15,110,86,0.06)" : "transparent",
                  }}>
                    <span style={{
                      width: 16, height: 16, borderRadius: "50%",
                      border: `1.5px solid ${item.done ? "#0F6E56" : "#D3D1C7"}`,
                      background: item.done ? "#0F6E56" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 2,
                    }}>
                      {item.done && (
                        <svg width="8" height="8" viewBox="0 0 8 8">
                          <polyline points="1,4 3,6 7,2"
                            stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </svg>
                      )}
                    </span>
                    <div>
                      <div style={{
                        fontSize: 13, fontWeight: 500,
                        color: item.done ? "#0F6E56" : "#222",
                        textDecoration: item.done ? "line-through" : "none",
                        opacity: item.done ? .65 : 1,
                      }}>
                        {label}
                      </div>
                      {!item.done && tip && (
                        <div style={{ fontSize: 11, color: "#999", marginTop: 1, lineHeight: 1.5 }}>
                          {tip}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* footer */}
          <div style={{
            margin: "8px 16px 16px",
            background: score >= 80 ? "rgba(15,110,86,0.07)" : "rgba(255,77,45,0.06)",
            border: `1px solid ${score >= 80 ? "rgba(15,110,86,0.18)" : "rgba(255,77,45,0.15)"}`,
            borderRadius: 10, padding: "10px 12px",
            fontSize: 12, color: score >= 80 ? "#0F6E56" : "#993C1D", lineHeight: 1.6,
          }}>
            {score >= 80 ? t.tipHigh : t.tipLow}
          </div>

        </div>
      )}
    </div>
  );
}
