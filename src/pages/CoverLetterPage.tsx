import React, { useState, useEffect } from "react";
import {
  FileText, Copy, Check, Download,
  ArrowLeft, RefreshCw, Wand2, ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useResumeStore } from "../store/useResumeStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { Navbar } from "@/components/layout/Navbar";
import { aiService } from "../services/aiService";
import { cn } from "@/lib/utils";

// ── i18n ──────────────────────────────────────────────────
const T: Record<string, any> = {
  ar: {
    title:          "خطاب تغطية",
    subtitle:       "اكتب خطاب تغطية احترافي في ثوانٍ بالذكاء الاصطناعي",
    formTitle:      "تفاصيل الوظيفة",
    importBtn:      "استورد من السيرة",
    fullName:       "اسمك الكامل",
    fullNamePh:     "مثال: أحمد محمد",
    jobTitle:       "المسمى الوظيفي",
    jobTitlePh:     "مثال: مهندس برمجيات",
    company:        "اسم الشركة",
    companyPh:      "مثال: شركة التقنية",
    manager:        "المسؤول عن التوظيف (اختياري)",
    managerPh:      "مثال: سارة أحمد",
    skills:         "المهارات الأساسية",
    skillsPh:       "مثال: React، Node.js، قيادة الفريق",
    jd:             "وصف الوظيفة (اختياري)",
    jdPh:           "الصق مقتطفاً من وصف الوظيفة...",
    tone:           "نبرة الخطاب",
    tones:          { professional: "احترافي", enthusiastic: "متحمس", confident: "واثق", formal: "رسمي" },
    lang:           "لغة الخطاب",
    langs:          { en: "إنجليزي", ar: "عربي", fr: "فرنسي" },
    generate:       "توليد الخطاب ✨",
    generating:     "جاري التوليد...",
    regenerate:     "توليد مرة أخرى",
    outputTitle:    "خطاب التغطية",
    copy:           "نسخ",
    copied:         "تم النسخ ✓",
    download:       "تحميل",
    emptyTitle:     "لم يتم التوليد بعد",
    emptyDesc:      "أملأ التفاصيل على اليسار واضغط \"توليد الخطاب\"",
    required:       "مطلوب",
    charCount:      (n: number) => `${n} حرف`,
    tip:            "💡 كلما أضفت وصف الوظيفة، كان الخطاب أدق وأكثر توافقاً",
  },
  en: {
    title:          "Cover Letter",
    subtitle:       "Generate a professional cover letter in seconds with AI",
    formTitle:      "Job Details",
    importBtn:      "Import from Resume",
    fullName:       "Your Full Name",
    fullNamePh:     "e.g. John Doe",
    jobTitle:       "Job Title",
    jobTitlePh:     "e.g. Software Engineer",
    company:        "Company Name",
    companyPh:      "e.g. Tech Corp",
    manager:        "Hiring Manager (Optional)",
    managerPh:      "e.g. Jane Smith",
    skills:         "Key Skills to Highlight",
    skillsPh:       "e.g. React, Node.js, Team Leadership",
    jd:             "Job Description Snippet (Optional)",
    jdPh:           "Paste a few sentences from the job description...",
    tone:           "Letter Tone",
    tones:          { professional: "Professional", enthusiastic: "Enthusiastic", confident: "Confident", formal: "Formal" },
    lang:           "Letter Language",
    langs:          { en: "English", ar: "Arabic", fr: "French" },
    generate:       "Generate Cover Letter ✨",
    generating:     "Generating...",
    regenerate:     "Regenerate",
    outputTitle:    "Your Cover Letter",
    copy:           "Copy",
    copied:         "Copied ✓",
    download:       "Download",
    emptyTitle:     "No Letter Generated Yet",
    emptyDesc:      "Fill out the job details and click \"Generate Cover Letter\"",
    required:       "Required",
    charCount:      (n: number) => `${n} chars`,
    tip:            "💡 Adding a job description makes your letter more targeted and ATS-friendly",
  },
  fr: {
    title:          "Lettre de motivation",
    subtitle:       "Générez une lettre de motivation professionnelle en quelques secondes",
    formTitle:      "Détails du poste",
    importBtn:      "Importer du CV",
    fullName:       "Votre nom complet",
    fullNamePh:     "ex. Jean Dupont",
    jobTitle:       "Intitulé du poste",
    jobTitlePh:     "ex. Ingénieur logiciel",
    company:        "Nom de l'entreprise",
    companyPh:      "ex. Tech Corp",
    manager:        "Responsable RH (Optionnel)",
    managerPh:      "ex. Marie Martin",
    skills:         "Compétences clés",
    skillsPh:       "ex. React, Node.js, Leadership",
    jd:             "Description du poste (Optionnel)",
    jdPh:           "Collez quelques phrases de la description...",
    tone:           "Ton de la lettre",
    tones:          { professional: "Professionnel", enthusiastic: "Enthousiaste", confident: "Confiant", formal: "Formel" },
    lang:           "Langue de la lettre",
    langs:          { en: "Anglais", ar: "Arabe", fr: "Français" },
    generate:       "Générer la lettre ✨",
    generating:     "Génération en cours...",
    regenerate:     "Régénérer",
    outputTitle:    "Votre lettre de motivation",
    copy:           "Copier",
    copied:         "Copié ✓",
    download:       "Télécharger",
    emptyTitle:     "Aucune lettre générée",
    emptyDesc:      "Remplissez les détails et cliquez sur \"Générer la lettre\"",
    required:       "Requis",
    charCount:      (n: number) => `${n} car.`,
    tip:            "💡 Ajouter une description de poste rend votre lettre plus ciblée",
  },
};

