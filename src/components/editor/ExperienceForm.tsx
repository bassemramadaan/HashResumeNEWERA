import { useState, useMemo } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Copy, AlertCircle } from 'lucide-react';
import SectionTooltip from './SectionTooltip';
import { getJobMatchResults } from '../../utils/ats';

const EXP_SUGGESTIONS = [
  "• Spearheaded a cross-functional team to deliver a critical project 2 weeks ahead of schedule, resulting in a 15% increase in operational efficiency.",
  "• Developed and implemented new processes that reduced costs by 20% while maintaining high quality standards.",
  "• Mentored and trained 5 junior team members, improving overall team productivity and morale.",
  "• Analyzed complex data sets to identify trends and opportunities, presenting actionable insights to senior management.",
  "• Collaborated with stakeholders across multiple departments to ensure alignment on strategic objectives and project deliverables."
];

export default function ExperienceForm() {
  const { data, addExperience, updateExperience, removeExperience } = useResumeStore();
  const { experience, jobDescription } = data;
  const [expandedId, setExpandedId] = useState<string | null>(experience[0]?.id || null);
  const [showSuggestionsFor, setShowSuggestionsFor] = useState<string | null>(null);

  const matchResults = useMemo(() => getJobMatchResults(data), [data]);

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
      <div className="flex items-center justify-end px-1">
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 w-full sm:w-auto"
        >
          <Plus size={18} />
          Add Experience
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed text-center text-slate-500 dark:text-slate-400 transition-colors">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-medium">No experience added yet.</p>
          <p className="text-sm mt-1">Click the button above to add your work history.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-all">
              <div 
                className="p-5 md:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">{exp.position || '(Not specified)'}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{exp.company || 'Company Name'} • {exp.startDate || 'Start'} - {exp.endDate || 'End'}</p>
                </div>
                <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      const { id: _id, ...rest } = exp;
                      addExperience(rest);
                    }}
                    className="p-2.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors"
                    title="Duplicate"
                  >
                    <Copy size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="p-2.5 text-slate-400">
                    {expandedId === exp.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {expandedId === exp.id && (
                <div className="p-5 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Job Title</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                        className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="e.g. Google"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Start Date</label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="e.g. Present or YYYY-MM"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</label>
                          <SectionTooltip 
                            title="Experience Tips" 
                            content="Use action verbs and quantify your achievements whenever possible. Bullet points are essential for ATS readability." 
                            example="• Increased sales by 25% through the implementation of a new CRM system and targeted marketing campaigns."
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => setShowSuggestionsFor(showSuggestionsFor === exp.id ? null : exp.id)}
                          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded-full transition-colors w-fit"
                        >
                          <Sparkles size={12} />
                          AI Suggestions (Free)
                        </button>
                      </div>

                      {showSuggestionsFor === exp.id && (
                        <div className="bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-4 mb-2 space-y-2 animate-in fade-in slide-in-from-top-2">
                          <p className="text-xs font-semibold text-indigo-800 dark:text-indigo-300 mb-2">Click a suggestion to append it to your description:</p>
                          {EXP_SUGGESTIONS.map((suggestion, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                const currentDesc = exp.description ? exp.description + '\n' : '';
                                updateExperience(exp.id, { description: currentDesc + suggestion });
                                setShowSuggestionsFor(null);
                              }}
                              className="block w-full text-left text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-white dark:hover:bg-slate-800 p-2 rounded-lg transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      <textarea
                        rows={5}
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        className="block w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors resize-y placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="• Describe your responsibilities and achievements..."
                      />
                      
                      {/* ATS Hint */}
                      {jobDescription && matchResults && (
                        <div className="mt-2 text-xs flex items-start gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                          <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                          <div className="text-slate-600 dark:text-slate-400">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">ATS Hint: </span>
                            {matchResults.missing.length > 0 ? (
                              <>Try incorporating some of these missing keywords if applicable: <span className="text-red-500 font-medium">{matchResults.missing.slice(0, 3).join(', ')}</span></>
                            ) : (
                              <span className="text-emerald-500 font-medium">Great! You've matched the top keywords.</span>
                            )}
                          </div>
                        </div>
                      )}
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
