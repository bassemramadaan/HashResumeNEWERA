/**
 * ATSScorer.tsx
 * صفحة ATS Scorer — آمنة، بتكال الـ Edge Function مش Gemini مباشرة
 *
 * Route: /ats-scorer
 * يتطلب: /api/ats-score.js (Edge Function) + /lib/atsScorer.js
 */

import { useState, useRef } from "react";
import { useNavigate }      from "react-router-dom";
import { analyzeATS }       from "../lib/atsScorer";

// ── i18n ──────────────────────────────────────────────────
const T: Record<string, any> = {
  ar: {
    badge:        "مدعوم بالذكاء الاصطناعي",
    title:        "اعرف درجة الـ ATS قبل ما تتقدم",
    sub:          "الصق سيرتك ووصف الوظيفة وشوف مدى توافقهم — وإزاي تحسّن فرصك",
    cvLabel:      "سيرتك الذاتية",
    cvPlaceholder:"الصق نص سيرتك هنا...",
    jdLabel:      "وصف الوظيفة",
    jdPlaceholder:"الصق وصف الوظيفة هنا...",
    chars:        "حرف",
    analyze:      "حلّل الآن ✨",
    analyzing:    "بيتحلل...",
    scoreTitle:   "درجة التوافق",
    excellent:    "ممتاز 🎉",
    good:         "كويس 👍",
    average:      "متوسط ⚠️",
    weak:         "ضعيف 🔧",
    kwTitle:      "الكلمات المفتاحية",
    found:        "موجودة",
    missing:      "ناقصة",
    secTitle:     "تحليل الأقسام",
    sugTitle:     "تحسينات مقترحة",
    copy:         "نسخ",
    copied:       "تم ✓",
    improve:      "حسّن سيرتك دلوقتي →",
    tryAgain:     "↺ حلّل وظيفة تانية",
    error:        "حصل خطأ، حاول تاني",
    minChars:     "الصق سيرتك ووصف الوظيفة أولاً (50 حرف على الأقل)",
  },
  en: {
    badge:        "AI-Powered",
    title:        "Know your ATS score before you apply",
    sub:          "Paste your resume and job description to see how well they match — and exactly how to improve",
    cvLabel:      "Your Resume",
    cvPlaceholder:"Paste your resume text here...",
    jdLabel:      "Job Description",
    jdPlaceholder:"Paste the job description here...",
    chars:        "chars",
    analyze:      "Analyze Now ✨",
    analyzing:    "Analyzing...",
    scoreTitle:   "Match Score",
    excellent:    "Excellent 🎉",
    good:         "Good 👍",
    average:      "Average ⚠️",
    weak:         "Needs Work 🔧",
    kwTitle:      "Keywords",
    found:        "Found",
    missing:      "Missing",
    secTitle:     "Section Analysis",
    sugTitle:     "Improvement Suggestions",
    copy:         "Copy",
    copied:       "Copied ✓",
    improve:      "Improve Your Resume Now →",
    tryAgain:     "↺ Analyze Another Job",
    error:        "Something went wrong. Please try again.",
    minChars:     "Paste your resume and job description first (min 50 chars each)",
  },
  fr: {
    badge:        "Propulsé par l'IA",
    title:        "Connaissez votre score ATS avant de postuler",
    sub:          "Collez votre CV et la description du poste pour voir leur compatibilité",
    cvLabel:      "Votre CV",
    cvPlaceholder:"Collez votre CV ici...",
    jdLabel:      "Description du poste",
    jdPlaceholder:"Collez la description du poste ici...",
    chars:        "car.",
    analyze:      "Analyser ✨",
    analyzing:    "Analyse en cours...",
    scoreTitle:   "Score de correspondance",
    excellent:    "Excellent 🎉",
    good:         "Bien 👍",
    average:      "Moyen ⚠️",
    weak:         "À améliorer 🔧",
    kwTitle:      "Mots-clés",
    found:        "Trouvés",
    missing:      "Manquants",
    secTitle:     "Analyse des sections",
    sugTitle:     "Suggestions d'amélioration",
    copy:         "Copier",
    copied:       "Copié ✓",
    improve:      "Améliorer mon CV →",
    tryAgain:     "↺ Analyser un autre poste",
    error:        "Une erreur s'est produite. Veuillez réessayer.",
    minChars:     "Collez votre CV et la description (min. 50 caractères chacun)",
  },
};

