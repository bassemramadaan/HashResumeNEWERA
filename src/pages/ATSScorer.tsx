import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { aiService } from "../services/aiService";
import { Navbar } from "../components/layout/Navbar";
import Footer from "../components/Footer";

// ── Types ────────────────────────────────────────────────
interface KeywordData {
  found: string[];
  missing: string[];
}

interface SectionData {
  name: string;
  score: number;
  feedback: string;
}

interface SuggestionData {
  issue: string;
  fix: string;
}

interface ATSResult {
  overallScore: number;
  matchLevel: 'excellent' | 'good' | 'average' | 'weak';
  summary: string;
  keywords: KeywordData;
  sections: SectionData[];
  suggestions: SuggestionData[];
}

// ── i18n ──────────────────────────────────────────────────
const T = {
  ar: {
    title:        "محلل الـ ATS",
    subtitle:     "حط سيرتك والـ job description وشوف مدى توافقهم",
    cvLabel:      "سيرتك الذاتية",
    cvPlaceholder:"الصق نص سيرتك هنا...",
    jdLabel:      "الـ Job Description",
    jdPlaceholder:"الصق وصف الوظيفة هنا...",
    analyze:      "حلل الآن",
    analyzing:    "بيتحلل...",
    score:        "درجة التوافق",
    keywords:     "الكلمات المفتاحية",
    found:        "موجودة ✓",
    missing:      "ناقصة ✗",
    sections:     "تحليل الأقسام",
    suggestions:  "تحسينات مقترحة",
    improve:      "حسّن سيرتك دلوقتي →",
    tryAgain:     "حلل وظيفة تانية",
    error:        "حصل خطأ، حاول تاني",
    pasteOrUpload:"الصق النص أو ارفع PDF",
    overall:      "التقييم العام",
    excellent:    "ممتاز",
    good:         "كويس",
    average:      "متوسط",
    weak:         "ضعيف",
    addToCV:      "أضفها لسيرتك",
  },
  en: {
    title:        "ATS Scorer",
    subtitle:     "Paste your resume and a job description to see how well they match",
    cvLabel:      "Your Resume",
    cvPlaceholder:"Paste your resume text here...",
    jdLabel:      "Job Description",
    jdPlaceholder:"Paste the job description here...",
    analyze:      "Analyze Now",
    analyzing:    "Analyzing...",
    score:        "Match Score",
    keywords:     "Keywords",
    found:        "Found ✓",
    missing:      "Missing ✗",
    sections:     "Section Analysis",
    suggestions:  "Improvement Suggestions",
    improve:      "Improve Your Resume Now →",
    tryAgain:     "Analyze Another Job",
    error:        "Something went wrong, please try again",
    pasteOrUpload:"Paste text or upload PDF",
    overall:      "Overall Rating",
    excellent:    "Excellent",
    good:         "Good",
    average:      "Average",
    weak:         "Weak",
    addToCV:      "Add to your CV",
  },
};

// ── Gemini prompt builder ────────────────────────────────
function buildSystemInstruction(lang: string) {
  return `You are an expert ATS (Applicant Tracking System) analyzer. Analyze the match between this resume and job description.
Return a JSON object in this exact structure:
{
  "overallScore": <number 0-100>,
  "matchLevel": "excellent" | "good" | "average" | "weak",
  "summary": "2-3 sentence summary in ${lang === "ar" ? "Arabic" : "English"}",
  "keywords": {
    "found": ["keyword1", "keyword2"],
    "missing": ["keyword1", "keyword2"]
  },
  "sections": [
    { "name": "Section Name in ${lang === "ar" ? "Arabic" : "English"}", "score": 0-100, "feedback": "Brief feedback in ${lang === "ar" ? "Arabic" : "English"}" }
  ],
  "suggestions": [
    { "issue": "What's missing in ${lang === "ar" ? "Arabic" : "English"}", "fix": "Exact phrase to add in ${lang === "ar" ? "Arabic" : "English"}" }
  ]
}
Ensure that the response is pure JSON without markdown codeblocks or other text.`;
}

