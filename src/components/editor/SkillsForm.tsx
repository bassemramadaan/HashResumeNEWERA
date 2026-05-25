import React, { useState, useMemo } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import { Plus, X, Sparkles, AlertCircle } from "lucide-react";
import SectionTooltip from "./SectionTooltip";
import { getJobMatchResults } from "../../utils/ats";

import AISuggestion from "./AISuggestion";

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
  const { skills, jobDescription, personalInfo } = data;
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
                {String(t.skills?.title || "")}
              </label>
              <SectionTooltip
                title={String(t.skills?.tips || "")}
                content={String(t.skills?.tipsContent || "")}
                example={String(t.skills?.tipsExample || "")}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
                          title={language === "ar" ? "اقتراح مهارات ذكية بناءً على بياناتك" : "Suggest smart skills based on your profile"}
            >
              <Sparkles size={14} />
              {language === "ar" ? "تحسين بالذكاء الاصطناعي" : "Improve with AI"}
            </button>
          </div>

          {showAISuggestions && (
            <div className="mb-4">
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
              placeholder={String(t.skills?.placeholder || "")}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:from-slate-300 disabled:to-slate-300 disabled:text-white0 text-white px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95 shadow-sm shadow-indigo-500/20"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">{String(t.skills?.add || "")}</span>
            </button>
          </div>

          {/* Smart Auto-Complete Suggested Skills based on Job Title */}
          {personalInfo.jobTitle && (
            <div className="mt-3 bg-indigo-50/40 p-3 rounded-xl border border-indigo-100/40">
              <h4 className="text-[11px] font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                <Sparkles size={11} className="text-indigo-500" />
                {language === "ar" 
                  ? `مهارات ذكية مقترحة لمجال (${personalInfo.jobTitle}) - اضغط للإضافة:`
                  : `Smart suggestions for (${personalInfo.jobTitle}) - click to insert:`}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(() => {
                  const title = (personalInfo.jobTitle || "").toLowerCase();
                  const pool = language === "ar"
                    ? (title.includes("برمج") || title.includes("مطور") || title.includes("ويب") || title.includes("برنامج") || title.includes("تقن") || title.includes("tech") || title.includes("dev") || title.includes("soft") || title.includes("engineer")
                        ? ["جافا سكريبت", "تايب سكريبت", "رياكت (React)", "Node.js", "قواعد بيانات SQL", "Git & GitHub", "حل المشكلات البرمجية", "منهجية Agile"]
                        : title.includes("تصميم") || title.includes("مُصمم") || title.includes("رسام") || title.includes("ديزاين") || title.includes("design") || title.includes("ui") || title.includes("ux") || title.includes("graphic")
                        ? ["تصميم واجهات UI", "Figma", "Adobe Photoshop", "الهوية البصرية", "تصميم تجربة UX", "التفكير الإبداعي", "تصميم الشعارات", "تعديل الصور"]
                        : title.includes("تسويق") || title.includes("مبيعات") || title.includes("ماركت") || title.includes("سوشيال") || title.includes("social") || title.includes("marketing") || title.includes("sales")
                        ? ["التسويق الرقمي", "إعلانات جوجل وفيسبوك", "إستراتيجية السوشيال ميديا", "تحسين محركات البحث SEO", "إستراتيجيات النمو", "مهارات الإقناع", "تحليل البيانات"]
                        : title.includes("مشروع") || title.includes("ادارة") || title.includes("مدير") || title.includes("تخطيط") || title.includes("manager") || title.includes("project")
                        ? ["إدارة المشاريع", "تخطيط المهام والميزانية", "منهجية Scrum & Agile", "حل النزاعات والقيادة", "تنسيق جهود الفريق", "إدارة المخاطر"]
                        : ["إدارة الوقت", "التواصل الفعال", "حل المشكلات العميقة", "العمل الجماعي", "مهارات الإقناع", "التفكير الإبداعي", "التخطيط التنظيمي"])
                    : (title.includes("soft") || title.includes("dev") || title.includes("web") || title.includes("engineer") || title.includes("program") || title.includes("tech")
                        ? ["JavaScript", "TypeScript", "React.js", "Node.js", "SQL & NoSQL", "Git", "RESTful APIs", "Docker", "Problem Solving", "Agile"]
                        : title.includes("design") || title.includes("art") || title.includes("ui") || title.includes("ux") || title.includes("graphic")
                        ? ["UI/UX Design", "Figma", "Adobe Suite", "Visual Design", "Wireframing", "User Research", "Prototyping", "Design Systems"]
                        : title.includes("market") || title.includes("sale") || title.includes("social") || title.includes("seo") || title.includes("growth")
                        ? ["Digital Marketing", "SEO & SEM", "Social Media Strategy", "Google Analytics", "Sales Pitching", "CRM Systems", "Content Strategy"]
                        : title.includes("project") || title.includes("manage") || title.includes("lead") || title.includes("scrum")
                        ? ["Project Management", "Agile & Scrum", "Risk Assessment", "Stakeholder Communication", "Resource Allocation", "Leadership"]
                        : ["Communication", "Problem Solving", "Time Management", "Collaboration", "Critical Thinking", "Adaptability"]);

                  const filtered = pool.filter(s => !skills.includes(s));
                  if (filtered.length === 0) {
                    return (
                      <span className="text-xs text-slate-400 italic">
                        {language === "ar" ? "لقد أضفت كل المهارات المقترحة!" : "All suggested skills added!"}
                      </span>
                    );
                  }
                  return filtered.map((skillName) => (
                    <button
                      key={skillName}
                      type="button"
                      onClick={() => addSkill(skillName)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-100/30 cursor-pointer select-none"
                    >
                      <span>+</span>
                      <span>{skillName}</span>
                    </button>
                  ));
                })()}
              </div>
            </div>
          )}
        </form>

        <div className="mb-8">
          <h3 className="text-sm font-medium text-slate-500 mb-4">
            {String(t.skills?.yourSkills || "")}
          </h3>
          {skills.length === 0 ? (
            <p className="text-sm text-slate-500 italic">
              {String(t.skills?.noSkills || "")}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const skillName = typeof skill === 'string' ? skill : skill.name;
                return (
                <span
                  key={skillName}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-800 text-sm font-medium group transition-colors"
                >
                  {skillName}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-slate-500 hover:text-red-500 focus:outline-none transition-colors"
                    aria-label={`Remove ${skillName}`}
                  >
                    <X size={14} />
                  </button>
                </span>
                );
              })}
            </div>
          )}
        </div>

        {/* ATS Hint */}
        {jobDescription && matchResults && (
          <div className="mb-8 text-xs flex items-start gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="text-slate-600">
              <span className="font-semibold text-slate-700">{String(t.experience?.atsHint || "")}: </span>
              {matchResults.missing.length > 0 ? (
                <>
                  {String(t.skills?.tryAddingKeywords || "")}{" "}
                  <span className="text-red-500 font-medium">
                    {matchResults.missing.slice(0, 5).join(", ")}
                  </span>
                </>
              ) : (
                <span className="text-emerald-500 font-medium">
                  {String(t.experience?.greatMatched || "")}
                </span>
              )}
            </div>
          </div>
        )}

        {unaddedSuggestions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-500" />
              {String(t.skills?.aiSuggestionsFree || "")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {unaddedSuggestions.map((skill) => {
                const skillName = typeof skill === 'string' ? skill : skill.name;
                return (
                <button
                  key={skillName}
                  onClick={() => addSkill(skill)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-sm font-medium transition-colors"
                >
                  <Plus size={14} />
                  {skillName}
                </button>
                );
              })}
            </div>
          </div>
        )
}
      </div>
    </div>
  );
};

export default SkillsForm;
