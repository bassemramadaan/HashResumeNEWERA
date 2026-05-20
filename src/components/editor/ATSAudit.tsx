import { useState, useMemo } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  CheckCircle2,
  AlertCircle,
  Activity,
  Target,
  Briefcase,
  Sparkles,
  Loader2,
  Check,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateATSScore, getJobMatchResults } from "../../utils/ats";

const aiT = {
  ar: {
    optTitle: "مُحسِّن السيرة الذاتية التفاعلي بالذكاء الاصطناعي ✨",
    optSubtitle: "سيقوم الذكاء الاصطناعي بصياغة ملخص مهني رائع، واقتراح الكلمات المفتاحية والمهارات المفقودة، وتعديل خبراتك العملية لتتجاوز اختبارات الفلترة بنجاح وبشكل طبيعي واحترافي.",
    optimizeBtn: "تحسين السيرة الذاتية بالذكاء الاصطناعي (AI)",
    optimizing: "جاري تحليل السيرة الذاتية وصياغة التحسينات المطلوبة...",
    summaryTitle: "الملخص المهني المقترح ✨",
    skillsTitle: "مهارات إضافية مفقودة 💡",
    expTitle: "صياغة معززة للخبرات والمسؤوليات 🚀",
    applyAll: "تطبيق كافة التحسينات والمهارات المقترحة دفعة واحدة",
    applySummary: "تحديث الملخص المهني فقط",
    applied: "تم التطبيق بنجاح ✅",
    applySkill: "أضف هذه المهارة",
    applyExp: "تحديث صياغة هذه الخبرة",
    compareCurrent: "الحالي في سيرتك:",
    compareAI: "صياغة الذكاء الاصطناعي المقترحة:",
    noExpToOptimize: "لم يتم العثور على خبرات عملية مضافة في سيرتك لتحسين صياغتها.",
    noSkillsToOptimize: "كل المهارات المقترحة تمت إضافتها بالفعل إلى سيرتك!",
    errorMsg: "حدث خطأ أثناء تشغيل المحسِّن التفاعلي. يرجى تكرار المحاولة."
  },
  en: {
    optTitle: "Dynamic AI CV Optimizer ✨",
    optSubtitle: "AI will analyze the target Job Description to craft an outstanding summary, propose relevant missing skills, and rewrite your work experiences naturally to pass the ATS filter with high scores.",
    optimizeBtn: "Optimize Resume with AI",
    optimizing: "Analyzing requirements & generating tailormade improvements...",
    summaryTitle: "Proposed Professional Summary ✨",
    skillsTitle: "AI Suggested Relevant Skills 💡",
    expTitle: "Refined Experience Bullet Points 🚀",
    applyAll: "Apply All Suggested AI Enhancements",
    applySummary: "Apply Summary Only",
    applied: "Applied Successfully ✅",
    applySkill: "Add This Skill",
    applyExp: "Apply Refined Experience",
    compareCurrent: "Current CV Text:",
    compareAI: "AI Optimized Alternative:",
    noExpToOptimize: "No work experience entries found to optimize.",
    noSkillsToOptimize: "All proposed skills are already present!",
    errorMsg: "An error occurred during AI optimization. Please try again."
  },
  fr: {
    optTitle: "Optimiseur Interactif de CV (IA) ✨",
    optSubtitle: "L'IA optimisera votre résumé, ajoutera les compétences manquantes requises et affinera vos descriptions d'expériences professionnelles.",
    optimizeBtn: "Optimiser le CV avec l'IA",
    optimizing: "Analyse et réécriture intelligente en cours...",
    summaryTitle: "Résumé Professionnel Suggéré ✨",
    skillsTitle: "Compétences Suggérées 💡",
    expTitle: "Fiche d'Expérience Retravaillée 🚀",
    applyAll: "Appliquer toutes les optimisations IA",
    applySummary: "Appliquer le résumé",
    applied: "Appliqué avec succès ✅",
    applySkill: "Ajouter la compétence",
    applyExp: "Appliquer la description",
    compareCurrent: "Texte Actuel :",
    compareAI: "Amélioration Proposée :",
    noExpToOptimize: "Aucune expérience professionnelle trouvée à optimiser.",
    noSkillsToOptimize: "Toutes les compétences suggérées sont déjà ajoutées !",
    errorMsg: "Échec de l'optimiseur par l'IA. Veuillez réessayer."
  }
};