// ── helpers ───────────────────────────────────────────────
function scoreColor(s: number) {
  if (s >= 80) return { fg: "#0F6E56", bg: "rgba(15,110,86,0.10)", ring: "#0F6E56" };
  if (s >= 60) return { fg: "#854F0B", bg: "rgba(133,79,11,0.10)", ring: "#BA7517" };
  if (s >= 40) return { fg: "#993C1D", bg: "rgba(255,77,45,0.10)", ring: "#FF4D2D" };
  return             { fg: "#7A1515", bg: "rgba(122,21,21,0.10)",  ring: "#991B1B" };
}

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const { ring } = scoreColor(score);
  const R  = (size - 14) / 2;
  const C  = 2 * Math.PI * R;
  const cx = size / 2;
  const dash = (score / 100) * C;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cx} r={R} fill="none" stroke="#F1EFE8" strokeWidth={10}/>
      <circle cx={cx} cy={cx} r={R} fill="none" stroke={ring}
        strokeWidth={10} strokeLinecap="round"
        strokeDasharray={`${dash} ${C}`}
        style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.22,1,.36,1)" }}
      />
      <text x={cx} y={cx} textAnchor="middle" dominantBaseline="central"
        fontSize={size < 100 ? 18 : 26} fontWeight={800} fill={ring}
        style={{ transform: "rotate(90deg)", transformOrigin: `${cx}px ${cx}px`, fontFamily: "system-ui" }}>
        {score}
      </text>
    </svg>
  );
}

