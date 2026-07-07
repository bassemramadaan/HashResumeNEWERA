import React, { useState, useMemo } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import { Plus, X, Sparkles, AlertCircle, Star, Tag } from "lucide-react";
import SectionTooltip from "./SectionTooltip";
import { getJobMatchResults } from "../../utils/ats";
import QuickAIAssistPill from "./QuickAIAssistPill";
import SkillsRadarGraph, { getSkillCategoryFallback } from "./SkillsRadarGraph";

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

  // Load and save skill levels persistently
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(`cv-skill-levels-${personalInfo.fullName || 'default'}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Load and save skill categories persistently
  const [skillCategories, setSkillCategories] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`cv-skill-categories-${personalInfo.fullName || 'default'}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const getSkillLevel = (skillName: string) => {
    return skillLevels[skillName] ?? 4; // default to 4/5
  };

  const setAndSaveSkillLevel = (skillName: string, level: number) => {
    const updated = { ...skillLevels, [skillName]: level };
    setSkillLevels(updated);
    try {
      localStorage.setItem(`cv-skill-levels-${personalInfo.fullName || 'default'}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const getSkillCategory = (skillName: string) => {
    return skillCategories[skillName] ?? getSkillCategoryFallback(skillName);
  };

  const setAndSaveSkillCategory = (skillName: string, category: string) => {
    const updated = { ...skillCategories, [skillName]: category };
    setSkillCategories(updated);
    try {
      localStorage.setItem(`cv-skill-categories-${personalInfo.fullName || 'default'}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

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
      {/* 📊 Interactive 3D Skills Radar Chart */}
      <SkillsRadarGraph
        skills={skills.map(s => typeof s === 'string' ? s : s.name)}
        skillLevels={skillLevels}
        skillCategories={skillCategories}
        language={language}
      />

      {/* Live ATS Keyword Assistant bar */}
      {jobDescription && matchResults && matchResults.missing.length > 0 && (
        <div className="bg-gradient-to-tr from-brand-50 to-orange-50/40 border border-brand-200/60 rounded-2.5xl p-5 md:p-6 shadow-[0_8px_20px_-4px_rgba(255,77,45,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-5 animate-fade-in text-start relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-400/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
          
          <div className="space-y-1.5 relative z-10 max-w-sm">
            <div className="flex items-center gap-2 text-brand-600 font-black text-xs uppercase tracking-wide">
              <Sparkles size={14} className="text-brand-500 animate-pulse shrink-0" />
              <span>{language === "ar" ? "مساعد كلمات الـ ATS المباشر" : "Live ATS Keyword Assistant"}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
              {language === "ar"
                ? "دققنا الوصف الوظيفي لشركتك واكتشفنا كلمات مفقودة هامة. اضغط على أي منها لإضافتها فوراً وسيرتفع تقييم الـ ATS Score أمامك تلقائياً:"
                : "We audited your company job description and found high-impact missing keywords. Click to inject instantly:"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto relative z-10 shrink-0">
            {matchResults.missing.slice(0, 6).map((missingKey) => (
              <button
                key={missingKey}
                type="button"
                onClick={() => addSkill(missingKey)}
                className="bg-white/80 backdrop-blur-sm hover:bg-brand-500 text-slate-700 hover:text-white border border-slate-200/80 hover:border-brand-500 rounded-xl px-3 py-1.5 text-xs font-black transition-all cursor-pointer shadow-sm flex items-center gap-1.5 active:scale-95 group/btn"
              >
                <Plus size={12} className="text-brand-500 group-hover/btn:text-white transition-colors" />
                <span>{missingKey}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-150 transition-colors">
        <form onSubmit={handleAdd} className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <label
                htmlFor="skillInput"
                className="text-[11px] font-semibold text-slate-500 block mb-1"
              >
                {String(t.skills?.title || "")}
              </label>
              <SectionTooltip
                title={String(t.skills?.tips || "")}
                content={String(t.skills?.tipsContent || "")}
                example={String(t.skills?.tipsExample || "")}
              />
              <QuickAIAssistPill
                section="skills"
                onInject={(skill) => {
                  if (skill && !skills.includes(skill)) {
                    addSkill(skill);
                  }
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              className="text-xs font-bold text-brand-600 flex items-center gap-1 bg-brand-50/50 hover:bg-brand-50 px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-brand-100/30"
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
                   <Sparkles size={10} className="text-brand-400 shrink-0" />
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
              className="flex-1 px-3 py-2.5 border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 focus:bg-white hover:border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition-all text-slate-900 placeholder-slate-400 font-medium"
              placeholder={String(t.skills?.placeholder || "")}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-slate-900 hover:bg-slate-950 disabled:bg-slate-200 text-white px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 hover:scale-[1.01] active:scale-95 shadow-sm cursor-pointer"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">{String(t.skills?.add || "")}</span>
            </button>
          </div>

          {/* Smart Auto-Complete Suggested Skills based on Job Title */}
          {personalInfo.jobTitle && (
            <div className="mt-3 bg-brand-50/15 p-3 rounded-xl border border-brand-100/30">
              <h4 className="text-[11px] font-bold text-slate-650 mb-2 flex items-center gap-1.5">
                <Sparkles size={11} className="text-brand-550" />
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
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-brand-50/40 text-brand-700 hover:bg-brand-50 hover:text-brand-800 transition-colors border border-brand-100/30 cursor-pointer select-none"
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

        <div className="mb-6">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-4">
            {String(t.skills?.yourSkills || "Your Skills")}
          </h3>
          {skills.length === 0 ? (
            <p className="text-xs text-slate-500 italic font-medium">
              {String(t.skills?.noSkills || "")}
            </p>
          ) : (
            <div className="space-y-3">
              {skills.map((skill) => {
                const skillName = typeof skill === 'string' ? skill : skill.name;
                const level = getSkillLevel(skillName);
                const category = getSkillCategory(skillName);

                return (
                  <div
                    key={skillName}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-150 bg-slate-50/40 hover:bg-slate-50 transition-all shadow-3xs"
                  >
                    {/* Left: Skill Name and Category Dropdown */}
                    <div className="flex flex-col gap-1.5 text-start">
                      <span className="font-extrabold text-sm text-slate-800">
                        {skillName}
                      </span>
                      
                      {/* Interactive Category Selector */}
                      <div className="flex items-center gap-1.5">
                        <Tag size={12} className="text-slate-400" />
                        <select
                          value={category}
                          onChange={(e) => setAndSaveSkillCategory(skillName, e.target.value)}
                          className="bg-transparent text-[10px] font-bold text-slate-500 border-none hover:text-brand-650 focus:text-brand-650 outline-none p-0 cursor-pointer transition-colors"
                        >
                          <option value="tech">{language === 'ar' ? '🔧 خبرة تقنية' : '🔧 Tech Skill'}</option>
                          <option value="collab">{language === 'ar' ? '🤝 عمل جماعي' : '🤝 Collaboration'}</option>
                          <option value="strategy">{language === 'ar' ? '📈 قيادة وتخطيط' : '📈 Strategy'}</option>
                          <option value="problem">{language === 'ar' ? '💡 حل مشكلات' : '💡 Problem Solv'}</option>
                          <option value="creative">{language === 'ar' ? '🎨 تصميم وابتكار' : '🎨 Creative'}</option>
                        </select>
                      </div>
                    </div>

                    {/* Right: Stars Level Controls & Delete Button */}
                    <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0">
                      {/* 5-Dots Interactive Rating Selector */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setAndSaveSkillLevel(skillName, star)}
                            className="p-1 cursor-pointer group focus:outline-none transition-transform active:scale-90"
                            title={`${language === 'ar' ? 'مستوى' : 'Level'} ${star}/5`}
                          >
                            <Star
                              size={15}
                              className={`transition-all duration-300 ${
                                star <= level
                                  ? 'fill-brand-500 text-brand-500 scale-110 drop-shadow-[0_0_2px_rgba(255,77,45,0.4)]'
                                  : 'text-slate-300 hover:text-brand-400 hover:scale-105'
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      {/* Delete Action button */}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                        aria-label={`Remove ${skillName}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ATS Hint */}
        {jobDescription && matchResults && (
          <div className="mb-6 text-xs flex items-start gap-2 p-3 bg-slate-50/70 rounded-xl border border-slate-150">
            <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="text-slate-600">
              <span className="font-semibold text-slate-705">{String(t.experience?.atsHint || "")}: </span>
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
            <h3 className="text-[11px] font-semibold text-slate-500 block mb-1 mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-brand-500" />
              {String(t.skills?.aiSuggestionsFree || "")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {unaddedSuggestions.map((skill) => {
                const skillName = typeof skill === 'string' ? skill : skill.name;
                return (
                  <button
                    key={skillName}
                    onClick={() => addSkill(skill)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-650 hover:bg-brand-50/40 hover:text-brand-700 hover:border-brand-200/50 text-xs sm:text-sm font-semibold transition-all shadow-3xs cursor-pointer"
                  >
                    <Plus size={14} className="text-brand-500" />
                    {skillName}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsForm;
