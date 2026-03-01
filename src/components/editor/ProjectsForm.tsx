import { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { FolderGit2, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function ProjectsForm() {
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FolderGit2 className="text-indigo-500" size={24} />
          Projects
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
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
        <div className="space-y-4">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all">
              <div 
                className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
              >
                <div>
                  <h3 className="font-bold text-slate-900">{proj.name || '(Not specified)'}</h3>
                  <p className="text-sm text-slate-500">{proj.link || 'No link provided'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeProject(proj.id); }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedId === proj.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
              </div>

              {expandedId === proj.id && (
                <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Project Name</label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                        placeholder="e.g. E-commerce Platform"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Project Link</label>
                      <input
                        type="url"
                        value={proj.link}
                        onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                        placeholder="e.g. github.com/username/project"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Description</label>
                      <textarea
                        rows={4}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                        className="block w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors resize-y"
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
}