export default function ATSAudit() {
  const { data, updateJobDescription, updatePersonalInfo, updateExperience } = useResumeStore();
  const { language } = useLanguageStore();
  const t = translations[language].atsAudit;
  const ait = aiT[language] || aiT.en;
  const { personalInfo, jobDescription } = data;
  const [showMatcher, setShowMatcher] = useState(!!jobDescription);

  // States for AI CV Optimization
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationData, setOptimizationData] = useState<{
    optimizedSummary: string;
    recommendedSkills: string[];
    optimizedExperience: { id: string; position: string; company: string; oldDescription: string; newDescription: string }[];
  } | null>(null);
  const [optimizationError, setOptimizationError] = useState<string | null>(null);
  const [appliedSections, setAppliedSections] = useState<{
    summary?: boolean;
    skills?: Record<string, boolean>;
    experience?: Record<string, boolean>;
  }>({});

  const { score, sections } = useMemo(() => calculateATSScore(data), [data]);
  const isEmpty = score === 0 && !personalInfo.fullName;

  const matchResults = useMemo(() => {
    return getJobMatchResults(data);
  }, [data]);

  const handleOptimize = async () => {
    if (!jobDescription || !jobDescription.trim()) return;
    setOptimizing(true);
    setOptimizationError(null);
    setOptimizationData(null);

    const resumeTxt = `
      Summary: ${personalInfo.summary || "None provided"}
      Skills: ${(data.skills || []).join(", ")}
      Experience:
      ${(data.experience || []).map(e => `ID: ${e.id} | Position: ${e.position} | Company: ${e.company} | Description: ${e.description}`).join("\n\n")}
    `;

    const systemInstruction = `You are a world-class Applicant Tracking System (ATS) Optimizer.
Analyze the user's CV summary, skills, and work experiences against the provided Job Description.
Refactor and optimize the summary, suggest relevant missing skills, and rewrite the experience descriptions to seamlessly incorporate missing keywords, active verbs, and quantitative achievements or metrics where possible.

Follow these strict rules:
1. Retain the exact original employment history, positions, company names, and dates. Do NOT invent new jobs, credentials, or dates under any circumstances.
2. Maintain high-level tone and professional stylistic structure in the exact language of the CV (Arabic if CV is Arabic, English if English).
3. Under "optimizedExperience", use the exact same ID passed for each experience. Rewrite the description using clean markdown bullet points starting with bullet symbol (e.g. "• Bullet 1").
4. Output a strict, valid JSON object matching the schema below. Output nothing but the pure JSON object:
{
  "optimizedSummary": "A revised, highly professional Summary incorporating relevant terms.",
  "recommendedSkills": ["Skill 1", "Skill 2", "Skill 3"],
  "optimizedExperience": [
    {
      "id": "exp_id_here",
      "newDescription": "• Refined bullet point 1...\\n• Refined bullet point 2..."
    }
  ]
}`;

    const promptText = `
=== RESUME INFO ===
${resumeTxt}

=== TARGET JOB DESCRIPTION ===
${jobDescription}

=== MISSING KEYWORDS ===
${(matchResults?.missing || []).join(", ")}
    `;

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.error?.message || "Failed to generate optimized content");
      }

      const text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("Empty response received from API");
      }

      const parsed = JSON.parse(text);

      const optimizedExpMapped = (parsed.optimizedExperience || []).map((oe: any) => {
        const found = data.experience.find(e => e.id === oe.id);
        return {
          id: oe.id,
          position: found?.position || "",
          company: found?.company || "",
          oldDescription: found?.description || "",
          newDescription: oe.newDescription || ""
        };
      }).filter((oe: any) => oe.id && oe.newDescription);

      setOptimizationData({
        optimizedSummary: parsed.optimizedSummary || "",
        recommendedSkills: parsed.recommendedSkills || [],
        optimizedExperience: optimizedExpMapped
      });

      setAppliedSections({});
    } catch (err: any) {
      console.error("AI Optimizer Error:", err);
      setOptimizationError(err.message || ait.errorMsg);
    } finally {
      setOptimizing(false);
    }
  };

  const applySummaryOnly = () => {
    if (!optimizationData) return;
    updatePersonalInfo({ summary: optimizationData.optimizedSummary });
    setAppliedSections(prev => ({ ...prev, summary: true }));
  };

  const applySingleSkill = (skill: string) => {
    if (!data.skills.includes(skill)) {
      useResumeStore.getState().addSkill(skill);
    }
    setAppliedSections(prev => {
      const skillsApplied = { ...prev.skills, [skill]: true };
      return { ...prev, skills: skillsApplied };
    });
  };

  const applySingleExperience = (id: string, newDesc: string) => {
    updateExperience(id, { description: newDesc });
    setAppliedSections(prev => {
      const expApplied = { ...prev.experience, [id]: true };
      return { ...prev, experience: expApplied };
    });
  };

  const applyAllChanges = () => {
    if (!optimizationData) return;

    // Apply summary
    updatePersonalInfo({ summary: optimizationData.optimizedSummary });

    // Apply skills
    optimizationData.recommendedSkills.forEach(sk => {
      if (!data.skills.includes(sk)) {
        useResumeStore.getState().addSkill(sk);
      }
    });

    // Apply experiences
    optimizationData.optimizedExperience.forEach(oe => {
      updateExperience(oe.id, { description: oe.newDescription });
    });

    // Set all applied
    const allSkillsApplied: Record<string, boolean> = {};
    optimizationData.recommendedSkills.forEach(sk => { allSkillsApplied[sk] = true; });

    const allExpApplied: Record<string, boolean> = {};
    optimizationData.optimizedExperience.forEach(oe => { allExpApplied[oe.id] = true; });

    setAppliedSections({
      summary: true,
      skills: allSkillsApplied,
      experience: allExpApplied
    });
  };

  if (isEmpty) {
    return (
      <div className="space-y-6 font-sans">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="text-indigo-500" size={24} />
            {t.title}
          </h2>
        </div>
        <div className="bg-slate-50 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 text-center transition-colors">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ring-1 ring-slate-900/5">
            <Activity className="text-slate-500" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {t.noDataTitle}
          </h3>
          <p className="text-white0 max-w-md mx-auto">{t.noDataDesc}</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-indigo-500";
    if (s >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Target className="text-indigo-500" size={24} />
          {t.title}
        </h2>
      </div>

      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 transition-colors">
        {/* Score Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-100">
          <div className="relative flex items-center justify-center shrink-0 w-40 h-40">
            <svg className="w-40 h-40 transform -rotate-90 absolute inset-0">
              <defs>
                <linearGradient
                  id="score-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    className="text-indigo-600"
                    stopColor="currentColor"
                  />
                  <stop
                    offset="100%"
                    className="text-cyan-600"
                    stopColor="currentColor"
                  />
                </linearGradient>
              </defs>
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-100 transition-colors"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={score >= 80 ? "url(#score-gradient)" : "currentColor"}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * score) / 100}
                className={cn(
                  "transition-all duration-1000 ease-out",
                  score < 80 ? getScoreColor(score) : "",
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={cn(
                  "text-5xl font-black tracking-tighter",
                  score >= 80
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent"
                    : getScoreColor(score),
                )}
              >
                {score}
              </span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
                {t.scoreOutOf}
              </span>
            </div>
          </div>

          <div className="text-center md:text-start">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {score >= 80
                ? t.greatJob
                : score >= 50
                  ? t.goodStart
                  : t.needsImprovement}
            </h3>
            <p className="text-slate-600 leading-relaxed max-w-lg">
              {t.atsExplanation}
            </p>
          </div>
        </div>

        {/* Section Breakdown */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-slate-900 mb-6">
            {t.sectionBreakdown}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">
                    {section.title}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-full",
                      section.score === section.maxScore
                        ? "bg-emerald-100 text-emerald-700"
                        : section.score > 0
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700",
                    )}
                  >
                    {section.score}/{section.maxScore}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      section.score === section.maxScore
                        ? "bg-emerald-500"
                        : section.score > 0
                          ? "bg-yellow-500"
                          : "bg-red-500",
                    )}
                    style={{
                      width: `${section.maxScore > 0 ? (section.score / section.maxScore) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detailed Feedback */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-slate-900">
              {t.detailedSuggestions}
            </h3>
            {sections.map(
              (section, idx) =>
                section.improvements.length > 0 && (
                  <div key={idx} className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <AlertCircle size={14} className="text-red-500" />
                      {section.title}
                    </h4>
                    <ul className="space-y-2">
                      {section.improvements.map((imp, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-4 p-4 bg-red-50/30 rounded-xl border border-red-100/50"
                        >
                          <div className="mt-2 shrink-0 w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-sm text-slate-700">{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
            )}
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-bold text-slate-900">
              {t.workingWell}
            </h3>
            {sections.map(
              (section, idx) =>
                section.goodPoints.length > 0 && (
                  <div key={idx} className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      {section.title}
                    </h4>
                    <ul className="space-y-2">
                      {section.goodPoints.map((gp, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-4 p-4 bg-emerald-50/30 rounded-xl border border-emerald-100/50"
                        >
                          <CheckCircle2
                            size={14}
                            className="text-emerald-500 shrink-0 mt-0.5"
                          />
                          <span className="text-sm text-slate-700">{gp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
            )}
          </div>
        </div>

        {/* Job Description Matcher (FREE) */}
        <div className="mt-12 pt-10 border-t border-slate-100 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="text-indigo-500" size={24} />
              {t.jobMatcher}{" "}
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ms-2">
                {t.free}
              </span>
            </h3>
            <button
              onClick={() => setShowMatcher(!showMatcher)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-colors"
            >
              {showMatcher ? t.hideMatcher : t.compareWithJD}
            </button>
          </div>

          {showMatcher && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 transition-colors">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {t.pasteJD}
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => updateJobDescription(e.target.value)}
                  placeholder={t.pastePlaceholder}
                  className="w-full h-40 p-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-sm"
                />
              </div>

              {matchResults && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center transition-colors">
                      <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">
                        {t.matchScore}
                      </div>
                      <div
                        className={cn(
                          "text-5xl font-black tracking-tighter mb-2",
                          matchResults.matchPercentage >= 70
                            ? "text-emerald-500"
                            : matchResults.matchPercentage >= 40
                              ? "text-yellow-500"
                              : "text-red-500",
                        )}
                      >
                        {matchResults.matchPercentage}%
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {t.basedOnKeywords}
                      </p>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <AlertCircle className="text-red-500" size={16} />
                          {t.missingKeywords} ({matchResults.missing.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {matchResults.missing.length > 0 ? (
                            matchResults.missing.map((kw) => (
                              <span
                                key={kw}
                                className="bg-red-50 text-red-700 border border-red-100 px-4 py-1 rounded-full text-xs font-medium transition-colors"
                              >
                                {kw}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-slate-500 italic">
                              {t.noMissingKeywords}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <CheckCircle2 className="text-emerald-500" size={16} />
                          {t.matchedKeywords} ({matchResults.matched.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {matchResults.matched.length > 0 ? (
                            matchResults.matched.map((kw) => (
                              <span
                                key={kw}
                                className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-1 rounded-full text-xs font-medium transition-colors"
                              >
                                {kw}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-slate-500 italic">
                              {t.noMatchedKeywords}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stunning Interactive AI Optimizer component */}
                  <div className="mt-8 bg-gradient-to-br from-indigo-50/50 via-slate-50 to-purple-50/50 p-6 rounded-2xl border border-slate-200 shadow-xs transition-all">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <Sparkles className="text-indigo-600 animate-pulse" size={20} />
                          {ait.optTitle}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                          {ait.optSubtitle}
                        </p>
                      </div>
                      <button
                        onClick={handleOptimize}
                        disabled={optimizing}
                        className={cn(
                          "w-full md:w-auto shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-xs cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none",
                        )}
                      >
                        {optimizing ? (
                          <>
                            <Loader2 className="animate-spin" size={16} />
                            <span>{ait.optimizing}</span>
                          </>
                        ) : (
                          <>
                            <Wand2 size={16} />
                            <span>{ait.optimizeBtn}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {optimizationError && (
                      <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
                        {optimizationError}
                      </div>
                    )}

                    {optimizationData && (
                      <div className="mt-8 space-y-6">
                        {/* Summary Section */}
                        {optimizationData.optimizedSummary && (
                          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-1.5 h-3 bg-indigo-500 rounded-full" />
                                {ait.summaryTitle}
                              </h5>
                              <button
                                onClick={applySummaryOnly}
                                disabled={appliedSections.summary}
                                className={cn(
                                  "text-xs font-bold px-4 py-1.5 rounded-lg border cursor-pointer transition-all",
                                  appliedSections.summary
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 pointer-events-none"
                                    : "bg-indigo-50 text-indigo-700 border-indigo-150 hover:bg-indigo-100"
                                )}
                              >
                                {appliedSections.summary ? ait.applied : ait.applySummary}
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-2">
                              {personalInfo.summary && (
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                  <div className="font-bold text-slate-500 mb-1">{ait.compareCurrent}</div>
                                  <p className="text-slate-600 leading-relaxed italic">{personalInfo.summary}</p>
                                </div>
                              )}
                              <div className="p-3 bg-indigo-50/10 rounded-lg border border-indigo-100/30">
                                <div className="font-bold text-indigo-600 mb-1">{ait.compareAI}</div>
                                <p className="text-slate-700 leading-relaxed font-semibold">{optimizationData.optimizedSummary}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Skills Section */}
                        {optimizationData.recommendedSkills && optimizationData.recommendedSkills.length > 0 && (
                          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                            <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                              <span className="w-1.5 h-3 bg-amber-500 rounded-full" />
                              {ait.skillsTitle}
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {optimizationData.recommendedSkills.map((sk) => {
                                const isSkillApplied = appliedSections.skills?.[sk] || data.skills.includes(sk);
                                return (
                                  <button
                                    key={sk}
                                    onClick={() => applySingleSkill(sk)}
                                    disabled={isSkillApplied}
                                    className={cn(
                                      "inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-semibold transition-all shadow-xs",
                                      isSkillApplied
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-150 pointer-events-none"
                                        : "bg-amber-50/30 text-amber-800 border-amber-200/60 hover:bg-amber-55/70 hover:scale-[1.02] cursor-pointer"
                                    )}
                                  >
                                    {isSkillApplied ? <Check size={12} /> : null}
                                    {sk}
                                    {!isSkillApplied && <span className="text-[10px] text-amber-500 font-bold ml-1">+</span>}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Experience Sections */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                          <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-1.5 h-3 bg-purple-500 rounded-full" />
                            {ait.expTitle}
                          </h5>
                          {optimizationData.optimizedExperience.length > 0 ? (
                            <div className="space-y-4">
                              {optimizationData.optimizedExperience.map((oe) => {
                                const isExpApplied = appliedSections.experience?.[oe.id];
                                return (
                                  <div key={oe.id} className="p-4 bg-slate-50/40 rounded-xl border border-slate-100">
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                      <div>
                                        <div className="text-sm font-bold text-slate-800">{oe.position}</div>
                                        <div className="text-xs text-slate-500 font-semibold">{oe.company}</div>
                                      </div>
                                      <button
                                        onClick={() => applySingleExperience(oe.id, oe.newDescription)}
                                        disabled={isExpApplied}
                                        className={cn(
                                          "text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer transition-all",
                                          isExpApplied
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 pointer-events-none"
                                            : "bg-purple-50 text-purple-700 border-purple-150 hover:bg-purple-100"
                                        )}
                                      >
                                        {isExpApplied ? ait.applied : ait.applyExp}
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                                      {oe.oldDescription && (
                                        <div>
                                          <div className="font-bold text-slate-500 mb-1">{ait.compareCurrent}</div>
                                          <p className="text-slate-500 whitespace-pre-line leading-relaxed italic">{oe.oldDescription}</p>
                                        </div>
                                      )}
                                      <div>
                                        <div className="font-bold text-purple-600 mb-1">{ait.compareAI}</div>
                                        <p className="text-slate-700 whitespace-pre-line leading-relaxed font-semibold">{oe.newDescription}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500">{ait.noExpToOptimize}</p>
                          )}
                        </div>

                        {/* Bulk Apply Button */}
                        <div className="pt-2">
                          <button
                            onClick={applyAllChanges}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm py-4 rounded-xl shadow-xs cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                          >
                            <CheckCircle2 size={18} />
                            <span>{ait.applyAll}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