function SectionBar({ name, score, feedback }: SectionData) {
  const { fg, bg } = scoreColor(score);
  return (
    <div style={{
      background: "#fff", border: "1px solid #F0EDE8",
      borderRadius: 12, padding: "14px 16px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{name}</span>
        <span style={{
          fontSize: 12, fontWeight: 700, color: fg,
          background: bg, padding: "2px 10px", borderRadius: 99,
        }}>{score}/100</span>
      </div>
      <div style={{ height: 4, background: "#F0EDE8", borderRadius: 99, marginBottom: 8, overflow: "hidden" }}>
        <div style={{
          height: 4, width: `${score}%`, background: fg,
          borderRadius: 99, transition: "width 1s ease",
        }}/>
      </div>
      <p style={{ fontSize: 12, color: "#666", margin: 0, lineHeight: 1.6 }}>{feedback}</p>
    </div>
  );
}

// ── main component ────────────────────────────────────────
export default function ATSScorer() {
  // Use a simple detection for language for now, or you could use a store
  const [lang, setLang] = useState<"ar" | "en">("ar");
  
  // Sync with HTML dir
  useEffect(() => {
    const html = document.documentElement;
    setLang(html.dir === "rtl" ? "ar" : "en");
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "dir") {
          setLang(html.dir === "rtl" ? "ar" : "en");
        }
      });
    });
    
    observer.observe(html, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const t        = T[lang] || T.en;
  const isRtl    = lang === "ar";
  const navigate = useNavigate();

  const [cvText,    setCvText]    = useState("");
  const [jdText,    setJdText]    = useState("");
  const [loading,   setLoading]   = useState(false);
  const [result,    setResult]    = useState<ATSResult | null>(null);
  const [error,     setError]     = useState<string | null>(null);
  const [copied,    setCopied]    = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const canAnalyze = cvText.trim().length > 50 && jdText.trim().length > 50;

  const handleAnalyze = async () => {
    if (!canAnalyze || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const prompt = `RESUME:\n${cvText}\n\nJOB DESCRIPTION:\n${jdText}`;
      const systemInstruction = buildSystemInstruction(lang);
      
      const response = await aiService.generateContent(prompt, systemInstruction);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Strip markdown fences if present
      const clean = response.text.replace(/```json|```/g, "").trim();
      const data = JSON.parse(clean) as ATSResult;
      
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e: unknown) {
      console.error("Analysis error:", e);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setResult(null); setError(null); };

  const copyFix = (fix: string, i: number) => {
    navigator.clipboard?.writeText(fix).catch(() => {});
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  const { fg } = result ? scoreColor(result.overallScore) : { fg: "#999", bg: "#F5F5F0" };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFAF8",
      direction: isRtl ? "rtl" : "ltr",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <Helmet>
        <title>{t.title} | HashResume</title>
      </Helmet>

      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 60px" }}>
        
        {/* ── Title block ── */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111", marginBottom: 8 }}>{t.title}</h1>
          <p style={{ fontSize: 16, color: "#666" }}>{t.subtitle}</p>
        </div>

        {/* ── Input section ── */}
        {!result && (
          <div className="ats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>

            {/* CV */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: ".05em" }}>
                📄 {t.cvLabel}
              </label>
              <textarea
                value={cvText}
                onChange={e => setCvText(e.target.value)}
                placeholder={t.cvPlaceholder}
                style={{
                  height: 350, padding: "20px", border: "1px solid #E0DDD6",
                  borderRadius: 16, fontSize: 14, fontFamily: "inherit",
                  color: "#111", background: "#fff", resize: "none",
                  outline: "none", lineHeight: 1.7,
                  transition: "all .2s ease",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
                }}
              />
              <div style={{ fontSize: 11, color: "#999", textAlign: isRtl ? "left" : "right" }}>
                {cvText.length} characters
              </div>
            </div>

            {/* JD */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: ".05em" }}>
                💼 {t.jdLabel}
              </label>
              <textarea
                value={jdText}
                onChange={e => setJdText(e.target.value)}
                placeholder={t.jdPlaceholder}
                style={{
                  height: 350, padding: "20px", border: "1px solid #E0DDD6",
                  borderRadius: 16, fontSize: 14, fontFamily: "inherit",
                  color: "#111", background: "#fff", resize: "none",
                  outline: "none", lineHeight: 1.7,
                  transition: "all .2s ease",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
                }}
              />
              <div style={{ fontSize: 11, color: "#999", textAlign: isRtl ? "left" : "right" }}>
                {jdText.length} characters
              </div>
            </div>

          </div>
        )}

        {/* ── Analyze button ── */}
        {!result && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze || loading}
              style={{
                background:   canAnalyze ? "#FF4D2D" : "#E0DDD6",
                color:        canAnalyze ? "#fff" : "#999",
                border:       "none",
                borderRadius: 14,
                padding:      "16px 48px",
                fontSize:     17,
                fontWeight:   700,
                cursor:       canAnalyze ? "pointer" : "not-allowed",
                display:      "flex",
                alignItems:   "center",
                gap:          12,
                fontFamily:   "inherit",
                transition:   "all .2s",
                minWidth:     240,
                justifyContent: "center",
                boxShadow: canAnalyze ? "0 10px 25px rgba(255,77,45,0.2)" : "none"
              }}
            >
              {loading ? (
                <>
                  <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span>
                  {t.analyzing}
                </>
              ) : (
                <>{t.analyze}</>
              )}
            </button>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: "rgba(255,77,45,0.08)", border: "1px solid rgba(255,77,45,0.2)",
            borderRadius: 12, padding: "16px 20px", color: "#932014",
            fontSize: 14, marginBottom: 32, textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {/* ── Results ── */}
        {result && (
          <div ref={resultRef} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            <div style={{ 
              display: "flex", justifyContent: isRtl ? "flex-start" : "flex-end", 
              marginBottom: -10 
            }}>
              <button onClick={handleReset} style={{
                fontSize: 13, padding: "8px 16px", borderRadius: 10,
                border: "1px solid #E0DDD6", background: "#fff",
                cursor: "pointer", color: "#555", fontWeight: 600,
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
              }}>
                ↺ {t.tryAgain}
              </button>
            </div>

            {/* Score card */}
            <div style={{
              background: "#fff", border: "1px solid #EBEBEB",
              borderRadius: 24, padding: "40px",
              display: "flex", alignItems: "center", gap: 40,
              flexWrap: "wrap",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
            }}>
              <ScoreRing score={result.overallScore} />
              <div style={{ flex: 1, minWidth: 300 }}>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 6, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>
                  {t.score}
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: fg, marginBottom: 10 }}>
                  {t[result.matchLevel] || result.matchLevel}
                </div>
                <p style={{ fontSize: 16, color: "#444", lineHeight: 1.8, margin: 0 }}>
                  {result.summary}
                </p>
              </div>
              <button
                onClick={() => navigate("/editor")}
                style={{
                  background: "#FF4D2D", color: "#fff", border: "none",
                  borderRadius: 14, padding: "16px 32px", fontSize: 15,
                  fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  boxShadow: "0 10px 20px rgba(255,77,45,0.15)"
                }}
              >
                {t.improve}
              </button>
            </div>

            <div className="ats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

              {/* Keywords */}
              <div style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: 24, padding: "30px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#111", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>🔑</span> {t.keywords}
                </div>

                {/* Found */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F6E56", marginBottom: 12, letterSpacing: ".05em", display: "flex", justifyContent: "space-between" }}>
                    <span>{t.found}</span>
                    <span>{result.keywords.found.length}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {result.keywords.found.map((kw, i) => (
                      <span key={i} style={{
                        background: "rgba(15,110,86,0.08)", color: "#0F6E56",
                        fontSize: 13, fontWeight: 600, padding: "6px 12px",
                        borderRadius: 8,
                      }}>{kw}</span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#993C1D", marginBottom: 12, letterSpacing: ".05em", display: "flex", justifyContent: "space-between" }}>
                    <span>{t.missing}</span>
                    <span>{result.keywords.missing.length}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {result.keywords.missing.map((kw, i) => (
                      <span key={i} style={{
                        background: "rgba(255,77,45,0.06)", color: "#993C1D",
                        fontSize: 13, fontWeight: 600, padding: "6px 12px",
                        borderRadius: 8, border: "1px dashed rgba(255,77,45,0.2)",
                      }}>{kw}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: 24, padding: "30px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#111", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>📊</span> {t.sections}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {result.sections.map((s, i) => (
                    <SectionBar key={i} {...s} />
                  ))}
                </div>
              </div>

            </div>

            {/* Suggestions */}
            <div style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: 24, padding: "30px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>💡</span> {t.suggestions}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {result.suggestions.map((s, i) => (
                  <div key={i} style={{
                    background: "#F9F9F7", border: "1px solid #F0EDE8",
                    borderRadius: 16, padding: "20px",
                    display: "flex", alignItems: "flex-start", gap: 16,
                  }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: 10,
                      background: "rgba(255,77,45,0.1)", color: "#FF4D2D",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 800, flexShrink: 0, marginTop: 2,
                    }}>{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: "#555", marginBottom: 10, fontWeight: 500 }}>{s.issue}</div>
                      <div style={{
                        background: "#fff", border: "1px solid #E0DDD6",
                        borderRadius: 10, padding: "12px 16px",
                        fontSize: 14, color: "#222", lineHeight: 1.7,
                        fontStyle: "italic",
                      }}>
                        "{s.fix}"
                      </div>
                    </div>
                    <button
                      onClick={() => copyFix(s.fix, i)}
                      style={{
                        fontSize: 13, padding: "8px 16px", borderRadius: 10,
                        border: "1px solid #E0DDD6",
                        background: copied === i ? "rgba(15,110,86,0.12)" : "#fff",
                        color: copied === i ? "#0F6E56" : "#444",
                        cursor: "pointer", flexShrink: 0, fontFamily: "inherit",
                        transition: "all .15s",
                        fontWeight: 600,
                        boxShadow: "0 2px 5px rgba(0,0,0,0.04)"
                      }}
                    >
                      {copied === i ? "✓ Copied" : t.addToCV}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 850px) {
          .ats-grid { grid-template-columns: 1fr !important; }
        }
      `}} />
    </div>
  );
}
