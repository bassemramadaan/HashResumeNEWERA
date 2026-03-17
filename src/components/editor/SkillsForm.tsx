import React, { useState, useMemo } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Plus, X, Sparkles, AlertCircle } from 'lucide-react';
import SectionTooltip from './SectionTooltip';
import { getJobMatchResults } from '../../utils/ats';

const SUGGESTED_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 
  'HTML/CSS', 'SQL', 'NoSQL', 'Git', 'Docker', 'AWS', 'Agile', 'Communication',
  'Problem Solving', 'Team Leadership', 'Project Management'
];

export default React.memo(function SkillsForm() {
  const { data, addSkill, removeSkill } = useResumeStore();
  const { skills, jobDescription } = data;
  const [inputValue, setInputValue] = useState('');

  const matchResults = useMemo(() => getJobMatchResults(data), [data]);

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && !skills.includes(trimmed)) {
      addSkill(trimmed);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const unaddedSuggestions = SUGGESTED_SKILLS.filter(s => !skills.includes(s)).slice(0, 8);

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <form onSubmit={handleAdd} className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <label htmlFor="skillInput" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              Add a skill
            </label>
            <SectionTooltip 
              title="Skills Tips" 
              content="List both hard skills (technical) and soft skills (interpersonal). Be specific and use keywords found in job descriptions." 
              example="Hard: React, Node.js, SQL. Soft: Project Management, Team Leadership."
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              id="skillInput"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-base sm:text-sm transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="e.g. React, Project Management..."
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-[#f16529] hover:bg-[#e44d26] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <Plus size={18} />
              Add Skill
            </button>
          </div>
        </form>

        <div className="mb-10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Your Skills</h3>
          {skills.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center transition-colors">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-slate-400 dark:text-slate-500 opacity-50" />
              <p className="text-slate-600 dark:text-slate-400 font-medium mb-4">No skills added yet. Try adding some of these:</p>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                {['Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Adaptability'].map(skill => (
                  <button
                    key={skill}
                    onClick={() => addSkill(skill)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold group transition-colors border border-slate-200 dark:border-slate-700"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="p-1 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 focus:outline-none transition-colors"
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ATS Hint */}
        {jobDescription && matchResults && (
          <div className="mb-8 text-xs flex items-start gap-1.5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">ATS Hint: </span>
              {matchResults.missing.length > 0 ? (
                <>Consider adding these missing skills from the job description: <span className="text-red-500 font-medium">{matchResults.missing.slice(0, 5).join(', ')}</span></>
              ) : (
                <span className="text-emerald-500 font-medium">Great! You've matched the top keywords.</span>
              )}
            </div>
          </div>
        )}

        {unaddedSuggestions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#f16529]" />
              AI Suggested Skills (Free)
            </h3>
            <div className="flex flex-wrap gap-2">
              {unaddedSuggestions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => addSkill(skill)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 text-sm font-medium transition-colors"
                >
                  <Plus size={14} />
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
