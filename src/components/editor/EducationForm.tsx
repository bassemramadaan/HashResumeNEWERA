import { useState } from 'react';
import { useResumeStore, Education } from '../../store/useResumeStore';
import { GraduationCap, Plus, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

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

export default function EducationForm() {
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <GraduationCap className="text-indigo-500" size={24} />
          Education
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
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
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                        placeholder="e.g. Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Institution</label>
                      <select
                        value={EGYPTIAN_UNIVERSITIES.includes(edu.institution) || edu.institution === '' ? edu.institution : 'Other'}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateEducation(edu.id, { institution: val === 'Other' ? '' : val });
                        }}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-white"
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
                          className="block w-full px-3 py-2 mt-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                          placeholder="Enter institution name"
                        />
                      ) : null}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Start Date</label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">End Date</label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                        placeholder="e.g. 2024 or Present"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-slate-700">Description (Optional)</label>
                        <button 
                          type="button"
                          onClick={() => setShowSuggestionsFor(showSuggestionsFor === edu.id ? null : edu.id)}
                          className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-full transition-colors"
                        >
                          <Sparkles size={12} />
                          AI Suggestions (Free)
                        </button>
                      </div>

                      {showSuggestionsFor === edu.id && (
                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 mb-2 space-y-2 animate-in fade-in slide-in-from-top-2">
                          <p className="text-xs font-semibold text-indigo-800 mb-2">Click a suggestion to append it to your description:</p>
                          {EDU_SUGGESTIONS.map((suggestion, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                const currentDesc = edu.description ? edu.description + '\n' : '';
                                updateEducation(edu.id, { description: currentDesc + suggestion });
                                setShowSuggestionsFor(null);
                              }}
                              className="block w-full text-left text-sm text-slate-600 hover:text-indigo-700 hover:bg-white p-2 rounded-lg transition-colors border border-transparent hover:border-indigo-200"
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
                        className="block w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors resize-y"
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