// ── color helpers ─────────────────────────────────────────
function scoreColor(s: number) {
  if (s >= 80) return { fg: "#0F6E56", bg: "rgba(15,110,86,0.10)"  };
  if (s >= 60) return { fg: "#854F0B", bg: "rgba(133,79,11,0.10)"  };
  if (s >= 40) return { fg: "#993C1D", bg: "rgba(255,77,45,0.10)"  };
  return             { fg: "#7A1515", bg: "rgba(122,21,21,0.10)"   };
}

// ── Score Ring ────────────────────────────────────────────
function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const { fg }  = scoreColor(score);
  const R       = (size - 14) / 2;
  const C       = 2 * Math.PI * R;
  const cx      = size / 2;
  const dash    = (score / 100) * C;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={cx} cy={cx} r={R} fill="none" stroke="#F1EFE8" strokeWidth={10}/>
      <circle cx={cx} cy={cx} r={R} fill="none" stroke={fg}
        strokeWidth={10} strokeLinecap="round"
        strokeDasharray={`${dash} ${C}`}
        style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.22,1,.36,1)" }}
      />
      <text x={cx} y={cx} textAnchor="middle" dominantBaseline="central"
        fontSize={size < 100 ? 18 : 26} fontWeight={800} fill={fg}
        style={{ transform: "rotate(90deg)", transformOrigin: `${cx}px ${cx}px`, fontFamily: "system-ui" }}>
        {score}
      </text>
    </svg>
  );
}

