import { useState } from 'react';
import { useResumeStore, Experience } from '../../store/useResumeStore';
import { Briefcase, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ExperienceForm() {
  const { data, addExperience, updateExperience, removeExperience } = useResumeStore();
  const { experience } = data;
  const [expandedId, setExpandedId] = useState<string | null>(experience[0]?.id || null);

  const handleAdd = () => {
    addExperience({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    // The new ID is generated in the store, so we can't easily expand it immediately without a ref or useEffect.
    // For simplicity, we'll just let the user click it.
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="text-green-500" size={24} />
          Work Experience
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 border-dashed text-center text-slate-500">
          No experience added yet. Click the button above to add your work history.
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all">
              <div 
                className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
              >
                <div>
                  <h3 className="font-bold text-slate-900">{exp.position || '(Not specified)'}</h3>
                  <p className="text-sm text-slate-500">{exp.company || 'Company Name'} • {exp.startDate || 'Start'} - {exp.endDate || 'End'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedId === exp.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
              </div>

              {expandedId === exp.id && (
                <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Job Title</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                        placeholder="e.g. Google"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Start Date</label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                        placeholder="e.g. Present or YYYY-MM"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Description</label>
                      <textarea
                        rows={5}
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        className="block w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors resize-y"
                        placeholder="• Describe your responsibilities and achievements..."
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
