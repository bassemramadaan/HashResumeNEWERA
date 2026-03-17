import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Copy } from 'lucide-react';

const EDU_SUGGESTIONS = [
  "• Graduated with Honors (Cum Laude).",
  "• Relevant Coursework: Data Structures, Algorithms, Database Management Systems, Software Engineering.",
  "• Capstone Project: Developed a full-stack web application for local businesses to manage inventory.",
  "• Active member of the Computer Science Society and organized weekly coding workshops.",
  "• Awarded the Dean's List for academic excellence for 4 consecutive semesters."
];

const EGYPTIAN_UNIVERSITIES = [
  "Cairo University",
  "Alexandria University",
  "Ain Shams University",
  "Assiut University",
  "Tanta University",
  "Mansoura University",
  "Zagazig University",
  "Helwan University",
  "Minia University",
  "Menoufia University",
  "Suez Canal University",
  "South Valley University",
  "Benha University",
  "Fayoum University",
  "Beni-Suef University",
  "Kafrelsheikh University",
  "Sohag University",
  "Port Said University",
  "Damanhour University",
  "Aswan University",
  "Damietta University",
  "Suez University",
  "Sadat City University",
  "Arish University",
  "New Valley University",
  "Matrouh University",
  "Luxor University",
  "Galala University",
  "King Salman International University",
  "Alamein International University",
  "Mansoura New University",
  "American University in Cairo (AUC)",
  "German University in Cairo (GUC)",
  "British University in Egypt (BUE)",
  "Future University in Egypt (FUE)",
  "Modern Sciences and Arts University (MSA)",
  "Misr International University (MIU)",
  "October 6 University (O6U)",
  "Pharos University in Alexandria (PUA)",
  "Nile University (NU)",
  "Zewail City of Science and Technology",
  "Egypt-Japan University of Science and Technology (E-JUST)",
  "Arab Academy for Science, Technology & Maritime Transport (AASTMT)",
  "Other"
];

export default React.memo(function EducationForm() {
  const { data, addEducation, updateEducation, removeEducation } = useResumeStore();
  const { education } = data;
  const [expandedId, setExpandedId] = useState<string | null>(education[0]?.id || null);
  const [showSuggestionsFor, setShowSuggestionsFor] = useState<string | null>(null);

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
      <div className="flex items-center justify-end px-1">
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-[#f16529] hover:bg-[#e44d26] text-white px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 w-full sm:w-auto"
        >
          <Plus size={18} />
          Add Education
        </button>
      </div>

      {education.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed text-center text-slate-500 dark:text-slate-400 transition-colors">
          <p className="font-medium">No education added yet.</p>
          <p className="text-sm mt-1">Click the button above to add your academic history.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-all">
              <div 
                className="p-5 md:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">{edu.degree || '(Not specified)'}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{edu.institution || 'Institution Name'} • {edu.startDate || 'Start'} - {edu.endDate || 'End'}</p>
                </div>
                <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      const { id: _id, ...rest } = edu;
                      addEducation(rest);
                    }}
                    className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                    title="Duplicate"
                  >
                    <Copy size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="p-2.5 text-slate-400">
                    {expandedId === edu.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {expandedId === edu.id && (
                <div className="p-5 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Degree / Major</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-base sm:text-sm transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="e.g. Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Institution</label>
                      <select
                        value={EGYPTIAN_UNIVERSITIES.includes(edu.institution) || edu.institution === '' ? edu.institution : 'Other'}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateEducation(edu.id, { institution: val === 'Other' ? '' : val });
                        }}
                        className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-base sm:text-sm transition-colors"
                      >
                        <option value="" disabled>Select University</option>
                        {EGYPTIAN_UNIVERSITIES.map(uni => (
                          <option key={uni} value={uni}>{uni}</option>
                        ))}
                      </select>
                      {(!EGYPTIAN_UNIVERSITIES.includes(edu.institution) && edu.institution !== '') || (edu.institution === '' && EGYPTIAN_UNIVERSITIES.includes('Other')) ? (
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                          className="block w-full px-4 py-3 mt-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-base sm:text-sm transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                          placeholder="Enter institution name"
                        />
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Start Date</label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                        className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-base sm:text-sm transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">End Date</label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-base sm:text-sm transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="e.g. 2024 or Present"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description (Optional)</label>
                        <button 
                          type="button"
                          onClick={() => setShowSuggestionsFor(showSuggestionsFor === edu.id ? null : edu.id)}
                          className="text-xs font-bold text-[#f16529] flex items-center justify-center gap-1.5 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 px-3 py-1.5 rounded-full transition-colors w-fit"
                        >
                          <Sparkles size={12} />
                          AI Suggestions (Free)
                        </button>
                      </div>

                      {showSuggestionsFor === edu.id && (
                        <div className="bg-orange-50/50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/50 rounded-xl p-4 mb-2 space-y-2 animate-in fade-in slide-in-from-top-2">
                          <p className="text-xs font-semibold text-orange-800 dark:text-orange-300 mb-2">Click a suggestion to append it to your description:</p>
                          {EDU_SUGGESTIONS.map((suggestion, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                const currentDesc = edu.description ? edu.description + '\n' : '';
                                updateEducation(edu.id, { description: currentDesc + suggestion });
                                setShowSuggestionsFor(null);
                              }}
                              className="block w-full text-left text-sm text-slate-600 dark:text-slate-300 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-white dark:hover:bg-slate-800 p-2 rounded-lg transition-colors border border-transparent hover:border-orange-200 dark:hover:border-orange-800"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      <textarea
                        rows={3}
                        value={edu.description}
                        onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                        className="block w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-slate-400 sm:text-sm transition-colors resize-y placeholder-slate-400 dark:placeholder-slate-500"
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
});
