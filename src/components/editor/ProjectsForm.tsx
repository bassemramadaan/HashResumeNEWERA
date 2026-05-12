import React, { useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Copy, Layout } from "lucide-react";
import { motion, Reorder, AnimatePresence } from "motion/react";

export const ProjectsForm: React.FC = () => {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const { data, updateProject, addProject, removeProject, reorderProjects, duplicateProject } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(data.projects[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 leading-none">
            {String(t.projects?.title || "Projects")}
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            {String(t.projects?.tipsContent || "")}
          </p>
        </div>
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-4 py-2 bg-[#ff4d2d] text-white rounded-lg hover:bg-[#e63e1d] transition-colors shadow-sm text-sm font-medium"
        >
          <Plus size={18} />
          {String(t.projects?.add || "Add")}
        </button>
      </div>

      {data.projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Layout className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">
            {String(t.projects?.noProjects || "No projects added yet.")}
          </h3>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={data.projects}
          onReorder={reorderProjects}
          className="space-y-4"
        >
          {data.projects.map((project) => (
            <Reorder.Item
              key={project.id}
              value={project}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                <GripVertical className="mr-3 text-gray-400 cursor-grab active:cursor-grabbing" size={20} />
                <button
                  onClick={() => toggleExpand(project.id)}
                  className="flex-1 text-left font-medium text-gray-900 truncate"
                >
                  {project.name || String(t.projects?.notSpecified || "")}
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => duplicateProject(project.id)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title={String(t.projects?.duplicate || "")}
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => removeProject(project.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title={String(t.projects?.remove || "")}
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => toggleExpand(project.id)}
                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {expandedId === project.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {expandedId === project.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {String(t.projects?.name || "")}
                          </label>
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => updateProject(project.id, { name: e.target.value })}
                            placeholder="e.g. Personal Portfolio"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {String(t.projects?.link || "")}
                          </label>
                          <input
                            type="text"
                            value={project.link}
                            onChange={(e) => updateProject(project.id, { link: e.target.value })}
                            placeholder="e.g. project-url.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {String(t.projects?.description || "")}
                        </label>
                        <textarea
                          value={project.description}
                          onChange={(e) => updateProject(project.id, { description: e.target.value })}
                          placeholder={String(t.projects?.tipsExample || "")}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
};
