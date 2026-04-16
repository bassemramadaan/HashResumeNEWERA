import React, { useState, Suspense, lazy } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Copy,
  Sparkles,
  GripVertical,
} from "lucide-react";
import { Reorder } from "framer-motion";
import SectionTooltip from "./SectionTooltip";

const AISuggestion = lazy(() => import("./AISuggestion"));

const ProjectsForm = () => {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const { data, addProject, updateProject, removeProject, updateData } =
    useResumeStore();
  const { projects } = data;
  const [expandedId, setExpandedId] = useState<string | null>(
    projects[0]?.id || null,
  );
  const [showSuggestionsFor, setShowSuggestionsFor] = useState<string | null>(
    null,
  );

  const handleAdd = () => {
    addProject({
      name: "",
      description: "",
      link: "",
    });
  };

  const handleReorder = (newOrder: typeof projects) => {
    updateData({ ...data, projects: newOrder });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SectionTooltip
            title={t.projects.title}
            content={t.projects.tooltipDesc || "Add your key projects to demonstrate your practical experience."}
            example={t.projects.tooltipExample || "e.g., E-commerce Platform - Built with React and Node.js"}
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-slate-50 text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-200"
        >
          <Plus size={16} />
          {t.projects.add}
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 border-dashed text-center text-white0">
          {t.projects.noProjects}
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={projects}
          onReorder={handleReorder}
          className="space-y-4"
        >
          {projects.map((proj) => (
            <Reorder.Item
              key={proj.id}
              value={proj}
              className="bg-slate-50 rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all"
            >
              <div
                className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() =>
                  setExpandedId(expandedId === proj.id ? null : proj.id)
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
                      {proj.name || t.projects.notSpecified}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {proj.link || t.projects.noLink}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const { id: _id, ...rest } = proj;
                      addProject(rest);
                    }}
                    className="p-2 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                    title={t.projects.duplicate}
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProject(proj.id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title={t.projects.remove}
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedId === proj.id ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}
                </div>
              </div>

              {expandedId === proj.id && (
                <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {t.projects.name}
                      </label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) =>
                          updateProject(proj.id, { name: e.target.value })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400"
                        placeholder={t.projects.name}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {t.projects.link}
                      </label>
                      <input
                        type="url"
                        value={proj.link}
                        onChange={(e) =>
                          updateProject(proj.id, { link: e.target.value })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400"
                        placeholder="e.g. github.com/username/project"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-medium text-slate-700">
                            {t.projects.description}
                          </label>
                          <SectionTooltip
                            title={t.projects.tips}
                            content={t.projects.tipsContent}
                            example={t.projects.tipsExample}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setShowSuggestionsFor(
                              showSuggestionsFor === proj.id ? null : proj.id,
                            )
                          }
                          className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-full transition-colors"
                        >
                          <Sparkles size={12} />
                          {t.projects.aiSuggestionsFree}
                        </button>
                      </div>

                      {showSuggestionsFor === proj.id && (
                        <Suspense
                          fallback={
                            <div className="h-20 animate-pulse bg-slate-100 rounded-xl mb-4" />
                          }
                        >
                          <AISuggestion
                            currentValue={proj.description}
                            onApply={(newText) => {
                              updateProject(proj.id, {
                                description: newText,
                              });
                              setShowSuggestionsFor(null);
                            }}
                            context={`Project Name: ${proj.name}, Link: ${proj.link}`}
                          />
                        </Suspense>
                      )}

                      <textarea
                        rows={4}
                        value={proj.description}
                        onChange={(e) =>
                          updateProject(proj.id, {
                            description: e.target.value,
                          })
                        }
                        className="block w-full p-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors resize-y placeholder-slate-400"
                        placeholder={t.projects.description}
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

export default ProjectsForm;
