import { useState } from 'react';
import { useResumeStore, Education } from '../../store/useResumeStore';
import { GraduationCap, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function EducationForm() {
  const { data, addEducation, updateEducation, removeEducation } = useResumeStore();
  const { education } = data;
  const [expandedId, setExpandedId] = useState<string | null>(education[0]?.id || null);

  const handleAdd = () => {
    addEducation({
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
      description: '',
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <GraduationCap className="text-green-500" size={24} />
          Education
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>

      {education.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 border-dashed text-center text-slate-500">
          No education added yet. Click the button above to add your academic history.
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all">
              <div 
                className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
              >
                <div>
                  <h3 className="font-bold text-slate-900">{edu.degree || '(Not specified)'}</h3>
                  <p className="text-sm text-slate-500">{edu.institution || 'Institution Name'} • {edu.startDate || 'Start'} - {edu.endDate || 'End'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedId === edu.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
              </div>

              {expandedId === edu.id && (
                <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Degree / Major</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                        placeholder="e.g. Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                        placeholder="e.g. University of Technology"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Start Date</label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">End Date</label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                        placeholder="e.g. 2024 or Present"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Description (Optional)</label>
                      <textarea
                        rows={3}
                        value={edu.description}
                        onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                        className="block w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors resize-y"
                        placeholder="• Relevant coursework, honors, GPA..."
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
