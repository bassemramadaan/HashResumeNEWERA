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
import { Reorder } from "framer-motion";
import FormSkeleton from "./FormSkeleton";
import SectionTooltip from "./SectionTooltip";

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
            title={t.education.title}
            content={t.education.tooltipDesc || "Add your educational background, starting with the most recent."}
            example={t.education.tooltipExample || "e.g., Bachelor of Science in Computer Science, Cairo University"}
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-slate-50 text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-200"
        >
          <Plus size={16} />
          {t.education.add}
        </button>
      </div>

      {education.length === 0 ? (
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 border-dashed text-center text-white0">
          {t.education.noEducation}
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
              className="bg-slate-50 rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all"
            >
              <div
                className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() =>
                  setExpandedId(expandedId === edu.id ? null : edu.id)
                }
              >
                <div className="flex items-center gap-4">
                  <div
                    className="cursor-grab active:cursor-grabbing p-1 text-slate-500 hover:text-slate-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {edu.degree || t.education.notSpecified}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {edu.institution || t.education.institution} •{" "}
                      {edu.startDate || t.education.startDate} - {edu.endDate || t.education.endDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const { id: _id, ...rest } = edu;
                      addEducation(rest);
                    }}
                    className="p-2 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                    title={t.education.duplicate}
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeEducation(edu.id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title={t.education.remove}
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedId === edu.id ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}
                </div>
              </div>

              {expandedId === edu.id && (
                <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {t.education.degree}
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(edu.id, { degree: e.target.value })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400"
                        placeholder={t.education.degree}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
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
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400"
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
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {t.education.startDate}
                      </label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) =>
                          updateEducation(edu.id, { startDate: e.target.value })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {t.education.endDate}
                      </label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) =>
                          updateEducation(edu.id, { endDate: e.target.value })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400"
                        placeholder={t.education.endDate}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-slate-700">
                          {t.education.description}
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setShowSuggestionsFor(
                              showSuggestionsFor === edu.id ? null : edu.id,
                            )
                          }
                          className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-full transition-colors"
                        >
                          <Sparkles size={12} />
                          {t.education.aiSuggestionsFree}
                        </button>
                      </div>

                      {showSuggestionsFor === edu.id && (
                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 mb-2 space-y-2 animate-in fade-in slide-in-from-top-2">
                          <p className="text-xs font-semibold text-indigo-800 mb-2">
                            {t.education.clickToAppend}
                          </p>
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
                              className="block w-full text-start text-sm text-slate-600 hover:text-indigo-700 hover:bg-slate-50 p-2 rounded-lg transition-colors border border-transparent hover:border-indigo-200"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      <textarea
                        rows={3}
                        value={edu.description}
                        onChange={(e) =>
                          updateEducation(edu.id, {
                            description: e.target.value,
                          })
                        }
                        className="block w-full p-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors resize-y placeholder-slate-400"
                        placeholder={t.education.descriptionPlaceholder}
                      />
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
