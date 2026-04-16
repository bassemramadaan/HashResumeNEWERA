import React, { useState, useMemo, Suspense, lazy } from "react";
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
  AlertCircle,
  GripVertical,
} from "lucide-react";
import { Reorder } from "framer-motion";
import SectionTooltip from "./SectionTooltip";
import { getJobMatchResults } from "../../utils/ats";

const AISuggestion = lazy(() => import("./AISuggestion"));

import FormSkeleton from "./FormSkeleton";

const ExperienceForm = () => {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const {
    data,
    isHydrated,
    addExperience,
    updateExperience,
    removeExperience,
    updateData,
  } = useResumeStore();

  const [expandedId, setExpandedId] = useState<string | null>(
    data.experience[0]?.id || null,
  );
  const [showAISuggestionFor, setShowAISuggestionFor] = useState<string | null>(
    null,
  );

  const matchResults = useMemo(() => getJobMatchResults(data), [data]);

  if (!isHydrated) {
    return <FormSkeleton />;
  }

  const { experience, jobDescription } = data;

  const handleAdd = () => {
    addExperience({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleReorder = (newOrder: typeof experience) => {
    updateData({ ...data, experience: newOrder });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SectionTooltip
            title={t.experience.title}
            content={t.experience.tooltipDesc || "Add your work experience, starting with the most recent."}
            example={t.experience.tooltipExample || "e.g., Senior Software Engineer at Google"}
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-slate-50 text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-200"
        >
          <Plus size={16} />
          {t.experience.add}
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 border-dashed text-center text-white0">
          {t.experience.noExperience}
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={experience}
          onReorder={handleReorder}
          className="space-y-4"
        >
          {experience.map((exp) => (
            <Reorder.Item
              key={exp.id}
              value={exp}
              className="bg-slate-50 rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all"
            >
              <div
                className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() =>
                  setExpandedId(expandedId === exp.id ? null : exp.id)
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
                      {exp.position || t.experience.notSpecified}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {exp.company || t.experience.company} •{" "}
                      {exp.startDate || t.experience.startDate} - {exp.endDate || t.experience.endDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const { id: _id, ...rest } = exp;
                      addExperience(rest);
                    }}
                    className="p-2 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                    title={t.experience.duplicate}
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExperience(exp.id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title={t.experience.remove}
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedId === exp.id ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}
                </div>
              </div>

              {expandedId === exp.id && (
                <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {t.experience.position}
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) =>
                          updateExperience(exp.id, { position: e.target.value })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400"
                        placeholder={t.experience.position}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {t.experience.company}
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, { company: e.target.value })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400"
                        placeholder={t.experience.company}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {t.experience.startDate}
                      </label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(exp.id, {
                            startDate: e.target.value,
                          })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {t.experience.endDate}
                      </label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) =>
                          updateExperience(exp.id, { endDate: e.target.value })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400"
                        placeholder={t.experience.endDate}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-medium text-slate-700">
                            {t.experience.description}
                          </label>
                          <SectionTooltip
                            title={t.experience.experienceTips}
                            content={t.experience.experienceDescTips}
                            example={t.experience.experienceExample}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setShowAISuggestionFor(
                              showAISuggestionFor === exp.id ? null : exp.id,
                            )
                          }
                          className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-full transition-colors"
                        >
                          <Sparkles size={12} />
                          {t.aiSuggestions}
                        </button>
                      </div>

                      {showAISuggestionFor === exp.id && (
                        <Suspense
                          fallback={
                            <div className="h-20 animate-pulse bg-slate-100 rounded-xl mb-4" />
                          }
                        >
                          <AISuggestion
                            currentValue={exp.description}
                            onApply={(newText) => {
                              updateExperience(exp.id, {
                                description: newText,
                              });
                              setShowAISuggestionFor(null);
                            }}
                            context={`Job Title: ${exp.position}, Company: ${exp.company}`}
                          />
                        </Suspense>
                      )}

                      <textarea
                        rows={5}
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(exp.id, {
                            description: e.target.value,
                          })
                        }
                        className="block w-full p-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors resize-y placeholder-slate-400"
                        placeholder={t.experience.descriptionPlaceholder}
                      />

                      {/* ATS Hint */}
                      {jobDescription && matchResults && (
                        <div className="mt-2 text-xs flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <AlertCircle
                            size={14}
                            className="text-amber-500 shrink-0 mt-0.5"
                          />
                          <div className="text-slate-600">
                            <span className="font-semibold text-slate-700">
                              {t.experience.atsHint}:{" "}
                            </span>
                            {matchResults.missing.length > 0 ? (
                              <>
                                {t.experience.tryIncorporating}{" "}
                                <span className="text-red-500 font-medium">
                                  {matchResults.missing.slice(0, 3).join(", ")}
                                </span>
                              </>
                            ) : (
                              <span className="text-emerald-500 font-medium">
                                {t.experience.greatMatched}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
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

export default ExperienceForm;
