import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Wrench, Plus, X, Sparkles } from 'lucide-react';
import SectionTooltip from './SectionTooltip';

const SUGGESTED_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 
  'HTML/CSS', 'SQL', 'NoSQL', 'Git', 'Docker', 'AWS', 'Agile', 'Communication',
  'Problem Solving', 'Team Leadership', 'Project Management'
];

export default function SkillsForm() {
  const { data, addSkill, removeSkill } = useResumeStore();
  const { skills } = data;
  const [inputValue, setInputValue] = useState('');

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
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <form onSubmit={handleAdd} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <label htmlFor="skillInput" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Add a skill
            </label>
            <SectionTooltip 
              title="Skills Tips" 
              content="List both hard skills (technical) and soft skills (interpersonal). Be specific and use keywords found in job descriptions." 
              example="Hard: React, Node.js, SQL. Soft: Project Management, Team Leadership."
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              id="skillInput"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="e.g. React, Project Management..."
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 disabled:text-slate-500 text-white px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95 shadow-sm shadow-indigo-500/20"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </form>

        <div className="mb-8">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Your Skills</h3>
          {skills.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No skills added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium group transition-colors"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 focus:outline-none transition-colors"
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {unaddedSuggestions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-500 dark:text-indigo-400" />
              AI Suggested Skills (Free)
            </h3>
            <div className="flex flex-wrap gap-2">
              {unaddedSuggestions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => addSkill(skill)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-200 dark:hover:border-indigo-800 text-sm font-medium transition-colors"
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
}
