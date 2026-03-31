import React, { useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
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

const PROJ_SUGGESTIONS = [
  "• Designed and developed a full-stack web application using React and Node.js, serving over 10,000 monthly active users.",
  "• Implemented a responsive and accessible user interface, improving user engagement by 25%.",
  "• Integrated third-party APIs for payment processing and user authentication, ensuring secure transactions.",
  "• Optimized database queries and backend logic, reducing page load times by 40%.",
  "• Collaborated with a team of 4 developers using Agile methodologies and Git for version control.",
];

const ProjectsForm = () => {
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
      <div className="flex items-center justify-end">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-slate-50 text-slate-600 hover:bg-slate-100 :bg-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-200"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 border-dashed text-center text-slate-500">
          No projects added yet. Click the button above to add your projects.
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
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all"
            >
              <div
                className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 :bg-slate-800/50 transition-colors"
                onClick={() =>
                  setExpandedId(expandedId === proj.id ? null : proj.id)
                }
              >
                <div className="flex items-center gap-4">
                  <div
                    className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 :text-slate-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {proj.name || "(Not specified)"}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {proj.link || "No link provided"}
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
                    className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 :bg-indigo-900/20 rounded-lg transition-colors"
                    title="Duplicate"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProject(proj.id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 :bg-red-900/20 rounded-lg transition-colors"
                    title="Remove"
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
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) =>
                          updateProject(proj.id, { name: e.target.value })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400"
                        placeholder="e.g. E-commerce Platform"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        Project Link
                      </label>
                      <input
                        type="url"
                        value={proj.link}
                        onChange={(e) =>
                          updateProject(proj.id, { link: e.target.value })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400"
                        placeholder="e.g. github.com/username/project"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-medium text-slate-700">
                            Description
                          </label>
                          <SectionTooltip
                            title="Project Tips"
                            content="Focus on your specific contributions, technologies used, and the impact or results of the project."
                            example="• Built a real-time chat application using Socket.io and React, supporting 500+ concurrent users."
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setShowSuggestionsFor(
                              showSuggestionsFor === proj.id ? null : proj.id,
                            )
                          }
                          className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 :bg-indigo-900/50 px-2 py-1 rounded-full transition-colors"
                        >
                          <Sparkles size={12} />
                          AI Suggestions (Free)
                        </button>
                      </div>

                      {showSuggestionsFor === proj.id && (
                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 mb-2 space-y-2 animate-in fade-in slide-in-from-top-2">
                          <p className="text-xs font-semibold text-indigo-800 mb-2">
                            Click a suggestion to append it to your description:
                          </p>
                          {PROJ_SUGGESTIONS.map((suggestion, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                const currentDesc = proj.description
                                  ? proj.description + "\n"
                                  : "";
                                updateProject(proj.id, {
                                  description: currentDesc + suggestion,
                                });
                                setShowSuggestionsFor(null);
                              }}
                              className="block w-full text-start text-sm text-slate-600 hover:text-indigo-700 :text-indigo-300 hover:bg-white :bg-slate-800 p-2 rounded-lg transition-colors border border-transparent hover:border-indigo-200 :border-indigo-800"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      <textarea
                        rows={4}
                        value={proj.description}
                        onChange={(e) =>
                          updateProject(proj.id, {
                            description: e.target.value,
                          })
                        }
                        className="block w-full p-4 border border-slate-200 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors resize-y placeholder-slate-400"
                        placeholder="• Describe the project, technologies used, and your role..."
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
