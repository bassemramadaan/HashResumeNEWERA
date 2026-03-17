import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const ProjectsForm = () => {
  const { data, addProject, updateProject, removeProject } = useResumeStore();
  const { projects } = data;
  const [expandedId, setExpandedId] = useState<string | null>(projects[0]?.id || null);

  const handleAdd = () => {
    addProject({
      name: '',
      description: '',
      link: '',
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-end">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-indigo-100 dark:border-indigo-800"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed text-center text-slate-500 dark:text-slate-400">
          No projects added yet. Click the button above to add your projects.
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-all">
              <div 
                className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
              >
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{proj.name || '(Not specified)'}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{proj.link || 'No link provided'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeProject(proj.id); }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedId === proj.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
              </div>

              {expandedId === proj.id && (
                <div className="p-4 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Project Name</label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                        className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="e.g. E-commerce Platform"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Project Link</label>
                      <input
                        type="url"
                        value={proj.link}
                        onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                        className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="e.g. github.com/username/project"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Description</label>
                      <textarea
                        rows={4}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                        className="block w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors resize-y placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="• Describe the project, technologies used, and your role..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsForm;