type Tone = "professional" | "enthusiastic" | "confident" | "formal";
type LetterLang = "en" | "ar" | "fr";

// ── field component ───────────────────────────────────────
function Field({
  label, required, hint, children,
}: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
        {required && <span className="text-[10px] text-[#FF4D2D] font-bold">*</span>}
      </div>
      {children}
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

const inputClass = "w-full px-3.5 py-2.5 border border-slate-200 bg-white text-slate-900 rounded-xl text-sm outline-none focus:border-[#FF4D2D] focus:ring-2 focus:ring-[#FF4D2D]/10 transition-all placeholder:text-slate-300";

// ── select component ──────────────────────────────────────
function Select({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(inputClass, "appearance-none pe-8 cursor-pointer")}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

// ── download helper ───────────────────────────────────────
function downloadTxt(text: string, filename: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── main ──────────────────────────────────────────────────
export default function CoverLetterPage() {
  const { data }     = useResumeStore();
  const { language } = useLanguageStore();
  const t            = T[language] ?? T.en;
  const isRtl        = language === "ar";

  const [form, setForm] = useState({
    fullName:       "",
    jobTitle:       "",
    companyName:    "",
    hiringManager:  "",
    jobDescription: "",
    skills:         "",
  });
  const [tone,           setTone]           = useState<Tone>("professional");
  const [letterLang,     setLetterLang]     = useState<LetterLang>(language as LetterLang ?? "en");
  const [generated,      setGenerated]      = useState("");
  const [isGenerating,   setIsGenerating]   = useState(false);
  const [copied,         setCopied]         = useState(false);
  const [error,          setError]          = useState("");

  // auto-fill from resume
  useEffect(() => {
    if (data.personalInfo.fullName && !form.fullName) {
      setForm(prev => ({
        ...prev,
        fullName: data.personalInfo.fullName || "",
        jobTitle: data.personalInfo.jobTitle || "",
        skills:   data.skills.join(", ") || "",
      }));
    }
  }, [data.personalInfo.fullName]);

  const importFromResume = () => {
    setForm(prev => ({
      ...prev,
      fullName: data.personalInfo.fullName || "",
      jobTitle: data.personalInfo.jobTitle || "",
      skills:   data.skills.join(", ") || "",
    }));
  };

  const canGenerate = form.fullName.trim() && form.jobTitle.trim() && form.companyName.trim();

  const buildPrompt = () => {
    const langMap: Record<LetterLang, string> = { en: "English", ar: "Arabic", fr: "French" };
    const toneMap: Record<Tone, string> = {
      professional: "professional and polished",
      enthusiastic: "enthusiastic and energetic",
      confident:    "confident and assertive",
      formal:       "formal and structured",
    };
    return `Write a ${toneMap[tone]} cover letter in ${langMap[letterLang]} for:

Position: ${form.jobTitle}
Company: ${form.companyName}
Candidate Name: ${form.fullName}
Hiring Manager: ${form.hiringManager || "Hiring Manager"}
Key Skills: ${form.skills || "Not specified"}
Job Description: ${form.jobDescription || "Not provided"}

Requirements:
- Keep it under 400 words
- Use real information provided, no placeholders like [Your Name]
- Make it specific to the company and role
- Use proper paragraphs
- ${letterLang === "ar" ? "Write in Arabic with RTL formatting" : ""}
- Start directly with the letter content, no title or metadata`;
  };

  const generate = async () => {
    if (!canGenerate || isGenerating) return;
    setIsGenerating(true);
    setError("");
    try {
      const result = await aiService.generateContent(buildPrompt());
      if (result.text) {
        setGenerated(result.text);
      } else {
        setError("Failed to generate. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(generated).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const filename = `cover-letter-${form.companyName.toLowerCase().replace(/\s+/g, "-")}.txt`;
    downloadTxt(generated, filename);
  };

  return (
    <div className={cn("min-h-screen bg-[#FAFAF8] flex flex-col font-sans", isRtl && "rtl")}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">

        {/* ── Page header ── */}
        <div className="mb-8">
          <Link to="/editor" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 mb-4 transition-colors">
            <ArrowLeft size={14} className="rtl:rotate-180" />
            {language === "ar" ? "رجوع للمحرر" : language === "fr" ? "Retour à l'éditeur" : "Back to Editor"}
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
              <p className="text-slate-500 text-sm mt-1">{t.subtitle}</p>
            </div>
            <button
              onClick={importFromResume}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF4D2D] bg-orange-50 hover:bg-orange-100 border border-orange-100 px-4 py-2 rounded-xl transition-colors"
            >
              <Download size={14} />
              {t.importBtn}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: Form ── */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-5">

            <h2 className="text-base font-bold text-slate-900">{t.formTitle}</h2>

            {/* Name */}
            <Field label={t.fullName} required>
              <input
                type="text" name="fullName"
                value={form.fullName}
                onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                placeholder={t.fullNamePh}
                className={inputClass}
              />
            </Field>

            {/* Job + Company */}
            <div className="grid grid-cols-2 gap-3">
              <Field label={t.jobTitle} required>
                <input
                  type="text" name="jobTitle"
                  value={form.jobTitle}
                  onChange={e => setForm(p => ({ ...p, jobTitle: e.target.value }))}
                  placeholder={t.jobTitlePh}
                  className={inputClass}
                />
              </Field>
              <Field label={t.company} required>
                <input
                  type="text" name="companyName"
                  value={form.companyName}
                  onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))}
                  placeholder={t.companyPh}
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Manager */}
            <Field label={t.manager}>
              <input
                type="text" name="hiringManager"
                value={form.hiringManager}
                onChange={e => setForm(p => ({ ...p, hiringManager: e.target.value }))}
                placeholder={t.managerPh}
                className={inputClass}
              />
            </Field>

            {/* Skills */}
            <Field label={t.skills}>
              <input
                type="text" name="skills"
                value={form.skills}
                onChange={e => setForm(p => ({ ...p, skills: e.target.value }))}
                placeholder={t.skillsPh}
                className={inputClass}
              />
            </Field>

            {/* JD */}
            <Field label={t.jd}>
              <textarea
                name="jobDescription"
                value={form.jobDescription}
                onChange={e => setForm(p => ({ ...p, jobDescription: e.target.value }))}
                rows={3}
                placeholder={t.jdPh}
                className={cn(inputClass, "resize-none")}
              />
              {!form.jobDescription && (
                <p className="text-[11px] text-slate-400">{t.tip}</p>
              )}
            </Field>

            {/* Tone + Language */}
            <div className="grid grid-cols-2 gap-3">
              <Field label={t.tone}>
                <Select
                  value={tone}
                  onChange={v => setTone(v as Tone)}
                  options={Object.entries(t.tones).map(([v, l]) => ({ value: v, label: l as string }))}
                />
              </Field>
              <Field label={t.lang}>
                <Select
                  value={letterLang}
                  onChange={v => setLetterLang(v as LetterLang)}
                  options={Object.entries(t.langs).map(([v, l]) => ({ value: v, label: l as string }))}
                />
              </Field>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-[#993C1D] bg-orange-50 border border-orange-100 rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={!canGenerate || isGenerating}
              className={cn(
                "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                canGenerate
                  ? "bg-[#FF4D2D] hover:bg-[#CC3A1F] text-white shadow-md shadow-orange-500/20 hover:scale-[1.01] active:scale-[0.99]"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  {t.generating}
                </>
              ) : (
                <>
                  <Wand2 size={15} />
                  {generated ? t.regenerate : t.generate}
                </>
              )}
            </button>
          </div>

          {/* ── Right: Output ── */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">{t.outputTitle}</h2>
              {generated && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={copy}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all",
                      copied
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? t.copied : t.copy}
                  </button>
                  <button
                    onClick={download}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 transition-all"
                  >
                    <Download size={12} />
                    {t.download}
                  </button>
                </div>
              )}
            </div>

            {generated ? (
              <div className="flex-1 flex flex-col gap-3">
                {/* Stats bar */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>{t.charCount(generated.length)}</span>
                  <span>·</span>
                  <span>{generated.split(/\s+/).filter(Boolean).length} words</span>
                  <span>·</span>
                  <span className="text-emerald-500 font-semibold">✓ Ready</span>
                </div>

                <textarea
                  value={generated}
                  onChange={e => setGenerated(e.target.value)}
                  className={cn(
                    "flex-1 min-h-[460px] p-5 border border-slate-200 bg-slate-50 rounded-xl text-slate-800 leading-relaxed resize-none outline-none focus:border-[#FF4D2D] focus:ring-2 focus:ring-[#FF4D2D]/10 transition-all text-sm font-serif",
                    letterLang === "ar" && "text-right"
                  )}
                  dir={letterLang === "ar" ? "rtl" : "ltr"}
                />

                <p className="text-[11px] text-slate-400 text-center">
                  {language === "ar" ? "يمكنك تعديل الخطاب مباشرة" : language === "fr" ? "Vous pouvez modifier la lettre directement" : "You can edit the letter directly above"}
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-xl p-8">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="text-[#FF4D2D] w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{t.emptyTitle}</h3>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">{t.emptyDesc}</p>

                {/* Preview skeleton */}
                <div className="w-full mt-6 space-y-2 opacity-30">
                  {[100, 90, 95, 85, 70].map((w, i) => (
                    <div key={i} className="h-2.5 bg-slate-200 rounded-full" style={{ width: `${w}%` }} />
                  ))}
                  <div className="h-2.5 bg-slate-200 rounded-full w-1/2 mt-4" />
                  {[100, 88, 92].map((w, i) => (
                    <div key={i} className="h-2.5 bg-slate-200 rounded-full" style={{ width: `${w}%` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
