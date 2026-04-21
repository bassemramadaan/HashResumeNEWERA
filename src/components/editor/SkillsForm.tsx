import React, { useState, useMemo, Suspense, lazy } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import { Plus, X, Sparkles, AlertCircle } from "lucide-react";
import SectionTooltip from "./SectionTooltip";
import { getJobMatchResults } from "../../utils/ats";

const AISuggestion = lazy(() => import("./AISuggestion"));

const SUGGESTED_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "HTML/CSS",
  "SQL",
  "NoSQL",
  "Git",
  "Docker",
  "AWS",
  "Agile",
  "Communication",
  "Problem Solving",
  "Team Leadership",
  "Project Management",
];

const SkillsForm = () => {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const { data, addSkill, removeSkill } = useResumeStore();
  const { skills, jobDescription } = data;
  const [inputValue, setInputValue] = useState("");
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const matchResults = useMemo(() => getJobMatchResults(data), [data]);

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && !skills.includes(trimmed)) {
      addSkill(trimmed);
      setInputValue("");
    }
  };

  const unaddedSuggestions = SUGGESTED_SKILLS.filter(
    (s) => !skills.includes(s),
  ).slice(0, 8);

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 transition-colors">
        <form onSubmit={handleAdd} className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <label
                htmlFor="skillInput"
                className="block text-sm font-medium text-slate-700"
              >
                {t.skills.title}
              </label>
              <SectionTooltip
                title={t.skills.tips}
                content={t.skills.tipsContent}
                example={t.skills.tipsExample}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
                          title={language === "ar" ? "اقتراح مهارات ذكية بناءً على بياناتك" : "Suggest smart skills based on your profile"}
            >
              <Sparkles size={14} />
              {language === "ar" ? "إصلاح عبر الذكاء الاصطناعي" : "Fix with AI"}
            </button>
          </div>

          {showAISuggestions && (
            <div className="mb-4">
              <Suspense
                fallback={
                  <div className="h-20 animate-pulse bg-slate-100 rounded-xl mb-4" />
                }
              >
                <AISuggestion
                  currentValue={skills.join(", ")}
                  onApply={(newText) => {
                    const newSkills = newText
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    newSkills.forEach((skill) => {
                      if (!skills.includes(skill)) {
                        addSkill(skill);
                      }
                    });
                    setShowAISuggestions(false);
                  }}
                  context={`Job Title: ${data.personalInfo.jobTitle}, Job Description: ${data.jobDescription}`}
                  promptOverride="Based on the job title and description, suggest a comma-separated list of 5-10 relevant skills. Only return the comma-separated list, no other text."
                />
              </Suspense>
              <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1 opacity-70 px-2 leading-tight">
                   <Sparkles size={10} className="text-indigo-400 shrink-0" />
                   {language === "ar" 
                     ? "يتم إرسال المهارات والوصف الوظيفي (بدون هويات) بشكل مشفر لاقتراح مهارات مخصصة."
                     : "Only skills and job description (no PII) are sent anonymously to generate tailored suggestions."}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              id="skillInput"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-slate-50 text-slate-900 placeholder-slate-400"
              placeholder={t.skills.placeholder}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:from-slate-300 disabled:to-slate-300 disabled:text-white0 text-white px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95 shadow-sm shadow-indigo-500/20"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">{t.skills.add}</span>
            </button>
          </div>
        </form>

        <div className="mb-8">
          <h3 className="text-sm font-medium text-slate-500 mb-4">
            {t.skills.yourSkills}
          </h3>
          {skills.length === 0 ? (
            <p className="text-sm text-slate-500 italic">
              {t.skills.noSkills}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-800 text-sm font-medium group transition-colors"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-slate-500 hover:text-red-500 focus:outline-none transition-colors"
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ATS Hint */}
        {jobDescription && matchResults && (
          <div className="mb-8 text-xs flex items-start gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="text-slate-600">
              <span className="font-semibold text-slate-700">{t.editor.experience.atsHint}: </span>
              {matchResults.missing.length > 0 ? (
                <>
                  {t.skills.tryAddingKeywords}{" "}
                  <span className="text-red-500 font-medium">
                    {matchResults.missing.slice(0, 5).join(", ")}
                  </span>
                </>
              ) : (
                <span className="text-emerald-500 font-medium">
                  {t.editor.experience.greatMatched}
                </span>
              )}
            </div>
          </div>
        )}

        {unaddedSuggestions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-500" />
              {t.skills.aiSuggestionsFree}
            </h3>
            <div className="flex flex-wrap gap-2">
              {unaddedSuggestions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => addSkill(skill)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-sm font-medium transition-colors"
                >
                  <Plus size={14} />
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsForm;
