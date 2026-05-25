import React, { useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Copy,
  GripVertical,
} from "lucide-react";
import { Reorder } from "motion/react";
import FormSkeleton from "./FormSkeleton";
import SectionTooltip from "./SectionTooltip";

import AISuggestion from "./AISuggestion";

const EducationForm = () => {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const eduSuggestions = t.education.eduSuggestions;
  const universities = t.education.universities;
  const { data, isHydrated, addEducation, updateEducation, removeEducation, updateData } =
    useResumeStore();

  const [expandedId, setExpandedId] = useState<string | null>(
    data.education[0]?.id || null,
  );
  const [showSuggestionsFor, setShowSuggestionsFor] = useState<string | null>(
    null,
  );

  if (!isHydrated) {
    return <FormSkeleton />;
  }

  const { education } = data;

  const handleAdd = () => {
    addEducation({
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleReorder = (newOrder: typeof education) => {
    updateData({ ...data, education: newOrder });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SectionTooltip
            title={String(t.education?.title || "")}
            content={String(t.education?.tooltipDesc || "Add your educational background, starting with the most recent.")}
            example={String(t.education?.tooltipExample || "e.g., Bachelor of Science in Computer Science, Cairo University")}
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-slate-100 hover:text-slate-800 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-200 cursor-pointer hover:shadow-xs active:scale-95"
        >
          <Plus size={16} />
          {String(t.education?.add || "")}
        </button>
      </div>

      {education.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 border-dashed text-center text-slate-500 shadow-3xs">
          {String(t.education?.noEducation || "")}
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={education}
          onReorder={handleReorder}
          className="space-y-4"
        >
          {education.map((edu) => (
            <Reorder.Item
              key={edu.id}
              value={edu}
              className="bg-white rounded-2xl shadow-sm border border-slate-150 overflow-hidden transition-all"
            >
              <div
                className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
                onClick={() =>
                  setExpandedId(expandedId === edu.id ? null : edu.id)
                }
              >
                <div className="flex items-center gap-4">
                  <div
                    className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 tracking-tight">
                      {edu.degree || String(t.education?.notSpecified || "")}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5 font-medium/90">
                      {edu.institution || String(t.education?.institution || "")} •{" "}
                      {edu.startDate || String(t.education?.startDate || "")} - {edu.endDate || String(t.education?.endDate || "")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-4 md:gap-4 lg:gap-4 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const { id: _id, ...rest } = edu;
                      addEducation(rest);
                    }}
                    className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                    title={String(t.education?.duplicate || "")}
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeEducation(edu.id);
                    }}
                    className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                    title={String(t.education?.remove || "")}
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
                    {expandedId === edu.id ? (
                      <ChevronUp size={20} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={20} className="text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedId === edu.id && (
                <div className="p-4 md:p-6 border-t border-slate-150 bg-white space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                        {t.education.degree}
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(edu.id, { degree: e.target.value })
                        }
                        className="block w-full px-4 py-3 border border-slate-200 hover:border-slate-300 bg-white text-slate-900 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs sm:text-sm transition-all font-medium placeholder-slate-450"
                        placeholder={t.education.degree}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                        {t.education.institution}
                      </label>
                      <input
                        list={`universities-${edu.id}`}
                        type="text"
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(edu.id, {
                            institution: e.target.value,
                          })
                        }
                        className="block w-full px-4 py-3 border border-slate-200 hover:border-slate-300 bg-white text-slate-900 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs sm:text-sm transition-all font-medium placeholder-slate-450"
                        placeholder={t.education.institution}
                      />
                      <datalist id={`universities-${edu.id}`}>
                        {universities.filter((u) => u !== "Other").map(
                          (uni) => (
                            <option key={uni} value={uni} />
                          ),
                        )}
                      </datalist>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                        {String(t.education?.startDate || "")}
                      </label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) =>
                          updateEducation(edu.id, { startDate: e.target.value })
                        }
                        className="block w-full px-4 py-3 border border-slate-200 hover:border-slate-300 bg-white text-slate-900 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs sm:text-sm transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                        {String(t.education?.endDate || "")}
                      </label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) =>
                          updateEducation(edu.id, { endDate: e.target.value })
                        }
                        className="block w-full px-4 py-3 border border-slate-200 hover:border-slate-300 bg-white text-slate-900 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs sm:text-sm transition-all font-medium placeholder-slate-455"
                        placeholder={String(t.education?.endDate || "")}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2 border-t border-slate-100 pt-4 mt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                          {String(t.education?.description || "")}
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setShowSuggestionsFor(
                              showSuggestionsFor === edu.id ? null : edu.id,
                            )
                          }
                          className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                          title={language === "ar" ? "أعد صياغة النص باحترافية عبر الذكاء الاصطناعي" : "Rewrite to be more professional"}
                        >
                          <Sparkles size={14} />
                          {language === "ar" ? "تحسين بالذكاء الاصطناعي" : "Improve with AI"}
                        </button>
                      </div>

                      {showSuggestionsFor === edu.id && (
                        <div className="mb-2">
                          <AISuggestion
                              currentValue={edu.description}
                              onApply={(newText) => {
                                updateEducation(edu.id, {
                                  description: newText,
                                });
                                setShowSuggestionsFor(null);
                              }}
                              context={`Institution: ${edu.institution}, Degree: ${edu.degree}`}
                            />
                          
                          
                          {/* Static Suggestions Fallback/Alternative */}
                          <div className="mt-4 p-4 bg-slate-50/60 rounded-xl border border-slate-200/50">
                             <p className="text-[10px] font-black text-slate-450 uppercase tracking-widest mb-3">{t.education.clickToAppend}</p>
                             <div className="flex flex-wrap gap-2">
                               {eduSuggestions.map((suggestion, idx) => (
                                 <button
                                   key={idx}
                                   type="button"
                                   onClick={() => {
                                     const currentDesc = edu.description
                                       ? edu.description + "\n"
                                       : "";
                                     updateEducation(edu.id, {
                                       description: currentDesc + suggestion,
                                     });
                                     setShowSuggestionsFor(null);
                                   }}
                                   className="text-xs text-slate-600 bg-white hover:text-indigo-600 hover:border-indigo-200 border border-slate-205 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                                 >
                                   {suggestion}
                                 </button>
                               ))}
                             </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="relative">
                        <textarea
                          rows={4}
                          value={edu.description}
                          onChange={(e) =>
                            updateEducation(edu.id, {
                              description: e.target.value,
                            })
                          }
                          className="block w-full p-4 border border-slate-200 bg-white text-slate-900 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs sm:text-sm transition-all resize-y placeholder-slate-450 font-medium leading-relaxed"
                          placeholder={String(t.education?.descriptionPlaceholder || "")}
                        />
                        <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1 opacity-70 px-2 leading-tight">
                            <Sparkles size={10} className="text-indigo-400 shrink-0" />
                            {language === "ar" 
                              ? "يتم إرسال النص أعلاه فقط (بدون أي هويات أو معلومات تواصل) بشكل مشفر لتخصيص محتواك."
                              : "Only the text snippet above is sent anonymously to generate tailored content."}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
};

export default EducationForm;