// ── Section Bar ───────────────────────────────────────────
function SectionBar({ name, score, feedback }: { name: string; score: number; feedback: string }) {
  const { fg, bg } = scoreColor(score);
  return (
    <div style={{
      background: "#FAFAF8", border: "1px solid #F0EDE8",
      borderRadius: 12, padding: "12px 14px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{name}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: fg, background: bg, padding: "2px 9px", borderRadius: 99 }}>
          {score}/100
        </span>
      </div>
      <div style={{ height: 4, background: "#E8E6DF", borderRadius: 99, marginBottom: 7, overflow: "hidden" }}>
        <div style={{
          height: 4, width: `${score}%`, background: fg,
          borderRadius: 99, transition: "width 1s ease",
        }}/>
      </div>
      <p style={{ fontSize: 12, color: "#666", margin: 0, lineHeight: 1.6 }}>{feedback}</p>
    </div>
  );
}

// ── Textarea field ────────────────────────────────────────
function Field({ label, value, onChange, placeholder, charCount }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: "#555", letterSpacing: ".04em", textTransform: "uppercase" }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height:       300,
          padding:      "14px",
          border:       `1.5px solid ${focused ? "#FF4D2D" : "#E0DDD6"}`,
          borderRadius: 12,
          fontSize:     13,
          fontFamily:   "inherit",
          color:        "#111",
          background:   "#fff",
          resize:       "none",
          outline:      "none",
          lineHeight:   1.7,
          transition:   "border-color .15s",
        }}
      />
      <div style={{ fontSize: 11, color: "#999", textAlign: "right" }}>
        {charCount} {charCount === 1 ? "char" : "chars"}
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────
export default function ATSScorer({ lang = "ar" }: { lang?: string }) {
  const t         = T[lang] ?? T.en;
  const isRtl     = lang === "ar";
  const navigate  = useNavigate?.() ?? null;

  const [cvText,  setCvText]  = useState("");
  const [jdText,  setJdText]  = useState("");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<any>(null);
  const [error,   setError]   = useState<string | null>(null);
  const [copied,  setCopied]  = useState<number | null>(null);
  const resultRef             = useRef<HTMLDivElement>(null);

  const canAnalyze = cvText.trim().length >= 50 && jdText.trim().length >= 50;

  // ── handlers ──
  const handleAnalyze = async () => {
    if (!canAnalyze || loading) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeATS({ cvText, jdText, lang });
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e: any) {
      setError(e.message ?? t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setResult(null); setError(null); };

  const handleCopy = (text: string, i: number) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  const { fg } = result ? scoreColor(result.overallScore) : { fg: "#999" };
  const levelLabel = result ? (t[result.matchLevel] ?? result.matchLevel) : "";

  // ── card style helper ──
  const card = (extra = {}) => ({
    background:   "#fff",
    border:       "1px solid #EBEBEB",
    borderRadius: 20,
    padding:      "24px",
    ...extra,
  });

  return (
    <div style={{
      minHeight:  "100vh",
      background: "#FAFAF8",
      direction:  isRtl ? "rtl" : "ltr",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>

      {/* ── Top bar ── */}
      <header style={{
        background:     "rgba(250,250,248,.94)",
        backdropFilter: "blur(14px)",
        borderBottom:   "1px solid #EBEBEB",
        padding:        "0 24px",
        position:       "sticky",
        top:            0,
        zIndex:         50,
      }}>
        <div style={{
          maxWidth:       1100,
          margin:         "0 auto",
          height:         60,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, background: "#111", borderRadius: 9,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800, color: "#fff",
            }}>#</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>
                Hash<span style={{ color: "#FF4D2D" }}>Resume</span>
              </div>
              <div style={{ fontSize: 11, color: "#888" }}>ATS Scorer</div>
            </div>
          </div>

          {result && (
            <button onClick={handleReset} style={{
              fontSize: 13, padding: "7px 16px", borderRadius: 8,
              border: "1px solid #E0DDD6", background: "transparent",
              cursor: "pointer", color: "#555", fontFamily: "inherit",
            }}>
              {t.tryAgain}
            </button>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* ── Page header ── */}
        {!result && (
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(255,77,45,0.08)", border: "1px solid rgba(255,77,45,0.18)",
              color: "#FF4D2D", fontSize: 11, fontWeight: 700,
              padding: "4px 12px", borderRadius: 99, marginBottom: 14,
              letterSpacing: ".08em", textTransform: "uppercase",
            }}>
              🎯 {t.badge}
            </div>
            <h1 style={{
              fontFamily: "'Syne', system-ui", fontSize: "clamp(26px,4vw,42px)",
              fontWeight: 800, color: "#111", letterSpacing: "-.02em",
              lineHeight: 1.1, marginBottom: 12,
            }}>
              {t.title}
            </h1>
            <p style={{ fontSize: 16, color: "#555", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
              {t.sub}
            </p>
          </div>
        )}

        {/* ── Input section ── */}
        {!result && (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
              marginBottom: 24,
            }}>
              <Field
                label={`📄 ${t.cvLabel}`}
                value={cvText}
                onChange={setCvText}
                placeholder={t.cvPlaceholder}
                charCount={cvText.length}
              />
              <Field
                label={`💼 ${t.jdLabel}`}
                value={jdText}
                onChange={setJdText}
                placeholder={t.jdPlaceholder}
                charCount={jdText.length}
              />
            </div>

            {/* hint */}
            {!canAnalyze && (cvText.length > 0 || jdText.length > 0) && (
              <p style={{ textAlign: "center", fontSize: 12, color: "#999", marginBottom: 12 }}>
                {t.minChars}
              </p>
            )}

            {/* analyze button */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze || loading}
                style={{
                  background:     canAnalyze ? "#FF4D2D" : "#E0DDD6",
                  color:          canAnalyze ? "#fff"    : "#999",
                  border:         "none",
                  borderRadius:   12,
                  padding:        "14px 44px",
                  fontSize:       16,
                  fontWeight:     700,
                  cursor:         canAnalyze ? "pointer" : "not-allowed",
                  fontFamily:     "inherit",
                  display:        "flex",
                  alignItems:     "center",
                  gap:            10,
                  transition:     "all .2s",
                  minWidth:       220,
                  justifyContent: "center",
                }}
              >
                {loading
                  ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> {t.analyzing}</>
                  : t.analyze
                }
              </button>
            </div>
          </>
        )}

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: "rgba(255,77,45,0.08)", border: "1px solid rgba(255,77,45,0.2)",
            borderRadius: 12, padding: "14px 18px", color: "#993C1D",
            fontSize: 14, marginBottom: 24, textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {/* ── Results ── */}
        {result && (
          <div ref={resultRef} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Score card */}
            <div style={{ ...card({ padding: "28px 32px" }), display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
              <ScoreRing score={result.overallScore} />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 11, color: "#888", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 4 }}>
                  {t.scoreTitle}
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, color: fg, marginBottom: 8, fontFamily: "'Syne', system-ui" }}>
                  {levelLabel}
                </div>
                <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75, margin: 0 }}>{result.summary}</p>
              </div>
              <button
                onClick={() => navigate?.("/editor")}
                style={{
                  background: "#FF4D2D", color: "#fff", border: "none",
                  borderRadius: 12, padding: "13px 22px", fontSize: 14,
                  fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  whiteSpace: "nowrap", transition: "background .15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#CC3A1F"}
                onMouseLeave={e => e.currentTarget.style.background = "#FF4D2D"}
              >
                {t.improve}
              </button>
            </div>

            {/* Keywords + Sections */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>

              {/* Keywords */}
              <div style={card()}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 18 }}>🔑 {t.kwTitle}</div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0F6E56", marginBottom: 8, letterSpacing: ".05em" }}>
                    {t.found} ✓ ({result.keywords.found.length})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {result.keywords.found.map((kw: string, i: number) => (
                      <span key={i} style={{
                        background: "rgba(15,110,86,0.10)", color: "#0F6E56",
                        fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 6,
                      }}>{kw}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#993C1D", marginBottom: 8, letterSpacing: ".05em" }}>
                    {t.missing} ✗ ({result.keywords.missing.length})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {result.keywords.missing.map((kw: string, i: number) => (
                      <span key={i} style={{
                        background: "rgba(255,77,45,0.08)", color: "#993C1D",
                        fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 6,
                        border: "1px dashed rgba(255,77,45,.3)",
                      }}>{kw}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div style={card()}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 18 }}>📊 {t.secTitle}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {result.sections.map((s: any, i: number) => (
                    <SectionBar key={i} name={s.name} score={s.score} feedback={s.feedback} />
                  ))}
                </div>
              </div>

            </div>

            {/* Suggestions */}
            <div style={card()}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 18 }}>💡 {t.sugTitle}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {result.suggestions.map((s: any, i: number) => (
                  <div key={i} style={{
                    background: "#FAFAF8", border: "1px solid #F0EDE8",
                    borderRadius: 12, padding: "14px 16px",
                    display: "flex", alignItems: "flex-start", gap: 12,
                  }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: "rgba(255,77,45,0.10)", color: "#FF4D2D",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2,
                    }}>{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>{s.issue}</div>
                      <div style={{
                        background: "#fff", border: "1px solid #E0DDD6",
                        borderRadius: 8, padding: "10px 12px",
                        fontSize: 13, color: "#111", lineHeight: 1.65, fontStyle: "italic",
                      }}>
                        "{s.fix}"
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(s.fix, i)}
                      style={{
                        fontSize: 12, padding: "6px 12px", borderRadius: 8,
                        border: "1px solid #E0DDD6",
                        background: copied === i ? "rgba(15,110,86,0.1)" : "#fff",
                        color:      copied === i ? "#0F6E56"              : "#555",
                        cursor:     "pointer", flexShrink: 0,
                        fontFamily: "inherit", transition: "all .15s",
                      }}
                    >
                      {copied === i ? t.copied : t.copy}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset */}
            <button onClick={handleReset} style={{
              display: "flex", alignItems: "center", gap: 8,
              margin: "0 auto", padding: "10px 24px",
              borderRadius: 10, border: "1px solid #E0DDD6",
              background: "#fff", fontSize: 14, color: "#555",
              cursor: "pointer", fontFamily: "inherit",
              transition: "all .15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#FF4D2D"; e.currentTarget.style.color="#FF4D2D"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#E0DDD6"; e.currentTarget.style.color="#555"; }}
            >
              {t.tryAgain}
            </button>

          </div>
        )}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
